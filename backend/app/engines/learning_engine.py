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
        mastered_concepts: Set[str],
        allow_soft_prerequisites: bool = False
    ) -> List[str]:
        """Returns list of concept IDs whose prerequisites are satisfied or softly scaffolded.
        
        If allow_soft_prerequisites is True, learners are not hard-blocked by unmastered prerequisites,
        enabling continuous forward progression without mandatory retakes.
        """
        prereq_map = defaultdict(set)
        for edge in prerequisites:
            prereq_map[edge["concept_id"]].add(edge["prerequisite_id"])

        unlocked = []
        for cid in all_concepts:
            if cid in mastered_concepts:
                continue
            required = prereq_map.get(cid, set())
            if required.issubset(mastered_concepts) or allow_soft_prerequisites:
                unlocked.append(cid)

        return unlocked

    @classmethod
    def get_adaptive_learning_path(
        cls,
        all_concepts: List[str],
        prerequisites: List[Dict[str, str]],
        mastered_concepts: Set[str],
        in_progress_concepts: Set[str] = None
    ) -> Dict[str, Any]:
        """Generates a complete adaptive learning path showing fully unlocked, scaffolded, and next-step nodes."""
        in_progress = in_progress_concepts or set()
        topo_order = cls.topological_sort_concepts(all_concepts, prerequisites)
        strict_unlocked = set(cls.get_unlocked_concepts(all_concepts, prerequisites, mastered_concepts, allow_soft_prerequisites=False))
        all_accessible = set(cls.get_unlocked_concepts(all_concepts, prerequisites, mastered_concepts, allow_soft_prerequisites=True))

        scaffolded = [cid for cid in all_accessible if cid not in strict_unlocked]

        # Determine best immediate forward recommendation
        next_concept = None
        for cid in topo_order:
            if cid not in mastered_concepts:
                next_concept = cid
                break

        # Rigorous Gating: nodes with unmet prerequisites are strictly locked
        locked_nodes = [cid for cid in all_concepts if cid not in mastered_concepts and cid not in strict_unlocked]
        can_advance = (next_concept in strict_unlocked) if next_concept else True

        return {
            "topological_sequence": topo_order,
            "mastered_concepts": list(mastered_concepts),
            "in_progress_concepts": list(in_progress),
            "strictly_unlocked": list(strict_unlocked),
            "locked_nodes": locked_nodes,
            "recommended_next_concept": next_concept,
            "can_advance_freely": can_advance,
            "requires_prerequisite_mastery": len(locked_nodes) > 0
        }


