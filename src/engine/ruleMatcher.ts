import { KnowledgeBaseRule, PolicyRule } from '../types';

export interface MatchingResult {
  matchedRules: KnowledgeBaseRule[];
  confidence: number;
  identifiedCategory?: string;
  missingRulesHint?: string[];
  explanation: string;
  status: 'ANSWERABLE' | 'PARTIALLY_ANSWERABLE' | 'UNANSWERED';
  generatedAnswer: string;
}

// Tokenizer & semantic keyword extraction helper
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s₹]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2);
}

// Category keyword mappings for robust local rule retrieval
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Eligibility: ['degree', 'enrolled', 'enrollment', 'regular', 'distance', 'part-time', 'domicile', 'citizen', 'age', '25', '27', '26', 'ceiling'],
  Income: ['income', 'household', 'family', 'salary', 'tehsildar', '2,50,000', '250000', '3,50,000', '350000', 'lakh', 'land', 'acre', 'acres', 'irrigated', 'agricultural', 'orphan', 'widow', 'means', 'brother', 'sibling'],
  Academic: ['marks', 'percentage', 'cgpa', 'cutoff', 'board', '12th', 'entrance', 'rank', 'management', 'quota', 'backlog', 'backlogs', 'sc/st', 'sc', 'st', 'merit'],
  Attendance: ['attendance', 'biometric', 'classroom', '75%', '65%', 'medical', 'hospital', 'illness', 'shortfall', 'condonation', 'consecutive', 'absent', 'absence', 'hospitalized'],
  Documents: ['document', 'documents', 'certificate', 'tehsildar', 'aadhaar', 'dbt', 'npci', 'bank', 'account', 'bonafide', 'marksheet', 'affidavit', 'stamp', 'paper', 'joint'],
  Renewal: ['renewal', 'renew', 'detained', 'detention', 'drop', 'first', 'attempt', 'subsequent', 'conduct', '30 days', 'reinstate', 'arrears', 'failed'],
  Deadline: ['deadline', 'portal', 'october', 'november', 'submission', 'forwarding', 'nodal', 'date', 'closure', 'late'],
  Exclusions: ['dual', 'concurrent', 'parallel', 'stipend', 'waiver', 'book', 'award', '10,000', 'ragging', 'cheating', 'disciplinary', 'salaried', 'job', 'employment', 'teaching', 'assistant', 'internship', 'assistantship'],
  Special: ['pwd', 'disability', 'handicapped', 'assistive', 'allowance', 'single girl', 'daughter', 'girl child', 'border', 'aspirational', 'tie-break', 'tie']
};

export function matchQueryAgainstKB(
  queryText: string,
  knowledgeBase: KnowledgeBaseRule[],
  fullPolicyRules: PolicyRule[]
): MatchingResult {
  const queryTokens = tokenize(queryText);
  const matchedRules: { rule: KnowledgeBaseRule; score: number }[] = [];

  for (const kbRule of knowledgeBase) {
    let score = 0;
    const ruleContent = `${kbRule.title} ${kbRule.category} ${kbRule.extractedConditions.join(' ')} ${kbRule.outcome}`.toLowerCase();
    
    // Exact token matching
    for (const token of queryTokens) {
      if (ruleContent.includes(token)) {
        score += 2;
      }
    }

    // Category boost
    const catWords = CATEGORY_KEYWORDS[kbRule.category] || [];
    for (const token of queryTokens) {
      if (catWords.includes(token)) {
        score += 1.5;
      }
    }

    // Specific entity boosters
    if (queryText.includes('₹') || queryText.toLowerCase().includes('income') || queryText.toLowerCase().includes('lakh')) {
      if (kbRule.category === 'Income') score += 3;
    }
    if (queryText.toLowerCase().includes('attend') || queryText.toLowerCase().includes('absent')) {
      if (kbRule.category === 'Attendance') score += 4;
    }
    if (queryText.toLowerCase().includes('renew') || queryText.toLowerCase().includes('detain') || queryText.toLowerCase().includes('fail')) {
      if (kbRule.category === 'Renewal') score += 3;
    }
    if (queryText.toLowerCase().includes('disabilit') || queryText.toLowerCase().includes('pwd') || queryText.toLowerCase().includes('girl child') || queryText.toLowerCase().includes('border') || queryText.toLowerCase().includes('aspirational')) {
      if (kbRule.category === 'Special') score += 5;
    }
    if (queryText.toLowerCase().includes('book award') || queryText.toLowerCase().includes('ragging') || queryText.toLowerCase().includes('salaried') || queryText.toLowerCase().includes('teaching assistant')) {
      if (kbRule.category === 'Exclusions') score += 4;
    }

    if (score >= 4) {
      matchedRules.push({ rule: kbRule, score });
    }
  }

  // Sort by score descending
  matchedRules.sort((a, b) => b.score - a.score);
  const topRules = matchedRules.slice(0, 3).map(m => m.rule);

  // Check if critical policy concepts asked in query exist in original policy but are missing from this KB
  const missingPolicyRulesForQuery: PolicyRule[] = [];
  for (const polRule of fullPolicyRules) {
    const isPresentInKB = knowledgeBase.some(k => k.ruleId === polRule.id);
    if (!isPresentInKB) {
      // Check if query is about this missing rule
      const polText = `${polRule.title} ${polRule.category} ${polRule.conditions.join(' ')}`.toLowerCase();
      let matchCount = 0;
      for (const token of queryTokens) {
        if (polText.includes(token)) matchCount++;
      }
      if (matchCount >= 2) {
        missingPolicyRulesForQuery.push(polRule);
      }
    }
  }

  // Determine Answerability
  if (topRules.length === 0) {
    return {
      matchedRules: [],
      confidence: 0,
      status: 'UNANSWERED',
      missingRulesHint: missingPolicyRulesForQuery.map(r => `${r.id}: ${r.title}`),
      explanation: 'No relevant policy rules were located in this knowledge base to address the inquiry.',
      generatedAnswer: 'Insufficient information in knowledge base. The required policy provisions have not been represented.'
    };
  }

  // If top matched rule has severe omitted conditions or missing companion rule
  const primaryMatch = topRules[0];
  const hasOmittedConditions = primaryMatch.omittedConditions && primaryMatch.omittedConditions.length > 0;
  const isPartiallyRepresented = primaryMatch.status === 'partially_represented';

  // Check if missing rules would have altered the verdict
  if (missingPolicyRulesForQuery.length > 0) {
    return {
      matchedRules: topRules,
      confidence: 45,
      identifiedCategory: primaryMatch.category,
      status: 'PARTIALLY_ANSWERABLE',
      missingRulesHint: missingPolicyRulesForQuery.map(r => `${r.id}: ${r.title} (${r.category})`),
      explanation: `The knowledge base contains general provisions under ${primaryMatch.ruleId}, but critical governing rules (${missingPolicyRulesForQuery.map(r => r.id).join(', ')}) are completely absent from this knowledge base.`,
      generatedAnswer: `Partial resolution: Based strictly on available rule [${primaryMatch.ruleId}: ${primaryMatch.title}], ${primaryMatch.outcome}. However, crucial policy conditions (e.g., regarding ${missingPolicyRulesForQuery[0].title}) are omitted from this KB.`
    };
  }

  if (isPartiallyRepresented && hasOmittedConditions) {
    return {
      matchedRules: topRules,
      confidence: 68,
      identifiedCategory: primaryMatch.category,
      status: 'PARTIALLY_ANSWERABLE',
      missingRulesHint: primaryMatch.omittedConditions,
      explanation: `Rule ${primaryMatch.ruleId} is represented, but fine-grained conditions were omitted during ad hoc construction: "${primaryMatch.omittedConditions?.join('; ')}".`,
      generatedAnswer: `Based on [${primaryMatch.ruleId}: ${primaryMatch.title}]: ${primaryMatch.outcome}. Notice: Secondary conditions or exceptions are not specified in this knowledge base.`
    };
  }

  // Full answerable case
  const combinedConditions = topRules.flatMap(r => r.extractedConditions).join(' | ');
  return {
    matchedRules: topRules,
    confidence: 96,
    identifiedCategory: primaryMatch.category,
    status: 'ANSWERABLE',
    explanation: `Successfully resolved using policy rules: ${topRules.map(r => r.ruleId).join(', ')}. All necessary eligibility criteria and boundary constraints are present.`,
    generatedAnswer: `Based on verified policy rules [${topRules.map(r => r.ruleId).join(', ')}]: Conditions satisfied: ${combinedConditions}. Outcome: ${topRules.map(r => r.outcome).join('; ')}.`
  };
}
