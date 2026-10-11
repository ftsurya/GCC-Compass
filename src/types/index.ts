export type EvidenceClassification =
  | 'verified_fact'
  | 'third_party_estimate'
  | 'company_announcement'
  | 'model_inference'
  | 'requires_verification';

export interface EvidenceItem {
  id: string;
  claim: string;
  metricValue?: string;
  sourceName: string;
  sourceUrl?: string;
  publicationDate: string;
  dateChecked: string;
  geography: string;
  jobCategories: string[];
  classification: EvidenceClassification;
  confidenceScore?: 'High' | 'Moderate' | 'Low' | 'Unverified';
  limitations: string;
  relevanceToScenario: string;
}

export interface RoleAllocation {
  id: string;
  title: string;
  seniority: 'Junior (0-2y)' | 'Mid (3-5y)' | 'Senior (6-9y)' | 'Lead / Principal (10y+)';
  headcount: number;
  marketAvailabilityNotes?: string;
}

export interface CityCoordinates {
  latitude: number;
  longitude: number;
}

export interface CityCostIndicator {
  primeGradeARent: string;
  status: EvidenceClassification | 'unavailable';
  sourceName: string;
  dateChecked: string;
  limitations: string;
}

export interface CityPolicyIndicator {
  policyName: string;
  highlights: string[];
  status: EvidenceClassification | 'unavailable';
  sourceName: string;
  dateChecked: string;
  limitations: string;
}

export interface CityProviderIndicator {
  identifiedProviders: string[];
  status: EvidenceClassification | 'unavailable';
  sourceName: string;
  dateChecked: string;
  limitations: string;
}

export type CompanyClassification =
  | 'Verified captive/global capability centre'
  | 'IT services or consulting company'
  | 'Software/product company'
  | 'Confirmed facility or development centre, but GCC status unverified'
  | 'Company or facility requiring verification';

export interface CompanyWorkforce {
  localHeadcount: string;
  headcountType:
    | 'facility_estimate'
    | 'facility_seating_capacity'
    | 'corporate_announcement'
    | 'company_announcement'
    | 'third_party_estimate'
    | 'requires_verification'
    | 'unavailable';
  sourceName: string;
  dateChecked: string;
  limitations: string;
}

export interface GccCompany {
  id: string;
  cityId: string;
  name: string;
  parentCompany: string;
  headquarters: string;
  facilityLocation: string;
  establishedYear?: number;
  primarySector: string;
  companyClassification: CompanyClassification;
  businessFunctions: string[];
  specialisations: string[];
  workforce: CompanyWorkforce;
  evidenceItemIds?: string[];
}

export interface CityWorkforceBreakdown {
  directGccHeadcount: string;
  directGccSource: string;
  totalTechSectorHeadcount: string;
  totalTechSectorSource: string;
  seniorTalentPool: string;
  geographicScope: string;
  dateChecked: string;
  definitionNotes: string;
}

export interface CityProfile {
  id: string;
  name: string;
  tier: 'Tier-1' | 'Tier-2' | 'Tier-3';
  state: string;
  techEcosystemSummary: string;
  knownGccPresence: string[];
  companies?: GccCompany[];
  workforceBreakdown?: CityWorkforceBreakdown;
  estimatedTechTalentPool: string;
  estimatedSeniorTechTalentPool: string;
  averageNoticePeriodDays: number;
  typicalOfferDropoutRate: number; // percentage (e.g. 25-35%)
  evidenceStatus: 'Partial Data' | 'Requires Verification' | 'Benchmarked';
  caveats: string;
  coordinates?: CityCoordinates;
  officeOperatingCost?: CityCostIndicator;
  stateIncentivesPolicy?: CityPolicyIndicator;
  serviceProviders?: CityProviderIndicator;
  evidenceItemIds?: string[];
}

export interface HiringPlanConfig {
  cityId: string;
  totalTargetHires: number;
  deadlineMonths: number;
  noticePeriodLagDays: 60 | 90; // Indian standard notice periods
  
  // Funnel conversion percentages (0 to 100)
  applicantToQualifiedRate: number; // raw applicants -> qualified screening
  qualifiedToInterviewRate: number; // qualified applicants -> 1st interview
  interviewToOfferRate: number; // interviewed candidates -> job offer extended
  offerAcceptanceRate: number; // offers extended -> offers accepted
  acceptedToJoiningRate: number; // offers accepted -> day-1 joined (drop-offs due to counteroffers / ghosting)

  // Recruitment Capacity
  dedicatedRecruiters: number;
  monthlyInterviewsPerRecruiter: number;
  agencySupportEnabled: boolean;
  agencyCapacityMultiplier: number; // e.g. 1.5x throughput
  
  // Role breakdown
  roles: RoleAllocation[];
}

export interface CalculationResult {
  targetHires: number;
  requiredAcceptedOffers: number;
  requiredOffersExtended: number;
  requiredInterviews: number;
  requiredQualifiedApplicants: number;
  requiredTotalApplicantPool: number;

  // Velocity & Runway
  monthlyPaceRequired: number; // hires/month
  activeInterviewWindowMonths: number; // deadline - notice lag
  latestOfferCutoffMonth: number; // Month by which all offers must be signed
  isTimelineImpossible: boolean; // true if notice lag >= deadline
  monthlyInterviewsNeeded: number;
  monthlyOffersNeeded: number;

  // Capacity & Engineering load
  totalRecruiterMonthlyCapacity: number;
  recruiterCapacityUtilizationPct: number;
  isRecruiterCapacityExceeded: boolean;
  recruiterDeficit: number; // additional recruiters needed
  
  engineeringInterviewHoursTotal: number;
  engineeringInterviewHoursPerMonth: number;

  // Risk & Feasibility
  bottlenecks: BottleneckAlert[];
  overallFeasibilityStatus: 'Mathematically Viable' | 'Capacity Constrained' | 'High Operational Risk' | 'Mathematically Infeasible';
  feasibilityRationale: string;
}

export interface BottleneckAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  impactMetric: string;
  suggestedMitigation: string;
}

export interface ScenarioComparison {
  id: string;
  name: string;
  description: string;
  config: HiringPlanConfig;
  result: CalculationResult;
}

export interface DemoScenario {
  id: string;
  key: string;
  title: string;
  subtitle: string;
  cityId: string;
  cityName: string;
  tier: string;
  headcount: number;
  deadlineMonths: number;
  noticePeriodLagDays: 60 | 90;
  keyChallenge: string;
  description: string;
  tags: string[];
  config: HiringPlanConfig;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  isGuest: boolean;
  avatarUrl?: string;
}
