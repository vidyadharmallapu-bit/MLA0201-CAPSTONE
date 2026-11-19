import { PolicyRule } from '../types';

export const SYNTHETIC_POLICY_METADATA = {
  code: "SYNTH-SCHOLARSHIP-2026",
  title: "National Higher Education Merit-Cum-Means Scholarship Scheme (Demonstration Synthetic Policy)",
  version: "4.2-RESEARCH",
  effectiveAcademicYear: "2026-2027",
  disclaimer: "SYNTHETIC DEMONSTRATION POLICY: This document is formulated exclusively for computer science knowledge engineering research. It does not represent any real-world government department or statutory authority.",
  budgetAllocationMinutes: 120, // Equal development time budget: 120 minutes each
};

export const INITIAL_POLICY_RULES: PolicyRule[] = [
  // 1. General Eligibility
  {
    id: "POL-R01",
    category: "Eligibility",
    title: "Full-Time Degree Enrollment",
    description: "Applicant must be enrolled as a regular full-time student in an accredited undergraduate or postgraduate degree program.",
    conditions: [
      "Must be enrolled in recognized degree program",
      "Mode of study must be full-time regular (distance / part-time prohibited)",
      "Institution must hold active national accreditation"
    ],
    expectedOutcome: "Eligible for consideration under regular track",
    sourceSection: "Section 1.1 - General Eligibility",
    isMandatory: true
  },
  {
    id: "POL-R02",
    category: "Eligibility",
    title: "Citizenship and Domicile",
    description: "Applicant must be a permanent resident/citizen and possess a verified state domicile certificate.",
    conditions: [
      "Must possess valid citizenship proof",
      "Must hold verified state domicile certificate issued within 3 years"
    ],
    expectedOutcome: "Domicile requirement fulfilled",
    sourceSection: "Section 1.2 - Domicile Criteria",
    isMandatory: true
  },
  {
    id: "POL-R03",
    category: "Eligibility",
    title: "Age Ceiling for First-Year Entry",
    description: "Applicant must not exceed 25 years of age as of the 1st of July of the application year.",
    conditions: [
      "Age <= 25 years on 1st July of application year",
      "Relaxation of up to 3 years for candidates from reserved or person-with-disability categories"
    ],
    expectedOutcome: "Age criteria validated",
    sourceSection: "Section 1.3 - Age Restrictions",
    isMandatory: true
  },

  // 2. Family Income Restrictions
  {
    id: "POL-R04",
    category: "Income",
    title: "Gross Annual Family Income Ceiling",
    description: "Combined gross annual household income from all revenue sources must not exceed ₹2,50,000.",
    conditions: [
      "Total household income <= INR 2,50,000 per annum",
      "Income must aggregate earnings of father, mother, and unmarried siblings",
      "Must be certified by Competent Revenue Authority (Tehsildar / SDO)"
    ],
    expectedOutcome: "Full means-tested allowance qualification",
    sourceSection: "Section 2.1 - Means Test & Income Thresholds",
    isMandatory: true
  },
  {
    id: "POL-R05",
    category: "Income",
    title: "Agricultural Land Ownership Ceiling",
    description: "Applicant's family must not own irrigated agricultural land exceeding 5 acres or dry land exceeding 10 acres.",
    conditions: [
      "Irrigated agricultural land <= 5 acres",
      "Unirrigated/dry land <= 10 acres",
      "Land revenue extract (Form 7/12) verification required"
    ],
    expectedOutcome: "Asset ceiling requirement met",
    sourceSection: "Section 2.2 - Asset Holdings",
    isMandatory: false
  },
  {
    id: "POL-R06",
    category: "Income",
    title: "Single-Parent / Orphan Income Exemption Tier",
    description: "Orphaned students or students with single widowed mothers are granted an income ceiling extension up to ₹3,50,000.",
    conditions: [
      "Certified death certificate of deceased parent(s) provided",
      "Relaxed income ceiling <= INR 3,50,000 per annum applies"
    ],
    expectedOutcome: "Extended means bracket granted",
    sourceSection: "Section 2.3 - Special Economic Hardship Tier",
    isMandatory: false
  },

  // 3. Academic Requirements
  {
    id: "POL-R07",
    category: "Academic",
    title: "Qualifying Board Examination Cutoff",
    description: "Applicant must have secured at least 65% aggregate marks (or equivalent 6.5 CGPA) in the 12th standard or qualifying board examination.",
    conditions: [
      "Aggregate percentage >= 65% (General/OBC)",
      "Aggregate percentage >= 55% for SC/ST/PwD applicants",
      "No compartmental or backlogs in primary core subjects"
    ],
    expectedOutcome: "Academic merit threshold passed",
    sourceSection: "Section 3.1 - Entry Academic Merit",
    isMandatory: true
  },
  {
    id: "POL-R08",
    category: "Academic",
    title: "Ongoing Semester Minimum CGPA",
    description: "For continuing students, a cumulative grade point average of at least 6.0 without any unresolved standing backlogs is required.",
    conditions: [
      "Current cumulative CGPA >= 6.0 on a 10-point scale",
      "Zero active uncleared backlogs at the time of scrutiny"
    ],
    expectedOutcome: "Continuation clearance granted",
    sourceSection: "Section 3.2 - Continuing Performance",
    isMandatory: true
  },
  {
    id: "POL-R09",
    category: "Academic",
    title: "Merit Rank in Competitive Entrance Exam",
    description: "Professional stream students (Engineering, Medical, Law) must have entered via recognized state or national competitive quota exams.",
    conditions: [
      "Must hold verifiable rank in approved state/national entrance test",
      "Management quota admissions without standardized merit are ineligible"
    ],
    expectedOutcome: "Entrance quota qualification cleared",
    sourceSection: "Section 3.3 - Professional Course Norms",
    isMandatory: false
  },

  // 4. Attendance
  {
    id: "POL-R10",
    category: "Attendance",
    title: "Mandatory Minimum 75% Biometric/Classroom Attendance",
    description: "The scholar must maintain not less than 75% verified physical or biometric attendance across all enrolled subjects during the preceding academic semester.",
    conditions: [
      "Overall semester attendance >= 75%",
      "Absences without certified medical certificate must not exceed 10 consecutive lecture days"
    ],
    expectedOutcome: "Attendance condition met for stipend disbursement",
    sourceSection: "Section 4.1 - Physical & Biometric Attendance",
    isMandatory: true
  },
  {
    id: "POL-R11",
    category: "Attendance",
    title: "Medical Attendance Condonation Limit",
    description: "In case of prolonged illness or hospitalization, an attendance shortfall down to 65% may be condoned by the Dean upon submission of government hospital records.",
    conditions: [
      "Attendance between 65% and 74.9%",
      "Certified hospitalization or medical fitness documentation from Civil Surgeon / Govt Medical Officer",
      "Recommendation letter signed by Head of Institution"
    ],
    expectedOutcome: "Conditional condonation approved",
    sourceSection: "Section 4.2 - Medical Shortfall Condonation",
    isMandatory: false
  },

  // 5. Required Documents
  {
    id: "POL-R12",
    category: "Documents",
    title: "Revenue Income Certificate Submission",
    description: "A digitally signed income certificate issued by a revenue officer not below the rank of Executive Magistrate / Tehsildar is mandatory.",
    conditions: [
      "Original digitally signed income certificate",
      "Certificate issue date must be within 6 months prior to application deadline"
    ],
    expectedOutcome: "Income validation verified",
    sourceSection: "Section 5.1 - Mandatory Documentation",
    isMandatory: true
  },
  {
    id: "POL-R13",
    category: "Documents",
    title: "Aadhaar-Linked Bank Account Verification",
    description: "Applicant must possess an active individual savings bank account seeded with Aadhaar for Direct Benefit Transfer (DBT).",
    conditions: [
      "Individual savings account in applicant's sole name (no joint accounts with friends or cousins)",
      "Bank account must be NPCI Aadhaar-seeded for DBT disbursement"
    ],
    expectedOutcome: "DBT payment channel authenticated",
    sourceSection: "Section 5.2 - Bank Mandate Rules",
    isMandatory: true
  },
  {
    id: "POL-R14",
    category: "Documents",
    title: "Official Marksheets and Enrollment Bonafide",
    description: "Original attested copy of previous academic transcript and bonafide certificate from the current college head.",
    conditions: [
      "Institutional bonafide signed by Principal / Dean",
      "Attested marksheets of all previous qualifying semesters"
    ],
    expectedOutcome: "Enrollment & academic documentation complete",
    sourceSection: "Section 5.3 - Institutional Validation",
    isMandatory: true
  },
  {
    id: "POL-R15",
    category: "Documents",
    title: "Non-Availment Affidavit",
    description: "Self-declaration affidavit notarized on 100-rupee stamp paper certifying the applicant is not drawing another concurrent financial aid.",
    conditions: [
      "Notarized stamp paper affidavit on ₹100 stamp paper",
      "Declaration explicitly naming no parallel central/state aid"
    ],
    expectedOutcome: "Affidavit validated",
    sourceSection: "Section 5.4 - Integrity Undertakings",
    isMandatory: true
  },

  // 6. Renewal Conditions
  {
    id: "POL-R16",
    category: "Renewal",
    title: "Annual Renewal Passing Mandate",
    description: "To renew the scholarship for subsequent years, the student must pass all year-end examinations in the first attempt.",
    conditions: [
      "Pass all semester/annual subjects on first attempt",
      "Minimum 60% cumulative aggregate marks retained",
      "Renewal form submitted within 30 days of annual results declaration"
    ],
    expectedOutcome: "Renewal sanctioned for next academic year",
    sourceSection: "Section 6.1 - Academic Progression for Renewal",
    isMandatory: true
  },
  {
    id: "POL-R17",
    category: "Renewal",
    title: "Consequence of Academic Failure or Detainment",
    description: "A student who fails, gets detained, or drops an academic year loses the scholarship permanently and cannot claim arrears upon repeat year.",
    conditions: [
      "Academic year drop or institutional detainment due to academic failure",
      "Permanent cancellation of scholarship without retroactive reinstatement"
    ],
    expectedOutcome: "Permanent scholarship termination",
    sourceSection: "Section 6.2 - Penalty for Academic Detention",
    isMandatory: true
  },
  {
    id: "POL-R18",
    category: "Renewal",
    title: "Institutional Conduct Certificate for Renewal",
    description: "A satisfactory disciplinary conduct certificate issued by the Head of the Department is compulsory for every annual renewal.",
    conditions: [
      "No involvement in ragging, campus harassment, or malpractice",
      "Signed satisfactory conduct certificate by Proctor / HOD"
    ],
    expectedOutcome: "Disciplinary clearance granted",
    sourceSection: "Section 6.3 - Conduct Clearance",
    isMandatory: true
  },

  // 7. Application Deadline
  {
    id: "POL-R19",
    category: "Deadline",
    title: "Strict Portal Submission Window",
    description: "Applications must be submitted online on the scholarship portal on or before 31st October of the academic year.",
    conditions: [
      "Electronic submission timestamp <= 31st October 23:59 IST",
      "Physical paper submissions after portal closure are strictly rejected"
    ],
    expectedOutcome: "Timely submission accepted",
    sourceSection: "Section 7.1 - Application Calendar",
    isMandatory: true
  },
  {
    id: "POL-R20",
    category: "Deadline",
    title: "Institutional Verification Cutoff",
    description: "Colleges must verify and forward student dossiers to the state nodal directorate by 15th November.",
    conditions: [
      "Institutional scrutiny deadline <= 15th November",
      "Unverified student files marked as institutional default"
    ],
    expectedOutcome: "Forwarded to State Scrutiny Desk",
    sourceSection: "Section 7.2 - Institutional Forwarding Window",
    isMandatory: true
  },

  // 8. Exclusions
  {
    id: "POL-R21",
    category: "Exclusions",
    title: "Dual Scholarship Prohibition",
    description: "Students drawing any other ongoing central, state, or UGC financial stipend or tuition fee waiver are strictly excluded.",
    conditions: [
      "No concurrent receipt of another government/institutional cash award",
      "Exemption: One-time merit book awards under ₹10,000 do not count as concurrent scholarship"
    ],
    expectedOutcome: "Disqualification if parallel scholarship is drawn",
    sourceSection: "Section 8.1 - Dual Benefit Restrictions",
    isMandatory: true
  },
  {
    id: "POL-R22",
    category: "Exclusions",
    title: "Disciplinary Ragging / Code of Conduct Bar",
    description: "Any applicant against whom disciplinary action for ragging, exam cheating, or cybercrime has been proven stands debarred for life.",
    conditions: [
      "Formal charge sheet or proctorial committee conviction for ragging or cheating",
      "Deemed ineligible across all state/national funding portals"
    ],
    expectedOutcome: "Immediate rejection and blacklisting",
    sourceSection: "Section 8.2 - Zero Tolerance for Indiscipline",
    isMandatory: true
  },
  {
    id: "POL-R23",
    category: "Exclusions",
    title: "Salaried Employment Bar",
    description: "Students engaged in full-time regular salaried employment with any government, corporate, or private entity are ineligible.",
    conditions: [
      "Must not be in full-time salaried employment",
      "Part-time student internships or teaching assistantships up to ₹8,000/month are permitted"
    ],
    expectedOutcome: "Employment barrier enforced",
    sourceSection: "Section 8.3 - Employment Constraints",
    isMandatory: true
  },

  // 9. Special Eligibility Conditions
  {
    id: "POL-R24",
    category: "Special",
    title: "Persons with Disabilities (PwD) Reserved Quota & Concessions",
    description: "Students with >= 40% certified disability are provided relaxed qualifying marks (50%) and an additional ₹1,000/month assistive aid allowance.",
    conditions: [
      "Unique Disability ID (UDID) card confirming disability >= 40%",
      "Qualifying marks relaxed to 50%",
      "Assistive device allowance granted"
    ],
    expectedOutcome: "Special PwD quota and compensatory allowance applied",
    sourceSection: "Section 9.1 - Affirmative Inclusion",
    isMandatory: false
  },
  {
    id: "POL-R25",
    category: "Special",
    title: "Single Girl Child Special Fellowship Rider",
    description: "A single girl child whose parents have no other surviving children is entitled to an additional ₹500/month stipend top-up upon judicial affidavit.",
    conditions: [
      "Must be the only living child of parents",
      "Executive First Class Magistrate affidavit confirming single girl child status"
    ],
    expectedOutcome: "Single girl child fellowship top-up approved",
    sourceSection: "Section 9.2 - Gender Equity Rider",
    isMandatory: false
  },
  {
    id: "POL-R26",
    category: "Special",
    title: "Border Area / Aspirational District Preference",
    description: "Students residing in notified border areas or aspirational rural districts receive a 5% priority score weightage during merit rank tie-breaking.",
    conditions: [
      "Residence certificate from notified aspirational/border block",
      "Tie-breaking priority assigned over urban applicants of identical marks"
    ],
    expectedOutcome: "Tie-breaking merit preference applied",
    sourceSection: "Section 9.3 - Regional Disparity Mitigation",
    isMandatory: false
  }
];
