import React from 'react';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
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
  Scale,
  Sparkles,
  ChevronRight,
  Download,
  ShieldAlert,
} from 'lucide-react';
import { CityProfile, HiringPlanConfig, CalculationResult, UserProfile } from '../types';

interface IntroViewProps {
  city: CityProfile;
  config: HiringPlanConfig;
  calc: CalculationResult;
  currentUser: UserProfile;
  onStartAssessment: () => void;
  onNavigateToOverview: () => void;
  onNavigateToStressTest: () => void;
  onNavigateToEvidence: () => void;
  onNavigateToBrief: () => void;
  onOpenAuth: () => void;
  onNavigateToWelcome?: () => void;
}

export const IntroView: React.FC<IntroViewProps> = ({
  city,
  config,
  calc,
  currentUser,
  onStartAssessment,
  onNavigateToOverview,
  onNavigateToStressTest,
  onNavigateToEvidence,
  onNavigateToBrief,
  onOpenAuth,
  onNavigateToWelcome,
}) => {
  const scrollToMethodology = () => {
    const el =
      document.getElementById('how-it-works-section') ||
      document.getElementById('intro-methodology-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 pb-12 animate-fadeIn">
      {/* Hero Section */}
      <section className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-14 shadow-xs relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-gradient-to-bl from-slate-100/90 via-slate-50/50 to-transparent rounded-full -mr-24 -mt-24 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-semibold text-slate-800">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>GCC Compass · Location Intelligence & Feasibility</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
            Make Smarter Decisions About Your Next GCC Location.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            Evaluate hiring feasibility, understand talent-market constraints, stress-test recruitment plans, and build evidence-backed decisions for your Global Capability Center.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onStartAssessment}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm hover:shadow group"
            >
              <span>Get Started · Launch Assessment</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={onNavigateToOverview}
              className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors shadow-xs"
            >
              <BarChart3 className="w-4 h-4 text-slate-500" />
              <span>Explore Dashboard</span>
            </button>
            <button
              onClick={scrollToMethodology}
              className="inline-flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <span>How It Works</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Audit-grade deterministic funnel</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Tier-1 vs Tier-2 India benchmarks</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Board-ready PDF & JSON export</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions / Core Capabilities Grid */}
      <section className="space-y-6">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Platform Capabilities
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Engineered for Executive Location Strategy
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Traditional expansion advice relies on anecdotal pitch decks. GCC Compass provides a rigorous mathematical framework grounded in verified labor market realities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Location Intelligence */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <Building2 className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Location Intelligence & Ecosystem Sizing
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Compare saturated Tier-1 hubs (Bengaluru, Hyderabad, Pune) with emerging Tier-2 tech destinations (Visakhapatnam). Evaluate tech talent depth, cost arbitrage, attrition rates, and existing enterprise GCC footprint.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">4 City Profiles</span>
              <button
                onClick={onNavigateToOverview}
                className="font-semibold text-slate-900 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>View Profiles</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Reverse Funnel Modeling */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <Sliders className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Deterministic Funnel Modeling
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Work backward from target headcount to compute precise top-of-funnel resume volumes, screening passes, interview requirements, and extended offer counts based on empirically calibrated conversion ratios.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Live Reactive Sliders</span>
              <button
                onClick={onStartAssessment}
                className="font-semibold text-slate-900 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>Open Plan Builder</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Recruiter Capacity & Bottlenecks */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Recruiter & Engineering Capacity
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Simulate in-house Talent Acquisition throughput and senior engineer interview load. Instantly uncover recruiter deficits, identify monthly bottlenecks, and gauge external agency scaling requirements.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Deficit & Strain Alerts</span>
              <button
                onClick={onStartAssessment}
                className="font-semibold text-slate-900 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>Calibrate Capacity</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 4: Notice Period & Reneging Modeling */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <Clock className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Indian Notice Period & Attrition Lags
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Incorporate statutory 60–90 day notice periods and 20–35% offer drop-out rates into your timeline. Calculate the exact month when all offers must be signed before day-1 operational opening.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Cutoff Window Detection</span>
              <button
                onClick={onNavigateToOverview}
                className="font-semibold text-slate-900 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>Inspect Timeline</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 5: Stress Testing & Scenario Matrix */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <Layers className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Adverse Market Stress Testing
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Test your expansion against adverse market conditions: severe offer reneging, extended notice delays, and recruiter bandwidth contractions. Evaluate sensitivity side-by-side against baseline.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Multi-Scenario Matrix</span>
              <button
                onClick={onNavigateToStressTest}
                className="font-semibold text-slate-900 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>Run Stress Test</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 6: Audit-Grade Evidence & Briefs */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <BookOpen className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Evidence Library & Board Briefs
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every assumption is anchored in documented labor data, industry reports, and empirical benchmarks. Import external evidence batches via JSON schema or export executive PDF and JSON decision briefs.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">JSON & PDF Export</span>
              <button
                onClick={onNavigateToBrief}
                className="font-semibold text-slate-900 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>View Decision Brief</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Active Assessment Live Teaser */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Assessment Engine Preview
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Current Model: {config.totalTargetHires} Tech Hires in {city.name} across {config.deadlineMonths} Months
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              Feasibility: {calc.overallFeasibilityStatus}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500">Target Joiners</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {calc.targetHires}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Across {config.deadlineMonths} Months
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500">Sourced Resumes</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {calc.requiredTotalApplicantPool.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Reverse funnel requirement
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500">Notice Period Window</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {calc.activeInterviewWindowMonths} Months
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Cutoff Month {calc.latestOfferCutoffMonth}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500">TA Team Status</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {calc.isRecruiterCapacityExceeded ? `-${calc.recruiterDeficit} TA Deficit` : 'Capacity OK'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {config.dedicatedRecruiters} in-house recruiters
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
            {calc.feasibilityRationale}
          </p>
          <button
            onClick={onStartAssessment}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs flex items-center gap-1.5"
          >
            <span>Open in Plan Builder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Methodology Walkthrough */}
      <section id="how-it-works-section" className="space-y-6 pt-4 scroll-mt-20">
        <div id="intro-methodology-section" className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Structured Decision Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            How GCC Compass Evaluates Feasibility
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            A 5-step deterministic methodology designed to withstand board-level scrutiny and investor diligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="text-xs font-bold text-slate-400">01</div>
            <h4 className="text-sm font-bold text-slate-900">
              Select City & Headcount
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Define the target headcount and select the city profile to ingest local talent ecosystem benchmarks.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="text-xs font-bold text-slate-400">02</div>
            <h4 className="text-sm font-bold text-slate-900">
              Calibrate Funnel Ratios
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Adjust stage-by-stage conversions based on role seniority, brand recognition, and sourcing channel mix.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="text-xs font-bold text-slate-400">03</div>
            <h4 className="text-sm font-bold text-slate-900">
              Factor Notice Lags
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Calculate notice-period compression, identify the offer cutoff month, and model offer reneging risks.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="text-xs font-bold text-slate-400">04</div>
            <h4 className="text-sm font-bold text-slate-900">
              Diagnose Capacity
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Compare required interview throughput against recruiter bandwidth and engineering time commitments.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="text-xs font-bold text-slate-400">05</div>
            <h4 className="text-sm font-bold text-slate-900">
              Export Decision Brief
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Synthesize findings into an executive briefing document with downloadable PDF, Markdown, and JSON payloads.
            </p>
          </div>
        </div>
      </section>

      {/* Target Personas Section */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-md space-y-8">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Enterprise Decision Makers
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Built for Global Expansion & Talent Leaders
          </h2>
          <p className="text-sm text-slate-300">
            Trusted by cross-functional executives evaluating Indian GCC setups and scaling operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
            <h4 className="text-base font-bold text-white">
              GCC Strategy & Expansion Directors
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Evaluate Tier-1 vs Tier-2 location trade-offs, compare operational risks, and defend location selection to board members with verifiable empirical evidence.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
            <h4 className="text-base font-bold text-white">
              Heads of Global Talent Acquisition
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Accurately size recruiter headcounts, determine RPO agency budget requirements, and set realistic hiring pace milestones before signing lease commitments.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
            <h4 className="text-base font-bold text-white">
              Engineering Leaders & CTOs
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Anticipate engineering interviewer capacity drain, understand local seniority distributions, and protect technical bar integrity under aggressive timelines.
            </p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xs">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Ready to Evaluate Your GCC Hiring Feasibility?
          </h2>
          <p className="text-sm text-slate-600">
            Start modeling now in guest mode or sign in with enterprise credentials.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onStartAssessment}
            className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm"
          >
            <span>Launch Plan Builder</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenAuth}
            className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors shadow-xs"
          >
            <span>Sign In / Select Profile</span>
          </button>
        </div>
      </section>
    </div>
  );
};
