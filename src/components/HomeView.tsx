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
  Sparkles,
  RotateCcw,
  Play,
} from 'lucide-react';
import { CityProfile, HiringPlanConfig, CalculationResult } from '../types';
import { DEMO_SCENARIOS } from '../data/defaultData';

interface HomeViewProps {
  city: CityProfile;
  config: HiringPlanConfig;
  calc: CalculationResult;
  hasActiveAssessment?: boolean;
  activeScenarioName?: string | null;
  onStartAssessment: () => void;
  onNavigateToBuilder: () => void;
  onNavigateToOverview: () => void;
  onNavigateToStressTest: () => void;
  onNavigateToEvidence: () => void;
  onNavigateToBrief: () => void;
  onNavigateToIntro?: () => void;
  onNavigateToMap?: () => void;
  onLoadDemoScenario?: (demoKey: string) => void;
  onClearAssessment?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  city,
  config,
  calc,
  hasActiveAssessment = false,
  activeScenarioName,
  onStartAssessment,
  onNavigateToBuilder,
  onNavigateToOverview,
  onNavigateToStressTest,
  onNavigateToEvidence,
  onNavigateToBrief,
  onNavigateToIntro,
  onNavigateToMap,
  onLoadDemoScenario,
  onClearAssessment,
}) => {
  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-10">
      {/* Hero Section in Retro NeoBrutalism */}
      <div className="bg-[#FFFDF5] border-4 border-black p-8 sm:p-12 shadow-[8px_8px_0px_0px_#000] relative overflow-hidden">
        {/* Retro hazard ribbon accent in top right */}
        <div className="absolute top-0 right-0 w-32 h-6 hazard-stripes border-b-2 border-l-2 border-black pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-[#FFE500] border-2 border-black font-mono text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
            <Compass className="w-4 h-4 stroke-[2.5]" />
            <span>SYS // GCC COMPASS STRATEGIC MATRIX</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black leading-tight uppercase font-display">
            Make Evidence-Backed Decisions About GCC Locations and Hiring Feasibility.
          </h1>

          <p className="text-base sm:text-lg text-neutral-800 leading-relaxed font-medium">
            Configure hiring plans, evaluate recruitment capacity, stress-test scenarios, and explore supporting evidence to understand the feasibility and risks of your GCC expansion plans.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 font-mono">
            <button
              onClick={onStartAssessment}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-black bg-[#FFE500] hover:bg-[#FFD000] border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000] transition-all group"
            >
              <span>Start Assessment</span>
              <ArrowRight className="w-4 h-4 stroke-[3] transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={scrollToHowItWorks}
              className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-bold uppercase tracking-wider text-black bg-white hover:bg-[#FAF7EE] border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] transition-all"
            >
              <span>Explore How It Works</span>
            </button>
            <button
              onClick={onNavigateToOverview}
              className="inline-flex items-center gap-2 px-4 py-3.5 text-sm font-bold uppercase tracking-wider text-black bg-white hover:bg-[#00F0A8] border-2 border-black shadow-[3px_3px_0px_0px_#000] transition-all"
            >
              <span>View Overview</span>
            </button>
            {onNavigateToIntro && (
              <button
                onClick={onNavigateToIntro}
                className="inline-flex items-center gap-2 px-4 py-3.5 text-sm font-bold uppercase tracking-wider text-neutral-700 bg-white hover:bg-[#FAF7EE] border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-all"
              >
                <span>Platform Intro</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ASSESSMENT-FIRST SECTION: Active Assessment vs Clean Unassessed Gateway */}
      {hasActiveAssessment ? (
        /* State A: Active Assessment Results Card */
        <div className="bg-[#FFFDF5] border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-3 border-black pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black text-black uppercase tracking-wider bg-[#00F0A8] px-2.5 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                  {activeScenarioName ? `Demo Scenario: ${activeScenarioName}` : 'Active Custom Assessment'}
                </span>
                <span className="text-xs font-mono font-bold text-neutral-700">// {city.name}, {city.state}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-black uppercase font-display mt-2">
                {config.totalTargetHires} Tech Hires in {city.name} across {config.deadlineMonths} Months
              </h2>
              <p className="text-xs font-mono text-neutral-700 mt-0.5">
                Testing operational viability against a {config.noticePeriodLagDays}-day notice period assumption and candidate reneging frictions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 font-mono">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000] ${
                  calc.overallFeasibilityStatus === 'Mathematically Viable'
                    ? 'bg-[#00F0A8] text-black'
                    : calc.overallFeasibilityStatus === 'Capacity Constrained'
                    ? 'bg-[#FFE500] text-black'
                    : 'bg-[#FF5A36] text-white'
                }`}
              >
                {calc.overallFeasibilityStatus === 'Mathematically Viable' ? (
                  <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
                )}
                {calc.overallFeasibilityStatus}
              </span>

              <button
                onClick={onStartAssessment}
                className="px-3.5 py-2 text-xs font-black uppercase text-black bg-[#FFE500] hover:bg-[#FFD000] border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-all inline-flex items-center gap-1"
              >
                <span>Open Plan Builder</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              <button
                onClick={onNavigateToOverview}
                className="px-3.5 py-2 text-xs font-black uppercase text-white bg-black hover:bg-neutral-800 border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-all inline-flex items-center gap-1"
              >
                <span>Full Overview</span>
              </button>

              {onClearAssessment && (
                <button
                  onClick={onClearAssessment}
                  className="px-2.5 py-2 text-xs font-bold uppercase text-black bg-white hover:bg-neutral-100 border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-all"
                  title="Clear assessment and return to clean setup state"
                >
                  <RotateCcw className="w-3.5 h-3.5 inline mr-1 stroke-[2.5]" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* 4 Key Findings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] space-y-1">
              <div className="text-[10px] font-mono font-black text-neutral-600 uppercase">1. Active Offer Window</div>
              <div className="text-2xl font-black font-mono text-black">
                {calc.activeInterviewWindowMonths} Months
              </div>
              <div className="text-xs text-neutral-700 leading-tight">
                {config.noticePeriodLagDays}-day notice lag enforces offer cutoff at Month {calc.latestOfferCutoffMonth}.
              </div>
            </div>

            <div className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] space-y-1">
              <div className="text-[10px] font-mono font-black text-neutral-600 uppercase">2. Top-of-Funnel Pool</div>
              <div className="text-2xl font-black font-mono text-black bg-[#FFE500] px-1 inline-block">
                {calc.requiredTotalApplicantPool.toLocaleString()}
              </div>
              <div className="text-xs text-neutral-700 leading-tight">
                Raw resumes required to yield {calc.targetHires} joiners at {((calc.targetHires / calc.requiredTotalApplicantPool) * 100).toFixed(2)}% yield.
              </div>
            </div>

            <div className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] space-y-1">
              <div className="text-[10px] font-mono font-black text-neutral-600 uppercase">3. Technical Interviews</div>
              <div className="text-2xl font-black font-mono text-black">
                {calc.requiredInterviews.toLocaleString()}
              </div>
              <div className="text-xs text-neutral-700 leading-tight">
                Requires {calc.monthlyInterviewsNeeded}/mo interview pace and {calc.engineeringInterviewHoursTotal.toLocaleString()} panel hours.
              </div>
            </div>

            <div className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] space-y-1">
              <div className="text-[10px] font-mono font-black text-neutral-600 uppercase">4. Recruiter Workload</div>
              <div className={`text-2xl font-black font-mono px-1 inline-block border border-black ${
                calc.isRecruiterCapacityExceeded ? 'bg-[#FF5A36] text-white' : 'bg-[#00F0A8] text-black'
              }`}>
                {calc.recruiterCapacityUtilizationPct}%
              </div>
              <div className="text-xs text-neutral-700 leading-tight">
                {calc.isRecruiterCapacityExceeded
                  ? `Capacity deficit of ${calc.recruiterDeficit} in-house recruiter(s).`
                  : 'Recruiter capacity within operating threshold.'}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* State B: Clean Initial State (No Completed Assessment Results Displayed Automatically) */
        <div className="bg-[#FFFDF5] border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000] space-y-6">
          <div className="border-b-3 border-black pb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-[#FFE500] border-2 border-black text-xs font-mono font-black uppercase mb-2">
              <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>ASSESSMENT SETUP GATEWAY // DETERMINISTIC MODELING</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-black uppercase font-display">
              Ready to Evaluate Your GCC Expansion Plan?
            </h2>
            <p className="text-sm text-neutral-800 mt-1 max-w-3xl leading-relaxed font-medium">
              The initial dashboard remains clean until you choose an evaluation pathway. Choose between configuring your organization’s custom hiring goals or loading an audit-grade enterprise demonstration scenario.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pathway 1: Custom Assessment */}
            <div className="p-6 bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between space-y-4 hover:shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
              <div className="space-y-3">
                <div className="w-11 h-11 bg-[#FFE500] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                  <Sliders className="w-6 h-6 stroke-[2.5] text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-black uppercase font-display">
                    Create Custom Workforce Assessment
                  </h3>
                  <p className="text-xs text-neutral-700 mt-1 leading-relaxed font-medium">
                    Define target headcount, select your expansion city across 6 benchmarked locations (Bengaluru, Hyderabad, Pune, Visakhapatnam, Coimbatore, Bhubaneswar), set project timelines, and tune stage conversion yields.
                  </p>
                </div>
                <div className="pt-1 flex flex-wrap gap-2 text-[10px] font-mono font-bold">
                  <span className="px-2 py-0.5 bg-[#FAF7EE] border border-black">CUSTOM HEADCOUNT</span>
                  <span className="px-2 py-0.5 bg-[#FAF7EE] border border-black">60/90D NOTICE LAG</span>
                  <span className="px-2 py-0.5 bg-[#FAF7EE] border border-black">TA CAPACITY SIZING</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onStartAssessment}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-wider text-black bg-[#FFE500] hover:bg-[#FFD000] border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] transition-all font-mono"
                >
                  <span>Start Assessment in Plan Builder</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>

            {/* Pathway 2: Load Demo Scenarios */}
            <div className="p-6 bg-[#FAF7EE] border-3 border-black shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-11 h-11 bg-[#00F0A8] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                  <Sparkles className="w-6 h-6 stroke-[2.5] text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-black uppercase font-display">
                    Explore Enterprise Demo Scenarios
                  </h3>
                  <p className="text-xs text-neutral-700 mt-1 leading-relaxed font-medium">
                    Inspect pre-modeled enterprise scenarios based on verified Indian labor-market frictions, recruiter throughput capacities, and notice-period bottlenecks.
                  </p>
                </div>

                <div className="space-y-2 pt-1 font-mono">
                  {DEMO_SCENARIOS.slice(0, 3).map((demo) => (
                    <div
                      key={demo.id}
                      className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-between gap-3 text-left"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-black text-black truncate uppercase">
                          {demo.title}
                        </div>
                        <div className="text-[11px] text-neutral-600">
                          {demo.headcount} Hires · {demo.cityName} · {demo.deadlineMonths} Mo
                        </div>
                      </div>
                      <button
                        onClick={() => onLoadDemoScenario && onLoadDemoScenario(demo.key)}
                        className="px-3 py-1 text-xs font-black uppercase text-black bg-[#FFE500] hover:bg-[#FFD000] border border-black shadow-[1px_1px_0px_0px_#000] shrink-0"
                      >
                        Load Demo
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 font-mono">
                <button
                  onClick={onNavigateToOverview}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-black bg-white hover:bg-[#00F0A8] border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-colors"
                >
                  <span>Browse All 5 Demo Scenarios in Overview</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Core Capabilities in Retro NeoBrutalism */}
      <div className="space-y-5">
        <div className="border-b-3 border-black pb-3">
          <div className="text-xs font-mono font-black uppercase bg-black text-[#FFE500] px-2 py-0.5 inline-block">
            CAPABILITY SUITE
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-black uppercase font-display mt-2">
            Core Location Intelligence & Feasibility Capabilities
          </h3>
          <p className="text-xs font-mono text-neutral-700 mt-1">
            Engineered for enterprise workforce planners, GCC expansion leaders, and executive decision-makers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white border-3 border-black p-6 shadow-[5px_5px_0px_0px_#000] space-y-4 flex flex-col justify-between hover:shadow-[7px_7px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-[#FFE500] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                  <Building2 className="w-5 h-5 stroke-[2.5] text-black" />
                </div>
                <span className="font-mono text-xs font-black">01 //</span>
              </div>
              <h4 className="text-base font-black text-black uppercase font-display">
                Multi-City Location Intelligence
              </h4>
              <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                Benchmark talent pools across Tier-1 metros (Bengaluru, Hyderabad, Pune) and emerging Tier-2 hubs (Visakhapatnam, Coimbatore, Bhubaneswar). Evaluates local seniority distributions, voluntary attrition, and established GCC campuses.
              </p>
            </div>
            <button
              onClick={onNavigateToMap || onStartAssessment}
              className="text-xs font-mono font-black uppercase text-black hover:bg-[#FFE500] px-2 py-1 border border-black inline-flex items-center gap-1.5 self-start transition-colors"
            >
              <span>Explore Locations on Map</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-white border-3 border-black p-6 shadow-[5px_5px_0px_0px_#000] space-y-4 flex flex-col justify-between hover:shadow-[7px_7px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-[#00F0A8] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                  <BarChart3 className="w-5 h-5 stroke-[2.5] text-black" />
                </div>
                <span className="font-mono text-xs font-black">02 //</span>
              </div>
              <h4 className="text-base font-black text-black uppercase font-display">
                Deterministic Funnel Engine
              </h4>
              <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                Strict backward induction calculations without floating-point approximations. Accurately determines required volumes at every step: Sourced Resumes → Qualified Screens → Technical Interviews → Offers → Day-1 Joiners.
              </p>
            </div>
            <button
              onClick={onNavigateToBuilder}
              className="text-xs font-mono font-black uppercase text-black hover:bg-[#00F0A8] px-2 py-1 border border-black inline-flex items-center gap-1.5 self-start transition-colors"
            >
              <span>Open Plan Configurator</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-white border-3 border-black p-6 shadow-[5px_5px_0px_0px_#000] space-y-4 flex flex-col justify-between hover:shadow-[7px_7px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-[#FF5A36] text-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                  <Clock className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="font-mono text-xs font-black">03 //</span>
              </div>
              <h4 className="text-base font-black text-black uppercase font-display">
                Notice-Period Runway Stress Testing
              </h4>
              <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                Models Indian 60-day and 90-day employment notice-period assumptions. Uncovers compressed offer closure deadlines and flags mathematically impossible hiring plans before capital is committed.
              </p>
            </div>
            <button
              onClick={onNavigateToStressTest}
              className="text-xs font-mono font-black uppercase text-black hover:bg-[#FF5A36] hover:text-white px-2 py-1 border border-black inline-flex items-center gap-1.5 self-start transition-colors"
            >
              <span>Compare Scenarios</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Card 4 */}
          <div className="bg-white border-3 border-black p-6 shadow-[5px_5px_0px_0px_#000] space-y-4 flex flex-col justify-between hover:shadow-[7px_7px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                  <Users className="w-5 h-5 stroke-[2.5] text-black" />
                </div>
                <span className="font-mono text-xs font-black">04 //</span>
              </div>
              <h4 className="text-base font-black text-black uppercase font-display">
                TA Capacity & Engineering Load
              </h4>
              <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                Simulates in-house recruiter bandwidth against candidate velocity. Quantifies team deficits, evaluates agency / RPO multiplier options, and computes senior engineering interviewer panel hours.
              </p>
            </div>
            <button
              onClick={onNavigateToBuilder}
              className="text-xs font-mono font-black uppercase text-black hover:bg-[#FFE500] px-2 py-1 border border-black inline-flex items-center gap-1.5 self-start transition-colors"
            >
              <span>Audit Team Capacity</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Card 5 */}
          <div className="bg-white border-3 border-black p-6 shadow-[5px_5px_0px_0px_#000] space-y-4 flex flex-col justify-between hover:shadow-[7px_7px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-[#00F0A8] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                  <BookOpen className="w-5 h-5 stroke-[2.5] text-black" />
                </div>
                <span className="font-mono text-xs font-black">05 //</span>
              </div>
              <h4 className="text-base font-black text-black uppercase font-display">
                Evidence Library & Epistemic Audit
              </h4>
              <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                Every claim is transparently classified: Verified Facts, Third-Party Estimates (NASSCOM, Aon, Mercer), Corporate Announcements, Model Inferences, or items explicitly marked as Requiring Verification.
              </p>
            </div>
            <button
              onClick={onNavigateToEvidence}
              className="text-xs font-mono font-black uppercase text-black hover:bg-[#00F0A8] px-2 py-1 border border-black inline-flex items-center gap-1.5 self-start transition-colors"
            >
              <span>Review Evidence Base</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Card 6 */}
          <div className="bg-white border-3 border-black p-6 shadow-[5px_5px_0px_0px_#000] space-y-4 flex flex-col justify-between hover:shadow-[7px_7px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-[#FFE500] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                  <FileText className="w-5 h-5 stroke-[2.5] text-black" />
                </div>
                <span className="font-mono text-xs font-black">06 //</span>
              </div>
              <h4 className="text-base font-black text-black uppercase font-display">
                Executive Decision Brief & Export
              </h4>
              <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                Generate board-ready decision memos with mathematical proofs, sensitivity comparisons, and actionable validation roadmaps. Export directly to printer-friendly PDF, JSON, or Markdown.
              </p>
            </div>
            <button
              onClick={onNavigateToBrief}
              className="text-xs font-mono font-black uppercase text-black hover:bg-[#FFE500] px-2 py-1 border border-black inline-flex items-center gap-1.5 self-start transition-colors"
            >
              <span>View Decision Brief</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Simple 3-Step User Journey */}
      <div id="how-it-works-section" className="bg-black text-white border-4 border-black p-8 sm:p-10 shadow-[8px_8px_0px_0px_#FFE500] space-y-8 scroll-mt-24">
        <div>
          <div className="text-xs font-mono font-black text-[#FFE500] uppercase tracking-wider">
            HOW GCC COMPASS WORKS // ASSESSMENT WORKFLOW
          </div>
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mt-1 font-display">
            How to Stress-Test a GCC Workforce Expansion Plan
          </h3>
          <p className="text-xs font-mono text-neutral-300 mt-1 max-w-2xl">
            A three-step analytical workflow designed to replace speculative estimates with mathematically rigorous operational modeling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white text-black border-3 border-black p-5 space-y-3 shadow-[4px_4px_0px_0px_#FFE500]">
            <div className="w-8 h-8 bg-[#FFE500] text-black font-mono text-sm font-black flex items-center justify-center border-2 border-black">
              01
            </div>
            <h4 className="text-base font-black uppercase font-display">Define Target Scope & City</h4>
            <p className="text-xs text-neutral-700 leading-relaxed font-medium">
              Select your Indian location, target headcount, seniority mix, and project deadline to establish the baseline operational scope.
            </p>
          </div>

          <div className="bg-white text-black border-3 border-black p-5 space-y-3 shadow-[4px_4px_0px_0px_#00F0A8]">
            <div className="w-8 h-8 bg-[#00F0A8] text-black font-mono text-sm font-black flex items-center justify-center border-2 border-black">
              02
            </div>
            <h4 className="text-base font-black uppercase font-display">Tune Funnel & Capacity</h4>
            <p className="text-xs text-neutral-700 leading-relaxed font-medium">
              Adjust stage conversion yields, notice-period reneging rates, and in-house recruiter team capacity to observe live bottleneck alerts.
            </p>
          </div>

          <div className="bg-white text-black border-3 border-black p-5 space-y-3 shadow-[4px_4px_0px_0px_#FF5A36]">
            <div className="w-8 h-8 bg-[#FF5A36] text-white font-mono text-sm font-black flex items-center justify-center border-2 border-black">
              03
            </div>
            <h4 className="text-base font-black uppercase font-display">Stress-Test & Export</h4>
            <p className="text-xs text-neutral-700 leading-relaxed font-medium">
              Compare alternative scenarios (e.g. compressed timelines vs RPO mitigation) and export a board-ready executive brief in PDF or JSON.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t-2 border-neutral-700 flex flex-wrap items-center justify-between gap-4 font-mono">
          <div className="text-xs text-neutral-400">
            AUDIT-GRADE DETERMINISTIC MODELING // ZERO FLOATING-POINT DRIFT
          </div>
          <button
            onClick={onStartAssessment}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFE500] text-black hover:bg-[#FFD000] font-black text-xs uppercase tracking-wider border-2 border-white shadow-[3px_3px_0px_0px_#fff] transition-all"
            aria-label="Start Assessment"
          >
            <span>Start Assessment</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
