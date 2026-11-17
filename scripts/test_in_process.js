const EventEmitter = require('events');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../server/.env') });

const db = require('../server/db');

// Models
const User = require('../server/models/User');
const Admin = require('../server/models/Admin');
const AdvocateAccount = require('../server/models/AdvocateAccount');
const Lawyer = require('../server/models/Lawyer');

// Routers
const authRouter = require('../server/routes/auth');
const userRouter = require('../server/routes/user');
const adminRouter = require('../server/routes/admin');
const lawyerPortalRouter = require('../server/routes/lawyerPortal');
const lawyersRouter = require('../server/routes/lawyers');
const courtsRouter = require('../server/routes/courts');
const articlesRouter = require('../server/routes/articles');

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName} - ${details}`);
    failed++;
  }
}

// In-process router simulator
function invokeRoute(router, req) {
  return new Promise((resolve) => {
    const res = {
      statusCode: 200,
      headers: {},
      _body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      setHeader(k, v) {
        this.headers[k] = v;
      },
      json(data) {
        this._body = data;
        resolve({ statusCode: this.statusCode, json: data });
      },
      send(data) {
        this._body = data;
        let parsed = null;
        try { parsed = JSON.parse(data); } catch (_) {}
        resolve({ statusCode: this.statusCode, body: data, json: parsed });
      },
      sendStatus(code) {
        this.statusCode = code;
        resolve({ statusCode: code });
      }
    };

    req.headers = req.headers || {};
    req.query = req.query || {};
    req.body = req.body || {};
    req.params = req.params || {};

    router.handle(req, res, (err) => {
      if (err) {
        resolve({ statusCode: 500, error: err });
      } else {
        resolve({ statusCode: res.statusCode, notHandled: true, json: res._body });
      }
    });
  });
}

async function runTestSuite() {
  console.log('=== RUNNING COMPLETE IN-PROCESS FUNCTIONALITY VERIFICATION ===');

  try {
    // 1. PUBLIC DIRECTORIES
    // 1A. Lawyers Directory
    const lawyersList = Lawyer.findAll({});
    assert(lawyersList.length >= 25, 'Lawyer.findAll returns full Indian advocate roster', `Count: ${lawyersList.length}`);
    const firstLawyer = lawyersList[0];
    assert(firstLawyer.name && firstLawyer.specialty && firstLawyer.hourlyRate, 'Lawyer profile has complete details');

    // 1B. Courts Directory
    const courtsList = db.prepare('SELECT * FROM courts').all();
    assert(courtsList.length >= 20, 'Courts dataset populated with Indian courts', `Count: ${courtsList.length}`);
    const sampleCourt = courtsList[0];
    assert(sampleCourt.name && sampleCourt.city && sampleCourt.jurisdiction, 'Court record has complete metadata');

    // 2. AUTHENTICATION - STRICT PORTAL SEGREGATION
    // 2A. Client Login (demouser@legalai.com)
    const clientAuthRes = await invokeRoute(authRouter, {
      method: 'POST',
      url: '/login',
      body: {
        email: 'demouser@legalai.com',
        password: 'demo1234',
        role: 'user'
      }
    });
    assert(clientAuthRes.statusCode === 200, 'Client login returns 200 OK');
    assert(clientAuthRes.json?.user?.role === 'user', 'Client authenticated with role "user"');
    assert(clientAuthRes.json?.redirectUrl === 'user.html', 'Client redirects to user.html');
    const clientToken = clientAuthRes.json?.token;
    assert(Boolean(clientToken), 'Client issued valid JWT token');

    // 2B. Advocate Login
    const sampleAdv = db.prepare('SELECT email, lawyerId FROM advocate_accounts LIMIT 1').get();
    const advocateAuthRes = await invokeRoute(authRouter, {
      method: 'POST',
      url: '/login',
      body: {
        email: sampleAdv.email,
        password: 'lawyer1234',
        role: 'lawyer'
      }
    });
    assert(advocateAuthRes.statusCode === 200, 'Advocate login returns 200 OK');
    assert(advocateAuthRes.json?.user?.role === 'lawyer', 'Advocate authenticated with role "lawyer"');
    assert(advocateAuthRes.json?.redirectUrl === 'lawyer.html', 'Advocate redirects to lawyer.html');
    const advocateToken = advocateAuthRes.json?.token;
    assert(Boolean(advocateToken), 'Advocate issued valid JWT token');

    // 2C. Admin Login (admin@legalai.com)
    const adminAuthRes = await invokeRoute(authRouter, {
      method: 'POST',
      url: '/login',
      body: {
        email: 'admin@legalai.com',
        password: 'admin1234',
        role: 'admin'
      }
    });
    assert(adminAuthRes.statusCode === 200, 'Admin login returns 200 OK');
    assert(adminAuthRes.json?.user?.role === 'admin', 'Admin authenticated with role "admin"');
    assert(adminAuthRes.json?.redirectUrl === 'admin.html', 'Admin redirects to admin.html');
    const adminToken = adminAuthRes.json?.token;
    assert(Boolean(adminToken), 'Admin issued valid JWT token');

    // 2D. Cross-Role Security: Client trying to log in via advocate portal
    const crossLoginRes = await invokeRoute(authRouter, {
      method: 'POST',
      url: '/login',
      body: {
        email: 'demouser@legalai.com',
        password: 'demo1234',
        role: 'lawyer'
      }
    });
    assert(crossLoginRes.statusCode === 401, 'Client blocked from signing into Advocate Chambers (401)');

    // 2E. Cross-Role Security: Client trying to access admin endpoint
    const crossAdminRes = await invokeRoute(adminRouter, {
      method: 'GET',
      url: '/users',
      headers: { authorization: `Bearer ${clientToken}` }
    });
    assert(crossAdminRes.statusCode === 403, 'Client token strictly blocked from Admin API with 403 Forbidden');

    // 2F. Cross-Role Security: Client trying to access advocate portal endpoint
    const crossAdvRes = await invokeRoute(lawyerPortalRouter, {
      method: 'GET',
      url: '/clients',
      headers: { authorization: `Bearer ${clientToken}` }
    });
    assert(crossAdvRes.statusCode === 403, 'Client token strictly blocked from Advocate API with 403 Forbidden');

    // 3. CLIENT PORTAL FUNCTIONALITY
    // 3A. Client profile
    const clientProfileRes = await invokeRoute(userRouter, {
      method: 'GET',
      url: '/profile',
      headers: { authorization: `Bearer ${clientToken}` }
    });
    assert(clientProfileRes.statusCode === 200 && clientProfileRes.json?.user?.email === 'demouser@legalai.com', 'Client can view their profile data');

    // 3B. Client court dockets / cases
    const clientCasesRes = await invokeRoute(userRouter, {
      method: 'GET',
      url: '/cases',
      headers: { authorization: `Bearer ${clientToken}` }
    });
    assert(clientCasesRes.statusCode === 200 && Array.isArray(clientCasesRes.json?.cases), 'Client can fetch active litigation dockets (/api/user/cases)');

    // 4. CONSULTATION BOOKING WORKFLOW (Client -> Advocate)
    const bookReq = {
      method: 'POST',
      url: `/${firstLawyer.id}/consult`,
      params: { id: String(firstLawyer.id) },
      headers: {
        authorization: `Bearer ${clientToken}`,
        'content-type': 'application/json'
      },
      body: {
        lawyerId: firstLawyer.id,
        lawyerName: firstLawyer.name,
        clientName: 'Demo Client',
        clientEmail: 'demouser@legalai.com',
        clientPhone: '9876543210',
        preferredDate: '2026-11-28',
        caseSummary: 'Verification of consultation booking flow and notification dispatch.'
      }
    };
    const bookRes = await invokeRoute(lawyersRouter, bookReq);
    assert(bookRes.statusCode === 201 && bookRes.json?.success === true, 'Consultation booking succeeds with 201 Created');
    const bookedConsultId = bookRes.json?.bookingId || bookRes.json?.consultation?.id;
    assert(bookedConsultId > 0, `Booking ID generated: ${bookedConsultId}`);

    // Verify consultation shows in Client Portal
    const userConsultsRes = await invokeRoute(userRouter, {
      method: 'GET',
      url: '/consultations',
      headers: { authorization: `Bearer ${clientToken}` }
    });
    const foundInUser = userConsultsRes.json?.consultations?.some(c => c.id === bookedConsultId);
    assert(foundInUser, 'Consultation appears in Client Portal (/api/user/consultations)');

    // 5. ADVOCATE PORTAL CONTROLS OVER CLIENT
    // Re-login advocate linked to this lawyer
    const linkedAdvRecord = db.prepare('SELECT email FROM advocate_accounts WHERE lawyerId = ?').get(firstLawyer.id);
    let activeAdvToken = advocateToken;
    if (linkedAdvRecord) {
      const relogin = await invokeRoute(authRouter, {
        method: 'POST',
        url: '/login',
        body: { email: linkedAdvRecord.email, password: 'lawyer1234', role: 'lawyer' }
      });
      if (relogin.json?.token) activeAdvToken = relogin.json.token;
    }

    // 5A. Advocate sees incoming consultation
    const advConsultsRes = await invokeRoute(lawyerPortalRouter, {
      method: 'GET',
      url: '/consultations',
      headers: { authorization: `Bearer ${activeAdvToken}` }
    });
    const foundInAdv = advConsultsRes.json?.consultations?.some(c => c.id === bookedConsultId);
    assert(foundInAdv, 'Advocate receives consultation request in Advocate Portal (/api/lawyer/consultations)');

    // 5B. Advocate updates consultation status
    const advUpdateRes = await invokeRoute(lawyerPortalRouter, {
      method: 'PUT',
      url: `/consultations/${bookedConsultId}`,
      params: { id: String(bookedConsultId) },
      headers: { authorization: `Bearer ${activeAdvToken}` },
      body: { status: 'confirmed', notes: 'Consultation confirmed by Advocate.' }
    });
    assert(advUpdateRes.statusCode === 200 && advUpdateRes.json?.consultation?.status === 'confirmed', 'Advocate successfully confirms consultation request');

    // 5C. Advocate accesses Client Directory & Dossier
    const advClientsRes = await invokeRoute(lawyerPortalRouter, {
      method: 'GET',
      url: '/clients',
      headers: { authorization: `Bearer ${activeAdvToken}` }
    });
    assert(advClientsRes.statusCode === 200 && Array.isArray(advClientsRes.json?.clients), 'Advocate can view assigned clients list');

    // 6. ADMIN CONTROLS OVER CLIENTS & ADVOCATES
    // 6A. Admin audits all client accounts
    const adminUsersRes = await invokeRoute(adminRouter, {
      method: 'GET',
      url: '/users',
      headers: { authorization: `Bearer ${adminToken}` }
    });
    assert(adminUsersRes.statusCode === 200 && adminUsersRes.json?.users?.length > 0, 'Admin can view all registered client accounts');

    // 6B. Admin audits all advocate accounts
    const adminAdvocatesRes = await invokeRoute(adminRouter, {
      method: 'GET',
      url: '/lawyers',
      headers: { authorization: `Bearer ${adminToken}` }
    });
    assert(adminAdvocatesRes.statusCode === 200 && adminAdvocatesRes.json?.lawyers?.length > 0, 'Admin can view all advocate accounts');

    // 6C. Admin audits all platform consultations
    const adminConsultsRes = await invokeRoute(adminRouter, {
      method: 'GET',
      url: '/consultations',
      headers: { authorization: `Bearer ${adminToken}` }
    });
    const foundInAdmin = adminConsultsRes.json?.consultations?.some(c => c.id === bookedConsultId);
    assert(foundInAdmin, 'Admin has full visibility and audit access over all platform consultations');

    // 6D. Admin accesses 360-degree client dossier
    const testClientId = clientAuthRes.json.user.id;
    const adminDossierRes = await invokeRoute(adminRouter, {
      method: 'GET',
      url: `/users/${testClientId}/dossier`,
      params: { id: String(testClientId) },
      headers: { authorization: `Bearer ${adminToken}` }
    });
    assert(adminDossierRes.statusCode === 200 && adminDossierRes.json?.user?.email === 'demouser@legalai.com', 'Admin can inspect full 360-degree client dossier');

    // 6E. Admin platform statistics
    const adminStatsRes = await invokeRoute(adminRouter, {
      method: 'GET',
      url: '/stats',
      headers: { authorization: `Bearer ${adminToken}` }
    });
    assert(adminStatsRes.statusCode === 200 && adminStatsRes.json?.stats?.lawyers?.totalLawyers >= 25, 'Admin platform statistics endpoint functions correctly');

    // 7. CLEANUP
    db.prepare('DELETE FROM notifications WHERE consultationId = ?').run(bookedConsultId);
    db.prepare('DELETE FROM consultations WHERE id = ?').run(bookedConsultId);
    console.log('[CLEANUP] Test records cleaned up successfully.');

    console.log(`\n========================================================`);
    console.log(`FULL SYSTEM VERIFICATION: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================================`);

  } catch (err) {
    console.error('Fatal test error:', err);
    failed++;
  }
}

runTestSuite();
