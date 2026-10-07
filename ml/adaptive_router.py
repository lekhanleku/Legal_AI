"""
LegalAI Adaptive Retrieval Router (Idea 1)
Determines dynamically whether retrieval should occur and adapts top-k & query strategy.
Solves the AILQA finding: RAG degrades large LLM performance on simple queries (Llama3-70B dropped
from 4.43 to 3.37 with unnecessary context).
Classifies into:
  1. 'DIRECT' (Answer Directly): Low complexity or standard definitions; avoids context pollution.
  2. 'RETRIEVE' (Standard Hybrid RAG): Moderate complexity, top-k = 3.
  3. 'RETRIEVE_MORE' (Deep Multi-Statute RAG): High complexity, multi-step conditions, exceptions;
     dynamically expands top-k = 6, triggers query rewriting and Knowledge Graph traversal.
"""

import re
from typing import Dict, List, Any, Tuple


class AdaptiveRetrievalRouter:
    """
    Evaluates query complexity and retrieval confidence to route queries adaptively,
    preventing retrieval-induced hallucination and context pollution.
    """

    def __init__(self):
        # Linguistic and legal indicators of high complexity
        self.complex_keywords = [
            "exception", "unless", "precondition", "provided that", "cross-reference",
            "compare", "difference between", "conflict", "superseded", "transition",
            "ipc vs bns", "crpc vs bnss", "when can the court", "terminate custody",
            "what conditions", "prerequisites", "multilingual", "both", "multi-step"
        ]

        # Simple conversational or universal legal principles that require NO retrieval
        self.direct_keywords = [
            "hello", "hi", "hey", "who are you", "what can you do", "help me",
            "what is a statute", "what does pro se mean", "what is a plaintiff",
            "what is a defendant", "define jurisdiction", "what is a contract",
            "good morning", "thanks", "thank you"
        ]

    def compute_query_complexity(self, query: str) -> Tuple[float, List[str]]:
        """
        Computes a continuous query complexity score C in [0, 1] and extracts trigger features.
        """
        q_lower = query.lower()
        score = 0.0
        reasons = []

        # 1. Word count length signal
        words = q_lower.split()
        if len(words) > 20:
            score += 0.25
            reasons.append("Multi-sentence detailed factual inquiry")
        elif len(words) > 10:
            score += 0.15

        # 2. Key structural reasoning triggers
        matched_complex = [kw for kw in self.complex_keywords if kw in q_lower]
        if matched_complex:
            score += min(0.4, 0.15 * len(matched_complex))
            reasons.append(f"Statutory condition / exception triggers: {', '.join(matched_complex)}")

        # 3. Question format signals (precondition/interrogative)
        if re.search(r"^(when can|under what circumstances|what are the requirements|how do i prove)", q_lower):
            score += 0.20
            reasons.append("Multi-element legal standard query")

        # 4. Multi-jurisdiction / code transition triggers
        if any(term in q_lower for term in ["ipc", "bns", "crpc", "bnss", "dutch", "netherlands", "ll144"]):
            score += 0.20
            reasons.append("Code versioning / cross-jurisdiction navigation")

        clamped_score = min(1.0, max(0.0, score))
        return round(clamped_score, 3), reasons

    def route_query(self, query: str, classification_confidence: float = 0.85) -> Dict[str, Any]:
        """
        Executes adaptive routing logic:
        - DIRECT: If simple/conversational, or query matches direct definitions.
        - RETRIEVE_MORE: If complexity >= 0.55 or multi-hop statutory dependencies found.
        - RETRIEVE: Otherwise standard hybrid retrieval.
        """
        q_lower = query.lower().strip()
        complexity_score, complexity_reasons = self.compute_query_complexity(query)

        # Check for direct answer trigger
        is_direct = any(q_lower == dk or q_lower.startswith(dk + " ") for dk in self.direct_keywords)
        if len(q_lower.split()) <= 4 and is_direct:
            return {
                "route": "DIRECT",
                "recommended_top_k": 0,
                "complexity_score": complexity_score,
                "reasons": ["Low-complexity query: Direct answer prevents context dilution and hallucination."],
                "expand_knowledge_graph": False,
                "rewrite_queries": False,
                "explanation": "Answer directly without injecting noisy external chunks (AILQA gap solution)."
            }

        if complexity_score >= 0.50:
            # High complexity: HyPA-RAG style adaptive expansion
            rewritten_subqueries = self._generate_subqueries(query)
            return {
                "route": "RETRIEVE_MORE",
                "recommended_top_k": 5,
                "complexity_score": complexity_score,
                "reasons": complexity_reasons,
                "expand_knowledge_graph": True,
                "rewrite_queries": True,
                "subqueries": rewritten_subqueries,
                "explanation": "Deep retrieval activated: Query requires multi-step preconditions, exceptions, and knowledge graph traversal."
            }

        # Standard retrieval
        return {
            "route": "RETRIEVE",
            "recommended_top_k": 3,
            "complexity_score": complexity_score,
            "reasons": ["Balanced legal inquiry: Standard hybrid RAG top-3 sufficient."],
            "expand_knowledge_graph": False,
            "rewrite_queries": False,
            "subqueries": [],
            "explanation": "Standard hybrid retrieval with BM25 + dense vector ranking."
        }

    def _generate_subqueries(self, query: str) -> List[str]:
        """Decomposes a complex query into focused sub-queries for rules, preconditions, and exceptions."""
        subqueries = [query]
        q_lower = query.lower()

        if "cheat" in q_lower or "fraud" in q_lower or "420" in q_lower:
            subqueries.append("What are the essential ingredients of cheating and dishonest inducement under Section 318(4) BNS?")
            subqueries.append("When is commercial breach of contract distinguished from criminal cheating?")

        if "bail" in q_lower:
            subqueries.append("What are the preconditions for anticipatory bail under Section 482 BNSS?")
            subqueries.append("Exceptions and humanitarian bail considerations for women, minors, and infirm")

        if "rent" in q_lower or "deposit" in q_lower:
            subqueries.append("Statutory deadlines and mandatory written itemized statement for security deposit deductions")
            subqueries.append("Warranty of habitability notice requirements and right to withhold rent into escrow")

        if "ll144" in q_lower or "aedt" in q_lower:
            subqueries.append("NYC Local Law 144 independent bias audit annual requirements")
            subqueries.append("Candidate 10 business days advance notice exceptions for automated screening")

        return list(dict.fromkeys(subqueries))[:3]


adaptive_router = AdaptiveRetrievalRouter()
