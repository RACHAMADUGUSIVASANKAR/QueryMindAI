import re
from typing import Tuple

INTENT_PATTERNS = {
    "FIND": [
        r"\b(find|show|get|list|display|fetch|retrieve|search|look\s+for|select)\b",
    ],
    "COUNT": [
        r"\b(count|how\s+many|number\s+of|total\s+number|tally)\b",
    ],
    "AGGREGATE": [
        r"\b(average|avg|sum|group|aggregate|total\s+.*by|mean|median)\b",
        r"\b(group\s+by|per|breakdown|distribution)\b",
    ],
    "UPDATE": [
        r"\b(update|set|change|modify|alter|edit)\b",
    ],
    "INSERT": [
        r"\b(insert|add|create|new|register)\b",
    ],
    "DELETE": [
        r"\b(delete|remove|drop|destroy|erase)\b",
    ],
    "SEARCH": [
        r"\b(semantic\s+search|similar\s+to|related\s+to|like|vector\s+search)\b",
    ],
}

# Priority order for intent resolution
INTENT_PRIORITY = ["DELETE", "UPDATE", "INSERT", "AGGREGATE", "COUNT", "SEARCH", "FIND"]


class IntentDetector:
    def __init__(self):
        self.patterns = {}
        for intent, patterns in INTENT_PATTERNS.items():
            self.patterns[intent] = [re.compile(p, re.IGNORECASE) for p in patterns]

    def detect(self, query: str) -> Tuple[str, float]:
        """Detect the intent of a natural language query.
        Returns (intent, confidence)."""
        query_lower = query.lower().strip()
        scores = {}

        for intent in INTENT_PRIORITY:
            score = 0
            for pattern in self.patterns[intent]:
                matches = pattern.findall(query_lower)
                score += len(matches)
            if score > 0:
                scores[intent] = score

        if not scores:
            return ("FIND", 0.5)

        # Pick highest priority intent among those with matches
        best_intent = None
        best_score = 0
        for intent in INTENT_PRIORITY:
            if intent in scores and scores[intent] > best_score:
                best_intent = intent
                best_score = scores[intent]

        # Calculate confidence based on match strength
        total_scores = sum(scores.values())
        confidence = min(0.95, 0.6 + (best_score / max(total_scores, 1)) * 0.35)

        # Block destructive intents
        if best_intent == "DELETE":
            return ("DELETE_BLOCKED", 0.99)

        return (best_intent, round(confidence, 2))
