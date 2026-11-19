export interface PolicyRule {
  id: string; // e.g., "POL-R01"
  category: 'Eligibility' | 'Income' | 'Academic' | 'Attendance' | 'Documents' | 'Renewal' | 'Deadline' | 'Exclusions' | 'Special';
  title: string;
  description: string;
  conditions: string[];
  expectedOutcome: string;
  sourceSection: string;
  isMandatory: boolean;
  notes?: string;
}

export interface CompetencyQuestion {
  id: string; // e.g., "CQ-01"
  question: string;
  category: 'Eligibility' | 'Income' | 'Academic' | 'Attendance' | 'Documents' | 'Renewal' | 'Deadline' | 'Exclusions' | 'Special';
  rationale: string;
  associatedRuleIds: string[];
  status: 'validated' | 'partially_covered' | 'unaddressed';
  isCustom?: boolean;
}

export interface KnowledgeBaseRule {
  id: string; // e.g., "KB-A-01"
  ruleId: string; // references POL-Rxx
  category: string;
  title: string;
  extractedConditions: string[];
  omittedConditions?: string[];
  outcome: string;
  status: 'verified' | 'partially_represented' | 'omitted';
  developmentNotes: string;
  verified: boolean;
}

export interface HeldOutQuery {
  id: string; // e.g., "TC-01"
  query: string;
  category: 'Eligibility' | 'Income' | 'Academic' | 'Attendance' | 'Documents' | 'Renewal' | 'Deadline' | 'Exclusions' | 'Special' | 'Complex' | 'Missing-Rule Detection';
  relevantRuleIds: string[];
  expectedClassification: 'ELIGIBLE' | 'INELIGIBLE' | 'CONDITIONAL' | 'REQUIRED_DOCUMENTS' | 'DEADLINE_PASSED' | 'POLICY_EXCLUSION' | 'INSUFFICIENT_INFORMATION';
  expectedAnswer: string;
  evaluationRationale: string;
}

export interface QueryEvaluationResult {
  queryId: string;
  approach: 'CQ_GUIDED' | 'AD_HOC';
  matchedRuleIds: string[];
  missingConditionDetected: boolean;
  omittedRuleIds: string[];
  status: 'CORRECT' | 'PARTIALLY_CORRECT' | 'INCORRECT' | 'UNANSWERED';
  generatedAnswer: string;
  confidenceScore: number;
  reasoning: string;
}

export interface MissingRuleReportItem {
  ruleId: string;
  category: string;
  policyRequirement: string;
  cqGuidedStatus: 'VERIFIED' | 'PARTIAL' | 'MISSING';
  adHocStatus: 'VERIFIED' | 'PARTIAL' | 'MISSING';
  omittedConditionsInAdHoc: string[];
  affectedQueryIds: string[];
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  impactExplanation: string;
  suggestedCorrection: string;
}

export interface EvaluationMetrics {
  totalQueries: number;
  correctAnswers: number;
  partiallyCorrectAnswers: number;
  incorrectAnswers: number;
  unansweredQueries: number;
  queryAccuracyPct: number; // (correct / total) * 100
  strictAccuracyPct: number;
  totalPolicyRules: number;
  representedRules: number;
  partiallyRepresentedRules: number;
  missingRules: number;
  ruleCoveragePct: number; // (represented / total) * 100
  categoryCoverage: { [category: string]: { total: number; represented: number; coveragePct: number } };
}
