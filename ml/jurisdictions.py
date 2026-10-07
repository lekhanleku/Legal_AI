"""
LegalAI Cross-Jurisdiction & Multilingual Legal QA Engine (Idea 8)
Supports cross-border legal transference across:
1. India (Bharatiya Nyaya Sanhita / BNSS / Consumer Protection Act) with Hindi legal terms
2. USA (Federal Title VII, 42 U.S.C. § 1983, California Civil Code, Delaware DGCL, NYC LL144)
3. Netherlands / EU (Dutch Civil Code Book 7 Article 247, GDPR Article 17/22)
Standardizes a Shared Evaluation Schema:
  { question, jurisdiction, language, governing_code, answer, article_attributions, temporal_validity }
"""

from typing import Dict, List, Any, Optional


HINDI_LEGAL_TERMS_GLOSSARY = {
    "धोखाधड़ी": {"english": "cheating / fraud", "statute": "BNS § 318(4)", "domain": "Criminal Law"},
    "जमानत": {"english": "bail", "statute": "BNSS § 480 / § 482", "domain": "Criminal Law"},
    "अग्रिम जमानत": {"english": "anticipatory bail", "statute": "BNSS § 482", "domain": "Criminal Law"},
    "किरायेदार": {"english": "tenant", "statute": "Tenancy Code", "domain": "Tenant Law"},
    "मकान मालिक": {"english": "landlord", "statute": "Tenancy Code", "domain": "Tenant Law"},
    "सुरक्षा जमा": {"english": "security deposit", "statute": "Rent Control / Security Deposit", "domain": "Tenant Law"},
    "एफआईआर": {"english": "First Information Report (FIR)", "statute": "BNSS § 173", "domain": "Criminal Law"},
    "मुआवजा": {"english": "damages / compensation", "statute": "Consumer Protection / Tort", "domain": "Civil Law"},
}

DUTCH_LEGAL_TERMS_GLOSSARY = {
    "huurovereenkomst": {"english": "rental agreement / lease", "statute": "BW 7:201", "domain": "Tenant Law"},
    "huurcommissie": {"english": "rent tribunal", "statute": "BW 7:249", "domain": "Tenant Law"},
    "liberalisatiegrens": {"english": "rent liberalization threshold", "statute": "BW 7:247", "domain": "Tenant Law"},
    "gebrek": {"english": "defect in rented property", "statute": "BW 7:204", "domain": "Tenant Law"},
    "opzegging": {"english": "termination of lease", "statute": "BW 7:271", "domain": "Tenant Law"},
}


class CrossJurisdictionEngine:
    """Manages cross-jurisdiction transference and multilingual query mapping."""

    def __init__(self):
        self.hindi_terms = HINDI_LEGAL_TERMS_GLOSSARY
        self.dutch_terms = DUTCH_LEGAL_TERMS_GLOSSARY

    def detect_jurisdiction_and_language(self, query: str) -> Dict[str, Any]:
        """Detects the target legal jurisdiction, language, and multilingual legal concepts."""
        q_lower = query.lower()
        matched_hindi = []
        matched_dutch = []

        # Check Hindi terms
        for term, data in self.hindi_terms.items():
            if term in query or data["english"] in q_lower:
                if term in query:
                    matched_hindi.append({"term": term, **data})

        # Check Dutch terms
        for term, data in self.dutch_terms.items():
            if term in q_lower:
                matched_dutch.append({"term": term, **data})

        # Determine Primary Jurisdiction
        if any(w in q_lower for w in ["bns", "ipc", "crpc", "bnss", "fir", "india", "delhi", "mumbai", "high court"]) or len(matched_hindi) > 0:
            jurisdiction = "India"
            governing_code = "Bharatiya Nyaya Sanhita (BNS 2023) / BNSS"
            language = "hi/en" if len(matched_hindi) > 0 else "en"
        elif any(w in q_lower for w in ["dutch", "netherlands", "amsterdam", "huurcommissie", "bw", "artikel 247"]) or len(matched_dutch) > 0:
            jurisdiction = "Netherlands"
            governing_code = "Burgerlijk Wetboek Boek 7 (BW 7)"
            language = "nl" if len(matched_dutch) > 0 else "en"
        elif any(w in q_lower for w in ["new york", "nyc", "ll144", "delaware", "california", "title vii", "eeoc", "miranda", "1983", "constitution"]):
            jurisdiction = "USA"
            governing_code = "U.S. Federal & State Statutes (NY/CA/DE)"
            language = "en"
        else:
            jurisdiction = "USA / Comparative"
            governing_code = "General Common Law & Model Acts"
            language = "en"

        return {
            "primary_jurisdiction": jurisdiction,
            "governing_statutory_code": governing_code,
            "detected_language": language,
            "multilingual_concepts": {
                "hindi_matches": matched_hindi,
                "dutch_matches": matched_dutch
            },
            "transferable_format": True
        }

    def format_shared_schema(
        self,
        question: str,
        answer: str,
        jurisdiction: str,
        language: str,
        attributions: List[Dict[str, Any]],
        temporal_validity: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Creates the shared cross-jurisdiction evaluation payload."""
        return {
            "schema_version": "2.0.0-LegalAI-CrossJurisdiction",
            "question": question,
            "jurisdiction": jurisdiction,
            "language": language,
            "answer": answer,
            "article_level_attributions": [
                {
                    "claim": a.get("claim_text"),
                    "cited_article": a.get("cited_authority"),
                    "status": a.get("attribution_label")
                }
                for a in attributions
            ],
            "temporal_validity": {
                "effective_date": temporal_validity.get("query_evaluation_date"),
                "status": "VALID_IN_FORCE" if not temporal_validity.get("has_temporal_alerts") else "SUPERSEDED_NOTICED"
            }
        }


jurisdiction_engine = CrossJurisdictionEngine()
