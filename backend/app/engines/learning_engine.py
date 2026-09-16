from typing import List, Dict, Set
from collections import defaultdict, deque


class LearningEngine:
    """Resolves curriculum Directed Acyclic Graph (DAG) dependencies and generates personalized lesson sequences."""

    @staticmethod
    def topological_sort_concepts(
        concept_ids: List[str],
        prerequisites: List[Dict[str, str]]  # list of {"concept_id": str, "prerequisite_id": str}
    ) -> List[str]:
        """
        Sorts concepts in valid DAG topological dependency order.
        prerequisite_id MUST be learned before concept_id.
        """
        in_degree = {cid: 0 for cid in concept_ids}
        adj_list = defaultdict(list)

        for edge in prerequisites:
            c_id = edge["concept_id"]
            p_id = edge["prerequisite_id"]
            if p_id in in_degree and c_id in in_degree:
                adj_list[p_id].append(c_id)
                in_degree[c_id] += 1

        queue = deque([cid for cid in concept_ids if in_degree[cid] == 0])
        sorted_order = []

        while queue:
            curr = queue.popleft()
            sorted_order.append(curr)
            for neighbor in adj_list[curr]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)

        # In case of disconnected or cyclic components, append any remaining
        for cid in concept_ids:
            if cid not in sorted_order:
                sorted_order.append(cid)

        return sorted_order

    @staticmethod
    def get_unlocked_concepts(
        all_concepts: List[str],
        prerequisites: List[Dict[str, str]],
        mastered_concepts: Set[str]
    ) -> List[str]:
        """Returns list of concept IDs whose prerequisites are fully satisfied."""
        prereq_map = defaultdict(set)
        for edge in prerequisites:
            prereq_map[edge["concept_id"]].add(edge["prerequisite_id"])

        unlocked = []
        for cid in all_concepts:
            if cid in mastered_concepts:
                continue
            required = prereq_map.get(cid, set())
            if required.issubset(mastered_concepts):
                unlocked.append(cid)

        return unlocked
