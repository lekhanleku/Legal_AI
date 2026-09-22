"""
LegalAI ML & RAG Inference Microservice
FastAPI server serving the Supervised Classifier and FAISS Vector Search.
"""

import os
import sys
import json
import joblib
import numpy as np
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
DATASET_PATH = os.path.join(BASE_DIR, "dataset", "legal_queries.csv")
CORPUS_PATH = os.path.join(BASE_DIR, "data", "legal_corpus.json")

app = FastAPI(
    title="LegalAI ML & RAG Intelligence Engine",
    description="Machine Learning Domain Classifier & Dense Vector RAG System",
    version="2.0.0"
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


def train_if_needed():
    """Auto-trains the model and builds vector index if model files are missing."""
    global classifier, faiss_index, rag_metadata, rag_embedder, metrics_data

    model_path = os.path.join(MODELS_DIR, "legal_classifier.pkl")
    faiss_path = os.path.join(MODELS_DIR, "faiss_index.bin")

    if not os.path.exists(model_path) or not os.path.exists(faiss_path):
        print("Model files not found. Auto-training ML pipeline and building FAISS vector index...")
        import pandas as pd
        from sklearn.model_selection import train_test_split
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.svm import LinearSVC
        from sklearn.calibration import CalibratedClassifierCV
        from sklearn.pipeline import Pipeline
        from sklearn.metrics import accuracy_score
        import faiss

        os.makedirs(MODELS_DIR, exist_ok=True)

        # 1. Train Classifier
        df = pd.read_csv(DATASET_PATH)
        pipe = Pipeline([
            ('tfidf', TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True, stop_words='english')),
            ('clf', CalibratedClassifierCV(estimator=LinearSVC(C=1.0, random_state=42)))
        ])
        pipe.fit(df['query'], df['category'])
        joblib.dump(pipe, model_path)
        print("Trained and saved classifier.")

        # 2. Build Vector Index
        with open(CORPUS_PATH, "r", encoding="utf-8") as f:
            corpus = json.load(f)

        corpus_texts = [
            f"{c['title']} ({c['domain']}) - {c['citation']}: {c['text']} Key elements: {' '.join(c.get('key_elements', []))}"
            for c in corpus
        ]

        embedder = TfidfVectorizer(ngram_range=(1, 2), stop_words='english')
        emb_matrix = embedder.fit_transform(corpus_texts).toarray().astype('float32')
        norms = np.linalg.norm(emb_matrix, axis=1, keepdims=True)
        emb_matrix = emb_matrix / np.maximum(norms, 1e-12)

        dim = emb_matrix.shape[1]
        idx = faiss.IndexFlatIP(dim)
        idx.add(emb_matrix)
        faiss.write_index(idx, faiss_path)

        meta = {
            "embedding_type": "tfidf-dense-normalized",
            "dimension": dim,
            "num_documents": len(corpus),
            "corpus": corpus
        }
        joblib.dump(meta, os.path.join(MODELS_DIR, "rag_metadata.pkl"))
        joblib.dump(embedder, os.path.join(MODELS_DIR, "rag_embedder.pkl"))
        print("Created and saved FAISS index.")


@app.on_event("startup")
def load_models():
    global classifier, faiss_index, rag_metadata, rag_embedder, metrics_data
    try:
        train_if_needed()

        import faiss
        model_path = os.path.join(MODELS_DIR, "legal_classifier.pkl")
        faiss_path = os.path.join(MODELS_DIR, "faiss_index.bin")
        meta_path = os.path.join(MODELS_DIR, "rag_metadata.pkl")
        metrics_path = os.path.join(MODELS_DIR, "metrics.json")

        classifier = joblib.load(model_path)
        faiss_index = faiss.read_index(faiss_path)
        rag_metadata = joblib.load(meta_path)

        embedder_path = os.path.join(MODELS_DIR, "rag_embedder.pkl")
        if os.path.exists(embedder_path):
            rag_embedder = joblib.load(embedder_path)

        if os.path.exists(metrics_path):
            with open(metrics_path, "r", encoding="utf-8") as f:
                metrics_data = json.load(f)

        print(f"✅ LegalAI ML Models & FAISS Index successfully loaded into memory!")
        print(f"✅ Vector index size: {faiss_index.ntotal} legal statutes.")
    except Exception as e:
        print(f"❌ Error loading ML models: {e}")


class QueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 3


class PredictResponse(BaseModel):
    success: bool
    category: str
    confidence: float
    confidence_percent: str
    probabilities: dict
    model_type: str


class RAGResponse(BaseModel):
    success: bool
    category: str
    confidence: float
    confidence_percent: str
    retrieved_sources: List[dict]
    grounded_answer: str
    suggested_specialty: str
    suggested_court: dict
    model_info: dict


@app.get("/api/ml/health")
def health():
    return {
        "status": "online",
        "service": "LegalAI ML & RAG Engine",
        "classifier_loaded": classifier is not None,
        "faiss_index_loaded": faiss_index is not None,
        "indexed_documents": faiss_index.ntotal if faiss_index else 0,
        "metrics": metrics_data
    }


@app.post("/api/ml/predict", response_model=PredictResponse)
def predict_category(req: QueryRequest):
    if not req.query or not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    if not classifier:
        raise HTTPException(status_code=503, detail="ML Classifier is not loaded")

    # Predict with probabilities
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
        model_type="Calibrated LinearSVC (TF-IDF N-Gram Pipeline)"
    )


@app.post("/api/rag/query", response_model=RAGResponse)
def rag_query(req: QueryRequest):
    if not req.query or not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    if not classifier or not faiss_index or not rag_metadata:
        raise HTTPException(status_code=503, detail="ML / RAG service not ready")

    # 1. Run ML Classifier for category & confidence
    probs = classifier.predict_proba([req.query])[0]
    classes = classifier.classes_
    top_idx = int(np.argmax(probs))
    category = classes[top_idx]
    confidence = float(probs[top_idx])

    # 2. Vector Retrieval via FAISS
    top_k = min(req.top_k, faiss_index.ntotal)
    if rag_embedder:
        query_vec = rag_embedder.transform([req.query]).toarray().astype('float32')
        norm = np.linalg.norm(query_vec)
        if norm > 0:
            query_vec = query_vec / norm
    else:
        # Fallback if sentence-transformers was used
        from sentence_transformers import SentenceTransformer
        model = SentenceTransformer('all-MiniLM-L6-v2')
        query_vec = model.encode([req.query], convert_to_numpy=True, normalize_embeddings=True)

    distances, indices = faiss_index.search(query_vec, top_k)

    corpus = rag_metadata["corpus"]
    retrieved_sources = []

    for rank, (dist, idx) in enumerate(zip(distances[0], indices[0]), start=1):
        if idx < len(corpus):
            doc = corpus[idx]
            retrieved_sources.append({
                "rank": rank,
                "similarity_score": round(float(dist), 4),
                "similarity_percent": f"{round(float(dist) * 100, 1)}%",
                "id": doc.get("id"),
                "domain": doc.get("domain"),
                "title": doc.get("title"),
                "citation": doc.get("citation"),
                "text": doc.get("text"),
                "key_elements": doc.get("key_elements", []),
                "action_checklist": doc.get("action_checklist", [])
            })

    # 3. Grounded Generative Legal Advisory Synthesis
    primary_source = retrieved_sources[0] if retrieved_sources else None
    mapping = DOMAIN_MAPPINGS.get(category, {
        "specialty": "General Practice",
        "courtCode": "US-GEN",
        "courtName": "District Civil Court",
        "role": "General Counsel"
    })

    # Synthesize grounded answer incorporating retrieved statutory elements
    answer_parts = [
        f"### ⚖️ Legal Analysis: **{category}**",
        f"> **ML Diagnostic:** Classified with **{round(confidence * 100, 1)}% confidence** via Supervised NLP Model.",
        f"> **Primary Authority (RAG Vector Match):** *{primary_source['title']}* [{primary_source['citation']}].",
        "",
        "#### 1. Statutory Context & Legal Principles",
        primary_source['text'] if primary_source else "Governed by applicable state and federal statutes.",
        "",
        "#### 2. Key Legal Elements & Tests"
    ]

    if primary_source and primary_source.get("key_elements"):
        for elem in primary_source["key_elements"]:
            answer_parts.append(f"* **Statutory Rule:** {elem}")

    answer_parts.extend([
        "",
        "#### 3. Critical Immediate Action Steps"
    ])

    if primary_source and primary_source.get("action_checklist"):
        for act in primary_source["action_checklist"]:
            answer_parts.append(f"* [ ] **Action:** {act}")

    answer_parts.extend([
        "",
        "#### 4. Procedural & Venue Recommendation",
        f"* **Recommended Attorney Specialty:** {mapping['role']} ({mapping['specialty']}).",
        f"* **Target Court Jurisdiction:** {mapping['courtName']} (Code: `{mapping['courtCode']}`).",
        "",
        "*(Note: This assessment is powered by LegalAI's ML & RAG Engine for educational purposes. For formal representation, consult a licensed attorney.)*"
    ])

    grounded_answer = "\n".join(answer_parts)

    return RAGResponse(
        success=True,
        category=category,
        confidence=round(confidence, 4),
        confidence_percent=f"{round(confidence * 100, 1)}%",
        retrieved_sources=retrieved_sources,
        grounded_answer=grounded_answer,
        suggested_specialty=mapping["specialty"],
        suggested_court={
            "code": mapping["courtCode"],
            "name": mapping["courtName"]
        },
        model_info={
            "classifier": "Calibrated LinearSVC (TF-IDF)",
            "vector_store": "FAISS (IndexFlatIP)",
            "retrieval_method": "Dense Vector Cosine Similarity",
            "indexed_documents": faiss_index.ntotal
        }
    )


if __name__ == "__main__":
    import uvicorn
    print("Starting LegalAI ML & RAG FastAPI service on http://127.0.0.1:8000 ...")
    uvicorn.run(app, host="127.0.0.1", port=8000)
