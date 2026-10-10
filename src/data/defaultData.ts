import {
  CityProfile,
  EvidenceItem,
  HiringPlanConfig,
  RoleAllocation,
  DemoScenario,
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
    coordinates: {
      latitude: 17.6868,
      longitude: 83.2185,
    },
    officeOperatingCost: {
      primeGradeARent: '₹35 - ₹55 / sq ft / month',
      status: 'third_party_estimate',
      sourceName: 'APITIC & Regional Commercial SEZ Lease Filings',
      dateChecked: 'October 2024',
      limitations: 'Contiguous Grade-A commercial floor plates >100k sq ft are scarce outside Rushikonda IT SEZ.',
    },
    stateIncentivesPolicy: {
      policyName: 'Andhra Pradesh IT Policy 2021-2024 (GCC Roadmap)',
      highlights: [
        'Lease rental subsidy in Rushikonda IT SEZ',
        'Industrial power tariff concessions for 5 years',
        'Reimbursement of patent filing costs and recruitment subsidies',
      ],
      status: 'verified_fact',
      sourceName: 'ITE&C Department, Government of Andhra Pradesh',
      dateChecked: 'October 2024',
      limitations: 'Disbursement timelines subject to state fiscal allocation cycles.',
    },
    serviceProviders: {
      identifiedProviders: [
        'Miracle Software Systems (Local Systems SI)',
        'Regional IT Staffing Agencies',
        'National IPCs (CBRE/JLL manage via Hyderabad office)',
      ],
      status: 'third_party_estimate',
      sourceName: 'ITAAP (IT Association of Andhra Pradesh) Directory',
      dateChecked: 'October 2024',
      limitations: 'Top-tier executive search practices operate fly-in teams from Hyderabad rather than full local offices.',
    },
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
    coordinates: {
      latitude: 17.3850,
      longitude: 78.4867,
    },
    officeOperatingCost: {
      primeGradeARent: '₹65 - ₹95 / sq ft / month',
      status: 'third_party_estimate',
      sourceName: 'CBRE India Office Market View H1 2024',
      dateChecked: 'October 2024',
      limitations: 'Rent figures reflect prime HITEC City and Financial District; peripheral sub-markets offer lower rates.',
    },
    stateIncentivesPolicy: {
      policyName: 'Telangana ICT Policy 2.0 & GRID Incentive Framework',
      highlights: [
        'Single-window clearance through TS-iPASS',
        'GRID incentives for tech hubs outside the western corridor',
        'Stamp duty and registration charge reimbursements',
      ],
      status: 'verified_fact',
      sourceName: 'ITE&C Department, Government of Telangana',
      dateChecked: 'October 2024',
      limitations: 'Fiscal incentives tied to specific campus capital investments and audited employment milestones.',
    },
    serviceProviders: {
      identifiedProviders: [
        'Colliers, Knight Frank, CBRE (Real Estate IPCs)',
        'Adecco, KellyOCG, TeamLease (Recruitment / RPO)',
        'Smartworks, Tablespace, Dextrus (Enterprise Flex Spaces)',
      ],
      status: 'verified_fact',
      sourceName: 'HYSEA (Hyderabad Software Enterprises Association) Directory',
      dateChecked: 'October 2024',
      limitations: 'Vendor density heavily concentrated in western tech corridor (HITEC City / Gachibowli).',
    },
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
    coordinates: {
      latitude: 12.9716,
      longitude: 77.5946,
    },
    officeOperatingCost: {
      primeGradeARent: '₹95 - ₹145 / sq ft / month',
      status: 'third_party_estimate',
      sourceName: 'Cushman & Wakefield Marketbeat India H1 2024',
      dateChecked: 'October 2024',
      limitations: 'Excludes Common Area Maintenance (CAM) charges, fit-out amortization, and property taxes.',
    },
    stateIncentivesPolicy: {
      policyName: 'Karnataka Information Technology Policy & Beyond Bengaluru Initiative',
      highlights: [
        'Incentives prioritize tier-2 expansion under Beyond Bengaluru',
        'Industrial power tariff concessions for registered IT units',
        'Patent filing reimbursement and R&D matching grants',
      ],
      status: 'verified_fact',
      sourceName: 'Department of Electronics, IT, BT, Government of Karnataka',
      dateChecked: 'October 2024',
      limitations: 'Tier-1 Bengaluru core zone receives minimal direct capital subsidies compared to regional clusters.',
    },
    serviceProviders: {
      identifiedProviders: [
        'CBRE, JLL, Cushman & Wakefield, Savills (IPC Real Estate)',
        'TeamLease, Michael Page, Randstad, Korn Ferry (Executive / RPO)',
        'Awfis, WeWork, Simpliwork, Indiqube (Managed Flex)',
      ],
      status: 'verified_fact',
      sourceName: 'NASSCOM Global Capability Centers Council Directory',
      dateChecked: 'October 2024',
      limitations: 'Ecosystem is hyper-mature with significant variation in fee structures and service tiers.',
    },
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
    coordinates: {
      latitude: 11.0168,
      longitude: 76.9558,
    },
    officeOperatingCost: {
      primeGradeARent: '₹40 - ₹60 / sq ft / month',
      status: 'third_party_estimate',
      sourceName: 'Guidance Tamil Nadu Commercial Real Estate Benchmarks',
      dateChecked: 'October 2024',
      limitations: 'Concentrated within ELCOT SEZ and TIDEL Park campuses; speculative commercial developments are limited.',
    },
    stateIncentivesPolicy: {
      policyName: 'Tamil Nadu Technology Policy & GCC Policy Framework',
      highlights: [
        'Payroll subsidy for employing women tech engineers in Tier-2 hubs',
        'Capital subsidy on land and building for investments in ELCOT IT parks',
        'Electricity duty exemption for IT/ITeS units for 5 years',
      ],
      status: 'verified_fact',
      sourceName: 'Guidance Tamil Nadu (Investment Promotion Agency)',
      dateChecked: 'October 2024',
      limitations: 'Payroll subsidies require minimum threshold of 50 local full-time tech employees.',
    },
    serviceProviders: {
      identifiedProviders: [
        'Regional IT staffing partners (Coimbatore & Chennai practices)',
        'TIDEL Park Managed Facilities',
        'CII Coimbatore IT Panel Consortia',
      ],
      status: 'third_party_estimate',
      sourceName: 'Codissia & CII Southern Region Directory',
      dateChecked: 'October 2024',
      limitations: 'Global real estate IPCs typically cover Coimbatore transactions from their Chennai regional desks.',
    },
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
    coordinates: {
      latitude: 20.2961,
      longitude: 85.8245,
    },
    officeOperatingCost: {
      primeGradeARent: '₹35 - ₹52 / sq ft / month',
      status: 'third_party_estimate',
      sourceName: 'IDCO (Odisha Industrial Infrastructure Development Corp)',
      dateChecked: 'October 2024',
      limitations: 'Primary commercial supply is state-owned IT parks (Infocity, O-Hub); private commercial spec space is nascent.',
    },
    stateIncentivesPolicy: {
      policyName: 'Odisha IT Policy 2022 & Data Center Policy',
      highlights: [
        '25% capital investment subsidy up to ₹20 Crore',
        'Lease rental subsidy of ₹20 per sq ft for 3 years in approved IT parks',
        '100% exemption on electricity duty for 5 years',
      ],
      status: 'verified_fact',
      sourceName: 'Electronics & IT Department, Government of Odisha',
      dateChecked: 'October 2024',
      limitations: 'Requires formal sanction through State Level Single Window Clearance Authority (SLSWCA).',
    },
    serviceProviders: {
      identifiedProviders: [
        'Regional IT Staffing Agencies',
        'O-Hub & Start-up Odisha Incubation Facilities',
        'National IPC real estate teams managed out of Kolkata',
      ],
      status: 'third_party_estimate',
      sourceName: 'TiE Bhubaneswar & Odisha IT Industry Consortium',
      dateChecked: 'October 2024',
      limitations: 'Specialist headhunting practices for Principal/Staff product roles usually staffed from Kolkata or Bengaluru.',
    },
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

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'demo-1',
    key: 'bengaluru-baseline',
    title: 'Bengaluru Tech Campus (Baseline)',
    subtitle: 'Tier-1 Tech Capital · Standard Funnel Assumptions',
    cityId: 'bengaluru',
    cityName: 'Bengaluru',
    tier: 'Tier-1',
    headcount: 300,
    deadlineMonths: 6,
    noticePeriodLagDays: 60,
    keyChallenge: 'Recruiter capacity deficit (409% TA load) & 2-month notice lag offer cutoff.',
    description:
      'Enterprise benchmark assessment evaluating 300 tech hires across 6 months in Bengaluru against India’s 60-day notice period assumptions and standard 5-member TA team capacity.',
    tags: ['Tier-1 Baseline', '60d Notice Lag', 'Capacity Bottleneck'],
    config: {
      ...DEFAULT_PLAN_CONFIG,
      cityId: 'bengaluru',
      totalTargetHires: 300,
      deadlineMonths: 6,
      noticePeriodLagDays: 60,
    },
  },
  {
    id: 'demo-2',
    key: 'hyderabad-compressed',
    title: 'Hyderabad Rapid Expansion',
    subtitle: 'Compressed 4-Month Timeline · HITEC City',
    cityId: 'hyderabad',
    cityName: 'Hyderabad',
    tier: 'Tier-1',
    headcount: 350,
    deadlineMonths: 4,
    noticePeriodLagDays: 60,
    keyChallenge: 'Active offer window compressed to 2 months; creates extreme velocity strain.',
    description:
      'Stress tests rapid aggressive hiring in Hyderabad where a 4-month deadline with a 60-day notice period leaves only 2 active months to complete all candidate offers.',
    tags: ['Compressed Runway', 'Rapid Ramp', 'High Velocity'],
    config: {
      ...DEFAULT_PLAN_CONFIG,
      cityId: 'hyderabad',
      totalTargetHires: 350,
      deadlineMonths: 4,
      noticePeriodLagDays: 60,
    },
  },
  {
    id: 'demo-3',
    key: 'vizag-high-renege',
    title: 'Visakhapatnam Coastal Center',
    subtitle: 'Tier-2 Emerging Hub · High Notice Dropout',
    cityId: 'vizag',
    cityName: 'Visakhapatnam',
    tier: 'Tier-2',
    headcount: 250,
    deadlineMonths: 6,
    noticePeriodLagDays: 60,
    keyChallenge: '40% post-offer renege rate requires extending 417+ offers to yield 250 joiners.',
    description:
      'Models regional Tier-2 expansion in Andhra Pradesh testing severe candidate counter-offers and last-minute ghosting (40% reneging friction during notice periods).',
    tags: ['Tier-2 Hub', 'High Dropouts', 'Counter-Offers'],
    config: {
      ...DEFAULT_PLAN_CONFIG,
      cityId: 'vizag',
      totalTargetHires: 250,
      deadlineMonths: 6,
      noticePeriodLagDays: 60,
      acceptedToJoiningRate: 60,
      offerAcceptanceRate: 65,
    },
  },
  {
    id: 'demo-4',
    key: 'coimbatore-high-bar',
    title: 'Coimbatore Product Engineering',
    subtitle: 'Tier-2 Specialized Hub · Selective Technical Bar',
    cityId: 'coimbatore',
    cityName: 'Coimbatore',
    tier: 'Tier-2',
    headcount: 200,
    deadlineMonths: 6,
    noticePeriodLagDays: 60,
    keyChallenge: '1 in 8 interview pass rate (12%) inflates engineering interview panel hours.',
    description:
      'Assesses high-bar technical hiring in Coimbatore’s emerging engineering cluster, with a strict 12% interview pass rate requiring 3,175+ technical interviewer hours.',
    tags: ['Selective Bar', 'Engineering Load', 'Niche Talent'],
    config: {
      ...DEFAULT_PLAN_CONFIG,
      cityId: 'coimbatore',
      totalTargetHires: 200,
      deadlineMonths: 6,
      noticePeriodLagDays: 60,
      interviewToOfferRate: 12,
      qualifiedToInterviewRate: 25,
    },
  },
  {
    id: 'demo-5',
    key: 'rpo-mitigated-scale',
    title: 'Enterprise RPO-Mitigated Scale',
    subtitle: 'Pan-India Hiring with External TA Multiplier (1.5x)',
    cityId: 'bengaluru',
    cityName: 'Bengaluru',
    tier: 'Tier-1',
    headcount: 400,
    deadlineMonths: 6,
    noticePeriodLagDays: 60,
    keyChallenge: 'Scaled 400-hire target mitigated through 8 recruiters and 1.5x RPO multiplier.',
    description:
      'Demonstrates strategic mitigation of high-volume hiring (400 tech hires) using an expanded 8-recruiter core team backed by agency/RPO throughput support.',
    tags: ['Enterprise Scale', 'RPO Mitigation', 'Capacity Balanced'],
    config: {
      ...DEFAULT_PLAN_CONFIG,
      cityId: 'bengaluru',
      totalTargetHires: 400,
      deadlineMonths: 6,
      noticePeriodLagDays: 60,
      dedicatedRecruiters: 8,
      agencySupportEnabled: true,
      agencyCapacityMultiplier: 1.5,
      acceptedToJoiningRate: 80,
    },
  },
];

