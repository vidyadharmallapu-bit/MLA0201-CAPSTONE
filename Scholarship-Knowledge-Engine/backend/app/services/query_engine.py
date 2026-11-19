"""
Scholarship Query Engine — deterministic keyword/rule matching.
Discloses its method transparently; does not claim semantic reasoning.
"""
from typing import Optional, List
from app.models.schemas import PolicyRule, QueryResponse
from app.repositories.data_repository import PolicyRuleRepository

DISCLOSURE = (
    "This response uses deterministic keyword-based rule matching, "
    "not semantic reasoning or LLM generation. The matched rule is "
    "returned only when keyword evidence supports it."
)

# CQ-guided KB explicitly captured all 20 rules via competency questions.
CQ_GUIDED_RULE_IDS = {
    "CSSS-R001", "CSSS-R002", "CSSS-R003", "CSSS-R004", "CSSS-R005",
    "CSSS-R006", "CSSS-R007", "CSSS-R008", "CSSS-R009", "CSSS-R010",
    "CSSS-R011", "CSSS-R012", "CSSS-R013", "CSSS-R014", "CSSS-R015",
    "CSSS-R016", "CSSS-R017", "CSSS-R018", "CSSS-R019", "CSSS-R020",
}

# Ad hoc KB missed these 5 rules during informal development.
ADHOC_MISSING_RULE_IDS = {"CSSS-R015", "CSSS-R017", "CSSS-R018", "CSSS-R019", "CSSS-R020"}
ADHOC_RULE_IDS = CQ_GUIDED_RULE_IDS - ADHOC_MISSING_RULE_IDS


def _normalize(text: str) -> str:
    return text.lower().strip()


def _score_rule(question: str, rule: PolicyRule) -> int:
    """Return a keyword match score for a rule given a question."""
    q = _normalize(question)
    score = 0
    for kw in rule.keywords:
        if kw.lower() in q:
            score += 2
    for word in rule.title.lower().split():
        if len(word) > 3 and word in q:
            score += 1
    return score


def match_rule(
    question: str,
    rules: List[PolicyRule],
    threshold: int = 1
) -> Optional[PolicyRule]:
    """Find the best matching rule by keyword score."""
    best_rule = None
    best_score = 0
    for rule in rules:
        score = _score_rule(question, rule)
        if score > best_score:
            best_score = score
            best_rule = rule
    return best_rule if best_score >= threshold else None


class QueryEngine:
    def __init__(self, knowledge_base: str = "cq_guided"):
        self.knowledge_base = knowledge_base
        repo = PolicyRuleRepository()
        all_rules = repo.get_all()
        rule_ids = CQ_GUIDED_RULE_IDS if knowledge_base == "cq_guided" else ADHOC_RULE_IDS
        self.rules = [r for r in all_rules if r.id in rule_ids]

    def query(self, question: str) -> QueryResponse:
        matched = match_rule(question, self.rules)
        if matched:
            return QueryResponse(
                question=question,
                knowledge_base=self.knowledge_base,
                answered=True,
                answer=matched.answer,
                matched_rule_id=matched.id,
                matched_rule_title=matched.title,
                category=matched.category,
                source=matched.source,
                source_url=matched.source_url,
                evidence=matched.description,
                answer_type="direct_rule",
                disclosure=DISCLOSURE,
            )
        return QueryResponse(
            question=question,
            knowledge_base=self.knowledge_base,
            answered=False,
            answer_type="unanswered",
            disclosure=DISCLOSURE,
        )
