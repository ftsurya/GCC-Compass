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
    <div className="space-y-12 pb-12 animate-fadeIn">
      {/* Hero Section in Retro NeoBrutalism */}
      <section className="bg-[#FFFDF5] border-4 border-black p-8 sm:p-14 shadow-[8px_8px_0px_0px_#000] relative overflow-hidden">
        {/* Retro hazard ribbon */}
        <div className="absolute top-0 right-0 w-36 h-6 hazard-stripes border-b-2 border-l-2 border-black pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-[#FFE500] border-2 border-black font-mono text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
            <Compass className="w-4 h-4 stroke-[2.5]" />
            <span>SYS // INDIA GCC LOCATION INTELLIGENCE PLATFORM</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-black leading-tight uppercase font-display">
            Make Smarter Decisions About Your Next GCC Location.
          </h1>

          <p className="text-base sm:text-lg text-neutral-800 leading-relaxed max-w-2xl font-medium">
            Evaluate hiring feasibility, understand talent-market constraints, stress-test recruitment plans, and build evidence-backed decisions for your Global Capability Center.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 font-mono">
            <button
              onClick={onStartAssessment}
              className="inline-flex items-center gap-2 px-6 py-4 text-sm font-black uppercase tracking-wider text-black bg-[#FFE500] hover:bg-[#FFD000] border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000] transition-all group"
            >
              <span>Get Started · Launch Assessment</span>
              <ArrowRight className="w-4 h-4 stroke-[3] transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={onNavigateToOverview}
              className="inline-flex items-center gap-2 px-5 py-4 text-sm font-bold uppercase tracking-wider text-black bg-white hover:bg-[#00F0A8] border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] transition-all"
            >
              <BarChart3 className="w-4 h-4 stroke-[2.5]" />
              <span>Explore Dashboard</span>
            </button>
            <button
              onClick={scrollToMethodology}
              className="inline-flex items-center gap-1.5 px-4 py-4 text-sm font-bold uppercase tracking-wider text-black bg-white hover:bg-[#FAF7EE] border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-all"
            >
              <span>How It Works</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-mono font-bold text-black border-t-2 border-black">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-black stroke-[2.5]" />
              <span>AUDIT-GRADE DETERMINISTIC FUNNEL</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-black stroke-[2.5]" />
              <span>TIER-1 VS TIER-2 INDIA BENCHMARKS</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-black stroke-[2.5]" />
              <span>BOARD-READY PDF & JSON EXPORT</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions / Core Capabilities Grid */}
      <section className="space-y-6">
        <div className="border-b-3 border-black pb-3">
          <div className="text-xs font-mono font-black uppercase bg-black text-[#FFE500] px-2 py-0.5 inline-block">
            PLATFORM CAPABILITIES
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-black uppercase font-display mt-2">
            Engineered for Executive Location Strategy
          </h2>
          <p className="text-sm font-mono text-neutral-700 mt-1">
            Traditional expansion advice relies on anecdotal pitch decks. GCC Compass provides a rigorous mathematical framework grounded in verified labor market realities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Location Intelligence */}
          <div className="bg-white border-3 border-black p-6 shadow-[5px_5px_0px_0px_#000] space-y-4 hover:shadow-[7px_7px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-11 h-11 bg-[#FFE500] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                <Building2 className="w-6 h-6 stroke-[2.5] text-black" />
              </div>
              <h3 className="text-base font-black text-black uppercase font-display">
                Location Intelligence & Ecosystem Sizing
              </h3>
              <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                Compare saturated Tier-1 hubs (Bengaluru, Hyderabad, Pune) with emerging Tier-2 tech destinations (Visakhapatnam, Coimbatore, Bhubaneswar). Evaluate tech talent depth, cost arbitrage, attrition rates, and existing enterprise GCC footprint.
              </p>
            </div>
            <div className="pt-3 border-t-2 border-black flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-neutral-600">6 HUBS BENCHMARKED</span>
              <button
                onClick={onNavigateToOverview}
                className="font-black text-black bg-[#FFE500] px-2 py-1 border border-black hover:bg-[#FFD000] flex items-center gap-1 transition-colors uppercase"
              >
                <span>View Profiles</span>
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Card 2: Reverse Funnel Modeling */}
          <div className="bg-white border-3 border-black p-6 shadow-[5px_5px_0px_0px_#000] space-y-4 hover:shadow-[7px_7px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-11 h-11 bg-[#00F0A8] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                <Sliders className="w-6 h-6 stroke-[2.5] text-black" />
              </div>
              <h3 className="text-base font-black text-black uppercase font-display">
                Deterministic Funnel Modeling
              </h3>
              <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                Work backward from target headcount to compute precise top-of-funnel resume volumes, screening passes, interview requirements, and extended offer counts based on empirically calibrated conversion ratios.
              </p>
            </div>
            <div className="pt-3 border-t-2 border-black flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-neutral-600">REACTIVE SLIDERS</span>
              <button
                onClick={onStartAssessment}
                className="font-black text-black bg-[#00F0A8] px-2 py-1 border border-black hover:bg-[#00d694] flex items-center gap-1 transition-colors uppercase"
              >
                <span>Open Plan Builder</span>
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Card 3: Recruiter Capacity & Bottlenecks */}
          <div className="bg-white border-3 border-black p-6 shadow-[5px_5px_0px_0px_#000] space-y-4 hover:shadow-[7px_7px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-11 h-11 bg-[#FF5A36] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                <Users className="w-6 h-6 stroke-[2.5] text-white" />
              </div>
              <h3 className="text-base font-black text-black uppercase font-display">
                Recruiter & Engineering Capacity
              </h3>
              <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                Simulate in-house Talent Acquisition throughput and senior engineer interview load. Instantly uncover recruiter deficits, identify monthly bottlenecks, and gauge external agency scaling requirements.
              </p>
            </div>
            <div className="pt-3 border-t-2 border-black flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-neutral-600">DEFICIT WARNINGS</span>
              <button
                onClick={onStartAssessment}
                className="font-black text-white bg-[#FF5A36] px-2 py-1 border border-black hover:bg-[#FF451A] flex items-center gap-1 transition-colors uppercase"
              >
                <span>Calibrate Capacity</span>
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Card 4: Notice Period & Reneging Modeling */}
          <div className="bg-white border-3 border-black p-6 shadow-[5px_5px_0px_0px_#000] space-y-4 hover:shadow-[7px_7px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-11 h-11 bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                <Clock className="w-6 h-6 stroke-[2.5] text-black" />
              </div>
              <h3 className="text-base font-black text-black uppercase font-display">
                Indian Notice Period & Attrition Lags
              </h3>
              <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                Incorporate statutory 60–90 day notice periods and 20–35% offer drop-out rates into your timeline. Calculate the exact month when all offers must be signed before day-1 operational opening.
              </p>
            </div>
            <div className="pt-3 border-t-2 border-black flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-neutral-600">CUTOFF DETECTION</span>
              <button
                onClick={onNavigateToOverview}
                className="font-black text-black bg-[#FFE500] px-2 py-1 border border-black hover:bg-[#FFD000] flex items-center gap-1 transition-colors uppercase"
              >
                <span>Inspect Timeline</span>
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Card 5: Stress Testing & Scenario Matrix */}
          <div className="bg-white border-3 border-black p-6 shadow-[5px_5px_0px_0px_#000] space-y-4 hover:shadow-[7px_7px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-11 h-11 bg-[#00F0A8] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                <Layers className="w-6 h-6 stroke-[2.5] text-black" />
              </div>
              <h3 className="text-base font-black text-black uppercase font-display">
                Adverse Market Stress Testing
              </h3>
              <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                Test your expansion against adverse market conditions: severe offer reneging, extended notice delays, and recruiter bandwidth contractions. Evaluate sensitivity side-by-side against baseline.
              </p>
            </div>
            <div className="pt-3 border-t-2 border-black flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-neutral-600">5 PRESET STRESS TESTS</span>
              <button
                onClick={onNavigateToStressTest}
                className="font-black text-black bg-[#00F0A8] px-2 py-1 border border-black hover:bg-[#00d694] flex items-center gap-1 transition-colors uppercase"
              >
                <span>Run Stress Test</span>
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Card 6: Audit-Grade Evidence & Briefs */}
          <div className="bg-white border-3 border-black p-6 shadow-[5px_5px_0px_0px_#000] space-y-4 hover:shadow-[7px_7px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-11 h-11 bg-[#FFE500] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                <BookOpen className="w-6 h-6 stroke-[2.5] text-black" />
              </div>
              <h3 className="text-base font-black text-black uppercase font-display">
                Evidence Library & Board Briefs
              </h3>
              <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                Every assumption is anchored in documented labor data, industry reports, and empirical benchmarks. Import external evidence batches via JSON schema or export executive PDF and JSON decision briefs.
              </p>
            </div>
            <div className="pt-3 border-t-2 border-black flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-neutral-600">VERIFIED CITATIONS</span>
              <button
                onClick={onNavigateToBrief}
                className="font-black text-black bg-[#FFE500] px-2 py-1 border border-black hover:bg-[#FFD000] flex items-center gap-1 transition-colors uppercase"
              >
                <span>View Decision Brief</span>
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Active Assessment Live Teaser */}
      <section className="bg-[#FFFDF5] border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-3 border-black pb-5">
          <div>
            <div className="text-xs font-mono font-black uppercase text-neutral-600">
              ACTIVE ASSESSMENT ENGINE PREVIEW
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-black uppercase font-display mt-1">
              Current Model: {config.totalTargetHires} Tech Hires in {city.name} across {config.deadlineMonths} Months
            </h2>
          </div>
          <div className="flex items-center gap-3 font-mono">
            <span className="text-xs font-black uppercase bg-[#00F0A8] text-black px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              FEASIBILITY: {calc.overallFeasibilityStatus}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
          <div className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000]">
            <div className="text-xs font-bold text-neutral-600 uppercase">Target Joiners</div>
            <div className="text-2xl font-black text-black mt-1">
              {calc.targetHires}
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5">
              Across {config.deadlineMonths} Months
            </div>
          </div>

          <div className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000]">
            <div className="text-xs font-bold text-neutral-600 uppercase">Sourced Resumes</div>
            <div className="text-2xl font-black text-black bg-[#FFE500] px-1 inline-block mt-1">
              {calc.requiredTotalApplicantPool.toLocaleString()}
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5">
              Reverse funnel math
            </div>
          </div>

          <div className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000]">
            <div className="text-xs font-bold text-neutral-600 uppercase">Offer Window</div>
            <div className="text-2xl font-black text-black mt-1">
              {calc.activeInterviewWindowMonths} Months
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5">
              Cutoff Month {calc.latestOfferCutoffMonth}
            </div>
          </div>

          <div className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000]">
            <div className="text-xs font-bold text-neutral-600 uppercase">TA Team Status</div>
            <div className="text-2xl font-black text-black mt-1">
              {calc.isRecruiterCapacityExceeded ? `-${calc.recruiterDeficit} TA Deficit` : 'Capacity OK'}
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5">
              {config.dedicatedRecruiters} recruiters
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
          <p className="text-xs text-neutral-800 leading-relaxed max-w-2xl font-medium">
            {calc.feasibilityRationale}
          </p>
          <button
            onClick={onStartAssessment}
            className="px-4 py-2.5 text-xs font-black uppercase text-black bg-[#FFE500] hover:bg-[#FFD000] border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>Open in Plan Builder</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </section>

      {/* Target Personas Section */}
      <section className="bg-black text-white border-4 border-black p-8 sm:p-12 shadow-[8px_8px_0px_0px_#FFE500] space-y-8">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-mono font-black uppercase tracking-wider text-[#FFE500]">
            ENTERPRISE DECISION MAKERS
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-display">
            Built for Global Expansion & Talent Leaders
          </h2>
          <p className="text-sm font-mono text-neutral-300">
            Trusted by cross-functional executives evaluating Indian GCC setups and scaling operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
          <div className="p-5 bg-white text-black border-3 border-black space-y-2 shadow-[4px_4px_0px_0px_#00F0A8]">
            <h4 className="text-base font-black uppercase font-display">
              GCC Expansion Directors
            </h4>
            <p className="text-xs text-neutral-700 leading-relaxed font-medium">
              Evaluate Tier-1 vs Tier-2 location trade-offs, compare operational risks, and defend location selection to board members with verifiable empirical evidence.
            </p>
          </div>

          <div className="p-5 bg-white text-black border-3 border-black space-y-2 shadow-[4px_4px_0px_0px_#FFE500]">
            <h4 className="text-base font-black uppercase font-display">
              Global TA Heads
            </h4>
            <p className="text-xs text-neutral-700 leading-relaxed font-medium">
              Accurately size recruiter headcounts, determine RPO agency budget requirements, and set realistic hiring pace milestones before signing lease commitments.
            </p>
          </div>

          <div className="p-5 bg-white text-black border-3 border-black space-y-2 shadow-[4px_4px_0px_0px_#FF5A36]">
            <h4 className="text-base font-black uppercase font-display">
              CTOs & Eng Leaders
            </h4>
            <p className="text-xs text-neutral-700 leading-relaxed font-medium">
              Anticipate engineering interviewer capacity drain, understand local seniority distributions, and protect technical bar integrity under aggressive timelines.
            </p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-[#FFFDF5] border-4 border-black p-8 sm:p-12 text-center space-y-6 shadow-[6px_6px_0px_0px_#000]">
        <div className="max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black font-display">
            Ready to Evaluate Your GCC Hiring Feasibility?
          </h2>
          <p className="text-sm font-mono text-neutral-700">
            Start modeling now in guest mode or sign in with enterprise credentials.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 font-mono">
          <button
            onClick={onStartAssessment}
            className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-black uppercase text-black bg-[#FFE500] hover:bg-[#FFD000] border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] transition-all"
          >
            <span>Launch Plan Builder</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
          <button
            onClick={onOpenAuth}
            className="inline-flex items-center gap-2 px-5 py-3.5 text-xs font-bold uppercase text-black bg-white hover:bg-[#FAF7EE] border-2 border-black shadow-[3px_3px_0px_0px_#000] transition-all"
          >
            <span>Sign In / Select Profile</span>
          </button>
        </div>
      </section>
    </div>
  );
};
