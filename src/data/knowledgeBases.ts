import { KnowledgeBaseRule } from '../types';
import { INITIAL_POLICY_RULES } from './policyRules';

// Approach A: CQ-Guided Knowledge Base
// Built methodically guided by CQs. Captures all 26 rules with high fidelity and full conditions.
export const INITIAL_CQ_GUIDED_KB: KnowledgeBaseRule[] = INITIAL_POLICY_RULES.map((rule, idx) => ({
  id: `KB-CQ-${String(idx + 1).padStart(2, '0')}`,
  ruleId: rule.id,
  category: rule.category,
  title: rule.title,
  extractedConditions: [...rule.conditions],
  outcome: rule.expectedOutcome,
  status: 'verified',
  developmentNotes: `Mapped systematically through Competency Question evaluation. Complete semantic condition tree captured.`,
  verified: true
}));

// Approach B: Ad Hoc Knowledge Base
// Built under the same 120-minute time constraint through cursory reading without structured CQs.
// Notice omissions typical of ad hoc engineering:
// - POL-R05 (Agricultural Land ceiling) omitted entirely.
// - POL-R06 (Single parent / orphan exemption) omitted entirely.
// - POL-R11 (Medical attendance condonation) omitted entirely.
// - POL-R13 (Aadhaar DBT linking requirement) omitted partially / missing DBT check.
// - POL-R17 (Detainment / failure permanent cancellation consequence) omitted.
// - POL-R21 (Dual scholarship book allowance exception) condition missed.
// - POL-R24 (PwD special quota) omitted entirely.
// - POL-R25 (Single girl child rider) omitted entirely.
// - POL-R26 (Border / Aspirational district tie breaker) omitted entirely.
export const INITIAL_AD_HOC_KB: KnowledgeBaseRule[] = [
  {
    id: "KB-ADH-01",
    ruleId: "POL-R01",
    category: "Eligibility",
    title: "Enrolled in Degree Course",
    extractedConditions: ["Must be enrolled in recognized degree program"],
    omittedConditions: ["Mode of study must be full-time regular", "Institution must hold active national accreditation"],
    outcome: "Eligible for consideration under regular track",
    status: "partially_represented",
    developmentNotes: "Captured broad enrollment concept; missed fine print on full-time mode and accreditation requirement.",
    verified: true
  },
  {
    id: "KB-ADH-02",
    ruleId: "POL-R02",
    category: "Eligibility",
    title: "Citizenship and Domicile",
    extractedConditions: ["Must possess valid citizenship proof", "Must hold state domicile certificate"],
    omittedConditions: ["Domicile certificate must be issued within 3 years"],
    outcome: "Domicile requirement fulfilled",
    status: "partially_represented",
    developmentNotes: "Captured domicile necessity; missed 3-year validity boundary.",
    verified: true
  },
  {
    id: "KB-ADH-03",
    ruleId: "POL-R03",
    category: "Eligibility",
    title: "Age Limit Under 25",
    extractedConditions: ["Age <= 25 years on 1st July of application year"],
    omittedConditions: ["Relaxation of up to 3 years for candidates from reserved or person-with-disability categories"],
    outcome: "Age criteria validated",
    status: "partially_represented",
    developmentNotes: "Noticed age 25 cutoff; missed the 3-year category relaxation clause in footnote.",
    verified: true
  },
  {
    id: "KB-ADH-04",
    ruleId: "POL-R04",
    category: "Income",
    title: "Annual Family Income Cap",
    extractedConditions: ["Total household income <= INR 2,50,000 per annum"],
    omittedConditions: ["Income must aggregate earnings of father, mother, and unmarried siblings", "Must be certified by Competent Revenue Authority"],
    outcome: "Income check passed",
    status: "partially_represented",
    developmentNotes: "Recorded ₹2.5L limit; missed sibling aggregation rule and specific Tehsildar authorization.",
    verified: true
  },
  // POL-R05 OMITTED in Ad Hoc (Land asset ceiling overlooked during cursory read)
  // POL-R06 OMITTED in Ad Hoc (Orphan / single parent relaxed tier overlooked)
  {
    id: "KB-ADH-05",
    ruleId: "POL-R07",
    category: "Academic",
    title: "12th Board Cutoff 65%",
    extractedConditions: ["Aggregate percentage >= 65%"],
    omittedConditions: ["Aggregate percentage >= 55% for SC/ST/PwD applicants", "No compartmental or backlogs in primary core subjects"],
    outcome: "Academic threshold met",
    status: "partially_represented",
    developmentNotes: "Recorded 65% standard cutoff; missed SC/ST 55% concession and backlog exclusion.",
    verified: true
  },
  {
    id: "KB-ADH-06",
    ruleId: "POL-R08",
    category: "Academic",
    title: "College CGPA 6.0",
    extractedConditions: ["Current cumulative CGPA >= 6.0 on a 10-point scale"],
    omittedConditions: ["Zero active uncleared backlogs at the time of scrutiny"],
    outcome: "Continuation cleared",
    status: "partially_represented",
    developmentNotes: "Noted 6.0 CGPA; missed standing backlog restriction.",
    verified: true
  },
  {
    id: "KB-ADH-07",
    ruleId: "POL-R09",
    category: "Academic",
    title: "Entrance Exam Rank",
    extractedConditions: ["Must hold verifiable rank in approved state/national entrance test"],
    outcome: "Entrance quota qualification cleared",
    status: "verified",
    developmentNotes: "Ad hoc reader noted professional exam rank requirement.",
    verified: true
  },
  {
    id: "KB-ADH-08",
    ruleId: "POL-R10",
    category: "Attendance",
    title: "75% Attendance",
    extractedConditions: ["Overall semester attendance >= 75%"],
    omittedConditions: ["Absences without medical certificate must not exceed 10 consecutive lecture days"],
    outcome: "Attendance condition met",
    status: "partially_represented",
    developmentNotes: "Captured 75% metric; missed 10-consecutive-day unexcused absence rule.",
    verified: true
  },
  // POL-R11 OMITTED in Ad Hoc (Medical condonation down to 65% missed entirely)
  {
    id: "KB-ADH-09",
    ruleId: "POL-R12",
    category: "Documents",
    title: "Income Certificate",
    extractedConditions: ["Original income certificate submission"],
    omittedConditions: ["Must be digitally signed by Tehsildar/SDO", "Certificate issue date must be within 6 months"],
    outcome: "Income validation verified",
    status: "partially_represented",
    developmentNotes: "Generic note on income cert; missed 6-month validity timestamp and digital signature requirement.",
    verified: true
  },
  {
    id: "KB-ADH-10",
    ruleId: "POL-R13",
    category: "Documents",
    title: "Bank Account",
    extractedConditions: ["Savings bank account in applicant's name"],
    omittedConditions: ["Bank account must be NPCI Aadhaar-seeded for Direct Benefit Transfer (DBT)"],
    outcome: "Bank account documented",
    status: "partially_represented",
    developmentNotes: "Noted bank account needed; missed NPCI Aadhaar DBT seeding mandate.",
    verified: true
  },
  {
    id: "KB-ADH-11",
    ruleId: "POL-R14",
    category: "Documents",
    title: "College Bonafide & Marksheet",
    extractedConditions: ["Institutional bonafide signed by Principal / Dean", "Attested marksheets of previous semester"],
    outcome: "Enrollment & academic documentation complete",
    status: "verified",
    developmentNotes: "Extracted clearly from checklist.",
    verified: true
  },
  {
    id: "KB-ADH-12",
    ruleId: "POL-R15",
    category: "Documents",
    title: "Non-Availment Affidavit",
    extractedConditions: ["Affidavit stating no parallel aid"],
    omittedConditions: ["Must be notarized on ₹100 stamp paper"],
    outcome: "Affidavit validated",
    status: "partially_represented",
    developmentNotes: "Noted affidavit requirement; stamp paper denomination detail omitted.",
    verified: true
  },
  {
    id: "KB-ADH-13",
    ruleId: "POL-R16",
    category: "Renewal",
    title: "Annual Renewal Passing",
    extractedConditions: ["Minimum 60% cumulative aggregate marks retained"],
    omittedConditions: ["Pass all subjects on first attempt", "Renewal form within 30 days of results"],
    outcome: "Renewal sanctioned",
    status: "partially_represented",
    developmentNotes: "Noted 60% marks; missed first attempt mandate and 30-day filing window.",
    verified: true
  },
  // POL-R17 OMITTED in Ad Hoc (Detainment permanent loss rule omitted)
  {
    id: "KB-ADH-14",
    ruleId: "POL-R18",
    category: "Renewal",
    title: "Good Conduct Certificate",
    extractedConditions: ["Satisfactory conduct certificate by HOD"],
    outcome: "Disciplinary clearance granted",
    status: "verified",
    developmentNotes: "Extracted from standard renewal clauses.",
    verified: true
  },
  {
    id: "KB-ADH-15",
    ruleId: "POL-R19",
    category: "Deadline",
    title: "Portal Deadline 31 October",
    extractedConditions: ["Electronic submission timestamp <= 31st October 23:59 IST"],
    outcome: "Timely submission accepted",
    status: "verified",
    developmentNotes: "Main portal date extracted.",
    verified: true
  },
  {
    id: "KB-ADH-16",
    ruleId: "POL-R20",
    category: "Deadline",
    title: "College Forwarding Deadline 15 Nov",
    extractedConditions: ["Institutional scrutiny deadline <= 15th November"],
    outcome: "Forwarded to State Scrutiny Desk",
    status: "verified",
    developmentNotes: "Forwarding date extracted.",
    verified: true
  },
  {
    id: "KB-ADH-17",
    ruleId: "POL-R21",
    category: "Exclusions",
    title: "No Dual Scholarships",
    extractedConditions: ["No concurrent receipt of another government/institutional cash award"],
    omittedConditions: ["Exemption: One-time merit book awards under ₹10,000 do not count as concurrent scholarship"],
    outcome: "Disqualification if parallel scholarship is drawn",
    status: "partially_represented",
    developmentNotes: "Banned all dual aid; completely missed the ₹10,000 book award exception clause.",
    verified: true
  },
  {
    id: "KB-ADH-18",
    ruleId: "POL-R22",
    category: "Exclusions",
    title: "Ragging & Misconduct Bar",
    extractedConditions: ["Formal charge sheet or conviction for ragging or cheating bars applicant"],
    outcome: "Immediate rejection and blacklisting",
    status: "verified",
    developmentNotes: "Noted zero tolerance policy for ragging.",
    verified: true
  },
  {
    id: "KB-ADH-19",
    ruleId: "POL-R23",
    category: "Exclusions",
    title: "No Salaried Employment",
    extractedConditions: ["Must not be in full-time salaried employment"],
    omittedConditions: ["Part-time student internships or teaching assistantships up to ₹8,000/month are permitted"],
    outcome: "Employment barrier enforced",
    status: "partially_represented",
    developmentNotes: "Stated no job; missed ₹8k student internship carve-out.",
    verified: true
  }
  // POL-R24 OMITTED in Ad Hoc (PwD quota and assistive allowance)
  // POL-R25 OMITTED in Ad Hoc (Single Girl Child fellowship rider)
  // POL-R26 OMITTED in Ad Hoc (Border area / Aspirational district tie breaker)
];
