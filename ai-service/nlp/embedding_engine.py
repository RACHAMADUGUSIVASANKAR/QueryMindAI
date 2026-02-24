import numpy as np
from typing import List

class EmbeddingEngine:
    """Generate text embeddings for vector search.
    Uses sentence-transformers when available, falls back to simple TF-IDF-like embeddings."""

    def __init__(self):
        self.model = None
        self.dimension = 384
        self._load_model()

    def _load_model(self):
        try:
            from sentence_transformers import SentenceTransformer
            self.model = SentenceTransformer("all-MiniLM-L6-v2")
            self.dimension = 384
            print("✓ Loaded sentence-transformers model: all-MiniLM-L6-v2")
        except Exception as e:
            print(f"⚠ sentence-transformers not available ({e}), using fallback embeddings")
            self.model = None

    def encode(self, text: str) -> List[float]:
        """Encode text into a vector embedding."""
        if self.model:
            embedding = self.model.encode(text, normalize_embeddings=True)
            return embedding.tolist()
        else:
            return self._fallback_encode(text)

    def encode_batch(self, texts: List[str]) -> List[List[float]]:
        """Encode multiple texts into vector embeddings."""
        if self.model:
            embeddings = self.model.encode(texts, normalize_embeddings=True)
            return embeddings.tolist()
        else:
            return [self._fallback_encode(t) for t in texts]

    def _fallback_encode(self, text: str) -> List[float]:
        """Simple hash-based embedding fallback when sentence-transformers is unavailable."""
        np.random.seed(hash(text.lower().strip()) % (2**32))
        embedding = np.random.randn(self.dimension).astype(np.float32)
        # Normalize
        norm = np.linalg.norm(embedding)
        if norm > 0:
            embedding = embedding / norm
        return embedding.tolist()

    def similarity(self, vec_a: List[float], vec_b: List[float]) -> float:
        """Compute cosine similarity between two vectors."""
        a = np.array(vec_a)
        b = np.array(vec_b)
        return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))
