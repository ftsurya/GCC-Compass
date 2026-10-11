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
  ShieldCheck,
  Sparkles,
  RotateCcw,
  Layers,
  Compass,
} from 'lucide-react';
import { CityProfile, HiringPlanConfig, CalculationResult } from '../types';
import { DEMO_SCENARIOS } from '../data/defaultData';

interface DashboardViewProps {
  city: CityProfile;
  config: HiringPlanConfig;
  calc: CalculationResult;
  hasActiveAssessment?: boolean;
  activeScenarioName?: string | null;
  onNavigateToBuilder: () => void;
  onNavigateToStressTest: () => void;
  onNavigateToEvidence: () => void;
  onLoadDemoScenario?: (scenarioKey: string) => void;
  onClearAssessment?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  city,
  config,
  calc,
  hasActiveAssessment = false,
  activeScenarioName,
  onNavigateToBuilder,
  onNavigateToStressTest,
  onNavigateToEvidence,
  onLoadDemoScenario,
  onClearAssessment,
}) => {
  const getStatusBadge = (status: CalculationResult['overallFeasibilityStatus']) => {
    switch (status) {
      case 'Mathematically Viable':
        return {
          textColor: 'text-black',
          bg: 'bg-[#00F0A8]',
          border: 'border-black',
          label: 'Mathematically Viable',
        };
      case 'Capacity Constrained':
        return {
          textColor: 'text-black',
          bg: 'bg-[#FFE500]',
          border: 'border-black',
          label: 'Capacity Constrained (Requires Sourcing Scale)',
        };
      case 'High Operational Risk':
        return {
          textColor: 'text-white',
          bg: 'bg-[#FF5A36]',
          border: 'border-black',
          label: 'High Operational Strain',
        };
      case 'Mathematically Infeasible':
        return {
          textColor: 'text-white',
          bg: 'bg-black',
          border: 'border-black',
          label: 'Mathematically Infeasible',
        };
    }
  };

  const statusMeta = getStatusBadge(calc.overallFeasibilityStatus);

  // If no assessment has been explicitly chosen or run yet, present the clean setup gateway
  if (!hasActiveAssessment) {
    return (
      <div className="space-y-8 animate-fadeIn">
        {/* Gateway Header */}
        <div className="bg-[#FFFDF5] border-4 border-black p-6 sm:p-10 shadow-[8px_8px_0px_0px_#000] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-3 border-black pb-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-[#FFE500] border-2 border-black font-mono text-xs font-black uppercase tracking-wider">
                <Compass className="w-4 h-4 stroke-[2.5]" />
                <span>OVERVIEW MATRIX // INITIAL SETUP GATEWAY</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-black uppercase font-display">
                Start an Assessment to View Feasibility Results
              </h1>
              <p className="text-sm font-mono text-neutral-800 max-w-3xl leading-relaxed font-medium">
                The initial workspace overview does not display completed assessment results automatically. To ensure integrity and avoid presenting speculative outcomes, choose between configuring custom workforce targets or loading an enterprise demonstration scenario.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 font-mono">
              <button
                onClick={onNavigateToBuilder}
                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-black uppercase text-black bg-[#FFE500] hover:bg-[#FFD000] border-2 border-black shadow-[3px_3px_0px_0px_#000] transition-all"
              >
                <Sliders className="w-4 h-4 stroke-[2.5]" />
                <span>Configure in Plan Builder</span>
              </button>
            </div>
          </div>

          {/* Two Primary Pathways */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 font-mono">
            {/* Pathway 1: Custom Plan */}
            <div className="lg:col-span-5 bg-white border-3 border-black p-6 flex flex-col justify-between space-y-6 shadow-[5px_5px_0px_0px_#000]">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#FFE500] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                  <Sliders className="w-6 h-6 stroke-[2.5] text-black" />
                </div>
                <div>
                  <h2 className="text-base font-black text-black uppercase font-display">
                    Option 1: Configure Custom Assessment
                  </h2>
                  <p className="text-xs text-neutral-700 mt-1 leading-relaxed font-medium">
                    Set up your organization’s planned headcount, target Indian hub, hiring deadlines, and stage conversion yields. Calculations will execute live via deterministic backwards induction.
                  </p>
                </div>

                <div className="space-y-2 text-xs text-neutral-800 pt-3 border-t-2 border-black">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-black stroke-[2.5] shrink-0" />
                    <span>Select from 6 benchmarked Indian tech cities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-black stroke-[2.5] shrink-0" />
                    <span>Model 60-day or 90-day notice period runways</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-black stroke-[2.5] shrink-0" />
                    <span>Audit in-house vs RPO recruitment capacity</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onNavigateToBuilder}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-black uppercase text-black bg-[#FFE500] hover:bg-[#FFD000] border-2 border-black shadow-[3px_3px_0px_0px_#000] transition-all"
              >
                <span>Open Plan Builder Configurator</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            {/* Pathway 2: Pre-Configured Demo Scenarios */}
            <div className="lg:col-span-7 bg-[#FFFDF5] border-3 border-black p-6 space-y-4 shadow-[5px_5px_0px_0px_#000]">
              <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <div>
                  <h2 className="text-base font-black text-black uppercase font-display flex items-center gap-2">
                    <Sparkles className="w-5 h-5 stroke-[2.5] text-black" />
                    <span>Option 2: Load Enterprise Demo Scenarios</span>
                  </h2>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Select a verified scenario to inspect labor-market friction and capacity bottlenecks:
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                {DEMO_SCENARIOS.map((demo) => (
                  <div
                    key={demo.id}
                    className="p-3.5 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase text-black">{demo.title}</span>
                        <span className="text-[10px] font-black px-1.5 py-0.2 bg-[#00F0A8] text-black border border-black uppercase">
                          {demo.tier}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-700">
                        <span className="font-bold text-black">{demo.headcount} Hires</span> across{' '}
                        <span className="font-bold text-black">{demo.deadlineMonths} Months</span> ({demo.noticePeriodLagDays}d notice)
                      </div>
                      <div className="text-[11px] text-neutral-600 italic">
                        {demo.keyChallenge}
                      </div>
                    </div>

                    <button
                      onClick={() => onLoadDemoScenario && onLoadDemoScenario(demo.key)}
                      className="px-3.5 py-1.5 text-xs font-black uppercase text-black bg-[#FFE500] hover:bg-[#FFD000] border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-colors whitespace-nowrap self-start sm:self-center"
                    >
                      Load Demo
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Epistemic disclaimer */}
          <div className="mt-4 pt-3 border-t-2 border-black flex items-start gap-2 text-xs font-mono text-neutral-700">
            <span className="font-black uppercase text-black shrink-0">EPISTEMIC STATUS:</span>
            <span>
              All GCC Compass results are calculated using backward induction arithmetic. No numbers are generated via speculative estimation or statistical extrapolation without explicit input parameters.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Active Assessment State: Render full calculated overview
  return (
    <div className="space-y-8 animate-fadeIn font-mono">
      {/* Top Banner / Problem Statement Context */}
      <div className="bg-[#FFFDF5] border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs mb-1">
              <span className="px-2.5 py-0.5 bg-[#00F0A8] text-black font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                {activeScenarioName ? `Demo: ${activeScenarioName}` : 'Active Custom Assessment'}
              </span>
              <span>//</span>
              <span className="font-bold uppercase text-black">{city.name}, {city.state}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black uppercase font-display mt-2">
              {config.totalTargetHires} Tech Hires in {city.name} across {config.deadlineMonths} Months
            </h1>
            <p className="mt-1 text-xs text-neutral-800 max-w-3xl font-medium">
              Testing operational feasibility against Indian labor-market frictions, recruiter throughput, and a {config.noticePeriodLagDays}-day notice period lag.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onNavigateToBuilder}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase text-black bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FFE500] transition-colors whitespace-nowrap"
            >
              <Sliders className="w-3.5 h-3.5 stroke-[2.5]" />
              Adjust Assumptions
            </button>
            <button
              onClick={onNavigateToStressTest}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black uppercase text-black bg-[#FFE500] hover:bg-[#FFD000] border-2 border-black shadow-[3px_3px_0px_0px_#000] transition-colors whitespace-nowrap"
            >
              Run Stress Test
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
            {onClearAssessment && (
              <button
                onClick={onClearAssessment}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase text-neutral-700 hover:text-black bg-white hover:bg-neutral-100 border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-colors whitespace-nowrap"
                title="Clear current assessment and return to clean setup state"
              >
                <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Epistemic disclaimer */}
        <div className="mt-4 pt-3 border-t-2 border-black flex items-start gap-2 text-xs text-neutral-700">
          <span className="font-black uppercase text-black shrink-0">EPISTEMIC STATUS:</span>
          <span>
            Calculations reflect deterministic funnel arithmetic derived from active assumptions. These results model operational recruitment yield and notice-period runways in {city.name}.
          </span>
        </div>
      </div>

      {/* Primary KPI Strip in Retro NeoBrutalism */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Target Joiners */}
        <div className="bg-white border-3 border-black p-5 shadow-[4px_4px_0px_0px_#000]">
          <div className="text-[11px] font-black uppercase text-neutral-600">Target Joiners</div>
          <div className="mt-1 text-3xl font-black font-mono tabular-nums text-black">
            {calc.targetHires}
          </div>
          <div className="mt-2 text-xs text-neutral-700 flex items-center justify-between border-t border-neutral-300 pt-1.5">
            <span>Required velocity</span>
            <span className="font-mono tabular-nums font-bold text-black">
              {calc.monthlyPaceRequired}/mo
            </span>
          </div>
        </div>

        {/* KPI 2: Total Talent Pool Needed */}
        <div className="bg-[#FFE500] border-3 border-black p-5 shadow-[4px_4px_0px_0px_#000]">
          <div className="text-[11px] font-black uppercase text-black">Total Sourced Pool</div>
          <div className="mt-1 text-3xl font-black font-mono tabular-nums text-black">
            {calc.requiredTotalApplicantPool.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-black flex items-center justify-between border-t border-black pt-1.5 font-bold">
            <span>Qualified screens</span>
            <span className="font-mono tabular-nums">
              {calc.requiredQualifiedApplicants.toLocaleString()}
            </span>
          </div>
        </div>

        {/* KPI 3: Final Interviews */}
        <div className="bg-white border-3 border-black p-5 shadow-[4px_4px_0px_0px_#000]">
          <div className="text-[11px] font-black uppercase text-neutral-600">Interviews Needed</div>
          <div className="mt-1 text-3xl font-black font-mono tabular-nums text-black">
            {calc.requiredInterviews.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-neutral-700 flex items-center justify-between border-t border-neutral-300 pt-1.5">
            <span>Engineering load</span>
            <span className="font-mono tabular-nums font-bold text-black">
              {calc.engineeringInterviewHoursTotal.toLocaleString()} hrs
            </span>
          </div>
        </div>

        {/* KPI 4: Recruiter Capacity */}
        <div className="bg-white border-3 border-black p-5 shadow-[4px_4px_0px_0px_#000]">
          <div className="text-[11px] font-black uppercase text-neutral-600">Recruiter Team Load</div>
          <div className="mt-1 text-3xl font-black font-mono tabular-nums text-black">
            {calc.recruiterCapacityUtilizationPct}%
          </div>
          <div className="mt-2 text-xs flex items-center justify-between border-t border-neutral-300 pt-1.5">
            <span>TA Capacity</span>
            <span
              className={`font-black uppercase px-1 ${
                calc.isRecruiterCapacityExceeded ? 'bg-[#FF5A36] text-white' : 'bg-[#00F0A8] text-black'
              }`}
            >
              {calc.isRecruiterCapacityExceeded
                ? `-${calc.recruiterDeficit} TA`
                : 'BALANCED'}
            </span>
          </div>
        </div>

        {/* KPI 5: Effective Offer Window */}
        <div className="bg-white border-3 border-black p-5 shadow-[4px_4px_0px_0px_#000]">
          <div className="text-[11px] font-black uppercase text-neutral-600">Offer Window</div>
          <div className="mt-1 text-3xl font-black font-mono tabular-nums text-black">
            {calc.activeInterviewWindowMonths} Mo
          </div>
          <div className="mt-2 text-xs text-neutral-700 flex items-center justify-between border-t border-neutral-300 pt-1.5">
            <span>Notice period</span>
            <span className="font-mono tabular-nums font-bold text-black">
              {config.noticePeriodLagDays} days
            </span>
          </div>
        </div>
      </div>

      {/* Operational Feasibility Verdict Banner */}
      <div
        className={`p-5 border-3 border-black ${statusMeta.bg} shadow-[5px_5px_0px_0px_#000]`}
      >
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-6 h-6 stroke-[2.5] text-black shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black uppercase text-black">
                FEASIBILITY VERDICT: {statusMeta.label}
              </span>
            </div>
            <p className="text-xs text-black leading-relaxed font-bold">
              {calc.feasibilityRationale}
            </p>
          </div>
        </div>
      </div>

      {/* Main Section: The Funnel Breakdown & Pacing Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Funnel Visualization */}
        <div className="lg:col-span-7 bg-[#FFFDF5] border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000] space-y-6">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <div>
              <h2 className="text-base font-black uppercase text-black font-display">Recruitment Funnel Mathematics</h2>
              <p className="text-xs text-neutral-600 mt-0.5">
                Deterministic backward induction from {calc.targetHires} joiners to initial sourcing
              </p>
            </div>
            <button
              onClick={onNavigateToBuilder}
              className="text-xs font-black uppercase text-black bg-[#FFE500] hover:bg-[#FFD000] px-2 py-1 border border-black shadow-[1px_1px_0px_0px_#000]"
            >
              Edit Rates
            </button>
          </div>

          <div className="space-y-3 font-mono">
            {/* Stage 1: Sourced Pool */}
            <div className="p-3.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-black uppercase text-black">Stage 1: Raw Sourced Resumes</span>
                <span className="font-mono font-black text-black tabular-nums bg-[#FFE500] px-1">
                  {calc.requiredTotalApplicantPool.toLocaleString()} candidates
                </span>
              </div>
              <div className="w-full bg-neutral-200 h-3 border border-black overflow-hidden">
                <div className="bg-black h-full w-full" />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-600">
                <span>Passes initial CV match / resume screening</span>
                <span className="font-mono tabular-nums font-bold text-black">
                  {config.applicantToQualifiedRate}% rate
                </span>
              </div>
            </div>

            {/* Stage 2: Qualified Applicants */}
            <div className="p-3.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-black uppercase text-black">Stage 2: Qualified & Screened</span>
                <span className="font-mono font-black text-black tabular-nums">
                  {calc.requiredQualifiedApplicants.toLocaleString()} candidates
                </span>
              </div>
              <div className="w-full bg-neutral-200 h-3 border border-black overflow-hidden">
                <div
                  className="bg-neutral-800 h-full"
                  style={{
                    width: `${Math.round(
                      (calc.requiredQualifiedApplicants / calc.requiredTotalApplicantPool) * 100
                    )}%`,
                  }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-600">
                <span>Consents & scheduled for technical interviews</span>
                <span className="font-mono tabular-nums font-bold text-black">
                  {config.qualifiedToInterviewRate}% rate
                </span>
              </div>
            </div>

            {/* Stage 3: Interviews Conducted */}
            <div className="p-3.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-black uppercase text-black">Stage 3: Technical Interviews</span>
                <span className="font-mono font-black text-black tabular-nums">
                  {calc.requiredInterviews.toLocaleString()} candidates
                </span>
              </div>
              <div className="w-full bg-neutral-200 h-3 border border-black overflow-hidden">
                <div
                  className="bg-[#00F0A8] h-full"
                  style={{
                    width: `${Math.round(
                      (calc.requiredInterviews / calc.requiredTotalApplicantPool) * 100
                    )}%`,
                  }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-600">
                <span>Passes technical bar to receive formal job offer</span>
                <span className="font-mono tabular-nums font-bold text-black">
                  {config.interviewToOfferRate}% rate (1 in {Math.round(100 / config.interviewToOfferRate)})
                </span>
              </div>
            </div>

            {/* Stage 4: Offers Extended */}
            <div className="p-3.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-black uppercase text-black">Stage 4: Formal Offers Extended</span>
                <span className="font-mono font-black text-black tabular-nums">
                  {calc.requiredOffersExtended.toLocaleString()} offers
                </span>
              </div>
              <div className="w-full bg-neutral-200 h-3 border border-black overflow-hidden">
                <div
                  className="bg-black h-full"
                  style={{
                    width: `${Math.round(
                      (calc.requiredOffersExtended / calc.requiredTotalApplicantPool) * 100
                    )}%`,
                  }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-600">
                <span>Candidate signs and formally accepts offer</span>
                <span className="font-mono tabular-nums font-bold text-black">
                  {config.offerAcceptanceRate}% acceptance
                </span>
              </div>
            </div>

            {/* Stage 5: Accepted Offers */}
            <div className="p-3.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-black uppercase text-black">Stage 5: Signed / Accepted Offers</span>
                <span className="font-mono font-black text-black tabular-nums">
                  {calc.requiredAcceptedOffers.toLocaleString()} signed
                </span>
              </div>
              <div className="w-full bg-neutral-200 h-3 border border-black overflow-hidden">
                <div
                  className="bg-[#FFE500] h-full"
                  style={{
                    width: `${Math.round(
                      (calc.requiredAcceptedOffers / calc.requiredTotalApplicantPool) * 100
                    )}%`,
                  }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-600">
                <span>Survives {config.noticePeriodLagDays}-day notice period without reneging</span>
                <span className="font-mono tabular-nums font-bold text-black">
                  {config.acceptedToJoiningRate}% joining rate ({100 - config.acceptedToJoiningRate}% drop-off)
                </span>
              </div>
            </div>

            {/* Stage 6: Day-1 Joiners */}
            <div className="p-3.5 bg-[#00F0A8] border-2 border-black shadow-[3px_3px_0px_0px_#000]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-black uppercase text-black">Stage 6: Target Day-1 Joiners</span>
                <span className="font-mono font-black text-black tabular-nums text-sm">
                  {calc.targetHires} joiners
                </span>
              </div>
              <div className="w-full bg-white h-3.5 border border-black overflow-hidden">
                <div
                  className="bg-black h-full"
                  style={{
                    width: `${Math.max(
                      3,
                      Math.round((calc.targetHires / calc.requiredTotalApplicantPool) * 100)
                    )}%`,
                  }}
                />
              </div>
              <div className="mt-2 text-[11px] text-black font-bold">
                End-to-end recruitment yield: Only{' '}
                <span className="font-mono font-black">
                  {((calc.targetHires / calc.requiredTotalApplicantPool) * 100).toFixed(2)}%
                </span>{' '}
                of raw candidate pool converts to day-1 joined headcount.
              </div>
            </div>
          </div>
        </div>

        {/* Right: The Indian Notice-Period Timeline & Pacing Runway */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FFFDF5] border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000] space-y-4">
            <div className="border-b-2 border-black pb-2">
              <h2 className="text-base font-black uppercase text-black font-display">
                The Notice-Period Runway Trap
              </h2>
              <p className="text-xs text-neutral-600 mt-0.5">
                How a {config.noticePeriodLagDays}-day notice period compresses your effective hiring deadline
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {calc.isTimelineImpossible ? (
                <div className="border-3 border-black p-3.5 bg-[#FF5A36] text-white shadow-[3px_3px_0px_0px_#000] text-xs space-y-1">
                  <div className="font-black uppercase flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 stroke-[2.5] shrink-0" />
                    <span>TIMELINE CONFLICT: ZERO EFFECTIVE RUNWAY</span>
                  </div>
                  <p className="text-[11px] leading-relaxed font-bold">
                    The {config.noticePeriodLagDays}-day notice period ({config.noticePeriodLagDays / 30} months) is greater than or equal to the total {config.deadlineMonths}-month project duration. Candidates serving notice cannot join by Month {config.deadlineMonths} without 100% notice buyouts.
                  </p>
                </div>
              ) : (
                <>
                  <div className="border-2 border-black p-3 bg-white shadow-[2px_2px_0px_0px_#000]">
                    <div className="flex items-center justify-between text-xs font-black uppercase text-black">
                      <span>
                        {calc.activeInterviewWindowMonths > 1
                          ? `M1 – M${calc.activeInterviewWindowMonths - 1}: Sourcing & Interviews`
                          : 'M1: Sourcing & Initial Screening'}
                      </span>
                      <span className="text-[10px] bg-black text-[#FFE500] px-1.5 py-0.2">ACTIVE WINDOW</span>
                    </div>
                    <p className="text-xs text-neutral-700 mt-1">
                      Team must source {calc.requiredTotalApplicantPool.toLocaleString()} candidates and conduct {calc.requiredInterviews.toLocaleString()} interviews (~{calc.monthlyInterviewsNeeded}/mo).
                    </p>
                  </div>

                  <div className="border-2 border-black p-3 bg-[#FFE500] shadow-[2px_2px_0px_0px_#000]">
                    <div className="flex items-center justify-between text-xs font-black uppercase text-black">
                      <span>Month {calc.latestOfferCutoffMonth}: CRITICAL OFFER CUTOFF</span>
                      <span className="text-[10px] bg-black text-white px-1.5 py-0.2">DEADLINE</span>
                    </div>
                    <p className="text-xs text-black mt-1 font-bold">
                      All {calc.requiredOffersExtended} offers must be finalized and signed by Month {calc.latestOfferCutoffMonth} for candidates to serve a {config.noticePeriodLagDays}-day notice period.
                    </p>
                  </div>

                  <div className="border-2 border-black p-3 bg-white shadow-[2px_2px_0px_0px_#000]">
                    <div className="flex items-center justify-between text-xs font-black uppercase text-black">
                      <span>
                        M{calc.latestOfferCutoffMonth + 1} – M{config.deadlineMonths}: Notice & Onboarding
                      </span>
                      <span className="text-[10px] bg-[#00F0A8] text-black px-1.5 py-0.2 border border-black">FULFILLMENT</span>
                    </div>
                    <p className="text-xs text-neutral-700 mt-1">
                      Candidates serve notice. At current {config.acceptedToJoiningRate}% rate, {calc.requiredAcceptedOffers - calc.targetHires} accepted candidates are projected to back out before Day 1 due to counteroffers.
                    </p>
                  </div>
                </>
              )}

              {/* Variability & Early Release Disclosure */}
              <div className="p-2.5 bg-white border border-black text-[11px] text-neutral-600 leading-relaxed">
                <strong className="text-black uppercase">Notice Period Variance Disclosure:</strong> Model assumes a uniform {config.noticePeriodLagDays}-day lag. In practice, Indian notice periods range from 30 days (startups) to 90 days (IT services).
              </div>
            </div>

            {/* Capacity vs Demand Quick Summary */}
            <div className="mt-4 pt-3 border-t-2 border-black space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-700">Active Offer Window</span>
                <span className="font-black text-black">
                  {calc.activeInterviewWindowMonths} months
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-700">Interviews Required / Month</span>
                <span className="font-black text-black">
                  {calc.monthlyInterviewsNeeded} interviews/mo
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-700">Recruiter Monthly Capacity</span>
                <span className="font-black text-black">
                  {calc.totalRecruiterMonthlyCapacity} interviews/mo ({config.dedicatedRecruiters} recruiters)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-700">Monthly Engineering Panel Time</span>
                <span className="font-black text-black">
                  {calc.engineeringInterviewHoursPerMonth} hrs/mo
                </span>
              </div>
            </div>
          </div>

          {/* City Context Card */}
          <div className="bg-white border-3 border-black p-5 shadow-[4px_4px_0px_0px_#000] space-y-3">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <span className="text-xs font-black uppercase text-black">
                {city.name} Talent Ecosystem ({city.tier})
              </span>
              <button
                onClick={onNavigateToEvidence}
                className="text-[11px] font-black uppercase text-black hover:bg-[#FFE500] px-1.5 py-0.5 border border-black flex items-center gap-1"
              >
                <span>Evidence</span>
                <ExternalLink className="w-3 h-3 stroke-[2.5]" />
              </button>
            </div>
            <p className="text-xs text-neutral-700 leading-relaxed font-medium">
              {city.techEcosystemSummary}
            </p>
            <div className="pt-2 border-t-2 border-black text-xs space-y-1">
              <div className="flex items-center justify-between text-neutral-700">
                <span>Estimated Senior Talent (6+y):</span>
                <span className="font-bold text-black">{city.estimatedSeniorTechTalentPool}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-700">
                <span>Typical Voluntary Attrition:</span>
                <span className="font-bold text-black">{city.typicalOfferDropoutRate}% in {city.tier}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Bottlenecks Section */}
      <div className="bg-[#FFFDF5] border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <div>
            <h2 className="text-base font-black uppercase text-black font-display">Identified Bottlenecks & Operational Risks</h2>
            <p className="text-xs text-neutral-600 mt-0.5">
              Specific constraints that could threaten the {config.deadlineMonths}-month hiring deadline
            </p>
          </div>
          <span className="text-xs font-black bg-black text-[#FFE500] px-2 py-0.5">
            {calc.bottlenecks.length} ACTIVE RISK FACTORS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {calc.bottlenecks.map((bottleneck) => (
            <div
              key={bottleneck.id}
              className={`p-4 border-2 border-black shadow-[3px_3px_0px_0px_#000] ${
                bottleneck.severity === 'critical'
                  ? 'bg-[#FF5A36] text-white'
                  : 'bg-[#FFE500] text-black'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 stroke-[2.5] shrink-0" />
                  <h3 className="text-xs font-black uppercase">{bottleneck.title}</h3>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.2 border border-black bg-white text-black font-bold uppercase">
                  {bottleneck.impactMetric}
                </span>
              </div>

              <p className="mt-2 text-xs leading-relaxed font-bold">
                {bottleneck.description}
              </p>

              <div className="mt-3 pt-2.5 border-t border-black text-xs font-bold">
                <span className="uppercase">Recommended Action: </span>
                <span className="font-medium">{bottleneck.suggestedMitigation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
