import re
from typing import List, Dict


COMMON_FIELDS = {
    "users": ["name", "email", "age", "city", "status", "role", "salary", "department", "created_at"],
    "products": ["name", "price", "category", "stock", "rating", "brand", "description"],
    "orders": ["user", "total", "items", "date", "status", "shipping", "payment_method"],
    "reviews": ["user", "product", "rating", "comment", "date"],
    "analytics": ["event", "user", "timestamp", "page", "duration"],
}

COMPARISON_PATTERNS = [
    (r"(greater|more|older|over|above|exceeds?|>)\s*(?:than\s*)?(\d+\.?\d*)", "$gt"),
    (r"(less|fewer|younger|under|below|<)\s*(?:than\s*)?(\d+\.?\d*)", "$lt"),
    (r"(at\s+least|>=|minimum)\s*(\d+\.?\d*)", "$gte"),
    (r"(at\s+most|<=|maximum)\s*(\d+\.?\d*)", "$lte"),
    (r"(equals?|is|=|==)\s+(\d+\.?\d*)", "$eq"),
    (r"(not|isn't|!=|<>)\s+(\w+)", "$ne"),
    (r"(between)\s+(\d+\.?\d*)\s+(?:and|to)\s+(\d+\.?\d*)", "$between"),
]

STATUS_VALUES = ["active", "inactive", "pending", "delivered", "shipped", "cancelled", "completed", "processing"]


class EntityExtractor:
    def __init__(self):
        pass

    def extract(self, query: str, collection: str = "users") -> List[Dict]:
        """Extract entities from a natural language query."""
        entities = []
        query_lower = query.lower()
        fields = COMMON_FIELDS.get(collection, COMMON_FIELDS["users"])

        # Extract field references
        for field in fields:
            if field in query_lower:
                entities.append({"type": "FIELD", "value": field, "label": "Field"})

        # Extract comparison operators and values
        for pattern_str, operator in COMPARISON_PATTERNS:
            pattern = re.compile(pattern_str, re.IGNORECASE)
            matches = pattern.finditer(query_lower)
            for match in matches:
                if operator == "$between":
                    entities.append({"type": "OPERATOR", "value": "$gte", "label": "Operator"})
                    entities.append({"type": "VALUE", "value": match.group(2), "label": "Value"})
                    entities.append({"type": "OPERATOR", "value": "$lte", "label": "Operator"})
                    entities.append({"type": "VALUE", "value": match.group(3), "label": "Value"})
                else:
                    entities.append({"type": "OPERATOR", "value": operator, "label": "Operator"})
                    entities.append({"type": "VALUE", "value": match.group(2), "label": "Value"})

        # Extract status values
        for status in STATUS_VALUES:
            if status in query_lower:
                if not any(e["value"] == "status" for e in entities):
                    entities.append({"type": "FIELD", "value": "status", "label": "Field"})
                entities.append({"type": "VALUE", "value": status, "label": "Status"})

        # Extract city names (capitalized words after "in" or "from")
        city_match = re.search(r"\b(?:in|from)\s+([A-Z][a-zA-Z\s]+?)(?:\s+with|\s+and|\s+where|\s*$)", query)
        if city_match:
            city = city_match.group(1).strip()
            if not any(e["value"] == "city" for e in entities):
                entities.append({"type": "FIELD", "value": "city", "label": "Field"})
            entities.append({"type": "VALUE", "value": city, "label": "City"})

        # Extract group-by fields
        group_match = re.search(r"\b(?:by|per|group\s+by)\s+(\w+)", query_lower)
        if group_match:
            group_field = group_match.group(1)
            if group_field in fields:
                entities.append({"type": "GROUP_BY", "value": group_field, "label": "Group By"})

        # Extract sort direction
        if re.search(r"\b(descending|desc|highest|most|top)\b", query_lower):
            entities.append({"type": "SORT", "value": -1, "label": "Sort Descending"})
        elif re.search(r"\b(ascending|asc|lowest|least|bottom)\b", query_lower):
            entities.append({"type": "SORT", "value": 1, "label": "Sort Ascending"})

        # Extract limit
        limit_match = re.search(r"\b(?:top|first|limit)\s+(\d+)\b", query_lower)
        if limit_match:
            entities.append({"type": "LIMIT", "value": int(limit_match.group(1)), "label": "Limit"})

        return entities
