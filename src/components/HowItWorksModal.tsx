import React, { useEffect, useRef } from 'react';
import {
  Compass,
  X,
  MapPin,
  Sliders,
  BarChart3,
  AlertTriangle,
  FileText,
  Building2,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartExploring: () => void;
  onOpenMapIntelligence: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onStartExploring,
  onOpenMapIntelligence,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key press & trap focus
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Focus close button on mount for accessibility
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs font-sans animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-it-works-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-[#FFFDF5] border-4 border-black shadow-[10px_10px_0px_0px_#000] max-w-3xl w-full my-auto overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b-3 border-black flex items-center justify-between bg-[#FFE500] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-black text-[#FFE500] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
              <Compass className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2
                id="how-it-works-title"
                className="text-lg sm:text-xl font-black text-black uppercase tracking-tight font-display"
              >
                How GCC Compass Works
              </h2>
              <p className="text-[11px] font-mono text-neutral-800 font-bold">
                A 7-Step Analytical Guide to Location & Hiring Feasibility
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="w-8 h-8 bg-white hover:bg-black hover:text-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] transition-colors"
            aria-label="Close user guide"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Scrollable Guide Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          {/* Introduction Card */}
          <div className="bg-[#FAF7EE] border-2 border-black p-4 shadow-[3px_3px_0px_0px_#000]">
            <p className="text-xs sm:text-sm text-neutral-900 leading-relaxed font-medium">
              GCC Compass replaces consultancy guesswork with mathematical modeling and verified ecosystem data.
              Whether you are planning a 50-person product squad or a 500-seat engineering center in India, this guide
              walks you through researching cities, building realistic hiring schedules, and stress-testing operational capacity.
            </p>
          </div>

          {/* 7 Steps List */}
          <div className="space-y-4 font-sans">
            {/* Step 1 */}
            <div className="bg-white border-3 border-black p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000] flex gap-3.5 sm:gap-4 items-start">
              <div className="w-8 h-8 shrink-0 bg-[#FFE500] text-black font-mono font-black text-sm flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                01
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-black uppercase font-display">
                    Start Exploring
                  </h3>
                  <span className="text-[10px] font-mono font-bold bg-[#00F0A8] px-1.5 py-0.2 border border-black uppercase">
                    Zero Setup Required
                  </span>
                </div>
                <p className="text-xs text-neutral-800 leading-relaxed">
                  When you enter the platform, you begin at the Platform Overview. You can freely explore the talent
                  intelligence matrix, compare cities, and review evidence before running or committing to any specific
                  hiring assessment.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white border-3 border-black p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000] flex gap-3.5 sm:gap-4 items-start">
              <div className="w-8 h-8 shrink-0 bg-[#00F0A8] text-black font-mono font-black text-sm flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                02
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-black uppercase font-display">
                    Choose How to Begin
                  </h3>
                </div>
                <p className="text-xs text-neutral-800 leading-relaxed">
                  Select your starting pathway from the dashboard:
                </p>
                <ul className="text-xs text-neutral-800 space-y-1 list-disc list-inside mt-1 font-medium">
                  <li>
                    <strong>Explore City Intelligence:</strong> Research talent depth and verified captives across 6 cities without creating a plan.
                  </li>
                  <li>
                    <strong>Load an Enterprise Demo Scenario:</strong> Pick one of five pre-calculated enterprise setups (e.g. Bengaluru Baseline or Hyderabad Expansion).
                  </li>
                  <li>
                    <strong>Configure a Custom Assessment:</strong> Input your own target headcount, timeline, and recruiter assumptions.
                  </li>
                </ul>
                <p className="text-[11px] font-mono text-neutral-600 mt-1">
                  <em>Note:</em> Exploring data is purely informational. Running an assessment calculates live funnel bottlenecks.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white border-3 border-black p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000] flex gap-3.5 sm:gap-4 items-start">
              <div className="w-8 h-8 shrink-0 bg-[#E8DEFF] text-black font-mono font-black text-sm flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                03
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 stroke-[2.5] text-black" />
                  <h3 className="text-sm sm:text-base font-black text-black uppercase font-display">
                    Explore a City & Verified Companies
                  </h3>
                </div>
                <p className="text-xs text-neutral-800 leading-relaxed">
                  Open <strong>Map Intelligence</strong> to inspect six audited hubs: Bengaluru, Hyderabad, Pune, Coimbatore,
                  Visakhapatnam, and Bhubaneswar. Check local tech talent pools, commercial office lease benchmarks (H1 2024),
                  and verified enterprise campuses.
                </p>
                <div className="bg-[#FFFDF5] border border-black p-2.5 text-[11px] text-neutral-800 space-y-1 font-mono">
                  <div className="font-bold flex items-center gap-1.5 text-black">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0A8] stroke-[2.5]" />
                    <span>Important Epistemic Standards:</span>
                  </div>
                  <div>• Companies are categorized as Captives, IT Services, or Product firms.</div>
                  <div>• Seating capacity represents physical building desks, not active employee headcounts.</div>
                  <div>• Private multinational headcounts that are undisclosed are marked as "Data unavailable" rather than guessed.</div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white border-3 border-black p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000] flex gap-3.5 sm:gap-4 items-start">
              <div className="w-8 h-8 shrink-0 bg-[#FFE500] text-black font-mono font-black text-sm flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                04
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 stroke-[2.5] text-black" />
                  <h3 className="text-sm sm:text-base font-black text-black uppercase font-display">
                    Build a Realistic Hiring Plan
                  </h3>
                </div>
                <p className="text-xs text-neutral-800 leading-relaxed">
                  In <strong>Plan Builder</strong>, specify your target hires (e.g. 300), launch runway (e.g. 6 months),
                  and local notice period (60 or 90 days). The system uses backward induction: because Indian tech candidates
                  typically have 60 to 90-day notice periods, all accepted offers must be finalized 2 to 3 months before your
                  scheduled opening date.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white border-3 border-black p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000] flex gap-3.5 sm:gap-4 items-start">
              <div className="w-8 h-8 shrink-0 bg-[#00F0A8] text-black font-mono font-black text-sm flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                05
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 stroke-[2.5] text-black" />
                  <h3 className="text-sm sm:text-base font-black text-black uppercase font-display">
                    Understand the Calculated Results
                  </h3>
                </div>
                <p className="text-xs text-neutral-800 leading-relaxed">
                  Review the mathematical breakdown of your plan:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono mt-1">
                  <div className="bg-[#FAF7EE] border border-black p-2">
                    <span className="font-bold">Sourced Resumes:</span> 30,000+ top-of-funnel profiles needed.
                  </div>
                  <div className="bg-[#FAF7EE] border border-black p-2">
                    <span className="font-bold">Interview Demand:</span> 2,800+ technical evaluation rounds.
                  </div>
                  <div className="bg-[#FAF7EE] border border-black p-2">
                    <span className="font-bold">Recruiter Capacity:</span> Flags team deficits if interviews exceed capacity.
                  </div>
                  <div className="bg-[#FAF7EE] border border-black p-2">
                    <span className="font-bold">Offer Deadline:</span> Hard cutoff month for extending offers.
                  </div>
                </div>
                <p className="text-[11px] font-mono text-neutral-600 mt-1">
                  <em>Disclaimer:</em> Results represent empirical model projections based on inputs and historical pass rates, not guaranteed hiring outcomes.
                </p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="bg-white border-3 border-black p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000] flex gap-3.5 sm:gap-4 items-start">
              <div className="w-8 h-8 shrink-0 bg-[#FFD000] text-black font-mono font-black text-sm flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                06
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 stroke-[2.5] text-black" />
                  <h3 className="text-sm sm:text-base font-black text-black uppercase font-display">
                    Stress-Test Critical Assumptions
                  </h3>
                </div>
                <p className="text-xs text-neutral-800 leading-relaxed">
                  Visit the <strong>Stress Test</strong> workspace to test resilience under pressure. See what happens when
                  timelines shrink from 6 to 4 months, offer reneging spikes to 40%, interview pass bars are raised, or an
                  external RPO agency partner is brought in to double recruiter bandwidth.
                </p>
              </div>
            </div>

            {/* Step 7 */}
            <div className="bg-white border-3 border-black p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000] flex gap-3.5 sm:gap-4 items-start">
              <div className="w-8 h-8 shrink-0 bg-[#00F0A8] text-black font-mono font-black text-sm flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                07
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 stroke-[2.5] text-black" />
                  <h3 className="text-sm sm:text-base font-black text-black uppercase font-display">
                    Review Evidence & Export Decision Briefs
                  </h3>
                </div>
                <p className="text-xs text-neutral-800 leading-relaxed">
                  Verify the underlying data in the <strong>Evidence Library</strong>, where every market claim includes
                  its publisher (NASSCOM, JLL, Colliers, Mercer) and known limitations. Then open the <strong>Decision Brief</strong>
                  to copy an executive summary or download board-ready reports in <strong>Markdown (.md)</strong>,
                  <strong>JSON</strong>, or <strong>PDF</strong> format.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t-3 border-black bg-[#FAF7EE] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider text-black bg-white hover:bg-neutral-200 border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-colors text-center"
          >
            Close Guide
          </button>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={() => {
                onClose();
                onOpenMapIntelligence();
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-[#00F0A8] border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] transition-all"
            >
              <MapPin className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Open Map Intelligence</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onStartExploring();
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4.5 py-2 text-xs font-black uppercase tracking-wider text-black bg-[#FFE500] hover:bg-[#FFD000] border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] transition-all"
            >
              <span>Start Exploring</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
