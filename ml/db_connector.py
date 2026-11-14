"""
LegalAI Python SQLite Connector (`ml/db_connector.py`)
Connects the FastAPI ML/RAG microservice and training pipeline directly
to `server/legalai.db` using Python's built-in `sqlite3` module (WAL mode).
"""

from contextlib import contextmanager
import json
import os
import sqlite3
from typing import Any, Dict, List, Optional, Tuple

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))
SERVER_DIR = os.path.join(PROJECT_ROOT, "server")


def resolve_db_path() -> str:
    """Resolve the shared SQLite database path used by Node.js and Python."""
    env_path = os.getenv("SQLITE_DB_PATH")
    if env_path:
        if os.path.isabs(env_path):
            return env_path
        server_rel = os.path.abspath(os.path.join(SERVER_DIR, env_path))
        if os.path.exists(server_rel) or os.path.exists(os.path.dirname(server_rel)):
            return server_rel
        return os.path.abspath(os.path.join(PROJECT_ROOT, env_path))
    return os.path.join(SERVER_DIR, "legalai.db")


@contextmanager
def get_connection():
    """Context manager yielding a configured SQLite connection with WAL enabled."""
    db_path = resolve_db_path()
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    conn = sqlite3.connect(db_path, timeout=10.0)
    conn.row_factory = sqlite3.Row
    try:
        conn.execute("PRAGMA journal_mode=WAL;")
        conn.execute("PRAGMA foreign_keys=ON;")
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def ensure_rag_tables() -> None:
    """Idempotently ensure RAG & statutory tables exist if Python boots before Node."""
    with get_connection() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS statutes (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              docKey TEXT NOT NULL UNIQUE,
              actCode TEXT DEFAULT '',
              actName TEXT DEFAULT '',
              domain TEXT NOT NULL,
              jurisdiction TEXT DEFAULT 'India',
              language TEXT DEFAULT 'en',
              section TEXT DEFAULT '',
              title TEXT NOT NULL,
              citation TEXT NOT NULL,
              effectiveDate TEXT DEFAULT NULL,
              repealDate TEXT DEFAULT NULL,
              status TEXT DEFAULT 'IN_FORCE',
              text TEXT NOT NULL,
              structureJson TEXT DEFAULT '{}',
              preconditionsJson TEXT DEFAULT '[]',
              exceptionsJson TEXT DEFAULT '[]',
              crossReferencesJson TEXT DEFAULT '[]',
              keyElementsJson TEXT DEFAULT '[]',
              actionChecklistJson TEXT DEFAULT '[]',
              supersedesJson TEXT DEFAULT 'null',
              supersededByJson TEXT DEFAULT 'null',
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS statute_versions (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              transitionKey TEXT NOT NULL UNIQUE,
              oldAct TEXT NOT NULL,
              oldSection TEXT NOT NULL,
              title TEXT NOT NULL,
              newAct TEXT NOT NULL,
              newSection TEXT NOT NULL,
              effectiveDate TEXT NOT NULL,
              status TEXT DEFAULT 'REPEALED_SUPERSEDED',
              jurisdiction TEXT DEFAULT 'India',
              punishment TEXT DEFAULT '',
              proceduralCode TEXT DEFAULT '',
              notes TEXT DEFAULT '',
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS rag_query_logs (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              userId INTEGER NULL,
              engine TEXT DEFAULT 'node-rag',
              query TEXT NOT NULL,
              category TEXT DEFAULT '',
              confidence REAL DEFAULT 0.0,
              route TEXT DEFAULT 'RETRIEVE',
              complexityScore REAL DEFAULT 0.0,
              jurisdiction TEXT DEFAULT 'India',
              retrievedDocKeysJson TEXT DEFAULT '[]',
              attributionPrecision REAL NULL,
              judgeScore REAL NULL,
              latencyMs REAL DEFAULT 0.0,
              userRating INTEGER NULL,
              userFeedback TEXT DEFAULT '',
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS rag_evaluations (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              benchmarkName TEXT NOT NULL,
              evaluatorType TEXT NOT NULL,
              krippendorffAlpha REAL DEFAULT 0.0,
              spearmanRho REAL DEFAULT 0.0,
              faithfulness REAL DEFAULT 0.0,
              citationPrecision REAL DEFAULT 0.0,
              preconditionCompleteness REAL DEFAULT 0.0,
              expertRating REAL DEFAULT 0.0,
              metricsJson TEXT DEFAULT '{}',
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            """
        )


def _safe_json_loads(raw: Any, fallback: Any) -> Any:
    if raw is None or raw == "":
        return fallback
    try:
        return json.loads(raw)
    except Exception:
        return fallback


def load_statutes_from_db() -> List[Dict[str, Any]]:
    """Fetch structured statutory documents from SQLite `statutes` table."""
    db_path = resolve_db_path()
    if not os.path.exists(db_path):
        return []
    try:
        ensure_rag_tables()
        with get_connection() as conn:
            rows = conn.execute("SELECT * FROM statutes ORDER BY id ASC").fetchall()
            docs: List[Dict[str, Any]] = []
            for r in rows:
                docs.append(
                    {
                        "id": r["docKey"],
                        "db_id": r["id"],
                        "act_code": r["actCode"],
                        "act_name": r["actName"],
                        "domain": r["domain"],
                        "jurisdiction": r["jurisdiction"],
                        "language": r["language"],
                        "section": r["section"],
                        "title": r["title"],
                        "citation": r["citation"],
                        "effective_date": r["effectiveDate"],
                        "repeal_date": r["repealDate"],
                        "status": r["status"],
                        "text": r["text"],
                        "structure": _safe_json_loads(r["structureJson"], {}),
                        "preconditions": _safe_json_loads(r["preconditionsJson"], []),
                        "exceptions": _safe_json_loads(r["exceptionsJson"], []),
                        "cross_references": _safe_json_loads(r["crossReferencesJson"], []),
                        "key_elements": _safe_json_loads(r["keyElementsJson"], []),
                        "action_checklist": _safe_json_loads(r["actionChecklistJson"], []),
                        "supersedes": _safe_json_loads(r["supersedesJson"], None),
                        "superseded_by": _safe_json_loads(r["supersededByJson"], None),
                    }
                )
            return docs
    except Exception:
        return []


def load_statute_versions_from_db() -> Dict[str, Dict[str, Any]]:
    """Load statutory version crosswalks from SQLite `statute_versions` table."""
    db_path = resolve_db_path()
    if not os.path.exists(db_path):
        return {}
    try:
        ensure_rag_tables()
        with get_connection() as conn:
            rows = conn.execute("SELECT * FROM statute_versions ORDER BY id ASC").fetchall()
            catalog: Dict[str, Dict[str, Any]] = {}
            for r in rows:
                catalog[r["transitionKey"]] = {
                    "old_act": r["oldAct"],
                    "old_section": r["oldSection"],
                    "title": r["title"],
                    "new_act": r["newAct"],
                    "new_section": r["newSection"],
                    "effective_date": r["effectiveDate"],
                    "status": r["status"],
                    "jurisdiction": r["jurisdiction"],
                    "punishment": r["punishment"],
                    "procedural_code": r["proceduralCode"],
                    "notes": r["notes"],
                }
            return catalog
    except Exception:
        return {}


def get_best_lawyer_and_court_from_db(
    specialty: str, default_court_code: Optional[str] = None
) -> Tuple[Optional[Dict[str, Any]], Optional[Dict[str, Any]]]:
    """Query SQLite `lawyers` and `courts` tables for domain-matched records."""
    db_path = resolve_db_path()
    if not os.path.exists(db_path):
        return None, None
    try:
        with get_connection() as conn:
            lawyer_row = None
            has_lawyers = conn.execute(
                "SELECT 1 FROM sqlite_master WHERE type='table' AND name='lawyers'"
            ).fetchone()
            if has_lawyers:
                if specialty:
                    lawyer_row = conn.execute(
                        """
                        SELECT id, name, title, specialty, barNumber, experienceYears,
                               firmName, city, state, hourlyRate, rating, successRate, primaryCourt
                        FROM lawyers
                        WHERE isAvailable = 1 AND LOWER(specialty) LIKE ?
                        ORDER BY successRate DESC, rating DESC, experienceYears DESC
                        LIMIT 1
                        """,
                        (f"%{specialty.lower()}%",),
                    ).fetchone()
                if not lawyer_row:
                    lawyer_row = conn.execute(
                        """
                        SELECT id, name, title, specialty, barNumber, experienceYears,
                               firmName, city, state, hourlyRate, rating, successRate, primaryCourt
                        FROM lawyers
                        WHERE isAvailable = 1
                        ORDER BY successRate DESC, rating DESC
                        LIMIT 1
                        """
                    ).fetchone()

            court_row = None
            has_courts = conn.execute(
                "SELECT 1 FROM sqlite_master WHERE type='table' AND name='courts'"
            ).fetchone()
            if has_courts:
                if default_court_code:
                    court_row = conn.execute(
                        """
                        SELECT id, name, code, jurisdiction, level, city, state, filingSystem
                        FROM courts
                        WHERE code = ?
                        LIMIT 1
                        """,
                        (default_court_code,),
                    ).fetchone()
                if not court_row:
                    court_row = conn.execute(
                        """
                        SELECT id, name, code, jurisdiction, level, city, state, filingSystem
                        FROM courts
                        ORDER BY id ASC
                        LIMIT 1
                        """
                    ).fetchone()

            lawyer_dict = dict(lawyer_row) if lawyer_row else None
            court_dict = dict(court_row) if court_row else None
            return lawyer_dict, court_dict
    except Exception:
        return None, None


def log_rag_inference(
    query: str,
    category: str = "",
    confidence: float = 0.0,
    route: str = "RETRIEVE",
    complexity_score: float = 0.0,
    jurisdiction: str = "India",
    retrieved_doc_keys: Optional[List[str]] = None,
    attribution_precision: Optional[float] = None,
    judge_score: Optional[float] = None,
    latency_ms: float = 0.0,
    user_id: Optional[int] = None,
    engine: str = "python-adaptive-rag",
) -> Optional[int]:
    """Persist an adaptive RAG inference log row in SQLite `rag_query_logs`."""
    try:
        ensure_rag_tables()
        with get_connection() as conn:
            cur = conn.execute(
                """
                INSERT INTO rag_query_logs (
                  userId, engine, query, category, confidence, route,
                  complexityScore, jurisdiction, retrievedDocKeysJson,
                  attributionPrecision, judgeScore, latencyMs
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    user_id,
                    engine,
                    query,
                    category,
                    float(confidence or 0.0),
                    route,
                    float(complexity_score or 0.0),
                    jurisdiction,
                    json.dumps(retrieved_doc_keys or []),
                    attribution_precision,
                    judge_score,
                    float(latency_ms or 0.0),
                ),
            )
            return cur.lastrowid
    except Exception:
        return None


def save_evaluation_run(
    benchmark_name: str,
    evaluator_type: str,
    krippendorff_alpha: float = 0.0,
    spearman_rho: float = 0.0,
    faithfulness: float = 0.0,
    citation_precision: float = 0.0,
    precondition_completeness: float = 0.0,
    expert_rating: float = 0.0,
    metrics_payload: Optional[Dict[str, Any]] = None,
) -> Optional[int]:
    """Persist an evaluation benchmark report row in SQLite `rag_evaluations`."""
    try:
        ensure_rag_tables()
        with get_connection() as conn:
            cur = conn.execute(
                """
                INSERT INTO rag_evaluations (
                  benchmarkName, evaluatorType, krippendorffAlpha, spearmanRho,
                  faithfulness, citationPrecision, preconditionCompleteness,
                  expertRating, metricsJson
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    benchmark_name,
                    evaluator_type,
                    float(krippendorff_alpha or 0.0),
                    float(spearman_rho or 0.0),
                    float(faithfulness or 0.0),
                    float(citation_precision or 0.0),
                    float(precondition_completeness or 0.0),
                    float(expert_rating or 0.0),
                    json.dumps(metrics_payload or {}),
                ),
            )
            return cur.lastrowid
    except Exception:
        return None


def save_feedback(
    rag_log_id: int, rating: Optional[int] = None, feedback: str = ""
) -> bool:
    """Update userRating and userFeedback on a logged RAG inference row."""
    try:
        ensure_rag_tables()
        clean_feedback = (feedback or "").strip()[:1000]
        with get_connection() as conn:
            cur = conn.execute(
                """
                UPDATE rag_query_logs
                SET userRating = COALESCE(?, userRating),
                    userFeedback = CASE WHEN ? != '' THEN ? ELSE userFeedback END
                WHERE id = ?
                """,
                (rating, clean_feedback, clean_feedback, int(rag_log_id)),
            )
            return cur.rowcount > 0
    except Exception:
        return False


def get_db_status() -> Dict[str, Any]:
    """Return SQLite connection status and row counts across LegalAI tables."""
    db_path = resolve_db_path()
    expected_tables = [
        "users",
        "ai_chats",
        "lawyers",
        "courts",
        "consultations",
        "cases",
        "notifications",
        "statutes",
        "statute_versions",
        "rag_query_logs",
        "rag_evaluations",
    ]
    counts: Dict[str, Optional[int]] = {}
    if not os.path.exists(db_path):
        return {
            "connected": False,
            "engine": "python-sqlite3",
            "db_path": db_path,
            "tables": {t: None for t in expected_tables},
        }

    try:
        with get_connection() as conn:
            for tbl in expected_tables:
                exists = conn.execute(
                    "SELECT 1 FROM sqlite_master WHERE type='table' AND name=?",
                    (tbl,),
                ).fetchone()
                if exists:
                    row = conn.execute(f'SELECT COUNT(*) AS cnt FROM "{tbl}"').fetchone()
                    counts[tbl] = int(row["cnt"]) if row else 0
                else:
                    counts[tbl] = None
        return {
            "connected": True,
            "engine": "python-sqlite3",
            "db_path": db_path,
            "table_count": sum(1 for v in counts.values() if v is not None),
            "tables": counts,
        }
    except Exception as exc:
        return {
            "connected": False,
            "engine": "python-sqlite3",
            "db_path": db_path,
            "error": str(exc),
            "tables": counts,
        }

