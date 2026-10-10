import { calculateHiringPlan } from '../utils/calculator';
import { HiringPlanConfig } from '../types';

interface TestCase {
  id: string;
  name: string;
  config: HiringPlanConfig;
  expected: {
    targetHires: number;
    requiredAcceptedOffers: number;
    requiredOffersExtended: number;
    requiredInterviews: number;
    requiredQualifiedApplicants: number;
    requiredTotalApplicantPool: number;
    activeInterviewWindowMonths: number;
    latestOfferCutoffMonth: number;
    isTimelineImpossible: boolean;
    monthlyPaceRequired: number;
    monthlyInterviewsNeeded: number;
    totalRecruiterMonthlyCapacity: number;
    recruiterCapacityUtilizationPct: number;
    isRecruiterCapacityExceeded: boolean;
    recruiterDeficit: number;
    engineeringInterviewHoursTotal: number;
    overallFeasibilityStatus?: string;
  };
}

const baseConfig: HiringPlanConfig = {
  cityId: 'vizag',
  totalTargetHires: 300,
  deadlineMonths: 6,
  noticePeriodLagDays: 60,
  applicantToQualifiedRate: 25,
  qualifiedToInterviewRate: 35,
  interviewToOfferRate: 20,
  offerAcceptanceRate: 70,
  acceptedToJoiningRate: 75,
  dedicatedRecruiters: 5,
  monthlyInterviewsPerRecruiter: 35,
  agencySupportEnabled: false,
  agencyCapacityMultiplier: 1.5,
  roles: [],
};

// 1. All conversion rates = 100%
const testCase1: TestCase = {
  id: 'TC-CALC-01',
  name: 'All conversion rates equal to 100%',
  config: {
    ...baseConfig,
    applicantToQualifiedRate: 100,
    qualifiedToInterviewRate: 100,
    interviewToOfferRate: 100,
    offerAcceptanceRate: 100,
    acceptedToJoiningRate: 100,
  },
  expected: {
    targetHires: 300,
    requiredAcceptedOffers: 300,
    requiredOffersExtended: 300,
    requiredInterviews: 300,
    requiredQualifiedApplicants: 300,
    requiredTotalApplicantPool: 300,
    activeInterviewWindowMonths: 4,
    latestOfferCutoffMonth: 4,
    isTimelineImpossible: false,
    monthlyPaceRequired: 50,
    monthlyInterviewsNeeded: 75,
    totalRecruiterMonthlyCapacity: 175,
    recruiterCapacityUtilizationPct: 43,
    isRecruiterCapacityExceeded: false,
    recruiterDeficit: 0,
    engineeringInterviewHoursTotal: 600,
    overallFeasibilityStatus: 'Mathematically Viable',
  },
};

// 2. Normal illustrative case (Default: 300 hires, 6 mo, 60d notice)
const testCase2: TestCase = {
  id: 'TC-CALC-02',
  name: 'Normal illustrative default case (300 in 6 mo, 60d notice)',
  config: { ...baseConfig },
  expected: {
    targetHires: 300,
    requiredAcceptedOffers: 400,
    requiredOffersExtended: 572,
    requiredInterviews: 2860,
    requiredQualifiedApplicants: 8172,
    requiredTotalApplicantPool: 32688,
    activeInterviewWindowMonths: 4,
    latestOfferCutoffMonth: 4,
    isTimelineImpossible: false,
    monthlyPaceRequired: 50,
    monthlyInterviewsNeeded: 715,
    totalRecruiterMonthlyCapacity: 175,
    recruiterCapacityUtilizationPct: 409,
    isRecruiterCapacityExceeded: true,
    recruiterDeficit: 16,
    engineeringInterviewHoursTotal: 5720,
    overallFeasibilityStatus: 'High Operational Risk',
  },
};

// 3. Low-conversion adverse case
const testCase3: TestCase = {
  id: 'TC-CALC-03',
  name: 'Low-conversion adverse stress case',
  config: {
    ...baseConfig,
    totalTargetHires: 100,
    acceptedToJoiningRate: 50,
    offerAcceptanceRate: 50,
    interviewToOfferRate: 10,
    qualifiedToInterviewRate: 20,
    applicantToQualifiedRate: 15,
  },
  expected: {
    targetHires: 100,
    requiredAcceptedOffers: 200,
    requiredOffersExtended: 400,
    requiredInterviews: 4000,
    requiredQualifiedApplicants: 20000,
    requiredTotalApplicantPool: 133334,
    activeInterviewWindowMonths: 4,
    latestOfferCutoffMonth: 4,
    isTimelineImpossible: false,
    monthlyPaceRequired: 16.7,
    monthlyInterviewsNeeded: 1000,
    totalRecruiterMonthlyCapacity: 175,
    recruiterCapacityUtilizationPct: 571,
    isRecruiterCapacityExceeded: true,
    recruiterDeficit: 24,
    engineeringInterviewHoursTotal: 8000,
    overallFeasibilityStatus: 'High Operational Risk',
  },
};

// 4. Fractional result requiring distinct step-by-step ceiling rounding
const testCase4: TestCase = {
  id: 'TC-CALC-04',
  name: 'Fractional result requiring distinct ceiling rounding at every stage',
  config: {
    ...baseConfig,
    totalTargetHires: 17,
    deadlineMonths: 5,
    noticePeriodLagDays: 60,
    acceptedToJoiningRate: 63,
    offerAcceptanceRate: 67,
    interviewToOfferRate: 23,
    qualifiedToInterviewRate: 31,
    applicantToQualifiedRate: 19,
    dedicatedRecruiters: 2,
    monthlyInterviewsPerRecruiter: 30,
  },
  expected: {
    targetHires: 17,
    requiredAcceptedOffers: 27,
    requiredOffersExtended: 41,
    requiredInterviews: 179,
    requiredQualifiedApplicants: 578,
    requiredTotalApplicantPool: 3043,
    activeInterviewWindowMonths: 3,
    latestOfferCutoffMonth: 3,
    isTimelineImpossible: false,
    monthlyPaceRequired: 3.4,
    monthlyInterviewsNeeded: 60,
    totalRecruiterMonthlyCapacity: 60,
    recruiterCapacityUtilizationPct: 100,
    isRecruiterCapacityExceeded: false,
    recruiterDeficit: 0,
    engineeringInterviewHoursTotal: 358,
    overallFeasibilityStatus: 'Mathematically Viable',
  },
};

// 5. 90-Day Notice Period Runway Test (6 months deadline, 90d notice lag = 3 mo lag)
const testCase5: TestCase = {
  id: 'TC-CALC-05',
  name: '90-Day Notice Period Timeline Shift (3-month active window)',
  config: {
    ...baseConfig,
    noticePeriodLagDays: 90,
  },
  expected: {
    targetHires: 300,
    requiredAcceptedOffers: 400,
    requiredOffersExtended: 572,
    requiredInterviews: 2860,
    requiredQualifiedApplicants: 8172,
    requiredTotalApplicantPool: 32688,
    activeInterviewWindowMonths: 3,
    latestOfferCutoffMonth: 3,
    isTimelineImpossible: false,
    monthlyPaceRequired: 50,
    monthlyInterviewsNeeded: 954,
    totalRecruiterMonthlyCapacity: 175,
    recruiterCapacityUtilizationPct: 545,
    isRecruiterCapacityExceeded: true,
    recruiterDeficit: 23,
    engineeringInterviewHoursTotal: 5720,
    overallFeasibilityStatus: 'High Operational Risk',
  },
};

// 6. Zero rate edge case safety test
const testCase6 = {
  id: 'TC-CALC-06',
  name: 'Zero conversion rate safe handling (Flags Mathematically Infeasible without crashing)',
  config: {
    ...baseConfig,
    acceptedToJoiningRate: 0,
    offerAcceptanceRate: 0,
  },
};

// 7. Timeline Infeasibility Test (2 months deadline with 60d notice period)
const testCase7: TestCase = {
  id: 'TC-CALC-07',
  name: 'Timeline Infeasibility (2 months deadline with 60d notice period)',
  config: {
    ...baseConfig,
    deadlineMonths: 2,
    noticePeriodLagDays: 60,
  },
  expected: {
    targetHires: 300,
    requiredAcceptedOffers: 400,
    requiredOffersExtended: 572,
    requiredInterviews: 2860,
    requiredQualifiedApplicants: 8172,
    requiredTotalApplicantPool: 32688,
    activeInterviewWindowMonths: 0,
    latestOfferCutoffMonth: 0,
    isTimelineImpossible: true,
    monthlyPaceRequired: 150,
    monthlyInterviewsNeeded: 2860,
    totalRecruiterMonthlyCapacity: 175,
    recruiterCapacityUtilizationPct: 1634,
    isRecruiterCapacityExceeded: true,
    recruiterDeficit: 77,
    engineeringInterviewHoursTotal: 5720,
    overallFeasibilityStatus: 'Mathematically Infeasible',
  },
};

// 8. Agency RPO Multiplier Test
const testCase8: TestCase = {
  id: 'TC-CALC-08',
  name: 'Agency RPO capacity multiplier (5 recruiters * 35 = 175 * 1.5 = 263)',
  config: {
    ...baseConfig,
    agencySupportEnabled: true,
    agencyCapacityMultiplier: 1.5,
  },
  expected: {
    targetHires: 300,
    requiredAcceptedOffers: 400,
    requiredOffersExtended: 572,
    requiredInterviews: 2860,
    requiredQualifiedApplicants: 8172,
    requiredTotalApplicantPool: 32688,
    activeInterviewWindowMonths: 4,
    latestOfferCutoffMonth: 4,
    isTimelineImpossible: false,
    monthlyPaceRequired: 50,
    monthlyInterviewsNeeded: 715,
    totalRecruiterMonthlyCapacity: 263,
    recruiterCapacityUtilizationPct: 272,
    isRecruiterCapacityExceeded: true,
    recruiterDeficit: 13,
    engineeringInterviewHoursTotal: 5720,
    overallFeasibilityStatus: 'High Operational Risk',
  },
};

// Run the tests
const tests = [testCase1, testCase2, testCase3, testCase4, testCase5, testCase7, testCase8];
let passedCount = 0;
let failedCount = 0;

console.log('====================================================');
console.log('RUNNING EXPANDED MATHEMATICAL & TIMELINE QA TESTS');
console.log('====================================================');

tests.forEach((t) => {
  const result = calculateHiringPlan(t.config);
  const diffs: string[] = [];

  Object.entries(t.expected).forEach(([key, expectedVal]) => {
    const actualVal = (result as any)[key];
    if (actualVal !== expectedVal) {
      diffs.push(`${key}: expected ${expectedVal}, got ${actualVal}`);
    }
  });

  if (diffs.length === 0) {
    console.log(`[PASS] ${t.id}: ${t.name}`);
    passedCount++;
  } else {
    console.log(`[FAIL] ${t.id}: ${t.name}`);
    diffs.forEach((d) => console.log(`   - ${d}`));
    failedCount++;
  }
});

// Run edge case
const zeroRes = calculateHiringPlan(testCase6.config);
const isZeroSafe =
  !isNaN(zeroRes.requiredTotalApplicantPool) &&
  isFinite(zeroRes.requiredTotalApplicantPool) &&
  zeroRes.overallFeasibilityStatus === 'Mathematically Infeasible' &&
  zeroRes.bottlenecks.some((b) => b.id === 'zero-conversion-rate');

if (isZeroSafe) {
  console.log(`[PASS] ${testCase6.id}: ${testCase6.name} (Flags Infeasible & Zero-Rate Bottleneck)`);
  passedCount++;
} else {
  console.log(`[FAIL] ${testCase6.id}: Zero rate was not flagged properly`);
  failedCount++;
}

console.log('----------------------------------------------------');
console.log(`Summary: ${passedCount} passed, ${failedCount} failed.`);
console.log('====================================================');
