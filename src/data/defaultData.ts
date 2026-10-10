import {
  CityProfile,
  EvidenceItem,
  HiringPlanConfig,
  RoleAllocation,
} from '../types';

export const CITIES_DATA: CityProfile[] = [
  {
    id: 'vizag',
    name: 'Visakhapatnam',
    tier: 'Tier-2',
    state: 'Andhra Pradesh',
    techEcosystemSummary:
      'Premier coastal industrial and emerging IT hub of Andhra Pradesh. Established IT SEZ presence at Rushikonda Hill and Madhurawada. Lower voluntary attrition compared to Tier-1 capitals, but senior niche specialist pool is shallow.',
    knownGccPresence: [
      'HSBC Software Development / Global Service Centre',
      'Wipro Technologies',
      'Infosys (Rushikonda Development Centre)',
      'Tech Mahindra',
      'Fluentgrid Limited (Smart Utility SaaS)',
      'Miracle Software Systems',
      'Conduent Business Services',
    ],
    estimatedTechTalentPool: '38,000 - 45,000 total IT/ITeS workforce',
    estimatedSeniorTechTalentPool: '6,500 - 8,200 (6+ years experience)',
    averageNoticePeriodDays: 60,
    typicalOfferDropoutRate: 25,
    evidenceStatus: 'Partial Data',
    caveats:
      'Verified corporate announcements confirm facilities, but detailed city-level census of specific programming frameworks (e.g., Kubernetes/Go/Rust) is unmeasured by official statistics. Requires recruiter sourcing pilot.',
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    tier: 'Tier-1',
    state: 'Telangana',
    techEcosystemSummary:
      'Major global tech epicenter with deep talent pools across cloud, enterprise software, and fintech. HITEC City and Financial District house 250+ multinational GCCs.',
    knownGccPresence: [
      'Google Engineering',
      'Microsoft India Development Center',
      'Amazon Development Center',
      'Novartis Biome GCC',
      'Goldman Sachs Technology',
      'Wells Fargo Enterprise Global Services',
    ],
    estimatedTechTalentPool: '920,000+ active tech professionals',
    estimatedSeniorTechTalentPool: '240,000+ (6+ years experience)',
    averageNoticePeriodDays: 60,
    typicalOfferDropoutRate: 30,
    evidenceStatus: 'Benchmarked',
    caveats:
      'Deep supply, but multi-offer competition is intense. Attrition runs 18-23% annually, driving high replacement hiring demand.',
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    tier: 'Tier-1',
    state: 'Karnataka',
    techEcosystemSummary:
      'The Silicon Valley of India. Highest concentration of GCCs, venture-backed startups, and cutting-edge R&D centers across Asia.',
    knownGccPresence: [
      'Target in India GCC',
      'Walmart Global Tech',
      'JPMorgan Chase Global Tech Center',
      'Intel Technology India',
      'SAP Labs India',
      'Cisco R&D Center',
    ],
    estimatedTechTalentPool: '1,500,000+ tech workforce',
    estimatedSeniorTechTalentPool: '410,000+ (6+ years experience)',
    averageNoticePeriodDays: 60,
    typicalOfferDropoutRate: 35,
    evidenceStatus: 'Benchmarked',
    caveats:
      'Highest talent depth in India, but highest compensation bands, fierce talent wars, and frequent last-minute offer reneges.',
  },
  {
    id: 'coimbatore',
    name: 'Coimbatore',
    tier: 'Tier-2',
    state: 'Tamil Nadu',
    techEcosystemSummary:
      'Emerging engineering and software innovation cluster with strong institutional feeder colleges (PSG Tech, CIT, Amrita). Growing embedded software and enterprise SaaS base.',
    knownGccPresence: [
      'Robert Bosch Engineering (RBEI)',
      'Cognizant Technology Solutions',
      'Amazon Customer Service & Tech',
      'Kovai.co',
      'Ford Motor Technology (near-regional)',
    ],
    estimatedTechTalentPool: '55,000 - 68,000 tech workforce',
    estimatedSeniorTechTalentPool: '9,000 - 12,000 (6+ years experience)',
    averageNoticePeriodDays: 60,
    typicalOfferDropoutRate: 22,
    evidenceStatus: 'Partial Data',
    caveats:
      'Strong junior-to-mid engineering pipeline, but leadership hiring (Principal, Director) usually requires relocation from Chennai or Bengaluru.',
  },
  {
    id: 'bhubaneswar',
    name: 'Bhubaneswar',
    tier: 'Tier-2',
    state: 'Odisha',
    techEcosystemSummary:
      'Fast-growing eastern hub backed by dedicated Infocity SEZ and major educational institutes (IIT Bhubaneswar, NIT Rourkela, IIIT, KIIT).',
    knownGccPresence: [
      'Infosys Development Center (Infocity)',
      'Tata Consultancy Services',
      'Wipro Technologies',
      'Deloitte Capability Center',
      'PwC India Acceleration Center',
    ],
    estimatedTechTalentPool: '42,000 - 52,000 tech workforce',
    estimatedSeniorTechTalentPool: '7,000 - 9,500 (6+ years experience)',
    averageNoticePeriodDays: 60,
    typicalOfferDropoutRate: 24,
    evidenceStatus: 'Partial Data',
    caveats:
      'High stickiness and low attrition, but lateral talent poaching within the city quickly cannibalizes existing IT campuses.',
  },
];

export const DEFAULT_ROLES: RoleAllocation[] = [
  {
    id: 'role-1',
    title: 'Senior Backend / Full-Stack Engineers (Java / Go / Node)',
    seniority: 'Senior (6-9y)',
    headcount: 90,
    marketAvailabilityNotes:
      'High demand skill set. In Tier-2 cities, candidates often have 60-day notice periods with multiple counter-offers.',
  },
  {
    id: 'role-2',
    title: 'Mid-Level Full-Stack Engineers (React / Node / Python)',
    seniority: 'Mid (3-5y)',
    headcount: 110,
    marketAvailabilityNotes:
      'Relatively healthy volume in regional IT services firms; higher willingness to join GCC for modern product tech stack.',
  },
  {
    id: 'role-3',
    title: 'Cloud Infrastructure & DevOps Engineers (AWS / Kubernetes)',
    seniority: 'Mid (3-5y)',
    headcount: 40,
    marketAvailabilityNotes:
      'Specialized certification pool is moderate in Tier-2. Often requires screening candidates with hybrid on-prem / cloud background.',
  },
  {
    id: 'role-4',
    title: 'QA Automation & SDET Engineers (Playwright / Selenium)',
    seniority: 'Mid (3-5y)',
    headcount: 35,
    marketAvailabilityNotes:
      'Good supply in Tier-2 services firms; easy transition into product engineering quality standards.',
  },
  {
    id: 'role-5',
    title: 'Tech Leads & Engineering Managers',
    seniority: 'Lead / Principal (10y+)',
    headcount: 25,
    marketAvailabilityNotes:
      'Critical local bottleneck. Senior technical leaders with modern architectural governance are scarce locally; often requires relocation incentive.',
  },
];

export const DEFAULT_PLAN_CONFIG: HiringPlanConfig = {
  cityId: 'vizag',
  totalTargetHires: 300,
  deadlineMonths: 6,
  noticePeriodLagDays: 60, // standard Indian notice period
  
  // Demonstration baseline conversion rates
  applicantToQualifiedRate: 25, // 25% of raw inbound resumes pass basic filters
  qualifiedToInterviewRate: 35, // 35% of qualified screens reach technical interview
  interviewToOfferRate: 20, // 1 in 5 interviewed candidates receives an offer
  offerAcceptanceRate: 70, // 70% of offers extended are accepted
  acceptedToJoiningRate: 75, // 75% of accepted candidates actually join on Day 1 (25% renege during notice)

  // Recruiter capacity
  dedicatedRecruiters: 5,
  monthlyInterviewsPerRecruiter: 35, // screening, coordinating & tracking per recruiter/mo
  agencySupportEnabled: false,
  agencyCapacityMultiplier: 1.5,

  roles: DEFAULT_ROLES,
};

export const EVIDENCE_LIBRARY: EvidenceItem[] = [
  {
    id: 'ev-1',
    claim:
      'Indian GCC headcount grew to 1.66 million professionals across 1,580+ centres in FY2024, expanding into Tier-2 hubs.',
    metricValue: '1.66 Million GCC workforce',
    sourceName: 'NASSCOM-Zinnov India GCC Industry Landscape Report (2024)',
    sourceUrl: 'https://nasscom.in/knowledge-centre/publications',
    publicationDate: 'June 2024',
    dateChecked: 'October 2024',
    geography: 'Pan-India',
    jobCategories: ['Engineering R&D', 'IT Services', 'BPM'],
    classification: 'third_party_estimate',
    confidenceScore: 'High',
    limitations:
      'Aggregated pan-India macro report. Does not isolate micro-level monthly hiring velocity for single cities.',
    relevanceToScenario:
      'Validates broader macroeconomic feasibility and corporate appetite for India GCC operations.',
  },
  {
    id: 'ev-2',
    claim:
      'Standard employment notice periods in Indian IT and GCC sectors range between 60 to 90 days, creating a mandatory 2 to 3-month fulfillment lag.',
    metricValue: '60 - 90 Days Notice Period',
    sourceName: 'Aon Annual Salary & Workforce Practices Survey India',
    sourceUrl: 'https://www.aon.com/india',
    publicationDate: 'February 2024',
    dateChecked: 'October 2024',
    geography: 'India Tech Sector',
    jobCategories: ['Software Engineering', 'Technical Architecture', 'Operations'],
    classification: 'third_party_estimate',
    confidenceScore: 'High',
    limitations:
      'Notice period enforceability varies by employer. Some firms allow buyout; others enforce mandatory 90-day serving.',
    relevanceToScenario:
      'Directly dictates our active offer window calculation: to achieve 6-month joiners, offers must be secured by Month 3 or 4.',
  },
  {
    id: 'ev-3',
    claim:
      'Offer reneging / candidate ghosting rates during notice periods in India range between 20% to 35% in high-demand tech stacks.',
    metricValue: '20% - 35% Offer Reneging Rate',
    sourceName: 'TeamLease Digital Talent Outlook & Mercer India Surveys',
    sourceUrl: 'https://www.teamlease.com',
    publicationDate: 'April 2024',
    dateChecked: 'October 2024',
    geography: 'Metro & Tier-1/2 Tech Markets',
    jobCategories: ['Full-Stack', 'DevOps', 'Data Engineering'],
    classification: 'third_party_estimate',
    confidenceScore: 'Moderate',
    limitations:
      'Anecdotal recruiter consensus ranges even higher (up to 40% in niche AI roles). Sourced figures are broad industry averages.',
    relevanceToScenario:
      'Justifies why 300 target hires strictly requires at least 400 accepted offers and 572+ extended offers.',
  },
  {
    id: 'ev-4',
    claim:
      'Infosys launched operations at its Rushikonda Hill-2 IT Park campus in Visakhapatnam, initially accommodating ~1,000 tech employees.',
    metricValue: '1,000 Initial Campus Seating',
    sourceName: 'Government of Andhra Pradesh IT Department & Infosys Corporate Filing',
    sourceUrl: 'https://www.infosys.com',
    publicationDate: 'October 2023',
    dateChecked: 'October 2024',
    geography: 'Visakhapatnam (Rushikonda)',
    jobCategories: ['Software Development', 'Enterprise Systems'],
    classification: 'company_announcement',
    confidenceScore: 'High',
    limitations:
      'Official announcement reflects seating infrastructure capacity, not real-time active lateral hiring velocity for third parties.',
    relevanceToScenario:
      'Proves Visakhapatnam has commercial IT infrastructure and Grade-A tech presence capable of supporting large development centers.',
  },
  {
    id: 'ev-5',
    claim:
      'HSBC Global Service Centre has operated in Visakhapatnam since 2005, employing several thousand professionals across financial tech and operations.',
    metricValue: 'Established Multinational Presence',
    sourceName: 'HSBC India Operations Corporate Overview',
    sourceUrl: 'https://www.hsbc.co.in',
    publicationDate: '2023 Corporate Review',
    dateChecked: 'October 2024',
    geography: 'Visakhapatnam',
    jobCategories: ['Fintech Engineering', 'Global Operations', 'Data Operations'],
    classification: 'company_announcement',
    confidenceScore: 'High',
    limitations:
      'Headcount breakdown between pure software engineers vs banking operations is proprietary and not publicly itemized.',
    relevanceToScenario:
      'Demonstrates multi-decade retention viability and institutional stability of multinational capability centers in Vizag.',
  },
  {
    id: 'ev-6',
    claim:
      'Estimated active senior tech talent pool (6+ years experience in product architectures) in Visakhapatnam is between 6,500 and 8,200 engineers.',
    metricValue: '6,500 - 8,200 Senior Talent Pool',
    sourceName: 'Regional Labour Market Inference Model (Synthesized from LinkedIn Recruiter & Job Portal Samples)',
    publicationDate: 'Internal Benchmark Q3 2024',
    dateChecked: 'October 2024',
    geography: 'Visakhapatnam District',
    jobCategories: ['Senior Software Engineers', 'System Architects', 'DevOps Leads'],
    classification: 'model_inference',
    confidenceScore: 'Moderate',
    limitations:
      'Inference based on active public profiles and company footprints. Passive candidates or unlisted engineers are excluded.',
    relevanceToScenario:
      'Indicates that hiring 90 Senior Engineers + 25 Leads in 6 months represents recruiting ~1.5% to 1.8% of the city’s entire senior pool.',
  },
  {
    id: 'ev-7',
    claim:
      'Tier-2 IT hubs like Visakhapatnam experience 14% to 17% voluntary attrition, substantially lower than Bengaluru/Hyderabad (21% to 26%).',
    metricValue: '14% - 17% Attrition in Tier-2 (vs 22%+ in Tier-1)',
    sourceName: 'NASSCOM SME & Emerging Hubs Council Insights',
    sourceUrl: 'https://nasscom.in',
    publicationDate: 'January 2024',
    dateChecked: 'October 2024',
    geography: 'Tier-2 Indian Cities',
    jobCategories: ['Software Development', 'IT Support'],
    classification: 'third_party_estimate',
    confidenceScore: 'Moderate',
    limitations:
      'Lower attrition also implies lower candidate liquidity (fewer active job seekers looking to change roles immediately).',
    relevanceToScenario:
      'Strong positive factor for long-term retention once hired, but a friction point for rapid lateral recruiting within 6 months.',
  },
  {
    id: 'ev-8',
    claim:
      'Detailed skill-cluster census for specialized modern technologies (e.g., Rust, Large Language Models, Distributed Systems) in Visakhapatnam.',
    metricValue: 'Requires Verification',
    sourceName: 'Official Public Data Unavailable',
    publicationDate: 'N/A',
    dateChecked: 'October 2024',
    geography: 'Visakhapatnam',
    jobCategories: ['Specialized AI/ML', 'Low-Latency Systems'],
    classification: 'requires_verification',
    confidenceScore: 'Unverified',
    limitations:
      'No audited government or chamber of commerce dataset exists detailing specialized tech stack distributions in Tier-2 cities.',
    relevanceToScenario:
      'Critical caveat: The planning team must not assume candidates in niche frameworks exist in high numbers without a dedicated talent mapping sprint.',
  },
];

