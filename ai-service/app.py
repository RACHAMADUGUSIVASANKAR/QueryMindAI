from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import time

app = FastAPI(title="QueryMind AI Service", version="1.0.0", description="NLP-powered MongoDB query translation engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lazy imports for NLP modules
intent_detector = None
entity_extractor = None
query_gen = None
embedding_eng = None

def get_intent_detector():
    global intent_detector
    if intent_detector is None:
        from nlp.intent_detection import IntentDetector
        intent_detector = IntentDetector()
    return intent_detector

def get_entity_extractor():
    global entity_extractor
    if entity_extractor is None:
        from nlp.entity_extraction import EntityExtractor
        entity_extractor = EntityExtractor()
    return entity_extractor

def get_query_generator():
    global query_gen
    if query_gen is None:
        from nlp.query_generator import QueryGenerator
        query_gen = QueryGenerator()
    return query_gen

def get_embedding_engine():
    global embedding_eng
    if embedding_eng is None:
        from nlp.embedding_engine import EmbeddingEngine
        embedding_eng = EmbeddingEngine()
    return embedding_eng


class TranslateRequest(BaseModel):
    query: str
    collection: str = "users"

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = []

class EmbedRequest(BaseModel):
    text: str


@app.get("/")
async def root():
    return {"service": "QueryMind AI", "status": "running", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": time.time()}


@app.post("/translate")
async def translate_query(request: TranslateRequest):
    try:
        start = time.time()

        detector = get_intent_detector()
        extractor = get_entity_extractor()
        generator = get_query_generator()

        intent, confidence = detector.detect(request.query)
        entities = extractor.extract(request.query, request.collection)
        mongo_query, pipeline = generator.generate(intent, entities, request.collection)

        elapsed = (time.time() - start) * 1000

        return {
            "intent": intent,
            "confidence": confidence,
            "entities": entities,
            "mongoQuery": mongo_query,
            "pipeline": pipeline,
            "collection": request.collection,
            "processingTime": round(elapsed, 2),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        message = request.message.lower()

        responses = {
            "help": "I can help you with MongoDB queries! Try asking: 'Find all users older than 25' or 'Count orders by status'.",
            "find": "To find documents, describe what you're looking for. Example: 'Show products with price greater than 100'.",
            "aggregate": "For aggregation, try: 'Get average age by department' or 'Sum total orders per month'.",
            "count": "To count documents, say: 'How many active users are there?' or 'Count products in electronics category'.",
            "collection": "A collection is like a table. Common collections include: users, products, orders, reviews.",
            "index": "Indexes improve query performance. MongoDB supports single field, compound, text, and vector search indexes.",
        }

        for key, response in responses.items():
            if key in message:
                return {"response": response}

        return {
            "response": f"I understand you asked about '{request.message}'. I can help with MongoDB queries, collections, aggregations, and more. Try asking a specific question!"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/embed")
async def embed_text(request: EmbedRequest):
    try:
        engine = get_embedding_engine()
        embedding = engine.encode(request.text)
        return {"embedding": embedding, "dimensions": len(embedding)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
