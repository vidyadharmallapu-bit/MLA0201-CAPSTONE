import { CompetencyQuestion } from '../types';

export const INITIAL_COMPETENCY_QUESTIONS: CompetencyQuestion[] = [
  {
    id: "CQ-01",
    question: "What are the core general eligibility criteria regarding degree enrollment and study mode?",
    category: "Eligibility",
    rationale: "Ensures the knowledge base captures full-time vs distance restrictions, degree accreditation, and course levels.",
    associatedRuleIds: ["POL-R01", "POL-R02", "POL-R03"],
    status: "validated"
  },
  {
    id: "CQ-02",
    question: "What is the maximum permissible annual family income and who counts towards the household aggregate?",
    category: "Income",
    rationale: "Discovers the exact numerical income ceiling (₹2,50,000), issuing authority, and whose earnings must be compiled.",
    associatedRuleIds: ["POL-R04"],
    status: "validated"
  },
  {
    id: "CQ-03",
    question: "Are there special income ceiling exemptions for orphaned students or single-parent families?",
    category: "Income",
    rationale: "Detects tiered economic hardship rules and relaxed thresholds (₹3,50,000).",
    associatedRuleIds: ["POL-R06"],
    status: "validated"
  },
  {
    id: "CQ-04",
    question: "What minimum academic marks or entrance test rankings are required for initial award consideration?",
    category: "Academic",
    rationale: "Uncovers 12th board cutoffs (65% general / 55% reserved) and entrance test validation.",
    associatedRuleIds: ["POL-R07", "POL-R09"],
    status: "validated"
  },
  {
    id: "CQ-05",
    question: "Is physical or biometric attendance mandatory, and can medical emergencies be condoned?",
    category: "Attendance",
    rationale: "Identifies the 75% attendance threshold and the medical relaxation window down to 65%.",
    associatedRuleIds: ["POL-R10", "POL-R11"],
    status: "validated"
  },
  {
    id: "CQ-06",
    question: "Which specific documents and bank account mandates must be verified before sanctioning stipend payment?",
    category: "Documents",
    rationale: "Specifies required Tehsildar income cert, Aadhaar DBT-linked bank account, bonafide, and non-availment affidavit.",
    associatedRuleIds: ["POL-R12", "POL-R13", "POL-R14", "POL-R15"],
    status: "validated"
  },
  {
    id: "CQ-07",
    question: "What happens if a student fails a semester, gets detained, or has backlogs during the renewal cycle?",
    category: "Renewal",
    rationale: "Identifies whether scholarships can be renewed after year drops, clarifying permanent cancellation penalties.",
    associatedRuleIds: ["POL-R16", "POL-R17", "POL-R18"],
    status: "validated"
  },
  {
    id: "CQ-08",
    question: "What are the precise portal submission and institutional forwarding deadlines?",
    category: "Deadline",
    rationale: "Extracts cutoffs (October 31st for student submission, Nov 15th for college verification).",
    associatedRuleIds: ["POL-R19", "POL-R20"],
    status: "validated"
  },
  {
    id: "CQ-09",
    question: "Which students are explicitly barred from applying under exclusion clauses (such as dual scholarships or employment)?",
    category: "Exclusions",
    rationale: "Captures strict bars regarding concurrent state/central financial aid, disciplinary ragging convictions, and regular employment.",
    associatedRuleIds: ["POL-R21", "POL-R22", "POL-R23"],
    status: "validated"
  },
  {
    id: "CQ-10",
    question: "Are there affirmative action concessions for Persons with Disabilities (PwD) or single girl children?",
    category: "Special",
    rationale: "Exposes special riders including relaxed passing marks (50%), assistive allowances, and single girl child top-ups.",
    associatedRuleIds: ["POL-R24", "POL-R25", "POL-R26"],
    status: "validated"
  },
  {
    id: "CQ-11",
    question: "Are agricultural landholdings counted as an asset restriction under the means test?",
    category: "Income",
    rationale: "Discovers land ownership caps (5 acres irrigated / 10 acres dry) to prevent asset-rich landholders from qualifying.",
    associatedRuleIds: ["POL-R05"],
    status: "validated"
  },
  {
    id: "CQ-12",
    question: "What minimum CGPA and clearing status is required for continuing scholars throughout college?",
    category: "Academic",
    rationale: "Ensures continuing student criteria (CGPA >= 6.0 with zero active backlogs) are formally represented.",
    associatedRuleIds: ["POL-R08"],
    status: "validated"
  }
];
