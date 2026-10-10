import React from 'react';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Sliders,
  Layers,
  BookOpen,
  FileText,
  Clock,
  Users,
  CheckCircle2,
  TrendingDown,
  BarChart3,
} from 'lucide-react';
import { CityProfile, HiringPlanConfig, CalculationResult } from '../types';

interface HomeViewProps {
  city: CityProfile;
  config: HiringPlanConfig;
  calc: CalculationResult;
  onStartAssessment: () => void;
  onNavigateToBuilder: () => void;
  onNavigateToOverview: () => void;
  onNavigateToStressTest: () => void;
  onNavigateToEvidence: () => void;
  onNavigateToBrief: () => void;
  onNavigateToIntro?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  city,
  config,
  calc,
  onStartAssessment,
  onNavigateToBuilder,
  onNavigateToOverview,
  onNavigateToStressTest,
  onNavigateToEvidence,
  onNavigateToBrief,
  onNavigateToIntro,
}) => {
  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-slate-100 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-semibold text-slate-800">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>GCC Compass · Location Intelligence & Feasibility</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Make Evidence-Backed Decisions About GCC Locations and Hiring Feasibility.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Configure hiring plans, evaluate recruitment capacity, stress-test scenarios, and explore supporting evidence to understand the feasibility and risks of your GCC expansion plans.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onStartAssessment}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm group"
            >
              <span>Start Assessment</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={scrollToHowItWorks}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors"
            >
              <span>Explore How It Works</span>
            </button>
            <button
              onClick={onNavigateToOverview}
              className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <span>View Overview</span>
            </button>
            {onNavigateToIntro && (
              <button
                onClick={onNavigateToIntro}
                className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                <span>Platform Intro</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Baseline Scenario Preview Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Assessment Baseline
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              {config.totalTargetHires} Tech Hires in {city.name} across {config.deadlineMonths} Months
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Testing operational viability in a Tier-2 hub against a {config.noticePeriodLagDays}-day notice period and candidate reneging frictions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                calc.overallFeasibilityStatus === 'Mathematically Viable'
                  ? 'bg-emerald-100 text-emerald-800'
                  : calc.overallFeasibilityStatus === 'Capacity Constrained'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {calc.overallFeasibilityStatus === 'Mathematically Viable' ? (
                <ShieldCheck className="w-3.5 h-3.5" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5" />
              )}
              {calc.overallFeasibilityStatus}
            </span>
            <button
              onClick={onStartAssessment}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-1"
            >
              <span>Open Plan Builder</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 4 Key Findings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">1. Active Offer Window</div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {calc.activeInterviewWindowMonths} Months
            </div>
            <div className="text-xs text-slate-600 mt-1">
              {config.noticePeriodLagDays}-day notice lag enforces offer cutoff at Month {calc.latestOfferCutoffMonth}.
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">2. Top-of-Funnel Sourced Pool</div>
            <div className="text-2xl font-bold font-mono text-indigo-600 mt-1">
              {calc.requiredTotalApplicantPool.toLocaleString()}
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Raw resumes required to yield {calc.targetHires} joiners at compound 0.92% conversion.
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">3. Technical Interviews</div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {calc.requiredInterviews.toLocaleString()}
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Requires {calc.monthlyInterviewsNeeded}/mo interview pace and {calc.engineeringInterviewHoursTotal.toLocaleString()} engineering panel hours.
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">4. Recruiter Workload</div>
            <div className={`text-2xl font-bold font-mono mt-1 ${calc.isRecruiterCapacityExceeded ? 'text-rose-600' : 'text-emerald-600'}`}>
              {calc.recruiterCapacityUtilizationPct}%
            </div>
            <div className="text-xs text-slate-600 mt-1">
              {calc.isRecruiterCapacityExceeded
                ? `Capacity deficit of ${calc.recruiterDeficit} in-house recruiter(s).`
                : 'Recruiter capacity within operating threshold.'}
            </div>
          </div>
        </div>
      </div>

      {/* Core Capabilities */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Core Location Intelligence & Feasibility Capabilities
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Engineered for enterprise workforce planners, GCC expansion leaders, and executive decision-makers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Multi-City Location Intelligence
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Benchmark talent pools across Tier-1 metros (Bengaluru, Hyderabad) and emerging Tier-2 hubs (Visakhapatnam, Pune, Coimbatore, Bhubaneswar). Evaluates local seniority distributions, voluntary attrition, and established GCC campuses.
              </p>
            </div>
            <button
              onClick={onStartAssessment}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 pt-2"
            >
              <span>Explore Locations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Deterministic Funnel Engine
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Strict backward induction calculations without floating-point approximations. Accurately determines required volumes at every step: Sourced Resumes → Qualified Screens → Technical Interviews → Offers → Day-1 Joiners.
              </p>
            </div>
            <button
              onClick={onNavigateToBuilder}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 inline-flex items-center gap-1 pt-2"
            >
              <span>Open Plan Configurator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Notice-Period Runway Stress Testing
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Models Indian 60-day and 90-day employment notice-period assumptions. Uncovers compressed offer closure deadlines and flags mathematically impossible hiring plans before capital is committed.
              </p>
            </div>
            <button
              onClick={onNavigateToStressTest}
              className="text-xs font-semibold text-amber-600 hover:text-amber-800 inline-flex items-center gap-1 pt-2"
            >
              <span>Compare Scenarios</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                TA Capacity & Engineering Load
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Simulates in-house recruiter bandwidth against candidate velocity. Quantifies team deficits, evaluates agency / RPO multiplier options, and computes senior engineering interviewer panel hours.
              </p>
            </div>
            <button
              onClick={onNavigateToBuilder}
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 inline-flex items-center gap-1 pt-2"
            >
              <span>Audit Team Capacity</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 5 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Evidence Library & Epistemic Audit
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every claim is transparently classified: Verified Facts, Third-Party Estimates (NASSCOM, Aon, Mercer), Corporate Announcements, Model Inferences, or items explicitly marked as Requiring Verification.
              </p>
            </div>
            <button
              onClick={onNavigateToEvidence}
              className="text-xs font-semibold text-sky-600 hover:text-sky-800 inline-flex items-center gap-1 pt-2"
            >
              <span>Review Evidence Base</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 6 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Executive Decision Brief & PDF Export
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate board-ready decision memos with mathematical proofs, sensitivity comparisons, and actionable validation roadmaps. Export directly to printer-friendly PDF, JSON, or Markdown.
              </p>
            </div>
            <button
              onClick={onNavigateToBrief}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1 pt-2"
            >
              <span>View Decision Brief</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Simple 3-Step User Journey */}
      <div id="how-it-works-section" className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 shadow-md space-y-8 scroll-mt-24">
        <div>
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            How GCC Compass Works · Assessment Workflow
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
            How to Stress-Test a GCC Workforce Expansion Plan
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            A three-step analytical workflow designed to replace speculative estimates with mathematically rigorous operational modeling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 space-y-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center border border-emerald-500/30">
              01
            </div>
            <h4 className="text-sm font-bold text-white">Define Target Scope & City</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Select your Indian location, target headcount, seniority mix, and project deadline to establish the baseline operational scope.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 space-y-3">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center border border-cyan-500/30">
              02
            </div>
            <h4 className="text-sm font-bold text-white">Tune Funnel & Capacity Factors</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Adjust stage conversion yields, notice-period reneging rates, and in-house recruiter team capacity to observe live bottleneck alerts.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 space-y-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center border border-indigo-500/30">
              03
            </div>
            <h4 className="text-sm font-bold text-white">Stress-Test & Export Brief</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Compare alternative scenarios (e.g. compressed timelines vs RPO mitigation) and export a board-ready executive brief in PDF or JSON.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Audit-grade deterministic modeling · Zero floating-point drift
          </div>
          <button
            onClick={onStartAssessment}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs rounded-xl transition-colors shadow-sm"
            aria-label="Start Assessment"
          >
            <span>Start Assessment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
