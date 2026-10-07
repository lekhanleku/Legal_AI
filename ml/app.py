"""
LegalAI ML & RAG Intelligence Microservice (Version 3.0.0)
FastAPI server serving:
1. Supervised NLP Domain Classifier (Calibrated LinearSVC)
2. Structure-Aware Statutory Chunker & FAISS Dense Vector Space
3. Adaptive Retrieval Router (Direct vs Standard vs Deep RAG)
4. Version-Aware Legal Registry & Temporal Validity (IPC/BNS Transition Engine)
5. Hybrid Retrieval (BM25 + FAISS Cosine + Cross-Encoder Reranker)
6. Statute Knowledge Graph for Preconditions & Cross-References
7. Claim-Level Attribution & ALCE Error Taxonomy Verification Engine
8. Calibrated LLM Judge & Blinded Expert Benchmark Suite
9. Cross-Jurisdiction & Multilingual Transference Engine
10. Legal Monoculture & Bias Auditor
11. Layperson-Facing Adapter & Escalation Framework
"""

import os
import sys

# Configure UTF-8 safe output for Windows console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

import json
import joblib
import numpy as np
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Internal Engine Modules
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from version_manager import version_manager
from structure_chunker import structure_chunker
from knowledge_graph import legal_kg
from adaptive_router import adaptive_router
from hybrid_retriever import HybridRetriever
from attribution_engine import attribution_engine
from evaluator import benchmark_suite, CalibratedLLMJudge
from jurisdictions import jurisdiction_engine
from bias_auditor import bias_auditor
from layperson_adapter import layperson_adapter

MODELS_DIR = os.path.join(BASE_DIR, "models")
DATASET_PATH = os.path.join(BASE_DIR, "dataset", "legal_queries.csv")
CORPUS_V2_PATH = os.path.join(BASE_DIR, "data", "legal_corpus_v2.json")
LEGACY_CORPUS_PATH = os.path.join(BASE_DIR, "data", "legal_corpus.json")

app = FastAPI(
    title="LegalAI Advanced Adaptive RAG & Intelligence Engine",
    description="Research-Grade Adaptive Hybrid-RAG Legal Microservice with Claim-Level Citations & Version Awareness",
    version="3.0.0"
)

# Enable CORS for Node.js backend and browser clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model state
classifier = None
faiss_index = None
rag_metadata = None
rag_embedder = None
hybrid_retriever_instance = None
calibrated_judge = CalibratedLLMJudge()
metrics_data = {}

# Legal domain mappings to attorneys and courts
DOMAIN_MAPPINGS = {
    "Tenant Law": {
        "specialty": "Real Estate Law",
        "courtCode": "COOK-IL",
        "courtName": "Cook County Housing & Municipal Court",
        "role": "Tenant Rights & Real Estate Attorney"
    },
    "Criminal Law": {
        "specialty": "Criminal Law",
        "courtCode": "MASS-SUFFOLK",
        "courtName": "Suffolk Superior Court Criminal Division",
        "role": "Criminal Defense Specialist"
    },
    "Corporate Law": {
        "specialty": "Corporate Law",
        "courtCode": "DE-CHANCERY",
        "courtName": "Delaware Court of Chancery",
        "role": "Corporate & Venture Counsel"
    },
    "Contracts Law": {
        "specialty": "Corporate Law",
        "courtCode": "SDNY",
        "courtName": "U.S. District Court (S.D.N.Y.)",
        "role": "Civil Litigation & Commercial Contracts Attorney"
    },
    "Family Law": {
        "specialty": "Family Law",
        "courtCode": "FL-11TH",
        "courtName": "Miami-Dade County Family Court",
        "role": "Family Law & Custody Attorney"
    },
    "Employment Law": {
        "specialty": "Employment Law",
        "courtCode": "NDIL",
        "courtName": "U.S. District Court (N.D. Ill.)",
        "role": "Labor & Employment Rights Attorney"
    },
    "Civil Rights": {
        "specialty": "Civil Rights",
        "courtCode": "SDNY",
        "courtName": "U.S. District Court (Federal Civil Rights)",
        "role": "Civil Rights & Constitutional Attorney"
    },
    "Personal Injury": {
        "specialty": "Personal Injury",
        "courtCode": "FL-11TH",
        "courtName": "Circuit Court (Tort Division)",
        "role": "Personal Injury & Trial Attorney"
    },
    "Intellectual Property": {
        "specialty": "Intellectual Property",
        "courtCode": "NDCA",
        "courtName": "U.S. District Court (N.D. Cal. Silicon Valley)",
        "role": "Intellectual Property Trial Attorney"
    },
    "Immigration Law": {
        "specialty": "Immigration Law",
        "courtCode": "CA9",
        "courtName": "U.S. Court of Appeals (9th Circuit) / EOIR",
        "role": "Immigration & Removal Defense Attorney"
    },
    "Tax Law": {
        "specialty": "Tax Law",
        "courtCode": "USTC",
        "courtName": "United States Tax Court (Washington, D.C.)",
        "role": "Tax Controversy & Defense Attorney"
    }
}


def load_corpus() -> List[Dict[str, Any]]:
    """Loads legal corpus, prioritizing v2 with rich structural annotations."""
    target_path = CORPUS_V2_PATH if os.path.exists(CORPUS_V2_PATH) else LEGACY_CORPUS_PATH
    with open(target_path, "r", encoding="utf-8") as f:
        return json.load(f)


def build_models_and_index():
    """Trains the supervised domain classifier and indexes structure-aware statutory chunks."""
    global classifier, faiss_index, rag_metadata, rag_embedder, hybrid_retriever_instance, metrics_data
    os.makedirs(MODELS_DIR, exist_ok=True)

    model_path = os.path.join(MODELS_DIR, "legal_classifier.pkl")
    faiss_path = os.path.join(MODELS_DIR, "faiss_index_v2.bin")
    meta_path = os.path.join(MODELS_DIR, "rag_metadata_v2.pkl")
    embedder_path = os.path.join(MODELS_DIR, "rag_embedder_v2.pkl")

    print("[LegalAI ML] Initializing model training and structure-aware indexing...")

    # 1. Train Classifier if needed
    import pandas as pd
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.svm import LinearSVC
    from sklearn.calibration import CalibratedClassifierCV
    from sklearn.pipeline import Pipeline
    import faiss

    if not os.path.exists(model_path):
        print("[LegalAI ML] Training Calibrated LinearSVC Classifier...")
        df = pd.read_csv(DATASET_PATH)
        pipe = Pipeline([
            ('tfidf', TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True, stop_words='english')),
            ('clf', CalibratedClassifierCV(estimator=LinearSVC(C=1.0, random_state=42)))
        ])
        pipe.fit(df['query'], df['category'])
        joblib.dump(pipe, model_path)
        classifier = pipe
    else:
        classifier = joblib.load(model_path)

    # 2. Build Structure-Aware Corpus Chunks
    raw_corpus = load_corpus()
    structured_chunks = [structure_chunker.parse_statute_structure(doc) for doc in raw_corpus]

    corpus_texts = [chunk["content"] for chunk in structured_chunks]

    embedder = TfidfVectorizer(ngram_range=(1, 2), stop_words='english')
    emb_matrix = embedder.fit_transform(corpus_texts).toarray().astype('float32')
    norms = np.linalg.norm(emb_matrix, axis=1, keepdims=True)
    emb_matrix = emb_matrix / np.maximum(norms, 1e-12)

    dim = emb_matrix.shape[1]
    idx = faiss.IndexFlatIP(dim)
    idx.add(emb_matrix)
    faiss.write_index(idx, faiss_path)

    meta = {
        "embedding_type": "structure-aware-tfidf-dense",
        "dimension": dim,
        "num_documents": len(raw_corpus),
        "raw_corpus": raw_corpus,
        "structured_chunks": structured_chunks
    }
    joblib.dump(meta, meta_path)
    joblib.dump(embedder, embedder_path)

    faiss_index = idx
    rag_metadata = meta
    rag_embedder = embedder
    hybrid_retriever_instance = HybridRetriever(raw_corpus)

    print(f"[OK] [LegalAI ML] Engine ready! Indexed {len(raw_corpus)} multi-jurisdictional statutes.")


@app.on_event("startup")
def startup_event():
    build_models_and_index()


# -------------------------------------------------------------
# Request & Response Models
# -------------------------------------------------------------
class QueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 3
    query_date: Optional[str] = None
    force_route: Optional[str] = None  # Optional override: 'DIRECT', 'RETRIEVE', 'RETRIEVE_MORE'


class AdaptiveRAGResponse(BaseModel):
    success: bool
    query: str
    category: str
    confidence: float
    confidence_percent: str
    routing: Dict[str, Any]
    temporal_validity: Dict[str, Any]
    jurisdiction_profile: Dict[str, Any]
    knowledge_graph_checklists: Dict[str, Any]
    retrieved_sources: List[Dict[str, Any]]
    grounded_answer: str
    claim_attributions: Dict[str, Any]
    calibrated_judge_evaluation: Dict[str, Any]
    layperson_view: Dict[str, Any]
    suggested_specialty: str
    suggested_court: Dict[str, Any]
    model_info: Dict[str, Any]


# -------------------------------------------------------------
# API Endpoints
# -------------------------------------------------------------
@app.get("/api/ml/health")
def health():
    return {
        "status": "online",
        "service": "LegalAI Advanced Adaptive RAG & Intelligence Engine",
        "version": "3.0.0",
        "classifier_loaded": classifier is not None,
        "faiss_index_loaded": faiss_index is not None,
        "indexed_statutes": faiss_index.ntotal if faiss_index else 0,
        "features": [
            "Adaptive Retrieval Router",
            "Structure-Aware Chunking",
            "Hybrid BM25 + Dense FAISS + Cross-Encoder Reranker",
            "Statute Knowledge Graph Preconditions",
            "Claim-Level Attribution & ALCE Error Taxonomy",
            "Calibrated LLM Judge & Krippendorff's Alpha",
            "Version-Aware Temporal Law Registry (IPC/BNS & CrPC/BNSS)",
            "Cross-Jurisdiction & Multilingual Support (India, USA, Netherlands)",
            "Bias & Legal Monoculture Auditor",
            "Layperson-Facing Actionable Adapter"
        ]
    }


class PredictResponse(BaseModel):
    success: bool
    category: str
    confidence: float
    confidence_percent: str
    probabilities: dict
    model_type: str


@app.post("/api/ml/predict", response_model=PredictResponse)
def predict_category(req: QueryRequest):
    global classifier
    if not req.query or not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    if classifier is None:
        build_models_and_index()

    probs = classifier.predict_proba([req.query])[0]
    classes = classifier.classes_
    top_idx = int(np.argmax(probs))
    category = classes[top_idx]
    confidence = float(probs[top_idx])
    prob_dict = {cls: round(float(p), 4) for cls, p in zip(classes, probs)}

    return PredictResponse(
        success=True,
        category=category,
        confidence=round(confidence, 4),
        confidence_percent=f"{round(confidence * 100, 1)}%",
        probabilities=prob_dict,
        model_type="Calibrated LinearSVC (Structure-Aware NLP Pipeline)"
    )


@app.post("/api/rag/adaptive", response_model=AdaptiveRAGResponse)
def adaptive_rag_query(req: QueryRequest):
    """
    Primary research-grade inference endpoint executing the complete Adaptive Hybrid-RAG pipeline.
    """
    global classifier, faiss_index, rag_metadata, rag_embedder, hybrid_retriever_instance
    if not req.query or not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    if classifier is None or faiss_index is None or hybrid_retriever_instance is None:
        build_models_and_index()

    query = req.query.strip()

    # 1. Supervised NLP Domain Classification
    probs = classifier.predict_proba([query])[0]
    classes = classifier.classes_
    top_idx = int(np.argmax(probs))
    category = classes[top_idx]
    confidence = float(probs[top_idx])

    # 2. Adaptive Retrieval Routing (Idea 1)
    routing_decision = adaptive_router.route_query(query, classification_confidence=confidence)
    if req.force_route:
        routing_decision["route"] = req.force_route

    # 3. Version-Aware Temporal Law & Code Transition Registry (Idea 7)
    temporal_info = version_manager.detect_temporal_context(query, req.query_date)

    # 4. Cross-Jurisdiction & Multilingual Mapping (Idea 8)
    jur_profile = jurisdiction_engine.detect_jurisdiction_and_language(query)

    # 5. Retrieval Execution based on Routing
    retrieved_sources = []
    effective_top_k = routing_decision.get("recommended_top_k", req.top_k)

    if routing_decision["route"] != "DIRECT" and effective_top_k > 0:
        # Run Dense Search via FAISS
        query_vec = rag_embedder.transform([query]).toarray().astype('float32')
        norm = np.linalg.norm(query_vec)
        if norm > 0:
            query_vec = query_vec / norm

        search_k = min(effective_top_k * 2, faiss_index.ntotal)
        distances, indices = faiss_index.search(query_vec, search_k)

        dense_scores = {int(idx): float(dist) for dist, idx in zip(distances[0], indices[0]) if idx >= 0}

        # Run Hybrid Search (BM25 + Dense + RRF + Cross-Encoder Reranker) (Idea 3)
        retrieved_sources = hybrid_retriever_instance.hybrid_search(
            query=query,
            dense_scores_dict=dense_scores,
            top_k=effective_top_k,
            alpha_dense_weight=0.55
        )

    # 6. Statute Knowledge Graph Precondition & Exception Traversal (Idea 4)
    kg_checklists = legal_kg.query_preconditions(query)

    # 7. Synthesize Grounded Advisory incorporating Statutory Rules, Preconditions & Versioning
    answer_parts = []
    mapping = DOMAIN_MAPPINGS.get(category, {
        "specialty": "Corporate & Civil Litigation",
        "courtCode": "SDNY",
        "courtName": "District Civil Court",
        "role": "General Legal Counsel"
    })

    # Header with diagnostic metadata
    answer_parts.append(f"### ⚖️ Legal Analysis: **{category}**")
    answer_parts.append(f"> **ML Diagnostic:** Classified with **{round(confidence * 100, 1)}% confidence**.")
    answer_parts.append(f"> **Adaptive Retrieval Route:** `{routing_decision['route']}` ({routing_decision['explanation']}).")

    if temporal_info["has_temporal_alerts"]:
        for alert in temporal_info["alerts"]:
            answer_parts.append(f"> {alert['message']}")

    if temporal_info.get("applicable_transitions"):
        trans = temporal_info["applicable_transitions"][0]
        answer_parts.append(
            f"> 🔄 **Statute Transition:** `{trans['old_act']} {trans['old_section']}` ➔ "
            f"**`{trans['new_act']} {trans['new_section']}`** (Effective: {trans['effective_date']})."
        )

    primary_source = retrieved_sources[0] if retrieved_sources else None

    if routing_decision["route"] == "DIRECT":
        answer_parts.extend([
            "",
            "#### 1. Core Legal Principles & Fundamental Rights",
            f"This matter falls under foundational doctrines of **{category}** ({jur_profile['primary_jurisdiction']}).",
            "* Procedural rights require adequate formal written notice before adverse action.",
            "* Claims and statutory remedies are strictly governed by jurisdictional statutes of limitation."
        ])
    else:
        answer_parts.extend([
            "",
            f"#### 1. Statutory Context & Legal Principles [{primary_source['citation'] if primary_source else 'Statute'}]",
            primary_source["text"] if primary_source else "Governed by applicable state and federal statutes."
        ])

        # Preconditions section (Idea 4)
        answer_parts.extend(["", "#### 2. Mandatory Statutory Preconditions ('Only If' Tests)"])
        preconds = primary_source.get("preconditions", []) if primary_source else []
        if preconds:
            for p in preconds:
                answer_parts.append(f"* **Precondition:** {p}")
        else:
            answer_parts.append("* **Condition:** Factual causation and timely assertion required.")

        # Attached Exceptions (Idea 2)
        exceptions = primary_source.get("exceptions", []) if primary_source else []
        if exceptions:
            answer_parts.extend(["", "#### 3. Statutory Exceptions & Provisos (Attached Authority)"])
            for exc in exceptions:
                answer_parts.append(f"* ⚠️ **Exception:** {exc}")

        # Action checklist
        checklist = primary_source.get("action_checklist", []) if primary_source else []
        if checklist:
            answer_parts.extend(["", "#### 4. Critical Immediate Action Steps"])
            for act in checklist:
                answer_parts.append(f"* [ ] **Action:** {act}")

    # Court & Attorney Guidance
    answer_parts.extend([
        "",
        "#### 5. Procedural & Venue Recommendation",
        f"* **Recommended Attorney Specialty:** {mapping['role']} ({mapping['specialty']}).",
        f"* **Target Court Jurisdiction:** {mapping['courtName']} (Code: `{mapping['courtCode']}`).",
        "",
        "*(Note: Powered by LegalAI's Version-Aware Adaptive RAG Engine for educational purposes. Consult a licensed attorney for formal representation.)*"
    ])

    grounded_answer = "\n".join(answer_parts)

    # 8. Claim-Level Attribution & ALCE Error Taxonomy Verification (Idea 5)
    extracted_claims = attribution_engine.extract_claims(grounded_answer)
    claim_attributions = attribution_engine.verify_claims_against_sources(extracted_claims, retrieved_sources)

    # 9. Calibrated LLM Judge Evaluation (Idea 6)
    judge_eval = calibrated_judge.evaluate_response(
        query=query,
        answer=grounded_answer,
        retrieved_sources=retrieved_sources,
        attribution_result=claim_attributions,
        has_temporal_alert=temporal_info["has_temporal_alerts"]
    )

    # 10. Layperson-Facing Adapter (Idea 10)
    layperson_view = layperson_adapter.adapt_response(
        category=category,
        expert_answer=grounded_answer,
        retrieved_sources=retrieved_sources,
        confidence_percent=f"{round(confidence * 100, 1)}%",
        temporal_alert=temporal_info
    )

    return AdaptiveRAGResponse(
        success=True,
        query=query,
        category=category,
        confidence=round(confidence, 4),
        confidence_percent=f"{round(confidence * 100, 1)}%",
        routing=routing_decision,
        temporal_validity=temporal_info,
        jurisdiction_profile=jur_profile,
        knowledge_graph_checklists=kg_checklists,
        retrieved_sources=retrieved_sources,
        grounded_answer=grounded_answer,
        claim_attributions=claim_attributions,
        calibrated_judge_evaluation=judge_eval,
        layperson_view=layperson_view,
        suggested_specialty=mapping["specialty"],
        suggested_court={
            "code": mapping["courtCode"],
            "name": mapping["courtName"]
        },
        model_info={
            "engine": "Version-Aware Adaptive Hybrid RAG",
            "version": "3.0.0",
            "retriever": "Hybrid BM25 + FAISS Cosine + Cross-Encoder Reranker",
            "attribution_framework": "ALCE Claim-Level NLI Verification",
            "indexed_statutes": faiss_index.ntotal if faiss_index else 0
        }
    )


# -------------------------------------------------------------
# Backwards Compatible Legacy Endpoint
# -------------------------------------------------------------
@app.post("/api/rag/query")
def legacy_rag_query(req: QueryRequest):
    """Backwards-compatible endpoint mapping to the adaptive engine."""
    res = adaptive_rag_query(req)
    return {
        "success": True,
        "category": res.category,
        "confidence": res.confidence,
        "confidence_percent": res.confidence_percent,
        "retrieved_sources": res.retrieved_sources,
        "grounded_answer": res.grounded_answer,
        "suggested_specialty": res.suggested_specialty,
        "suggested_court": res.suggested_court,
        "model_info": res.model_info,
        "temporal_validity": res.temporal_validity,
        "routing": res.routing,
        "claim_attributions": res.claim_attributions,
        "layperson_view": res.layperson_view
    }


# -------------------------------------------------------------
# Research & Evaluation Lab Endpoints
# -------------------------------------------------------------
@app.get("/api/rag/versions")
def get_version_catalog():
    """Returns statutory version transition maps (IPC->BNS, CrPC->BNSS, NY LL144, Dutch BW)."""
    return {
        "success": True,
        "catalog": version_manager.get_all_transitions()
    }


@app.get("/api/rag/knowledge-graph")
def get_knowledge_graph(query: Optional[str] = None):
    """Returns the full statutory knowledge graph topology and precondition checklists."""
    if query:
        return legal_kg.query_preconditions(query)
    return legal_kg.export_graph_summary()


@app.post("/api/rag/evaluate")
def run_evaluation_benchmark():
    """Runs the rigorous blinded expert review and calibrated LLM judge benchmark."""
    results = benchmark_suite.run_benchmark()
    return {
        "success": True,
        "results": results
    }


@app.get("/api/rag/bias-audit")
def run_bias_audit():
    """Audits the statutory knowledge corpus for party balance and legal monoculture."""
    corpus = rag_metadata.get("raw_corpus", []) if rag_metadata else load_corpus()
    report = bias_auditor.audit_corpus(corpus)
    return {
        "success": True,
        "report": report
    }


@app.post("/api/rag/chunk-comparison")
def compare_chunking():
    """Compares Structure-Aware chunking against fixed 150-word cut chunking."""
    corpus = rag_metadata.get("raw_corpus", []) if rag_metadata else load_corpus()
    comparison = structure_chunker.compare_chunking_methods(corpus)
    return {
        "success": True,
        "comparison": comparison
    }


if __name__ == "__main__":
    import uvicorn
    print("Starting LegalAI Advanced Adaptive RAG & Intelligence Engine on http://127.0.0.1:8000 ...")
    uvicorn.run(app, host="127.0.0.1", port=8000)
