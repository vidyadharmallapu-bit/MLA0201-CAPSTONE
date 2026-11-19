import { HeldOutQuery, KnowledgeBaseRule, MissingRuleReportItem, PolicyRule } from '../types';

export function detectMissingRules(
  fullPolicyRules: PolicyRule[],
  cqKB: KnowledgeBaseRule[],
  adHocKB: KnowledgeBaseRule[],
  heldOutQueries: HeldOutQuery[]
): MissingRuleReportItem[] {
  const cqMap = new Map(cqKB.map(r => [r.ruleId, r]));
  const adHocMap = new Map(adHocKB.map(r => [r.ruleId, r]));

  const report: MissingRuleReportItem[] = [];

  for (const polRule of fullPolicyRules) {
    const cqRule = cqMap.get(polRule.id);
    const adHocRule = adHocMap.get(polRule.id);

    const cqStatus = !cqRule ? 'MISSING' : (cqRule.omittedConditions && cqRule.omittedConditions.length > 0 ? 'PARTIAL' : 'VERIFIED');
    const adHocStatus = !adHocRule ? 'MISSING' : (adHocRule.omittedConditions && adHocRule.omittedConditions.length > 0 ? 'PARTIAL' : 'VERIFIED');

    // Identify affected queries from held-out set
    const affectedQueries = heldOutQueries.filter(q => q.relevantRuleIds.includes(polRule.id)).map(q => q.id);

    // If ad-hoc has defect or is missing, compute impact
    const omittedConditions = adHocRule?.omittedConditions || polRule.conditions;

    let severity: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    if (adHocStatus === 'MISSING') {
      severity = polRule.isMandatory ? 'HIGH' : 'MEDIUM';
    } else if (adHocStatus === 'PARTIAL') {
      severity = 'MEDIUM';
    }

    let impactExplanation = "Policy condition correctly captured in both knowledge bases.";
    let suggestedCorrection = "No amendment necessary.";

    if (adHocStatus === 'MISSING') {
      impactExplanation = `Rule ${polRule.id} was completely omitted in ad hoc development. Any queries interrogating ${polRule.title.toLowerCase()} fail or generate false positive answers.`;
      suggestedCorrection = `Introduce competency question: "What are the rules regarding ${polRule.title}?" and extract the complete condition clause.`;
    } else if (adHocStatus === 'PARTIAL') {
      impactExplanation = `Ad hoc engineer abstracted the rule but dropped sub-clauses: [${omittedConditions.join('; ')}]. Causes partially correct or inaccurate answers on edge-case queries.`;
      suggestedCorrection = `Refine KB rule with full multi-condition logic: incorporate ${omittedConditions[0] || 'all sub-clauses'}.`;
    }

    report.push({
      ruleId: polRule.id,
      category: polRule.category,
      policyRequirement: polRule.title + ": " + polRule.description,
      cqGuidedStatus: cqStatus,
      adHocStatus: adHocStatus,
      omittedConditionsInAdHoc: adHocStatus === 'VERIFIED' ? [] : omittedConditions,
      affectedQueryIds: affectedQueries,
      severity,
      impactExplanation,
      suggestedCorrection
    });
  }

  return report;
}
