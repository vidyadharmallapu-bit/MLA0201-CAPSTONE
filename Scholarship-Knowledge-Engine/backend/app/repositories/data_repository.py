"""Data repository — loads JSON data files. Replace with DB later."""
import json
import os
from typing import List, Optional
from app.models.schemas import PolicyRule, CompetencyQuestion, TestQuery

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "data")


def _load_json(filename: str) -> list:
    path = os.path.join(DATA_DIR, filename)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


class PolicyRuleRepository:
    def __init__(self):
        self._rules: List[PolicyRule] = [
            PolicyRule(**r) for r in _load_json("policy_rules.json")
        ]

    def get_all(self) -> List[PolicyRule]:
        return self._rules

    def get_by_id(self, rule_id: str) -> Optional[PolicyRule]:
        return next((r for r in self._rules if r.id == rule_id), None)

    def get_by_category(self, category: str) -> List[PolicyRule]:
        return [r for r in self._rules if r.category.lower() == category.lower()]

    def get_categories(self) -> List[str]:
        return sorted(set(r.category for r in self._rules))

    def count(self) -> int:
        return len(self._rules)


class CompetencyQuestionRepository:
    def __init__(self):
        self._cqs: List[CompetencyQuestion] = [
            CompetencyQuestion(**c) for c in _load_json("competency_questions.json")
        ]

    def get_all(self) -> List[CompetencyQuestion]:
        return self._cqs

    def get_by_id(self, cq_id: str) -> Optional[CompetencyQuestion]:
        return next((c for c in self._cqs if c.id == cq_id), None)

    def get_by_category(self, category: str) -> List[CompetencyQuestion]:
        return [c for c in self._cqs if c.category.lower() == category.lower()]

    def count(self) -> int:
        return len(self._cqs)


class TestQueryRepository:
    def __init__(self):
        self._queries: List[TestQuery] = [
            TestQuery(**q) for q in _load_json("heldout_test_queries.json")
        ]

    def get_all(self) -> List[TestQuery]:
        return self._queries

    def count(self) -> int:
        return len(self._queries)
