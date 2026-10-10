import { HiringPlanConfig, CalculationResult, BottleneckAlert } from '../types';

/**
 * Deterministic calculation engine for GCC Hiring Plan Stress Testing.
 * Uses strict mathematical formulas without random approximations.
 */
export function calculateHiringPlan(config: HiringPlanConfig): CalculationResult {
  const targetHires = Math.max(1, Math.round(config.totalTargetHires || 1));
  const deadlineMonths = Math.max(1, Number(config.deadlineMonths) || 1);

  // Check for zero or negative conversion rates
  const hasZeroRate =
    (config.applicantToQualifiedRate ?? 0) <= 0 ||
    (config.qualifiedToInterviewRate ?? 0) <= 0 ||
    (config.interviewToOfferRate ?? 0) <= 0 ||
    (config.offerAcceptanceRate ?? 0) <= 0 ||
    (config.acceptedToJoiningRate ?? 0) <= 0;

  // Normalize conversion rates from percentage (0-100) to decimal (0.01 - 1.0)
  // Clamp to min 0.01 to prevent division by zero while preserving deterministic results
  const rJoin = Math.max(0.01, Math.min(1.0, (Number(config.acceptedToJoiningRate ?? 75) <= 0 ? 1 : Number(config.acceptedToJoiningRate ?? 75)) / 100));
  const rAccept = Math.max(0.01, Math.min(1.0, (Number(config.offerAcceptanceRate ?? 70) <= 0 ? 1 : Number(config.offerAcceptanceRate ?? 70)) / 100));
  const rIntToOffer = Math.max(0.01, Math.min(1.0, (Number(config.interviewToOfferRate ?? 20) <= 0 ? 1 : Number(config.interviewToOfferRate ?? 20)) / 100));
  const rQualToInt = Math.max(0.01, Math.min(1.0, (Number(config.qualifiedToInterviewRate ?? 35) <= 0 ? 1 : Number(config.qualifiedToInterviewRate ?? 35)) / 100));
  const rAppToQual = Math.max(0.01, Math.min(1.0, (Number(config.applicantToQualifiedRate ?? 25) <= 0 ? 1 : Number(config.applicantToQualifiedRate ?? 25)) / 100));

  // 1. Funnel Calculations (Deterministic Backward Induction)
  // To get N joiners, how many accepted offers are needed?
  const requiredAcceptedOffers = Math.ceil(targetHires / rJoin);

  // To get that many accepted offers, how many offers must be extended?
  const requiredOffersExtended = Math.ceil(requiredAcceptedOffers / rAccept);

  // To get that many offers, how many interviews must be conducted?
  const requiredInterviews = Math.ceil(requiredOffersExtended / rIntToOffer);

  // To get that many interviews, how many qualified applicants are needed?
  const requiredQualifiedApplicants = Math.ceil(requiredInterviews / rQualToInt);

  // To find that many qualified applicants, what total resume/applicant volume is needed?
  const requiredTotalApplicantPool = Math.ceil(requiredQualifiedApplicants / rAppToQual);

  // 2. Timeline & Velocity with Indian Notice Period Lag
  const noticeLagMonths = (config.noticePeriodLagDays || 60) / 30; // 60 days = 2 months, 90 days = 3 months
  const rawRunwayMonths = deadlineMonths - noticeLagMonths;
  const isTimelineImpossible = rawRunwayMonths <= 0;
  
  // The active interview & offer closure window is the period before the notice cutoff
  // Clamped to at least 1 month for operational pacing calculations if feasible
  const activeInterviewWindowMonths = isTimelineImpossible ? 0 : Math.max(1, rawRunwayMonths);
  const latestOfferCutoffMonth = isTimelineImpossible ? 0 : Math.max(1, deadlineMonths - Math.round(noticeLagMonths));

  const monthlyPaceRequired = Math.round((targetHires / deadlineMonths) * 10) / 10;
  const divisorWindow = Math.max(1, activeInterviewWindowMonths);
  const monthlyInterviewsNeeded = Math.ceil(requiredInterviews / divisorWindow);
  const monthlyOffersNeeded = Math.ceil(requiredOffersExtended / divisorWindow);

  // 3. Recruiter Capacity Stress Test
  const recruiters = Math.max(1, Number(config.dedicatedRecruiters) || 1);
  const throughputPerRecruiter = Math.max(5, Number(config.monthlyInterviewsPerRecruiter) || 35);
  
  let baseMonthlyCapacity = recruiters * throughputPerRecruiter;
  if (config.agencySupportEnabled) {
    const multiplier = Math.max(1.0, Number(config.agencyCapacityMultiplier) || 1.5);
    baseMonthlyCapacity = Math.round(baseMonthlyCapacity * multiplier);
  }
  const totalRecruiterMonthlyCapacity = baseMonthlyCapacity;

  const recruiterCapacityUtilizationPct = Math.round((monthlyInterviewsNeeded / totalRecruiterMonthlyCapacity) * 100);
  const isRecruiterCapacityExceeded = monthlyInterviewsNeeded > totalRecruiterMonthlyCapacity;
  const recruiterDeficit = isRecruiterCapacityExceeded
    ? Math.ceil((monthlyInterviewsNeeded - totalRecruiterMonthlyCapacity) / throughputPerRecruiter)
    : 0;

  // 4. Engineering Load (Interviewer Hours)
  // Standard GCC tech panel: 2 rounds of 1 hour tech interviews + 30 min debrief = 2.5 interviewer hours per interviewed candidate
  const hoursPerInterview = 2.0;
  const engineeringInterviewHoursTotal = Math.round(requiredInterviews * hoursPerInterview);
  const engineeringInterviewHoursPerMonth = Math.round(
    engineeringInterviewHoursTotal / Math.max(1, activeInterviewWindowMonths)
  );

  // 5. Bottleneck and Risk Identification
  const bottlenecks: BottleneckAlert[] = [];

  // A. Recruiter Bandwidth Bottleneck
  if (isRecruiterCapacityExceeded) {
    bottlenecks.push({
      id: 'recruiter-capacity',
      severity: recruiterCapacityUtilizationPct > 150 ? 'critical' : 'warning',
      title: 'Recruitment Team Capacity Deficit',
      description: `Current team capacity is ${totalRecruiterMonthlyCapacity} interviews/mo, but the plan demands ${monthlyInterviewsNeeded} interviews/mo (${recruiterCapacityUtilizationPct}% load).`,
      impactMetric: `Shortfall of ${recruiterDeficit} recruiter(s)`,
      suggestedMitigation: 'Add temporary RPO recruitment partners, engage specialized search agencies, or extend the hiring deadline.',
    });
  }

  // B. Notice Period Cliff Bottleneck
  if (noticeLagMonths >= deadlineMonths) {
    bottlenecks.push({
      id: 'notice-period-cliff',
      severity: 'critical',
      title: 'Impossible Timeline vs Notice Period',
      description: `Target deadline of ${deadlineMonths} months is shorter than or equal to the candidate notice period (${config.noticePeriodLagDays} days / ${noticeLagMonths} months). Candidates cannot serve notice and join within deadline.`,
      impactMetric: `Zero effective interview runway`,
      suggestedMitigation: 'Target immediate joiners, budget for aggressive notice period buyouts, or extend deadline to at least 6 months.',
    });
  } else if (activeInterviewWindowMonths <= 2) {
    bottlenecks.push({
      id: 'compressed-window',
      severity: 'critical',
      title: 'Compressed Offer Closure Window',
      description: `Due to ${config.noticePeriodLagDays}-day notice periods, all ${requiredOffersExtended} offers must be finalized within the first ${activeInterviewWindowMonths} month(s) to hit the ${deadlineMonths}-month joining deadline.`,
      impactMetric: `${monthlyOffersNeeded} offers/mo required`,
      suggestedMitigation: 'Front-load sourcing immediately in Month 1 with pre-vetted candidate pools and daily interview panels.',
    });
  }

  // C. Joining Drop-Off / Ghosting Risk (Crucial Indian GCC Market Factor)
  if (config.acceptedToJoiningRate < 75) {
    bottlenecks.push({
      id: 'high-offer-dropout',
      severity: 'warning',
      title: 'High Offer Drop-off Friction (Counteroffers & Ghosting)',
      description: `An accepted-to-joining rate of ${config.acceptedToJoiningRate}% means ${Math.round(100 - config.acceptedToJoiningRate)}% of accepted offers will be reneged during notice periods. You must extend ${requiredOffersExtended - targetHires} surplus offers to achieve ${targetHires} joiners.`,
      impactMetric: `${requiredAcceptedOffers - targetHires} reneged offers anticipated`,
      suggestedMitigation: 'Implement a structured candidate engagement program during notice periods, offer joining bonuses tied to Day 1, or establish pre-joining onboarding touchpoints.',
    });
  }

  // D. Engineering Interviewer Bandwidth Strain
  if (engineeringInterviewHoursPerMonth > 250) {
    bottlenecks.push({
      id: 'engineering-time-tax',
      severity: 'warning',
      title: 'Heavy Engineering Bandwidth Drain',
      description: `Your technical staff will need to conduct ~${engineeringInterviewHoursPerMonth} interview hours per month across ${activeInterviewWindowMonths} months.`,
      impactMetric: `${engineeringInterviewHoursTotal.toLocaleString()} total engineering hours`,
      suggestedMitigation: 'Implement standardized asynchronous coding assessments, train more senior engineers as certified interviewers, or use verified 3rd-party technical screening panels.',
    });
  }

  // E. Zero-Rate Infeasibility Check
  if (hasZeroRate) {
    bottlenecks.push({
      id: 'zero-conversion-rate',
      severity: 'critical',
      title: 'Zero or Invalid Funnel Rate Specified',
      description: 'One or more funnel stages is set to 0% conversion. Mathematically, no candidates can progress beyond a zero-yield stage.',
      impactMetric: '0% funnel progress',
      suggestedMitigation: 'Enter positive non-zero conversion percentages for all recruitment stages.',
    });
  }

  // F. Candidate Sourcing Volume Sanity Check
  if (requiredTotalApplicantPool > 10000) {
    bottlenecks.push({
      id: 'sourcing-volume-strain',
      severity: 'warning',
      title: 'Massive Sourcing Volume Required',
      description: `A pipeline of ${requiredTotalApplicantPool.toLocaleString()} total applicants is required. In Tier-2 cities like Visakhapatnam, this may exceed the immediate active talent pool in specialized tech stacks.`,
      impactMetric: `${requiredTotalApplicantPool.toLocaleString()} applicants required`,
      suggestedMitigation: 'Partner with regional engineering universities for junior roles, and implement hybrid/relocation packages to attract talent from Hyderabad, Bengaluru, and Chennai.',
    });
  }

  // Overall Feasibility Verdict
  let overallFeasibilityStatus: CalculationResult['overallFeasibilityStatus'] = 'Mathematically Viable';
  let feasibilityRationale = 'Plan is mathematically sound with manageable recruiter load.';

  if (hasZeroRate) {
    overallFeasibilityStatus = 'Mathematically Infeasible';
    feasibilityRationale = 'Funnel contains 0% conversion rate. Pipeline cannot yield required joiners.';
  } else if (isTimelineImpossible) {
    overallFeasibilityStatus = 'Mathematically Infeasible';
    feasibilityRationale = `Notice period (${config.noticePeriodLagDays} days / ${noticeLagMonths} mo) is greater than or equal to total project duration (${deadlineMonths} mo). Candidates serving notice cannot join by deadline without buyouts or immediate joiners.`;
  } else if (recruiterCapacityUtilizationPct > 160 || activeInterviewWindowMonths <= 2) {
    overallFeasibilityStatus = 'High Operational Risk';
    feasibilityRationale = `Extreme operational strain: recruiter workload is ${recruiterCapacityUtilizationPct}% of capacity and offer window is compressed to ${activeInterviewWindowMonths} month(s).`;
  } else if (isRecruiterCapacityExceeded) {
    overallFeasibilityStatus = 'Capacity Constrained';
    feasibilityRationale = `Recruitment load exceeds in-house capacity by ${recruiterCapacityUtilizationPct - 100}%. Requires ${recruiterDeficit} additional recruiter(s) or agency support.`;
  }

  return {
    targetHires,
    requiredAcceptedOffers,
    requiredOffersExtended,
    requiredInterviews,
    requiredQualifiedApplicants,
    requiredTotalApplicantPool,
    monthlyPaceRequired,
    activeInterviewWindowMonths,
    latestOfferCutoffMonth,
    isTimelineImpossible,
    monthlyInterviewsNeeded,
    monthlyOffersNeeded,
    totalRecruiterMonthlyCapacity,
    recruiterCapacityUtilizationPct,
    isRecruiterCapacityExceeded,
    recruiterDeficit,
    engineeringInterviewHoursTotal,
    engineeringInterviewHoursPerMonth,
    bottlenecks,
    overallFeasibilityStatus,
    feasibilityRationale,
  };
}

/**
 * Generates an executive summary text for decision briefs and clipboard export.
 */
export function generateExecutiveSummary(
  cityName: string,
  config: HiringPlanConfig,
  calc: CalculationResult
): string {
  return `EXECUTIVE DECISION BRIEF: GCC COMPASS LOCATION INTELLIGENCE
Location: ${cityName}
Target Hires: ${config.totalTargetHires}
Target Deadline: ${config.deadlineMonths} Months (${config.noticePeriodLagDays}-day notice period assumption)

1. MATHEMATICAL FUNNEL SUMMARY
- Target Day-1 Joiners: ${calc.targetHires}
- Required Accepted Offers: ${calc.requiredAcceptedOffers} (accounting for ${(100 - config.acceptedToJoiningRate).toFixed(0)}% notice period dropouts)
- Required Offers Extended: ${calc.requiredOffersExtended} (${config.offerAcceptanceRate}% offer acceptance rate)
- Required Final Interviews: ${calc.requiredInterviews} (${config.interviewToOfferRate}% interview-to-offer rate)
- Required Qualified Applicants: ${calc.requiredQualifiedApplicants} (${config.qualifiedToInterviewRate}% screen-to-interview rate)
- Total Pipeline Pool Needed: ${calc.requiredTotalApplicantPool.toLocaleString()} candidates

2. OPERATIONAL CAPACITY & VELOCITY
- Effective Offer Closure Window: ${calc.activeInterviewWindowMonths} months (due to ${config.noticePeriodLagDays / 30}-month notice period lag)
- Monthly Interview Velocity: ${calc.monthlyInterviewsNeeded} interviews/month
- In-house Monthly Capacity: ${calc.totalRecruiterMonthlyCapacity} interviews/month
- Team Bandwidth Utilization: ${calc.recruiterCapacityUtilizationPct}%
- Technical Panel Time Required: ${calc.engineeringInterviewHoursTotal.toLocaleString()} engineering hours (${calc.engineeringInterviewHoursPerMonth} hrs/mo)

3. FEASIBILITY VERDICT: ${calc.overallFeasibilityStatus.toUpperCase()}
${calc.feasibilityRationale}

4. KEY OPERATIONAL BOTTLENECK(S):
${calc.bottlenecks.map((b, i) => `[${i + 1}] ${b.title}: ${b.description} (Suggested Action: ${b.suggestedMitigation})`).join('\n')}
`;
}
