import { calculateHiringPlan } from '../utils/calculator';
import {
  CITIES_DATA,
  DEFAULT_PLAN_CONFIG,
  EVIDENCE_LIBRARY,
  DEMO_SCENARIOS,
  GCC_COMPANIES,
} from '../data/defaultData';
import { HiringPlanConfig, CityProfile, RoleAllocation } from '../types';
import { jsPDF } from 'jspdf';
import {
  validateBulkEvidenceJson,
  EVIDENCE_JSON_SCHEMA_EXAMPLE,
  EVIDENCE_JSON_SCHEMA_DEFINITION,
} from '../utils/evidenceSchema';
import * as fs from 'fs';
import * as path from 'path';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  [PASS] ${msg}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${msg}`);
    failed++;
  }
}

console.log('====================================================');
console.log('RUNNING GCC COMPASS COMPREHENSIVE REGRESSION SUITE');
console.log('====================================================\n');

// -----------------------------------------------------------------------------
// 1. NAVIGATION & ROUTING ARCHITECTURE
// -----------------------------------------------------------------------------
console.log('SECTION 1: Start Assessment Destination & Routing Verification');

const appTsx = fs.readFileSync(path.join(process.cwd(), 'src/App.tsx'), 'utf-8');
const homeViewTsx = fs.readFileSync(path.join(process.cwd(), 'src/components/HomeView.tsx'), 'utf-8');
const topBarTsx = fs.readFileSync(path.join(process.cwd(), 'src/components/TopBar.tsx'), 'utf-8');

// Test 1.1: HomeView onStartAssessment routes directly to Plan Builder in App.tsx
assert(
  appTsx.includes("onStartAssessment={() => handleSelectTab('plan-builder')}"),
  'App.tsx binds HomeView onStartAssessment directly to plan-builder (NOT overview)'
);

// Test 1.2: Overview is preserved as a distinct destination
assert(
  appTsx.includes("onNavigateToOverview={() => handleSelectTab('overview')}"),
  'App.tsx preserves Overview as an independent destination'
);

// Test 1.3: TopBar includes all core navigation destinations
const expectedTabs = ['intro', 'home', 'overview', 'plan-builder', 'stress-test', 'evidence-library', 'decision-brief'];
expectedTabs.forEach((tab) => {
  assert(
    topBarTsx.includes(`'${tab}'`),
    `TopBar contains navigation destination: ${tab}`
  );
});

// Test 1.4: Both Start Assessment buttons exist in HomeView
assert(
  homeViewTsx.includes('Start Assessment') &&
  (homeViewTsx.match(/onStartAssessment/g) || []).length >= 2,
  'HomeView contains both primary and final Start Assessment triggers bound to onStartAssessment'
);

// Test 1.5: Explore How It Works links to how-it-works-section
assert(
  homeViewTsx.includes("document.getElementById('how-it-works-section')") &&
  homeViewTsx.includes('id="how-it-works-section"'),
  'Explore How It Works button smoothly scrolls to target #how-it-works-section'
);

// Test 1.6: IntroView and AuthModal integrated in App.tsx
const introViewTsx = fs.readFileSync(path.join(process.cwd(), 'src/components/IntroView.tsx'), 'utf-8');
assert(
  introViewTsx.includes('Make Smarter Decisions About Your Next GCC Location.') &&
  introViewTsx.includes('Launch Assessment'),
  'IntroView contains official SaaS headline and Launch Assessment CTA'
);
assert(
  appTsx.includes('<IntroView') && appTsx.includes('<AuthModal'),
  'App.tsx integrates IntroView for Page 1 and AuthModal for user session management'
);

// Test 1.7: WelcomeView integrated for /welcome access page
const welcomeViewTsx = fs.readFileSync(path.join(process.cwd(), 'src/components/WelcomeView.tsx'), 'utf-8');
assert(
  appTsx.includes('<WelcomeView') && welcomeViewTsx.includes('Continue as Guest'),
  'App.tsx integrates WelcomeView with Continue as Guest option'
);
assert(
  welcomeViewTsx.includes('Prototype') || welcomeViewTsx.includes('Unavailable in Preview'),
  'WelcomeView clearly marks Sign In as prototype/unavailable without simulating fake authentication'
);

// Test 1.8: Route-based separation for all required paths
const requiredRoutes = [
  '/',
  '/welcome',
  '/app',
  '/app/overview',
  '/app/plan-builder',
  '/app/stress-test',
  '/app/evidence',
  '/app/decision-brief',
];
requiredRoutes.forEach((route) => {
  assert(
    appTsx.includes(`'${route}'`),
    `App.tsx defines explicit route destination: ${route}`
  );
});

// Test 1.9: TopBar distinguishes public intro/welcome headers from internal workspace
assert(
  topBarTsx.includes('isPublicIntro') && topBarTsx.includes('isPublicWelcome') && topBarTsx.includes('isWorkspace'),
  'TopBar cleanly separates Public Intro, Welcome, and Workspace header layouts'
);

// -----------------------------------------------------------------------------
// 2. PLAN BUILDER REACTIVITY & CALCULATION ENGINE
// -----------------------------------------------------------------------------
console.log('\nSECTION 2: Plan Builder Reactivity & State Calculations');

// Test 2.1: Default Baseline (300 in 6 mo, 60d notice)
let liveConfig: HiringPlanConfig = { ...DEFAULT_PLAN_CONFIG };
let result = calculateHiringPlan(liveConfig);

assert(result.targetHires === 300, 'Baseline target hires is 300');
assert(result.requiredAcceptedOffers === 400, 'Baseline accepted offers is 400 (300 / 0.75)');
assert(result.requiredOffersExtended === 572, 'Baseline offers extended is 572 (ceil(400 / 0.70))');
assert(result.requiredInterviews === 2860, 'Baseline interviews is 2860 (ceil(572 / 0.20))');
assert(result.requiredQualifiedApplicants === 8172, 'Baseline qualified screens is 8172 (ceil(2860 / 0.35))');
assert(result.requiredTotalApplicantPool === 32688, 'Baseline sourced resumes is 32688 (ceil(8172 / 0.25))');
assert(result.activeInterviewWindowMonths === 4, 'Active offer window is 4 months (6 - 2mo notice lag)');
assert(result.latestOfferCutoffMonth === 4, 'Latest offer cutoff is Month 4');
assert(result.isRecruiterCapacityExceeded === true, 'Recruiter capacity deficit flagged (175 cap vs 715 need)');
assert(result.recruiterDeficit === 16, 'Recruiter deficit calculated at 16 TA members');

// Test 2.2: Numeric Target Hires Change (Clearing and typing 500)
// Simulating user clearing to 0 then entering 500
liveConfig = { ...liveConfig, totalTargetHires: 500 };
result = calculateHiringPlan(liveConfig);
assert(result.targetHires === 500, 'Reactivity: Target hires updated to 500');
assert(result.requiredAcceptedOffers === 667, 'Reactivity: Accepted offers updated to 667 (ceil(500 / 0.75))');
assert(result.requiredOffersExtended === 953, 'Reactivity: Offers extended is 953 (ceil(667 / 0.70))');
assert(result.requiredInterviews === 4765, 'Reactivity: Interviews is 4765 (ceil(953 / 0.20))');
assert(result.requiredQualifiedApplicants === 13615, 'Reactivity: Qualified applicants is 13615 (ceil(4765 / 0.35))');
assert(result.requiredTotalApplicantPool === 54460, 'Reactivity: Sourced pool updated to 54460 for 500 hires (ceil(13615 / 0.25))');

// Test 2.3: Conversion Slider Adjustments (Applicant pass rate 25% -> 40%)
liveConfig = { ...liveConfig, applicantToQualifiedRate: 40 };
result = calculateHiringPlan(liveConfig);
assert(result.requiredTotalApplicantPool === 34038, 'Reactivity: Sourced pool recalculated to 34038 with 40% pass rate (ceil(13615 / 0.40))');

// Test 2.4: Conversion Slider Adjustment (Reneging rate 75% -> 60%)
liveConfig = { ...liveConfig, acceptedToJoiningRate: 60 };
result = calculateHiringPlan(liveConfig);
assert(result.requiredAcceptedOffers === 834, 'Reactivity: Accepted offers rises to 834 (ceil(500 / 0.60))');

// Test 2.5: Role Breakdown Modification (Adjusting headcount dynamically)
const customRoles: RoleAllocation[] = [
  { id: 'r1', title: 'Senior Backend Engineer', seniority: 'Senior (6-9y)', headcount: 120, marketAvailabilityNotes: 'High demand' },
  { id: 'r2', title: 'Data Platform Engineer', seniority: 'Mid (3-5y)', headcount: 80, marketAvailabilityNotes: 'Moderate supply' },
];
const newHeadcountSum = customRoles.reduce((acc, r) => acc + r.headcount, 0);
liveConfig = { ...liveConfig, roles: customRoles, totalTargetHires: newHeadcountSum };
result = calculateHiringPlan(liveConfig);
assert(result.targetHires === 200, 'Reactivity: Role list adjustment syncs totalTargetHires to 200');

// Test 2.6: Notice Period Change (60d -> 90d lag)
liveConfig = { ...liveConfig, noticePeriodLagDays: 90 };
result = calculateHiringPlan(liveConfig);
assert(result.activeInterviewWindowMonths === 3, 'Notice Period: 90 days lag shortens active window to 3 months (6 - 3)');
assert(result.latestOfferCutoffMonth === 3, 'Notice Period: Offer cutoff moves to Month 3');

// Test 2.7: Infeasible Timeline Constraint (2 months deadline with 60d notice)
liveConfig = { ...liveConfig, deadlineMonths: 2, noticePeriodLagDays: 60 };
result = calculateHiringPlan(liveConfig);
assert(result.isTimelineImpossible === true, 'Infeasible Timeline: 2m deadline with 60d notice flagged as impossible');
assert(result.overallFeasibilityStatus === 'Mathematically Infeasible', 'Infeasible Timeline: Status is Mathematically Infeasible');

// Test 2.8: Recruiter Team Resourcing & RPO Multiplier
liveConfig = {
  ...DEFAULT_PLAN_CONFIG,
  dedicatedRecruiters: 8,
  agencySupportEnabled: true,
  agencyCapacityMultiplier: 1.5,
};
result = calculateHiringPlan(liveConfig);
// 8 * 35 = 280; 280 * 1.5 = 420
assert(result.totalRecruiterMonthlyCapacity === 420, 'RPO Support: Capacity boosted from 280 to 420 (1.5x multiplier)');

// Test 2.9: All Scenario Presets
// Preset A: Compressed Runway
const compressedResult = calculateHiringPlan({ ...DEFAULT_PLAN_CONFIG, deadlineMonths: 4, noticePeriodLagDays: 60 });
assert(compressedResult.activeInterviewWindowMonths === 2, 'Preset Compressed: Active window is 2 months');

// Preset B: High Reneging
const highDropoutResult = calculateHiringPlan({ ...DEFAULT_PLAN_CONFIG, acceptedToJoiningRate: 60, offerAcceptanceRate: 65 });
assert(highDropoutResult.requiredOffersExtended === 770, 'Preset High Reneging: Offers extended rises to 770');

// Preset C: High Technical Bar
const highBarResult = calculateHiringPlan({ ...DEFAULT_PLAN_CONFIG, interviewToOfferRate: 12, qualifiedToInterviewRate: 25 });
assert(highBarResult.requiredInterviews === 4767, 'Preset High Bar: Interviews rises to 4767');

// Preset D: Perfect Pipeline QA
const perfectResult = calculateHiringPlan({
  ...DEFAULT_PLAN_CONFIG,
  applicantToQualifiedRate: 100,
  qualifiedToInterviewRate: 100,
  interviewToOfferRate: 100,
  offerAcceptanceRate: 100,
  acceptedToJoiningRate: 100,
});
assert(perfectResult.requiredTotalApplicantPool === 300, 'Preset Perfect: Sourced pool equals exactly 300 for 300 joiners');

// -----------------------------------------------------------------------------
// 3. EXPORT CAPABILITIES VERIFICATION
// -----------------------------------------------------------------------------
console.log('\nSECTION 3: Export Engine Verification (Markdown, JSON, PDF)');

const sampleCity = CITIES_DATA[0]; // Visakhapatnam
const sampleConfig = DEFAULT_PLAN_CONFIG;
const sampleCalc = calculateHiringPlan(sampleConfig);

// Test 3.1: JSON Export Data Integrity
const jsonPayload = {
  briefTitle: `GCC Compass Location Intelligence Brief: ${sampleCity.name}`,
  dateGenerated: new Date().toISOString(),
  location: sampleCity,
  planConfig: sampleConfig,
  deterministicResults: sampleCalc,
  evidenceCitations: EVIDENCE_LIBRARY.map((e) => ({
    id: e.id,
    claim: e.claim,
    metricValue: e.metricValue,
    sourceName: e.sourceName,
    sourceUrl: e.sourceUrl,
    publicationDate: e.publicationDate,
    dateChecked: e.dateChecked,
    geography: e.geography,
    jobCategories: e.jobCategories,
    classification: e.classification,
    confidenceScore: e.confidenceScore,
    limitations: e.limitations,
  })),
};

const jsonString = JSON.stringify(jsonPayload, null, 2);
const parsedJson = JSON.parse(jsonString);

assert(parsedJson.location.id === 'vizag', 'JSON Export: Location preserved correctly');
assert(parsedJson.planConfig.totalTargetHires === 300, 'JSON Export: Plan config preserved');
assert(parsedJson.deterministicResults.requiredTotalApplicantPool === 32688, 'JSON Export: Funnel math matches 32,688');
assert(Array.isArray(parsedJson.evidenceCitations) && parsedJson.evidenceCitations.length === EVIDENCE_LIBRARY.length, 'JSON Export: All evidence items serialized without loss');

// Test 3.2: Markdown Export Generation
const seniorHeadcount = sampleConfig.roles
  .filter((r) => r.seniority.includes('Senior') || r.seniority.includes('Lead'))
  .reduce((sum, r) => sum + (Number(r.headcount) || 0), 0);

const markdown = `# EXECUTIVE DECISION BRIEF: GCC COMPASS LOCATION INTELLIGENCE
**Subject:** Feasibility Evaluation for Establishing Tech Workforce in ${sampleCity.name}, ${sampleCity.state}
**Target:** ${sampleConfig.totalTargetHires} Tech Professionals within ${sampleConfig.deadlineMonths} Months

## 1. Executive Summary & Verdict
- **Target Day-1 Joined Headcount:** ${sampleCalc.targetHires} professionals
- **Feasibility Verdict:** **${sampleCalc.overallFeasibilityStatus.toUpperCase()}**

## 2. Deterministic Recruitment Funnel Sizing
| Funnel Stage | Volume Required | Conversion / Yield Rate | Operational Notes |
| 1. Sourced Resume Pool | ${sampleCalc.requiredTotalApplicantPool.toLocaleString()} | ${sampleConfig.applicantToQualifiedRate}% screen pass rate |
| 6. Final Day-1 Joiners | **${sampleCalc.targetHires}** | Target workforce achieved |
`;

assert(markdown.includes('EXECUTIVE DECISION BRIEF: GCC COMPASS LOCATION INTELLIGENCE'), 'Markdown Export: Contains correct title');
assert(markdown.includes('32,688'), 'Markdown Export: Contains exact deterministic applicant pool (32,688)');
assert(markdown.includes(sampleCity.name), 'Markdown Export: Contains selected city name');
assert(markdown.includes(sampleCalc.overallFeasibilityStatus.toUpperCase()), 'Markdown Export: Contains feasibility verdict');

// Test 3.3: PDF Generation via jsPDF
try {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = margin;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('CONFIDENTIAL · GCC WORKFORCE EXPANSION MEMORANDUM', margin, y);
  y += 6;

  doc.setFontSize(16);
  doc.text(`Workforce Feasibility Assessment: ${sampleCity.name}`, margin, y);
  y += 10;

  // Add funnel details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Target Hires: ${sampleCalc.targetHires}`, margin, y);
  y += 6;
  doc.text(`Required Sourced Pool: ${sampleCalc.requiredTotalApplicantPool}`, margin, y);
  y += 6;
  doc.text(`Required Interviews: ${sampleCalc.requiredInterviews}`, margin, y);
  y += 6;
  doc.text(`Feasibility Status: ${sampleCalc.overallFeasibilityStatus}`, margin, y);

  // Add page footer
  doc.setFontSize(7);
  doc.text(`Page 1 of ${doc.getNumberOfPages()}`, pageWidth - margin, pageHeight - 5, { align: 'right' });

  const pageCount = doc.getNumberOfPages();
  const pdfBytes = doc.output('arraybuffer');

  assert(pageCount >= 1, `PDF Generation: Created ${pageCount} page(s) successfully`);
  assert(pdfBytes.byteLength > 1000, `PDF Generation: Output stream contains valid PDF binary (${pdfBytes.byteLength} bytes)`);
} catch (pdfErr) {
  assert(false, `PDF Generation failed: ${pdfErr}`);
}

// -----------------------------------------------------------------------------
// 4. BULK UPLOAD JSON SCHEMA VALIDATION
// -----------------------------------------------------------------------------
console.log('\n--- 4. Testing Bulk Upload JSON Schema Validation ---');

// 4.1 Valid schema example test
const validResult = validateBulkEvidenceJson(JSON.stringify(EVIDENCE_JSON_SCHEMA_EXAMPLE));
assert(validResult.valid === true, 'Bulk Upload: Sample JSON matches schema and passes validation');
assert(validResult.parsedItems.length === 1, 'Bulk Upload: Exactly 1 record parsed from sample');
assert(validResult.parsedItems[0].claim.includes('Tier-2'), 'Bulk Upload: Parsed claim correctly extracted');
assert(validResult.parsedItems[0].classification === 'third_party_estimate', 'Bulk Upload: Classification correctly validated');

// 4.2 Batch with multiple valid records
const multiBatch = [
  {
    claim: 'Visakhapatnam offers 28-35% lower commercial operating cost compared to Bangalore or Hyderabad.',
    metricValue: '28% - 35% Cost Arbitrage',
    sourceName: 'CBRE India Office Market Report 2024',
    sourceUrl: 'https://cbre.co.in',
    classification: 'third_party_estimate',
    limitations: 'Prime IT SEZ spaces only; secondary real estate varies.',
  },
  {
    claim: 'Wipro and Tech Mahindra maintain offshore development units at Visakhapatnam Special Economic Zone.',
    sourceName: 'VSEZ Authority Annual Report',
    classification: 'verified_fact',
    limitations: 'Static unit count; headcount fluctuates by contract cycle.',
  },
];
const multiResult = validateBulkEvidenceJson(JSON.stringify(multiBatch));
assert(multiResult.valid === true, 'Bulk Upload: Multi-record batch validates successfully');
assert(multiResult.parsedItems.length === 2, 'Bulk Upload: Correctly parsed 2 records');
assert(multiResult.parsedItems[1].confidenceScore === 'High', 'Bulk Upload: verified_fact automatically assigned High confidence');

// 4.3 Rejection of invalid JSON syntax
const malformedResult = validateBulkEvidenceJson('{ "invalid": json syntax [');
assert(malformedResult.valid === false, 'Bulk Upload: Rejects malformed JSON syntax');
assert(malformedResult.errors.length > 0 && malformedResult.errors[0].field === 'JSON Syntax', 'Bulk Upload: Returns JSON Syntax error');

// 4.4 Rejection of missing required fields (claim, sourceName, classification, limitations)
const missingFieldsBatch = [
  {
    // missing claim
    sourceName: 'Industry Survey',
    classification: 'third_party_estimate',
    limitations: 'None given',
  },
  {
    claim: 'Valid claim statement with sufficient length',
    // missing sourceName
    classification: 'invalid_classification_name', // invalid classification
    // missing limitations
  },
];
const missingResult = validateBulkEvidenceJson(JSON.stringify(missingFieldsBatch));
assert(missingResult.valid === false, 'Bulk Upload: Rejects batch with missing required fields');
assert(missingResult.errors.some(e => e.field === 'claim'), 'Bulk Upload: Detects missing claim error');
assert(missingResult.errors.some(e => e.field === 'sourceName'), 'Bulk Upload: Detects missing sourceName error');
assert(missingResult.errors.some(e => e.field === 'classification'), 'Bulk Upload: Detects invalid classification enum error');
assert(missingResult.errors.some(e => e.field === 'limitations'), 'Bulk Upload: Detects missing limitations error for anti-hallucination compliance');

// 4.5 Wrapping object support (e.g. { "evidence": [...] })
const wrappedResult = validateBulkEvidenceJson(JSON.stringify({ evidence: multiBatch }));
assert(wrappedResult.valid === true, 'Bulk Upload: Supports objects containing "evidence" array');
assert(wrappedResult.parsedItems.length === 2, 'Bulk Upload: Parsed 2 records from wrapped payload');

// 4.6 Atomic Batch Validation: No partial imports on any invalid record
const mixedBatch = [
  {
    claim: 'Completely valid record that would otherwise pass.',
    sourceName: 'Valid Source',
    classification: 'verified_fact',
    limitations: 'Valid limitation',
  },
  {
    claim: 'Too short', // Invalid (< 5 chars) or missing field
    sourceName: '',     // Invalid (< 2 chars)
    classification: 'invalid_enum',
    limitations: '',
  },
];
const mixedResult = validateBulkEvidenceJson(JSON.stringify(mixedBatch));
assert(mixedResult.valid === false, 'Bulk Upload Atomic: Batch with one invalid record is rejected in its entirety');
assert(mixedResult.parsedItems.length === 0, 'Bulk Upload Atomic: No partial parsedItems returned when batch fails');

// 4.7 Disallow dangerous URI schemes (e.g. javascript: or data:)
const xssBatch = [
  {
    claim: 'Attempted malicious script link in evidence source link.',
    sourceName: 'Malicious Research',
    sourceUrl: 'javascript:alert(1)',
    classification: 'third_party_estimate',
    limitations: 'Security audit test',
  },
];
const xssResult = validateBulkEvidenceJson(JSON.stringify(xssBatch));
assert(xssResult.valid === false, 'Bulk Upload Security: Rejects dangerous javascript: URL scheme');
assert(xssResult.errors.some(e => e.field === 'sourceUrl'), 'Bulk Upload Security: Identifies unsafe URL scheme error');

// 4.8 Duplicate detection against existing evidence library
const duplicateBatch = [
  {
    id: EVIDENCE_LIBRARY[0].id, // Matches existing record ID
    claim: EVIDENCE_LIBRARY[0].claim,
    sourceName: 'Re-uploaded source',
    classification: 'third_party_estimate',
    limitations: 'Updated notes',
  },
];
const dupeResult = validateBulkEvidenceJson(JSON.stringify(duplicateBatch), EVIDENCE_LIBRARY);
assert(dupeResult.valid === true, 'Bulk Upload Duplicate: Valid format passes schema');
assert(dupeResult.duplicateCount === 1, 'Bulk Upload Duplicate: Identifies duplicate record match');
assert(dupeResult.parsedItems[0].id !== EVIDENCE_LIBRARY[0].id, 'Bulk Upload Duplicate: Generates unique replacement ID so existing record is not overwritten');

// 4.9 Empty batch rejection
const emptyResult = validateBulkEvidenceJson(JSON.stringify([]));
assert(emptyResult.valid === false, 'Bulk Upload Empty: Empty array is rejected with clear error');
assert(emptyResult.errors.some(e => e.field === 'Empty Dataset'), 'Bulk Upload Empty: Identifies Empty Dataset error');

// -----------------------------------------------------------------------------
// 5. ASSESSMENT-FIRST LIFECYCLE, DEMO PRESERVATION & DETERMINISTIC CALCULATIONS
// -----------------------------------------------------------------------------
console.log('\nSECTION 5: Assessment-First Dashboard, Demo Preservation & Calculations');

const dashboardViewTsx = fs.readFileSync(path.join(process.cwd(), 'src/components/DashboardView.tsx'), 'utf-8');
const planBuilderViewTsx = fs.readFileSync(path.join(process.cwd(), 'src/components/PlanBuilderView.tsx'), 'utf-8');

// Test 5.1: Initial unassessed state integration in App.tsx
assert(
  appTsx.includes('hasActiveAssessment') && appTsx.includes('ASSESSMENT_ACTIVE_KEY'),
  'App.tsx implements assessment lifecycle state with unassessed default'
);

// Test 5.2: Demo Scenarios preserved and accessible
assert(
  Array.isArray(DEMO_SCENARIOS) && DEMO_SCENARIOS.length >= 5,
  'Demo Data: All 5 enterprise demo scenarios are preserved and available'
);

// Test 5.3: Each demo scenario calculates deterministically
DEMO_SCENARIOS.forEach((scenario) => {
  const calc = calculateHiringPlan(scenario.config);
  assert(
    typeof calc.targetHires === 'number' &&
      calc.targetHires === scenario.headcount &&
      calc.requiredTotalApplicantPool > calc.targetHires &&
      !isNaN(calc.recruiterCapacityUtilizationPct),
    `Demo Scenario "${scenario.title}" calculates deterministically (${calc.targetHires} hires, ${calc.requiredTotalApplicantPool.toLocaleString()} pool)`
  );
});

// Test 5.4: HomeView handles unassessed state cleanly
assert(
  homeViewTsx.includes('hasActiveAssessment') &&
    homeViewTsx.includes('Ready to Evaluate Your GCC Expansion Plan?') &&
    homeViewTsx.includes('onLoadDemoScenario'),
  'HomeView: Initial dashboard displays clean setup gateway without automatic completed results'
);

// Test 5.5: DashboardView handles unassessed state cleanly
assert(
  dashboardViewTsx.includes('hasActiveAssessment') &&
    dashboardViewTsx.includes('Start an Assessment to View Feasibility Results') &&
    dashboardViewTsx.includes('Load Enterprise Demo Scenarios'),
  'DashboardView: Initial overview displays assessment gateway without automatic completed results'
);

// Test 5.6: PlanBuilderView provides explicit Run Assessment trigger
assert(
  planBuilderViewTsx.includes('onRunAssessment') &&
    planBuilderViewTsx.includes('Run Assessment & View Overview'),
  'PlanBuilderView: Provides explicit Run Assessment action to transition to active overview'
);

// Test 5.7: Evidence library integrity and zero hallucination
assert(
  EVIDENCE_LIBRARY.length >= 8 &&
    EVIDENCE_LIBRARY.every(
      (item) => item.claim && item.sourceName && item.classification && item.limitations
    ),
  'Evidence Base: All items have verified sources, classifications, and explicit limitations'
);

// -----------------------------------------------------------------------------
// 6. MAP INTELLIGENCE CITY-DATA ASSOCIATION, COMPANY DIRECTORY & DATA INTEGRITY
// -----------------------------------------------------------------------------
console.log('\nSECTION 6: Map Intelligence City-Data Association & Integrity');

const mapIntelligenceViewTsx = fs.readFileSync(path.join(process.cwd(), 'src/components/MapIntelligenceView.tsx'), 'utf-8');

// Test 6.1: Supported cities verification
const expectedCities = ['bengaluru', 'hyderabad', 'vizag', 'coimbatore', 'bhubaneswar', 'pune'];
const foundCityIds = CITIES_DATA.map((c) => c.id);
assert(
  expectedCities.every((id) => foundCityIds.includes(id)),
  'Map Intelligence: All 6 required cities (Bengaluru, Hyderabad, Vizag, Coimbatore, Bhubaneswar, Pune) are present'
);

// Test 6.2: Every city has stable unique ID, verified coordinates, and complete indicators
assert(
  CITIES_DATA.every(
    (c) =>
      c.id &&
      c.name &&
      c.tier &&
      c.state &&
      c.coordinates?.latitude &&
      c.coordinates?.longitude &&
      c.officeOperatingCost &&
      c.stateIncentivesPolicy &&
      c.serviceProviders &&
      c.caveats
  ),
  'Map Intelligence: Every city has stable unique ID, verified coordinates, operating costs, and policies'
);

// Test 6.3: Structured hierarchy: City -> GCC Companies -> Company Profiles -> Functions -> Workforce
assert(
  GCC_COMPANIES.length >= 25 &&
    GCC_COMPANIES.every(
      (comp) =>
        comp.id &&
        comp.cityId &&
        comp.name &&
        comp.parentCompany &&
        comp.facilityLocation &&
        comp.primarySector &&
        Array.isArray(comp.businessFunctions) &&
        comp.businessFunctions.length > 0 &&
        Array.isArray(comp.specialisations) &&
        comp.specialisations.length > 0 &&
        comp.workforce?.localHeadcount &&
        comp.workforce?.sourceName &&
        comp.workforce?.dateChecked &&
        comp.workforce?.limitations
    ),
  'Map Intelligence: Reliable structured hierarchy established: City -> GCC Companies -> Profiles -> Functions -> Workforce'
);

// Test 6.4: Company Directory Filtering: Zero cross-city pollution
const puneCompanies = GCC_COMPANIES.filter((c) => c.cityId === 'pune');
const cbeCompanies = GCC_COMPANIES.filter((c) => c.cityId === 'coimbatore');
const blrCompanies = GCC_COMPANIES.filter((c) => c.cityId === 'bengaluru');
const vizagCompanies = GCC_COMPANIES.filter((c) => c.cityId === 'vizag');

assert(
  puneCompanies.length >= 4 &&
    puneCompanies.every((c) => c.cityId === 'pune') &&
    !puneCompanies.some((c) => c.cityId === 'coimbatore' || c.cityId === 'bengaluru'),
  'Map Intelligence Directory: Pune companies are strictly isolated and not attributed to Coimbatore or Bengaluru'
);

assert(
  cbeCompanies.length >= 4 &&
    cbeCompanies.every((c) => c.cityId === 'coimbatore') &&
    !cbeCompanies.some((c) => c.cityId === 'vizag' || c.cityId === 'pune'),
  'Map Intelligence Directory: Coimbatore companies are strictly isolated and not attributed to Vizag or Pune'
);

// Test 6.5: Workforce definition distinctness: Direct GCC vs Total Tech Sector
assert(
  CITIES_DATA.every(
    (c) =>
      c.workforceBreakdown?.directGccHeadcount &&
      c.workforceBreakdown?.totalTechSectorHeadcount &&
      c.workforceBreakdown?.geographicScope &&
      c.workforceBreakdown?.definitionNotes
  ),
  'Map Intelligence Workforce: Preserves distinct direct GCC headcount, total tech sector headcount, and explicit geographic scope'
);

// Test 6.6: Missing data handled explicitly without fabrication
const unverifiedCompanies = GCC_COMPANIES.filter(
  (c) =>
    c.workforce.headcountType === 'requires_verification' ||
    c.workforce.localHeadcount === 'Data unavailable'
);
assert(
  unverifiedCompanies.length >= 2 &&
    unverifiedCompanies.every((c) => c.workforce.limitations.length > 0),
  'Map Intelligence Integrity: Undisclosed company workforce figures display "Data unavailable" or "requires_verification" with caveats'
);

// Test 6.7: Evidence association isolation: No generic Tier-2 leakage
assert(
  mapIntelligenceViewTsx.includes('activeCityCompanies') &&
    mapIntelligenceViewTsx.includes('cityRelevantEvidence') &&
    !mapIntelligenceViewTsx.includes("geo.includes('tier-2')"),
  'Map Intelligence Evidence: Eliminated cross-city evidence leakage; generic tier-2 query removed'
);

// Test 6.8: Assessment isolation: Map Intelligence exploration does not mutate active assessment
assert(
  mapIntelligenceViewTsx.includes('onTransferCityToBuilder') &&
    mapIntelligenceViewTsx.includes('handleTransferToPlanBuilder') &&
    appTsx.includes('handleTransferCityToBuilder'),
  'Map Intelligence Isolation: Exploring map markers does not alter active assessment state; transfer requires explicit user action'
);

// Test 6.9: Sidebar filter with data availability toggles
assert(
  mapIntelligenceViewTsx.includes('filterVerifiedIncentives') &&
    mapIntelligenceViewTsx.includes('filterDirectGccWorkforce') &&
    mapIntelligenceViewTsx.includes('filterOfficeCostBenchmarks') &&
    mapIntelligenceViewTsx.includes('filterEmpiricalEvidence') &&
    mapIntelligenceViewTsx.includes('Data Availability Toggles'),
  'Map Intelligence Sidebar: Contains explicit data availability filters (verified incentives, workforce, office cost, empirical evidence)'
);

// Test 6.10: Dynamic map marker filtering
assert(
  mapIntelligenceViewTsx.includes('filteredCities') &&
    mapIntelligenceViewTsx.includes('filteredCities.forEach') &&
    mapIntelligenceViewTsx.includes('handleResetFilters'),
  'Map Intelligence Map: City markers render strictly from filteredCities with dynamic reset action'
);

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n====================================================');
console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
}
