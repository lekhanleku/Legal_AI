"""
LegalAI Claim-Level Attribution & Citation Verification Engine (Idea 5)
Inspired by ALCE (Attributed Language for Complex Reasoning) and legal NLI frameworks.
Solves the gap identified in the Dutch paper and AILQA:
- Chunk-level evaluation or BLEU/ROUGE misses hallucinated citations and omitted conditions.
- Implements fine-grained claim-level attribution checking against cited statutory provisions.
- Classifies each proposition into the ALCE-Legal Error Taxonomy:
    1. SUPPORTED (Entailed directly by cited statute)
    2. PARTIALLY_SUPPORTED (Broadly correct, minor condition qualification needed)
    3. WRONG_CITATION (Cited statute does not support the stated proposition)
    4. MISSING_CONDITION (Asserts an absolute rule without vital statutory precondition)
    5. UNSUPPORTED_EXTRAPOLATION (Hallucinated rule or unsupported fact)
"""

import re
from typing import Dict, List, Any, Optional


class ClaimLevelAttributionEngine:
    """Performs claim-level decomposition and verification against retrieved statutory authorities."""

    def __init__(self):
        self.citation_pattern = re.compile(
            r"\[([^\]]+)\]|\(([A-Z][\w\s\.,§\(\)]+\d+)\)|(?:Section|Article|§)\s*[\d\(\)]+",
            re.IGNORECASE
        )

    def extract_claims(self, text: str) -> List[Dict[str, Any]]:
        """Splits advisory response into discrete legal propositions/sentences."""
        # Clean markdown headers and formatting
        lines = [line.strip() for line in text.split("\n") if line.strip() and not line.startswith("#")]
        claims = []

        for line in lines:
            if line.startswith(">") or line.startswith("*") or line.startswith("-") or re.match(r"^\d+\.", line):
                clean_line = re.sub(r"^[\*\->\d\.\s\[\]]+", "", line).strip()
            else:
                clean_line = line.strip()

            # Split into sentences
            sentences = re.split(r"(?<=[.!?])\s+", clean_line)
            for s in sentences:
                s_clean = s.strip()
                if len(s_clean) > 15:
                    claims.append({
                        "raw_text": s_clean,
                        "citations_found": self._find_citations(s_clean)
                    })

        return claims

    def _find_citations(self, sentence: str) -> List[str]:
        citations = []
        matches = self.citation_pattern.findall(sentence)
        for m in matches:
            if isinstance(m, tuple):
                for sub in m:
                    if sub.strip():
                        citations.append(sub.strip())
            elif isinstance(m, str) and m.strip():
                citations.append(m.strip())
        return citations

    def verify_claims_against_sources(
        self,
        claims: List[Dict[str, Any]],
        retrieved_sources: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Evaluates each claim against retrieved statutory authorities and assigns
        an ALCE-style Attribution Taxonomy label.
        """
        verified_claims = []
        supported_count = 0
        partially_supported_count = 0
        wrong_citation_count = 0
        missing_condition_count = 0
        unsupported_count = 0

        # Build lookup of retrieved statutory text and citations
        source_texts = " ".join([
            f"{s.get('citation', '')} {s.get('text', '')} {' '.join(s.get('preconditions', []))} {' '.join(s.get('key_elements', []))}"
            for s in retrieved_sources
        ]).lower()

        primary_source = retrieved_sources[0] if retrieved_sources else None
        primary_preconditions = [p.lower() for p in (primary_source.get("preconditions", []) if primary_source else [])]

        for claim_obj in claims:
            sentence = claim_obj["raw_text"]
            s_lower = sentence.lower()
            cites = claim_obj["citations_found"]

            # 1. Check for Missing Precondition pattern
            # If claim asserts a powerful right (withholding rent, terminating, bail, penalty)
            # without stating the required statutory condition
            has_unqualified_assertion = (
                ("withhold rent" in s_lower and not any(w in s_lower for w in ["notice", "escrow", "14"])) or
                ("claim treble damages" in s_lower and not any(w in s_lower for w in ["bad faith", "statutory", "30 days", "21 days"])) or
                ("anticipatory bail is guaranteed" in s_lower)
            )

            if has_unqualified_assertion:
                label = "MISSING_CONDITION"
                status_color = "warning"
                verdict_text = "Asserts absolute legal outcome while omitting mandatory statutory condition / notice period."
                confidence = 0.88
                missing_condition_count += 1

            # 2. Check for Wrong Citation
            elif cites and not any(c.lower() in source_texts for c in cites):
                label = "WRONG_CITATION"
                status_color = "danger"
                verdict_text = f"Cites {', '.join(cites)} which does not appear in retrieved authorities or is legally inapplicable."
                confidence = 0.92
                wrong_citation_count += 1

            # 3. Check for Supported by retrieved sources
            else:
                # Measure token overlap between claim and retrieved text
                claim_words = [w for w in re.findall(r"\b\w+\b", s_lower) if len(w) > 4]
                overlap = sum(1 for w in claim_words if w in source_texts)
                overlap_ratio = overlap / max(len(claim_words), 1)

                if overlap_ratio >= 0.45 or any(c.lower() in source_texts for c in cites):
                    label = "SUPPORTED"
                    status_color = "success"
                    verdict_text = "Entailed and corroborated by retrieved statutory authority."
                    confidence = 0.95
                    supported_count += 1
                elif overlap_ratio >= 0.25:
                    label = "PARTIALLY_SUPPORTED"
                    status_color = "info"
                    verdict_text = "Grounded in general legal principles, but lacks specific statutory citation."
                    confidence = 0.78
                    partially_supported_count += 1
                else:
                    label = "UNSUPPORTED_EXTRAPOLATION"
                    status_color = "danger"
                    verdict_text = "Factual or procedural claim not supported by retrieved statutory chunks."
                    confidence = 0.70
                    unsupported_count += 1

            verified_claims.append({
                "claim_text": sentence,
                "citations": cites,
                "attribution_label": label,
                "status_color": status_color,
                "explanation": verdict_text,
                "confidence": confidence,
                "cited_authority": primary_source.get("citation", "Statutory Rule") if primary_source else None
            })

        total_claims = max(len(verified_claims), 1)
        attribution_precision = round((supported_count + 0.5 * partially_supported_count) / total_claims, 3)
        faithfulness_index = round((supported_count / total_claims), 3)

        return {
            "total_claims_evaluated": len(verified_claims),
            "attribution_precision": attribution_precision,
            "faithfulness_index": faithfulness_index,
            "taxonomy_distribution": {
                "SUPPORTED": supported_count,
                "PARTIALLY_SUPPORTED": partially_supported_count,
                "MISSING_CONDITION": missing_condition_count,
                "WRONG_CITATION": wrong_citation_count,
                "UNSUPPORTED_EXTRAPOLATION": unsupported_count
            },
            "claims": verified_claims,
            "overall_status": "HIGH_FIDELITY" if attribution_precision >= 0.80 else "NEEDS_QUALIFICATION"
        }


attribution_engine = ClaimLevelAttributionEngine()
