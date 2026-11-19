import { EvaluationMetrics, HeldOutQuery, KnowledgeBaseRule, PolicyRule, QueryEvaluationResult } from '../types';

export function calculateMetrics(
  testCases: HeldOutQuery[],
  evaluationResults: QueryEvaluationResult[],
  knowledgeBase: KnowledgeBaseRule[],
  fullPolicyRules: PolicyRule[]
): EvaluationMetrics {
  const totalQueries = testCases.length;
  let correctAnswers = 0;
  let partiallyCorrectAnswers = 0;
  let incorrectAnswers = 0;
  let unansweredQueries = 0;

  for (const res of evaluationResults) {
    if (res.status === 'CORRECT') correctAnswers++;
    else if (res.status === 'PARTIALLY_CORRECT') partiallyCorrectAnswers++;
    else if (res.status === 'INCORRECT') incorrectAnswers++;
    else if (res.status === 'UNANSWERED') unansweredQueries++;
  }

  // Under academic strict evaluation, partially correct answers are NOT counted as fully correct.
  // Standard accuracy: (Correct / Total) * 100
  const queryAccuracyPct = totalQueries > 0 ? (correctAnswers / totalQueries) * 100 : 0;
  // Strict weighted score: (Correct + 0.5 * Partial) / Total
  const strictAccuracyPct = totalQueries > 0 ? ((correctAnswers + 0.5 * partiallyCorrectAnswers) / totalQueries) * 100 : 0;

  // Rule Coverage Calculations
  const totalPolicyRules = fullPolicyRules.length;
  const kbRuleMap = new Map<string, KnowledgeBaseRule>();
  for (const r of knowledgeBase) {
    kbRuleMap.set(r.ruleId, r);
  }

  let fullyRepresentedRules = 0;
  let partiallyRepresentedRules = 0;
  let missingRules = 0;

  for (const polRule of fullPolicyRules) {
    const kbRule = kbRuleMap.get(polRule.id);
    if (!kbRule) {
      missingRules++;
    } else if (kbRule.status === 'verified' && (!kbRule.omittedConditions || kbRule.omittedConditions.length === 0)) {
      fullyRepresentedRules++;
    } else {
      partiallyRepresentedRules++;
    }
  }

  // Rule coverage defined strictly as policy rules correctly represented
  const ruleCoveragePct = totalPolicyRules > 0 ? (fullyRepresentedRules / totalPolicyRules) * 100 : 0;

  // Breakdown by policy category
  const categories = Array.from(new Set(fullPolicyRules.map(r => r.category)));
  const categoryCoverage: Record<string, { total: number; represented: number; coveragePct: number }> = {};

  for (const cat of categories) {
    const catRules = fullPolicyRules.filter(r => r.category === cat);
    const catRepresented = catRules.filter(r => {
      const kbR = kbRuleMap.get(r.id);
      return kbR && kbR.status === 'verified' && (!kbR.omittedConditions || kbR.omittedConditions.length === 0);
    }).length;
    categoryCoverage[cat] = {
      total: catRules.length,
      represented: catRepresented,
      coveragePct: (catRepresented / catRules.length) * 100
    };
  }

  return {
    totalQueries,
    correctAnswers,
    partiallyCorrectAnswers,
    incorrectAnswers,
    unansweredQueries,
    queryAccuracyPct: Math.round(queryAccuracyPct * 10) / 10,
    strictAccuracyPct: Math.round(strictAccuracyPct * 10) / 10,
    totalPolicyRules,
    representedRules: fullyRepresentedRules,
    partiallyRepresentedRules,
    missingRules,
    ruleCoveragePct: Math.round(ruleCoveragePct * 10) / 10,
    categoryCoverage
  };
}
