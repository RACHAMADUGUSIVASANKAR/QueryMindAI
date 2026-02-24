from typing import List, Dict, Tuple, Optional, Any


class QueryGenerator:
    """Generates MongoDB queries from detected intent and extracted entities."""

    def generate(self, intent: str, entities: List[Dict], collection: str) -> Tuple[Dict, Optional[List]]:
        """Generate a MongoDB query and optional aggregation pipeline.
        Returns (mongo_query, pipeline)."""

        if intent == "DELETE_BLOCKED":
            return {"_error": "Destructive operations are not allowed"}, None

        if intent == "AGGREGATE":
            pipeline = self._build_aggregation(entities)
            return {}, pipeline

        if intent == "COUNT":
            query = self._build_find_query(entities)
            return query, None

        # Default: FIND
        query = self._build_find_query(entities)
        return query, None

    def _build_find_query(self, entities: List[Dict]) -> Dict:
        """Build a MongoDB find query from entities."""
        query: Dict[str, Any] = {}
        i = 0

        while i < len(entities):
            entity = entities[i]

            if entity["type"] == "FIELD":
                field = entity["value"]
                # Look ahead for operator and value
                op = None
                val = None

                for j in range(i + 1, min(i + 4, len(entities))):
                    if entities[j]["type"] == "OPERATOR" and op is None:
                        op = entities[j]["value"]
                    elif entities[j]["type"] == "VALUE" and val is None:
                        val = entities[j]["value"]
                    elif entities[j]["type"] == "FIELD":
                        break

                if val is not None:
                    # Try to convert to number
                    try:
                        numeric_val = float(val)
                        if numeric_val == int(numeric_val):
                            numeric_val = int(numeric_val)
                        val = numeric_val
                    except (ValueError, TypeError):
                        pass

                    if op and op.startswith("$"):
                        if field in query and isinstance(query[field], dict):
                            query[field][op] = val
                        else:
                            query[field] = {op: val}
                    else:
                        query[field] = val

            i += 1

        return query

    def _build_aggregation(self, entities: List[Dict]) -> List[Dict]:
        """Build an aggregation pipeline from entities."""
        pipeline = []

        # Build match stage from field/operator/value entities
        match = self._build_find_query(
            [e for e in entities if e["type"] in ("FIELD", "OPERATOR", "VALUE")]
        )
        if match:
            pipeline.append({"$match": match})

        # Build group stage
        group_by = next((e["value"] for e in entities if e["type"] == "GROUP_BY"), None)
        if group_by:
            group_stage = {
                "$group": {
                    "_id": f"${group_by}",
                    "count": {"$sum": 1},
                }
            }

            # Add aggregation fields (avg, sum)
            numeric_fields = [e["value"] for e in entities if e["type"] == "FIELD" and e["value"] != group_by]
            for field in numeric_fields:
                group_stage["$group"][f"avg_{field}"] = {"$avg": f"${field}"}

            pipeline.append(group_stage)
        else:
            pipeline.append({
                "$group": {
                    "_id": None,
                    "count": {"$sum": 1},
                }
            })

        # Sort stage
        sort_direction = next((e["value"] for e in entities if e["type"] == "SORT"), -1)
        pipeline.append({"$sort": {"count": sort_direction}})

        # Limit stage
        limit = next((e["value"] for e in entities if e["type"] == "LIMIT"), 20)
        pipeline.append({"$limit": limit})

        return pipeline
