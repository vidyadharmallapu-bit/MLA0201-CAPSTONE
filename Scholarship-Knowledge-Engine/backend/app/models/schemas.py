"""Pydantic schemas for the Scholarship Knowledge Engine API."""
from typing import Optional, List
from pydantic import BaseModel, Field


class PolicyRule(BaseModel):
    id: str
    title: str
    category: str
    description: str
    conditions: List[str]
    answer: str
    source: str
    source_url: str
    effective_year: str
    last_verified: str
    keywords: List[str]


class CompetencyQuestion(BaseModel):
    id: str
    question: str
    related_rule_ids: List[str]
    category: str
    expected_answer_type: str
    purpose: str


class TestQuery(BaseModel):
    id: str
    question: str
    category: str
    expected_rule_id: str
    cq_guided_prediction: Optional[str] = None
    adhoc_prediction: Optional[str] = None
    cq_guided_correct: bool
    adhoc_correct: bool
    notes: str


class QueryRequest(BaseModel):
    question: str = Field(..., min_length=3, max_length=500)
    knowledge_base: str = Field(default="cq_guided", pattern="^(cq_guided|adhoc)$")


class QueryResponse(BaseModel):
    question: str
    knowledge_base: str
    answered: bool
    answer: Optional[str] = None
    matched_rule_id: Optional[str] = None
    matched_rule_title: Optional[str] = None
    category: Optional[str] = None
    source: Optional[str] = None
    source_url: Optional[str] = None
    evidence: Optional[str] = None
    answer_type: str  # "direct_rule", "inference", "unanswered"
    disclosure: str = "This response uses deterministic keyword-based rule matching, not semantic reasoning or LLM generation."


class EvaluationMetrics(BaseModel):
    knowledge_base: str
    total_test_queries: int
    correct_predictions: int
    incorrect_predictions: int
    unanswered_queries: int
    query_accuracy_percent: float
    rule_coverage_percent: float
    total_rules: int
    represented_rules: int


class ComparisonResult(BaseModel):
    cq_guided: EvaluationMetrics
    adhoc: EvaluationMetrics
    test_queries: List[TestQuery]


class DashboardSummary(BaseModel):
    total_policy_rules: int
    total_competency_questions: int
    total_test_queries: int
    policy_categories: List[str]
    cq_guided_metrics: EvaluationMetrics
    adhoc_metrics: EvaluationMetrics


class HealthResponse(BaseModel):
    status: str
    version: str


class Source(BaseModel):
    name: str
    url: str
    description: str
    effective_year: str
