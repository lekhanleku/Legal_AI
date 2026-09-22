"""
LegalAI Machine Learning & RAG Indexing Pipeline
Trains the NLP Domain Classifier and builds the FAISS Vector Index.
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "dataset", "legal_queries.csv")
CORPUS_PATH = os.path.join(BASE_DIR, "data", "legal_corpus.json")
MODELS_DIR = os.path.join(BASE_DIR, "models")

os.makedirs(MODELS_DIR, exist_ok=True)

print("=" * 60)
print("     LEGALAI MACHINE LEARNING & RAG PIPELINE TRAINING     ")
print("=" * 60)

# ============================================================
# 1. TRAIN SUPERVISED ML CLASSIFIER (TF-IDF + Calibrated SVM)
# ============================================================
print("\n[1/3] Loading Legal Dataset...")
df = pd.read_csv(DATASET_PATH)
print(f"Loaded {len(df)} labeled training samples across {df['category'].nunique()} legal categories.")

X = df['query']
y = df['category']

# Train / Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

print(f"Training samples: {len(X_train)} | Testing samples: {len(X_test)}")

# Build Pipeline: TF-IDF with unigrams & bigrams + Calibrated LinearSVC (for probabilities)
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(
        ngram_range=(1, 2),
        sublinear_tf=True,
        max_df=0.95,
        min_df=1,
        stop_words='english'
    )),
    ('clf', CalibratedClassifierCV(estimator=LinearSVC(C=1.0, random_state=42)))
])

print("\n[2/3] Training Machine Learning Classifier...")
pipeline.fit(X_train, y_train)

# Evaluation
y_pred = pipeline.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred, output_dict=True)

cv_scores = cross_val_score(pipeline, X, y, cv=5)

print("\n" + "-" * 50)
print(f"✅ ML Model Test Accuracy: {accuracy * 100:.2f}%")
print(f"✅ 5-Fold Cross-Validation Accuracy: {cv_scores.mean() * 100:.2f}% (+/- {cv_scores.std() * 100:.2f}%)")
print("-" * 50)

# Save Classifier
model_path = os.path.join(MODELS_DIR, "legal_classifier.pkl")
joblib.dump(pipeline, model_path)
print(f"Saved trained ML model to: {model_path}")

metrics = {
    "model_name": "Calibrated LinearSVC with TF-IDF Vectorizer",
    "test_accuracy": float(accuracy),
    "cross_val_mean": float(cv_scores.mean()),
    "cross_val_std": float(cv_scores.std()),
    "total_samples": len(df),
    "categories": sorted(list(df['category'].unique())),
    "classification_report": report
}

metrics_path = os.path.join(MODELS_DIR, "metrics.json")
with open(metrics_path, "w", encoding="utf-8") as f:
    json.dump(metrics, f, indent=2)
print(f"Saved training metrics to: {metrics_path}")

# ============================================================
# 2. BUILD RAG SEMANTIC VECTOR INDEX
# ============================================================
print("\n[3/3] Building RAG Vector Store from Legal Knowledge Corpus...")

with open(CORPUS_PATH, "r", encoding="utf-8") as f:
    corpus = json.load(f)

print(f"Loaded {len(corpus)} statutory chunks for semantic vector indexing.")

corpus_texts = [
    f"{c['title']} ({c['domain']}) - {c['citation']}: {c['text']} Key elements: {' '.join(c.get('key_elements', []))}"
    for c in corpus
]

# Vector Embedding model for RAG
try:
    from sentence_transformers import SentenceTransformer
    print("Loading SentenceTransformer ('all-MiniLM-L6-v2')...")
    embedder = SentenceTransformer('all-MiniLM-L6-v2')
    embeddings = embedder.encode(corpus_texts, convert_to_numpy=True, normalize_embeddings=True)
    embedding_type = "sentence-transformers/all-MiniLM-L6-v2"
    print(f"Generated dense embeddings matrix with shape {embeddings.shape}.")
except Exception as e:
    print(f"SentenceTransformer notice ({e}), using TF-IDF dense normalized vector space.")
    from sklearn.feature_extraction.text import TfidfVectorizer
    embedder = TfidfVectorizer(ngram_range=(1, 2), stop_words='english')
    embeddings = embedder.fit_transform(corpus_texts).toarray().astype('float32')
    # Normalize L2
    norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
    embeddings = embeddings / np.maximum(norms, 1e-12)
    embedding_type = "tfidf-dense-normalized"

# Build FAISS Index
import faiss
dim = embeddings.shape[1]
index = faiss.IndexFlatIP(dim) # Inner Product on normalized vectors = Cosine Similarity
index.add(embeddings.astype('float32'))

print(f"✅ FAISS Vector Index created with {index.ntotal} documents (Dimension: {dim}).")

# Save Vector Index and Metadata
faiss_path = os.path.join(MODELS_DIR, "faiss_index.bin")
faiss.write_index(index, faiss_path)

rag_meta = {
    "embedding_type": embedding_type,
    "dimension": dim,
    "num_documents": len(corpus),
    "corpus": corpus
}

meta_path = os.path.join(MODELS_DIR, "rag_metadata.pkl")
joblib.dump(rag_meta, meta_path)

if embedding_type.startswith("tfidf"):
    embedder_path = os.path.join(MODELS_DIR, "rag_embedder.pkl")
    joblib.dump(embedder, embedder_path)

print(f"Saved FAISS index to: {faiss_path}")
print(f"Saved RAG metadata to: {meta_path}")

print("\n" + "=" * 60)
print("  🎉 MACHINE LEARNING & RAG PIPELINE BUILD COMPLETE! 🎉  ")
print("=" * 60)
