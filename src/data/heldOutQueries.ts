import { HeldOutQuery } from '../types';

export const HELD_OUT_QUERIES: HeldOutQuery[] = [
  // 1. Eligibility Queries
  {
    id: "TC-01",
    category: "Eligibility",
    query: "Can a 27-year-old General category applicant enroll in a distance MBA program and receive the scholarship?",
    relevantRuleIds: ["POL-R01", "POL-R03"],
    expectedClassification: "INELIGIBLE",
    expectedAnswer: "Ineligible on two counts: First, the policy strictly requires full-time regular degree enrollment and prohibits distance/part-time study (POL-R01). Second, the maximum age ceiling for general candidates is 25 years as of 1st July (POL-R03).",
    evaluationRationale: "Tests full-time mode restriction and general age cutoff."
  },
  {
    id: "TC-02",
    category: "Eligibility",
    query: "Is a 26-year-old student with a certified physical disability (PwD) eligible under the age criteria for first-year entry?",
    relevantRuleIds: ["POL-R03", "POL-R24"],
    expectedClassification: "ELIGIBLE",
    expectedAnswer: "Eligible for age criteria. The standard age ceiling of 25 years provides a 3-year relaxation for candidates from reserved or PwD categories (POL-R03, POL-R24), allowing entry up to 28 years.",
    evaluationRationale: "Tests discovery of the age relaxation footnote for PwD applicants."
  },

  // 2. Income-Related Queries
  {
    id: "TC-03",
    category: "Income",
    query: "Can an applicant apply if their father earns ₹1,80,000, mother earns ₹60,000, and an unmarried elder brother earns ₹50,000 per year?",
    relevantRuleIds: ["POL-R04"],
    expectedClassification: "INELIGIBLE",
    expectedAnswer: "Ineligible. The household income aggregates father, mother, and unmarried siblings, totaling ₹2,90,000, which exceeds the mandatory ₹2,50,000 annual ceiling (POL-R04).",
    evaluationRationale: "Tests household income aggregation condition (unmarried siblings inclusion)."
  },
  {
    id: "TC-04",
    category: "Income",
    query: "Can an orphaned student with an annual income of ₹3,10,000 apply under the economic means test?",
    relevantRuleIds: ["POL-R04", "POL-R06"],
    expectedClassification: "ELIGIBLE",
    expectedAnswer: "Eligible under the special economic hardship tier (POL-R06). While the regular ceiling is ₹2,50,000, orphaned students and students with single widowed mothers are granted an extended ceiling up to ₹3,50,000 upon submitting death certificates.",
    evaluationRationale: "Directly tests whether the KB captured the orphan exemption rule (POL-R06)."
  },
  {
    id: "TC-05",
    category: "Income",
    query: "A student whose family earns ₹1,90,000 annually owns 8 acres of irrigated agricultural land. Are they eligible?",
    relevantRuleIds: ["POL-R04", "POL-R05"],
    expectedClassification: "INELIGIBLE",
    expectedAnswer: "Ineligible due to asset ceiling violation. Although their monetary income (₹1.90L) is below the ₹2.5L limit, POL-R05 sets a strict maximum cap of 5 acres for irrigated agricultural land (or 10 acres dry land).",
    evaluationRationale: "Tests the agricultural land asset ownership ceiling (POL-R05)."
  },

  // 3. Academic Queries
  {
    id: "TC-06",
    category: "Academic",
    query: "Can an SC/ST student who scored 58% in 12th standard qualify for the initial entry scholarship?",
    relevantRuleIds: ["POL-R07"],
    expectedClassification: "ELIGIBLE",
    expectedAnswer: "Eligible under academic merit. While the general cutoff is 65%, the policy specifies a relaxed threshold of 55% aggregate marks for SC/ST/PwD applicants in their qualifying board exam (POL-R07).",
    evaluationRationale: "Tests category-specific academic cutoff relaxation."
  },
  {
    id: "TC-07",
    category: "Academic",
    query: "Can a student admitted through an unapproved discretionary management quota seat with 88% marks apply?",
    relevantRuleIds: ["POL-R01", "POL-R09"],
    expectedClassification: "INELIGIBLE",
    expectedAnswer: "Ineligible. Professional course students must have entered through a recognized state or national competitive entrance quota exam (POL-R09); discretionary management quota admissions without standardized merit ranks are expressly barred.",
    evaluationRationale: "Tests professional entrance rank condition vs raw percentage."
  },
  {
    id: "TC-08",
    category: "Academic",
    query: "A continuing 3rd-semester student has a cumulative CGPA of 6.8 but has one active uncleared backlog in Mathematics. Can they continue?",
    relevantRuleIds: ["POL-R08"],
    expectedClassification: "INELIGIBLE",
    expectedAnswer: "Ineligible for continuation. Although the CGPA (6.8) meets the >= 6.0 cutoff, POL-R08 strictly requires zero active uncleared backlogs at the time of scrutiny.",
    evaluationRationale: "Tests compound condition (CGPA >= 6.0 AND zero active backlogs)."
  },

  // 4. Attendance Queries
  {
    id: "TC-09",
    category: "Attendance",
    query: "A student has 68% semester attendance due to a 3-week hospitalized viral illness with a government hospital discharge summary. Can their stipend be approved?",
    relevantRuleIds: ["POL-R10", "POL-R11"],
    expectedClassification: "CONDITIONAL",
    expectedAnswer: "Conditionally eligible for approval via medical condonation. The standard requirement is 75% (POL-R10), but POL-R11 permits shortfall condonation down to 65% for certified hospitalizations supported by government hospital records and Dean's recommendation.",
    evaluationRationale: "Directly tests the medical condonation rule (POL-R11)."
  },
  {
    id: "TC-10",
    category: "Attendance",
    query: "A scholar maintains an overall 78% attendance rate but was absent for 14 consecutive lecture days without notice. Does this violate policy?",
    relevantRuleIds: ["POL-R10"],
    expectedClassification: "INELIGIBLE",
    expectedAnswer: "Violates policy condition. While their aggregate percentage exceeds 75%, POL-R10 explicitly forbids unexcused consecutive absences exceeding 10 lecture days.",
    evaluationRationale: "Tests secondary sub-condition inside the attendance rule."
  },

  // 5. Documentation Queries
  {
    id: "TC-11",
    category: "Documents",
    query: "Can an applicant submit a salary certificate issued by a private employer instead of a Tehsildar income certificate?",
    relevantRuleIds: ["POL-R04", "POL-R12"],
    expectedClassification: "INELIGIBLE",
    expectedAnswer: "Ineligible document submission. POL-R12 and POL-R04 mandate a digitally signed revenue income certificate issued by a Competent Revenue Authority (Tehsildar / SDO); private salary certificates are rejected.",
    evaluationRationale: "Tests strict compliance with authorized revenue document authority."
  },
  {
    id: "TC-12",
    category: "Documents",
    query: "Can the scholarship funds be disbursed into a student's joint savings account held jointly with their elder cousin?",
    relevantRuleIds: ["POL-R13"],
    expectedClassification: "INELIGIBLE",
    expectedAnswer: "Ineligible bank account. POL-R13 mandates an individual savings account in the applicant's sole name, linked and seeded with NPCI Aadhaar for Direct Benefit Transfer (DBT). Joint accounts with non-guardians/relatives are prohibited.",
    evaluationRationale: "Tests sole bank account and NPCI Aadhaar DBT seeding requirements."
  },

  // 6. Renewal Queries
  {
    id: "TC-13",
    category: "Renewal",
    query: "A student failed their 2nd year and was detained for an academic year. Can they reinstate their scholarship after clearing all subjects next year?",
    relevantRuleIds: ["POL-R16", "POL-R17"],
    expectedClassification: "INELIGIBLE",
    expectedAnswer: "Permanently ineligible. Under POL-R17, any student who fails, gets detained, or drops an academic year forfeits the scholarship permanently; it cannot be reinstated or claimed retroactively during a repeat year.",
    evaluationRationale: "Tests the permanent forfeiture rule for academic detention (POL-R17)."
  },
  {
    id: "TC-14",
    category: "Renewal",
    query: "If a scholar scored 68% in their annual exam and passed all subjects in the first attempt, can they submit their renewal form 5 months later?",
    relevantRuleIds: ["POL-R16"],
    expectedClassification: "DEADLINE_PASSED",
    expectedAnswer: "Ineligible due to missed renewal deadline. POL-R16 requires renewal applications to be submitted within 30 days of annual results declaration; a 5-month delay exceeds the allowable window.",
    evaluationRationale: "Tests the 30-day renewal filing limit."
  },

  // 7. Deadline Queries
  {
    id: "TC-15",
    category: "Deadline",
    query: "Can a student submit their initial application on the online portal on 5th November?",
    relevantRuleIds: ["POL-R19"],
    expectedClassification: "DEADLINE_PASSED",
    expectedAnswer: "Ineligible due to deadline expiration. POL-R19 sets a strict electronic portal submission deadline of 31st October 23:59 IST; submissions on 5th November are locked out.",
    evaluationRationale: "Tests hard application calendar cutoff (POL-R19)."
  },

  // 8. Exclusion Queries
  {
    id: "TC-16",
    category: "Exclusions",
    query: "A student receives a one-time ₹5,000 national merit book award from an engineering society. Does this disqualify them under the dual scholarship prohibition?",
    relevantRuleIds: ["POL-R21"],
    expectedClassification: "ELIGIBLE",
    expectedAnswer: "Does not disqualify. While POL-R21 strictly prohibits concurrent recurring government stipends, it contains an express exception permitting one-time merit book awards under ₹10,000.",
    evaluationRationale: "Tests fine-grained exception clause for one-time book awards under ₹10k."
  },
  {
    id: "TC-17",
    category: "Exclusions",
    query: "Can a full-time student working as an uncompensated or part-time paid teaching assistant earning ₹6,000/month receive the scholarship?",
    relevantRuleIds: ["POL-R23"],
    expectedClassification: "ELIGIBLE",
    expectedAnswer: "Eligible. POL-R23 bars full-time regular salaried employment but explicitly permits part-time student internships or campus teaching assistantships up to ₹8,000/month.",
    evaluationRationale: "Tests the part-time teaching assistant stipend exception threshold."
  },
  {
    id: "TC-18",
    category: "Exclusions",
    query: "An applicant was issued a formal university reprimand and penalty by the proctorial board for ragging junior students. Are they eligible?",
    relevantRuleIds: ["POL-R18", "POL-R22"],
    expectedClassification: "POLICY_EXCLUSION",
    expectedAnswer: "Strictly excluded. Under POL-R22 (Zero Tolerance) and POL-R18, any student with proven disciplinary convictions or formal proctorial charge sheets for ragging or cheating is barred for life.",
    evaluationRationale: "Tests anti-ragging lifetime exclusion clause."
  },

  // 9. Special Rider Queries
  {
    id: "TC-19",
    category: "Special",
    query: "What additional monetary allowance is an eligible student with 50% locomotor disability entitled to receive?",
    relevantRuleIds: ["POL-R24"],
    expectedClassification: "ELIGIBLE",
    expectedAnswer: "Eligible for an additional ₹1,000/month assistive device and conveyance allowance under the affirmative inclusion rider for scholars with certified disability >= 40% (POL-R24).",
    evaluationRationale: "Directly tests retrieval of disability assistive allowance rider (POL-R24)."
  },
  {
    id: "TC-20",
    category: "Special",
    query: "Is a female candidate who is the only child of her parents eligible for any supplemental fellowship top-up?",
    relevantRuleIds: ["POL-R25"],
    expectedClassification: "ELIGIBLE",
    expectedAnswer: "Eligible for a ₹500/month stipend top-up under the Single Girl Child Special Fellowship rider (POL-R25), upon submitting an Executive First Class Magistrate affidavit certifying single child status.",
    evaluationRationale: "Directly tests retrieval of the Single Girl Child rider (POL-R25)."
  },

  // 10. Complex Multi-Condition Queries
  {
    id: "TC-21",
    category: "Complex",
    query: "Can an orphan student with 56% 12th marks, ₹3,20,000 family income, and full-time regular B.Tech admission apply?",
    relevantRuleIds: ["POL-R01", "POL-R04", "POL-R06", "POL-R07"],
    expectedClassification: "INELIGIBLE",
    expectedAnswer: "Ineligible due to academic percentage shortfall. Although their income (₹3.20L) is covered by the orphan exemption tier (POL-R06 <= ₹3.50L), general qualifying marks require at least 65% (POL-R07); 56% is insufficient unless certified under reserved/PwD categories.",
    evaluationRationale: "Tests interaction of orphan income exemption with standard academic cutoffs."
  },
  {
    id: "TC-22",
    category: "Complex",
    query: "In a tie-break between two identical 92% candidates from rural aspirational districts versus urban districts, who receives preference?",
    relevantRuleIds: ["POL-R26"],
    expectedClassification: "ELIGIBLE",
    expectedAnswer: "The candidate residing in the notified aspirational or border district receives tie-breaking preference under POL-R26 (5% priority score weightage for regional disparity mitigation).",
    evaluationRationale: "Tests retrieval of the aspirational district tie-breaking priority rule (POL-R26)."
  }
];
