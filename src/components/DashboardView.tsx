import React from 'react';
import {
  Users,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Clock,
  Briefcase,
  Sliders,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { CityProfile, HiringPlanConfig, CalculationResult } from '../types';

interface DashboardViewProps {
  city: CityProfile;
  config: HiringPlanConfig;
  calc: CalculationResult;
  onNavigateToBuilder: () => void;
  onNavigateToStressTest: () => void;
  onNavigateToEvidence: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  city,
  config,
  calc,
  onNavigateToBuilder,
  onNavigateToStressTest,
  onNavigateToEvidence,
}) => {
  const getStatusBadge = (status: CalculationResult['overallFeasibilityStatus']) => {
    switch (status) {
      case 'Mathematically Viable':
        return {
          textColor: 'text-emerald-700',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          label: 'Mathematically Viable',
        };
      case 'Capacity Constrained':
        return {
          textColor: 'text-amber-700',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          label: 'Capacity Constrained (Requires Sourcing Scale)',
        };
      case 'High Operational Risk':
        return {
          textColor: 'text-rose-700',
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          label: 'High Operational Strain',
        };
      case 'Mathematically Infeasible':
        return {
          textColor: 'text-red-800',
          bg: 'bg-red-50',
          border: 'border-red-200',
          label: 'Mathematically Infeasible',
        };
    }
  };

  const statusMeta = getStatusBadge(calc.overallFeasibilityStatus);

  return (
    <div className="space-y-8">
      {/* Top Banner / Problem Statement Context */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>GCC Expansion Plan Assessment</span>
              <span aria-hidden="true">·</span>
              <span>Primary Hypothesis Stress Test</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{city.name}, {city.state}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {config.totalTargetHires} Tech Hires in {city.name} across {config.deadlineMonths} Months
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-3xl">
              Testing operational feasibility against Indian labor-market frictions, recruiter throughput, and a {config.noticePeriodLagDays}-day notice period lag.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onNavigateToBuilder}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              Adjust Assumptions
            </button>
            <button
              onClick={onNavigateToStressTest}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              Run Stress Test
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Epistemic disclaimer */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-700 shrink-0">Epistemic Status:</span>
          <span>
            Calculations reflect deterministic funnel arithmetic using demonstration defaults. These results do not represent customer-validated demand or guaranteed candidate availability in {city.name}.
          </span>
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Target Joiners */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Target Day-1 Joiners</div>
          <div className="mt-2 text-3xl font-bold tracking-tight font-mono tabular-nums text-slate-900">
            {calc.targetHires}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Required velocity</span>
            <span className="font-mono tabular-nums font-semibold text-slate-700">
              {calc.monthlyPaceRequired}/mo
            </span>
          </div>
        </div>

        {/* KPI 2: Total Talent Pool Needed */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Total Sourced Pool Needed</div>
          <div className="mt-2 text-3xl font-bold tracking-tight font-mono tabular-nums text-slate-900">
            {calc.requiredTotalApplicantPool.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Qualified candidates</span>
            <span className="font-mono tabular-nums font-semibold text-slate-700">
              {calc.requiredQualifiedApplicants.toLocaleString()}
            </span>
          </div>
        </div>

        {/* KPI 3: Final Interviews */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Interviews to Conduct</div>
          <div className="mt-2 text-3xl font-bold tracking-tight font-mono tabular-nums text-slate-900">
            {calc.requiredInterviews.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Engineering panel load</span>
            <span className="font-mono tabular-nums font-semibold text-slate-700">
              {calc.engineeringInterviewHoursTotal.toLocaleString()} hrs
            </span>
          </div>
        </div>

        {/* KPI 4: Recruiter Capacity */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Recruiter Team Load</div>
          <div className="mt-2 text-3xl font-bold tracking-tight font-mono tabular-nums text-slate-900">
            {calc.recruiterCapacityUtilizationPct}%
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Capacity status</span>
            <span
              className={`font-semibold ${
                calc.isRecruiterCapacityExceeded ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {calc.isRecruiterCapacityExceeded
                ? `-${calc.recruiterDeficit} recruiters`
                : 'Balanced'}
            </span>
          </div>
        </div>

        {/* KPI 5: Effective Offer Window */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Effective Offer Window</div>
          <div className="mt-2 text-3xl font-bold tracking-tight font-mono tabular-nums text-slate-900">
            {calc.activeInterviewWindowMonths} Mo
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Notice period lag</span>
            <span className="font-mono tabular-nums font-semibold text-slate-700">
              {config.noticePeriodLagDays} days
            </span>
          </div>
        </div>
      </div>

      {/* Operational Feasibility Verdict Banner */}
      <div
        className={`p-5 rounded-xl border ${statusMeta.bg} ${statusMeta.border} shadow-sm`}
      >
        <div className="flex items-start gap-3">
          <ShieldAlert className={`w-5 h-5 shrink-0 mt-0.5 ${statusMeta.textColor}`} />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${statusMeta.textColor}`}>
                FEASIBILITY VERDICT: {statusMeta.label}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {calc.feasibilityRationale}
            </p>
          </div>
        </div>
      </div>

      {/* Main Section: The Funnel Breakdown & Pacing Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Funnel Visualization */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recruitment Funnel Mathematics</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Deterministic backward induction from {calc.targetHires} joiners to initial sourcing
              </p>
            </div>
            <button
              onClick={onNavigateToBuilder}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium underline underline-offset-2"
            >
              Edit Rates
            </button>
          </div>

          <div className="space-y-3">
            {/* Stage 1: Sourced Pool */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">Stage 1: Raw Sourced Resumes / Inbound</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {calc.requiredTotalApplicantPool.toLocaleString()} candidates
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-800 h-full w-full" />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>Passes initial CV match / resume screening</span>
                <span className="font-mono tabular-nums font-medium text-slate-700">
                  {config.applicantToQualifiedRate}% rate
                </span>
              </div>
            </div>

            {/* Stage 2: Qualified Applicants */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">Stage 2: Qualified & Screened Pool</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {calc.requiredQualifiedApplicants.toLocaleString()} candidates
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-slate-700 h-full"
                  style={{
                    width: `${Math.round(
                      (calc.requiredQualifiedApplicants / calc.requiredTotalApplicantPool) * 100
                    )}%`,
                  }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>Consents & scheduled for technical interviews</span>
                <span className="font-mono tabular-nums font-medium text-slate-700">
                  {config.qualifiedToInterviewRate}% rate
                </span>
              </div>
            </div>

            {/* Stage 3: Interviews Conducted */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">Stage 3: Technical & Leadership Interviews</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {calc.requiredInterviews.toLocaleString()} candidates
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full"
                  style={{
                    width: `${Math.round(
                      (calc.requiredInterviews / calc.requiredTotalApplicantPool) * 100
                    )}%`,
                  }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>Passes technical bar to receive formal job offer</span>
                <span className="font-mono tabular-nums font-medium text-slate-700">
                  {config.interviewToOfferRate}% rate (1 in {Math.round(100 / config.interviewToOfferRate)})
                </span>
              </div>
            </div>

            {/* Stage 4: Offers Extended */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">Stage 4: Formal Offers Extended</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {calc.requiredOffersExtended.toLocaleString()} offers
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-sky-600 h-full"
                  style={{
                    width: `${Math.round(
                      (calc.requiredOffersExtended / calc.requiredTotalApplicantPool) * 100
                    )}%`,
                  }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>Candidate signs and formally accepts offer</span>
                <span className="font-mono tabular-nums font-medium text-slate-700">
                  {config.offerAcceptanceRate}% acceptance
                </span>
              </div>
            </div>

            {/* Stage 5: Accepted Offers */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">Stage 5: Signed / Accepted Offers</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {calc.requiredAcceptedOffers.toLocaleString()} signed
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-600 h-full"
                  style={{
                    width: `${Math.round(
                      (calc.requiredAcceptedOffers / calc.requiredTotalApplicantPool) * 100
                    )}%`,
                  }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>Survives {config.noticePeriodLagDays}-day notice period without reneging</span>
                <span className="font-mono tabular-nums font-medium text-slate-700">
                  {config.acceptedToJoiningRate}% joining rate ({100 - config.acceptedToJoiningRate}% drop-off)
                </span>
              </div>
            </div>

            {/* Stage 6: Day-1 Joiners */}
            <div className="p-3.5 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-emerald-900">Stage 6: Target Day-1 Joiners (Target)</span>
                <span className="font-mono font-bold text-emerald-900 tabular-nums">
                  {calc.targetHires} joiners
                </span>
              </div>
              <div className="w-full bg-emerald-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full"
                  style={{
                    width: `${Math.max(
                      3,
                      Math.round((calc.targetHires / calc.requiredTotalApplicantPool) * 100)
                    )}%`,
                  }}
                />
              </div>
              <div className="mt-2 text-[11px] text-emerald-800">
                End-to-end recruitment yield: Only{' '}
                <span className="font-mono font-bold">
                  {((calc.targetHires / calc.requiredTotalApplicantPool) * 100).toFixed(2)}%
                </span>{' '}
                of raw candidate pool converts to day-1 joined headcount.
              </div>
            </div>
          </div>
        </div>

        {/* Right: The Indian Notice-Period Timeline & Pacing Runway */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                The Notice-Period Runway Trap
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                How a {config.noticePeriodLagDays}-day notice period compresses your effective hiring deadline
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {calc.isTimelineImpossible ? (
                <div className="border border-rose-200 rounded-lg p-3 bg-rose-50 text-xs text-rose-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Timeline Conflict: Zero Effective Runway</span>
                  </div>
                  <p className="text-[11px] text-rose-800 leading-relaxed">
                    The {config.noticePeriodLagDays}-day notice period ({config.noticePeriodLagDays / 30} months) is greater than or equal to the total {config.deadlineMonths}-month project duration. Candidates serving notice cannot join by Month {config.deadlineMonths} without 100% notice buyouts or sourcing exclusively immediate joiners.
                  </p>
                </div>
              ) : (
                <>
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                      <span>
                        {calc.activeInterviewWindowMonths > 1
                          ? `Months 1 – ${calc.activeInterviewWindowMonths - 1}: Sourcing & Active Interviews`
                          : 'Month 1: Sourcing & Initial Technical Screening'}
                      </span>
                      <span className="text-[11px] font-mono text-indigo-700 font-semibold">Active Window</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Team must source {calc.requiredTotalApplicantPool.toLocaleString()} candidates and conduct {calc.requiredInterviews.toLocaleString()} interviews (~{calc.monthlyInterviewsNeeded}/mo).
                    </p>
                  </div>

                  <div className="border border-amber-200 rounded-lg p-3 bg-amber-50">
                    <div className="flex items-center justify-between text-xs font-semibold text-amber-900">
                      <span>Month {calc.latestOfferCutoffMonth}: CRITICAL OFFER CUTOFF</span>
                      <span className="text-[11px] font-mono text-amber-800 font-semibold">Latest Offer Date</span>
                    </div>
                    <p className="text-xs text-amber-800 mt-1">
                      All {calc.requiredOffersExtended} offers must be finalized and signed by Month {calc.latestOfferCutoffMonth} for candidates to serve a {config.noticePeriodLagDays}-day notice period and join by Month {config.deadlineMonths}.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                      <span>
                        Months {calc.latestOfferCutoffMonth + 1} – {config.deadlineMonths}: Notice Period & Onboarding Waves
                      </span>
                      <span className="text-[11px] font-mono text-emerald-700 font-semibold">Fulfillment</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Candidates serve notice. At current {config.acceptedToJoiningRate}% rate, {calc.requiredAcceptedOffers - calc.targetHires} accepted candidates are projected to back out before Day 1 due to counteroffers.
                    </p>
                  </div>
                </>
              )}

              {/* Variability & Early Release Disclosure */}
              <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg text-[11px] text-slate-500 leading-relaxed">
                <strong className="text-slate-700">Notice Period Variance Disclosure:</strong> Model assumes a uniform {config.noticePeriodLagDays}-day lag. In practice, Indian notice periods range from 30 days (probation/startups) to 90 days (IT services). Notice buyouts, counteroffers, and early releases are working assumptions rather than contractual guarantees.
              </div>
            </div>

            {/* Capacity vs Demand Quick Summary */}
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Active Offer Window</span>
                <span className="font-mono font-semibold text-slate-900">
                  {calc.activeInterviewWindowMonths} months
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Interviews Required / Month</span>
                <span className="font-mono font-semibold text-slate-900">
                  {calc.monthlyInterviewsNeeded} interviews/mo
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Recruiter Team Capacity</span>
                <span className="font-mono font-semibold text-slate-900">
                  {calc.totalRecruiterMonthlyCapacity} interviews/mo ({config.dedicatedRecruiters} recruiters)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Monthly Engineering Interview Time</span>
                <span className="font-mono font-semibold text-slate-900">
                  {calc.engineeringInterviewHoursPerMonth} hrs/mo
                </span>
              </div>
            </div>
          </div>

          {/* City Context Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800">
                {city.name} Talent Ecosystem ({city.tier})
              </span>
              <button
                onClick={onNavigateToEvidence}
                className="text-[11px] text-slate-500 hover:text-slate-900 flex items-center gap-1"
              >
                <span>View Evidence</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {city.techEcosystemSummary}
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-600">
                <span>Estimated Senior Talent (6+y):</span>
                <span className="font-mono font-semibold text-slate-800">{city.estimatedSeniorTechTalentPool}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Typical Voluntary Attrition:</span>
                <span className="font-mono font-semibold text-slate-800">{city.typicalOfferDropoutRate}% in Tier-2</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Bottlenecks Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Identified Bottlenecks & Operational Risks</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Specific constraints that could threaten the {config.deadlineMonths}-month hiring deadline
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {calc.bottlenecks.length} active risk factors
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {calc.bottlenecks.map((bottleneck) => (
            <div
              key={bottleneck.id}
              className={`p-4 rounded-lg border ${
                bottleneck.severity === 'critical'
                  ? 'bg-rose-50/60 border-rose-200 text-rose-950'
                  : 'bg-amber-50/60 border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    className={`w-4 h-4 shrink-0 ${
                      bottleneck.severity === 'critical' ? 'text-rose-600' : 'text-amber-600'
                    }`}
                  />
                  <h3 className="text-xs font-bold">{bottleneck.title}</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/70 border border-current font-medium">
                  {bottleneck.impactMetric}
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                {bottleneck.description}
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-xs">
                <span className="font-semibold text-slate-800">Recommended Action: </span>
                <span className="text-slate-600">{bottleneck.suggestedMitigation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
