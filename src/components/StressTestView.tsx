import React, { useState, useEffect } from 'react';
import {
  Layers,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { HiringPlanConfig, CalculationResult, CityProfile } from '../types';
import { calculateHiringPlan } from '../utils/calculator';

interface StressTestViewProps {
  baselineConfig: HiringPlanConfig;
  baselineCalc: CalculationResult;
  city: CityProfile;
}

export const StressTestView: React.FC<StressTestViewProps> = ({
  baselineConfig,
  baselineCalc,
  city,
}) => {
  // Stressed / Alternative scenario state
  const [stressedConfig, setStressedConfig] = useState<HiringPlanConfig>({
    ...baselineConfig,
    // Default stress: lower joining rate (more ghosting/reneging), tighter pass rate
    acceptedToJoiningRate: 65, // 35% dropout
    interviewToOfferRate: 15, // stricter interview bar
    dedicatedRecruiters: 5,
  });

  // Keep target headcount and city in sync with baseline if baseline changes
  useEffect(() => {
    setStressedConfig((prev) => ({
      ...prev,
      cityId: baselineConfig.cityId,
      totalTargetHires: baselineConfig.totalTargetHires,
      roles: baselineConfig.roles,
    }));
  }, [baselineConfig.cityId, baselineConfig.totalTargetHires, baselineConfig.roles]);

  const stressedCalc = calculateHiringPlan(stressedConfig);

  // Preset Handlers
  const applyPreset = (presetName: string) => {
    switch (presetName) {
      case 'high-dropout':
        setStressedConfig({
          ...baselineConfig,
          acceptedToJoiningRate: 60, // 40% renege
          offerAcceptanceRate: 65,
        });
        break;
      case 'compressed-timeline':
        setStressedConfig({
          ...baselineConfig,
          deadlineMonths: 4, // compressed from 6 to 4
          noticePeriodLagDays: 60,
        });
        break;
      case 'high-bar':
        setStressedConfig({
          ...baselineConfig,
          interviewToOfferRate: 12, // 1 in 8 pass rate
          qualifiedToInterviewRate: 25,
        });
        break;
      case 'mitigated-scale':
        setStressedConfig({
          ...baselineConfig,
          dedicatedRecruiters: 8,
          agencySupportEnabled: true,
          agencyCapacityMultiplier: 1.5,
          acceptedToJoiningRate: 80, // boosted through retention bonus
        });
        break;
      case 'reset':
        setStressedConfig({ ...baselineConfig });
        break;
    }
  };

  const handleUpdate = <K extends keyof HiringPlanConfig>(
    key: K,
    value: HiringPlanConfig[K]
  ) => {
    setStressedConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Deltas
  const deltaApplicantPool = stressedCalc.requiredTotalApplicantPool - baselineCalc.requiredTotalApplicantPool;
  const deltaInterviews = stressedCalc.requiredInterviews - baselineCalc.requiredInterviews;
  const deltaOffers = stressedCalc.requiredOffersExtended - baselineCalc.requiredOffersExtended;
  const deltaRecruiterLoad = stressedCalc.recruiterCapacityUtilizationPct - baselineCalc.recruiterCapacityUtilizationPct;
  const deltaEngHours = stressedCalc.engineeringInterviewHoursTotal - baselineCalc.engineeringInterviewHoursTotal;

  return (
    <div className="space-y-8 font-mono animate-fadeIn">
      {/* Top Banner in Retro NeoBrutalism */}
      <div className="bg-[#FFFDF5] border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
              <span className="bg-black text-[#FFE500] px-2.5 py-0.5 font-black uppercase text-xs tracking-wider border border-black shadow-[2px_2px_0px_0px_#000]">
                MODULE 04 // SENSITIVITY TESTING
              </span>
              <span className="text-black font-black">//</span>
              <span className="bg-[#00F0A8] text-black px-2 py-0.5 font-black uppercase border border-black">
                {city.name}, {city.state}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-black uppercase font-display">
              Baseline vs Stressed Scenario Comparison
            </h1>
            <p className="text-xs text-neutral-800 mt-1 max-w-3xl font-medium font-sans">
              Stress-test the {baselineConfig.totalTargetHires}-hire hiring plan under adverse market conditions (severe offer reneges, compressed deadlines, or stricter technical bars).
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-black text-black bg-[#FFE500] border-2 border-black px-3 py-1.5 shadow-[3px_3px_0px_0px_#000] inline-block uppercase">
              Deterministic Comparative Delta
            </span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mt-5 pt-4 border-t-2 border-black flex flex-wrap items-center gap-2">
          <span className="text-xs font-black uppercase text-black mr-1">Load Preset:</span>
          <button
            onClick={() => applyPreset('high-dropout')}
            className="px-3 py-1.5 text-xs bg-white hover:bg-[#FFE500] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] font-black uppercase transition-all"
          >
            Severe Offer Reneging (35% Drop)
          </button>
          <button
            onClick={() => applyPreset('compressed-timeline')}
            className="px-3 py-1.5 text-xs bg-white hover:bg-[#FFE500] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] font-black uppercase transition-all"
          >
            Compressed 4-Month Rush
          </button>
          <button
            onClick={() => applyPreset('high-bar')}
            className="px-3 py-1.5 text-xs bg-white hover:bg-[#FFE500] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] font-black uppercase transition-all"
          >
            Stricter Interview Bar (12% Pass)
          </button>
          <button
            onClick={() => applyPreset('mitigated-scale')}
            className="px-3 py-1.5 text-xs bg-[#00F0A8] hover:bg-[#00d694] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] font-black uppercase transition-all"
          >
            Mitigated Scale-Up (8 Recruiters + RPO)
          </button>
          <button
            onClick={() => applyPreset('reset')}
            className="px-3 py-1.5 text-xs bg-white text-neutral-800 hover:text-black hover:bg-neutral-100 border-2 border-black shadow-[2px_2px_0px_0px_#000] font-black uppercase ml-auto flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
            Clone Baseline
          </button>
        </div>
      </div>

      {/* Delta Callout Summary Cards in Retro NeoBrutalism */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Delta 1: Offers Extended */}
        <div className="bg-white border-3 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
          <div className="text-[11px] font-black uppercase text-neutral-600">Offers Required Delta</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono tabular-nums text-black">
              {stressedCalc.requiredOffersExtended}
            </span>
            <span
              className={`text-xs font-mono font-black px-1 border border-black ${
                deltaOffers > 0 ? 'bg-[#FF5A36] text-white' : deltaOffers < 0 ? 'bg-[#00F0A8] text-black' : 'bg-neutral-200 text-black'
              }`}
            >
              {deltaOffers > 0 ? `+${deltaOffers}` : deltaOffers}
            </span>
          </div>
          <div className="text-[11px] text-neutral-600 mt-2 border-t border-neutral-200 pt-1">
            vs {baselineCalc.requiredOffersExtended} in Baseline
          </div>
        </div>

        {/* Delta 2: Interviews */}
        <div className="bg-white border-3 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
          <div className="text-[11px] font-black uppercase text-neutral-600">Interviews Conducted Delta</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono tabular-nums text-black">
              {stressedCalc.requiredInterviews.toLocaleString()}
            </span>
            <span
              className={`text-xs font-mono font-black px-1 border border-black ${
                deltaInterviews > 0 ? 'bg-[#FF5A36] text-white' : deltaInterviews < 0 ? 'bg-[#00F0A8] text-black' : 'bg-neutral-200 text-black'
              }`}
            >
              {deltaInterviews > 0 ? `+${deltaInterviews.toLocaleString()}` : deltaInterviews.toLocaleString()}
            </span>
          </div>
          <div className="text-[11px] text-neutral-600 mt-2 border-t border-neutral-200 pt-1">
            vs {baselineCalc.requiredInterviews.toLocaleString()} in Baseline
          </div>
        </div>

        {/* Delta 3: Recruiter Load */}
        <div className="bg-white border-3 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
          <div className="text-[11px] font-black uppercase text-neutral-600">Recruiter Team Load Delta</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono tabular-nums text-black">
              {stressedCalc.recruiterCapacityUtilizationPct}%
            </span>
            <span
              className={`text-xs font-mono font-black px-1 border border-black ${
                deltaRecruiterLoad > 0 ? 'bg-[#FF5A36] text-white' : deltaRecruiterLoad < 0 ? 'bg-[#00F0A8] text-black' : 'bg-neutral-200 text-black'
              }`}
            >
              {deltaRecruiterLoad > 0 ? `+${deltaRecruiterLoad}%` : `${deltaRecruiterLoad}%`}
            </span>
          </div>
          <div className="text-[11px] text-neutral-600 mt-2 border-t border-neutral-200 pt-1">
            vs {baselineCalc.recruiterCapacityUtilizationPct}% in Baseline
          </div>
        </div>

        {/* Delta 4: Engineering Time */}
        <div className="bg-white border-3 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
          <div className="text-[11px] font-black uppercase text-neutral-600">Engineering Hours Delta</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono tabular-nums text-black">
              {stressedCalc.engineeringInterviewHoursTotal.toLocaleString()}h
            </span>
            <span
              className={`text-xs font-mono font-black px-1 border border-black ${
                deltaEngHours > 0 ? 'bg-[#FF5A36] text-white' : deltaEngHours < 0 ? 'bg-[#00F0A8] text-black' : 'bg-neutral-200 text-black'
              }`}
            >
              {deltaEngHours > 0 ? `+${deltaEngHours.toLocaleString()}h` : `${deltaEngHours.toLocaleString()}h`}
            </span>
          </div>
          <div className="text-[11px] text-neutral-600 mt-2 border-t border-neutral-200 pt-1">
            vs {baselineCalc.engineeringInterviewHoursTotal.toLocaleString()}h in Baseline
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Stressed Sliders + Side-by-Side Comparison Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Stress Controls (5 cols) */}
        <div className="lg:col-span-5 bg-[#FFFDF5] border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000] space-y-5">
          <div className="border-b-2 border-black pb-3">
            <h2 className="text-sm font-black uppercase text-black font-display">
              Tune Stressed Assumptions
            </h2>
            <p className="text-xs text-neutral-600 mt-0.5">
              Adjust variables to test elasticity of recruitment operations
            </p>
          </div>

          <div className="space-y-4">
            {/* Control: Accepted-to-Joining Rate */}
            <div className="space-y-1.5 p-3.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black uppercase text-black">
                  Accepted-to-Joining Rate
                </span>
                <span className="font-mono font-black text-black bg-[#FFE500] px-1 border border-black">
                  {stressedConfig.acceptedToJoiningRate}%
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="95"
                step="1"
                value={stressedConfig.acceptedToJoiningRate}
                onChange={(e) =>
                  handleUpdate('acceptedToJoiningRate', parseInt(e.target.value))
                }
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-600 font-bold uppercase">
                <span>Severe ghosting (40%)</span>
                <span>Baseline: {baselineConfig.acceptedToJoiningRate}%</span>
                <span>High stickiness (95%)</span>
              </div>
            </div>

            {/* Control: Interview-to-Offer Rate */}
            <div className="space-y-1.5 p-3.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black uppercase text-black">
                  Interview-to-Offer Pass Rate
                </span>
                <span className="font-mono font-black text-black bg-[#FFE500] px-1 border border-black">
                  {stressedConfig.interviewToOfferRate}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={stressedConfig.interviewToOfferRate}
                onChange={(e) =>
                  handleUpdate('interviewToOfferRate', parseInt(e.target.value))
                }
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-600 font-bold uppercase">
                <span>Elite bar (5%)</span>
                <span>Baseline: {baselineConfig.interviewToOfferRate}%</span>
                <span>Relaxed (50%)</span>
              </div>
            </div>

            {/* Control: Deadline in Months */}
            <div className="space-y-1.5 p-3.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black uppercase text-black">
                  Hiring Deadline (Months)
                </span>
                <span className="font-mono font-black text-black bg-[#FFE500] px-1 border border-black">
                  {stressedConfig.deadlineMonths} Months
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="12"
                step="1"
                value={stressedConfig.deadlineMonths}
                onChange={(e) =>
                  handleUpdate('deadlineMonths', parseInt(e.target.value))
                }
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-600 font-bold uppercase">
                <span>Compressed (2 mo)</span>
                <span>Baseline: {baselineConfig.deadlineMonths} mo</span>
                <span>Extended (12 mo)</span>
              </div>
            </div>

            {/* Control: Dedicated Recruiters */}
            <div className="space-y-1.5 p-3.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black uppercase text-black">
                  Dedicated In-house Recruiters
                </span>
                <span className="font-mono font-black text-black bg-[#FFE500] px-1 border border-black">
                  {stressedConfig.dedicatedRecruiters} Recruiters
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={stressedConfig.dedicatedRecruiters}
                onChange={(e) =>
                  handleUpdate('dedicatedRecruiters', parseInt(e.target.value))
                }
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-600 font-bold uppercase">
                <span>Understaffed (1)</span>
                <span>Baseline: {baselineConfig.dedicatedRecruiters}</span>
                <span>Scaled (20)</span>
              </div>
            </div>

            {/* Agency Support Toggle */}
            <div className="p-3.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase text-black block">
                  RPO Partner Augmentation
                </span>
                <span className="text-[11px] text-neutral-600 font-medium">
                  Adds 1.5x throughput bandwidth
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={stressedConfig.agencySupportEnabled}
                  onChange={(e) => handleUpdate('agencySupportEnabled', e.target.checked)}
                  className="w-5 h-5 accent-black border-2 border-black rounded-none cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right: Side-by-Side Comparison Table (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFDF5] border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000] space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <div>
              <h2 className="text-sm font-black uppercase text-black font-display">
                Side-by-Side Deterministic Matrix
              </h2>
              <p className="text-xs text-neutral-600 mt-0.5">
                Exact mathematical divergence between scenarios
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border-3 border-black shadow-[3px_3px_0px_0px_#000] bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFE500] border-b-2 border-black text-black font-black uppercase">
                <tr>
                  <th className="py-2.5 px-3 border-r-2 border-black">Metric / Parameter</th>
                  <th className="py-2.5 px-3 font-mono text-right w-28 border-r-2 border-black">Baseline</th>
                  <th className="py-2.5 px-3 font-mono text-right w-28 bg-black text-[#FFE500] border-r-2 border-black">
                    Stressed
                  </th>
                  <th className="py-2.5 px-3 font-mono text-right w-24">Impact Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black font-mono">
                {/* Row 1: Target Hires */}
                <tr>
                  <td className="py-2 px-3 text-black font-black uppercase border-r-2 border-black">Target Hires</td>
                  <td className="py-2 px-3 text-right tabular-nums text-black border-r-2 border-black">
                    {baselineCalc.targetHires}
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums font-black bg-[#FAF7EE] text-black border-r-2 border-black">
                    {stressedCalc.targetHires}
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums text-neutral-500 font-bold">
                    —
                  </td>
                </tr>

                {/* Row 2: Deadline & Active Window */}
                <tr>
                  <td className="py-2 px-3 text-black font-bold uppercase border-r-2 border-black">
                    Offer Window ({baselineConfig.noticePeriodLagDays}d notice)
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums text-black border-r-2 border-black">
                    {baselineCalc.activeInterviewWindowMonths} Months
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums font-black bg-[#FAF7EE] text-black border-r-2 border-black">
                    {stressedCalc.activeInterviewWindowMonths} Months
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums font-bold text-black">
                    {stressedCalc.activeInterviewWindowMonths - baselineCalc.activeInterviewWindowMonths} mo
                  </td>
                </tr>

                {/* Row 3: Joining Drop-off */}
                <tr>
                  <td className="py-2 px-3 text-black font-bold uppercase border-r-2 border-black">
                    Accepted-to-Joining Rate
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums text-black border-r-2 border-black">
                    {baselineConfig.acceptedToJoiningRate}%
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums font-black bg-[#FAF7EE] text-black border-r-2 border-black">
                    {stressedConfig.acceptedToJoiningRate}%
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums text-[#FF5A36] font-black">
                    {stressedConfig.acceptedToJoiningRate - baselineConfig.acceptedToJoiningRate}%
                  </td>
                </tr>

                {/* Row 4: Required Accepted Offers */}
                <tr>
                  <td className="py-2 px-3 text-black font-bold uppercase border-r-2 border-black">
                    Required Signed Offers
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums text-black border-r-2 border-black">
                    {baselineCalc.requiredAcceptedOffers}
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums font-black bg-[#FAF7EE] text-black border-r-2 border-black">
                    {stressedCalc.requiredAcceptedOffers}
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums font-black text-[#FF5A36]">
                    +{stressedCalc.requiredAcceptedOffers - baselineCalc.requiredAcceptedOffers}
                  </td>
                </tr>

                {/* Row 5: Required Formal Offers */}
                <tr>
                  <td className="py-2 px-3 text-black font-bold uppercase border-r-2 border-black">
                    Total Formal Offers Extended
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums text-black border-r-2 border-black">
                    {baselineCalc.requiredOffersExtended}
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums font-black bg-[#FAF7EE] text-black border-r-2 border-black">
                    {stressedCalc.requiredOffersExtended}
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums font-black text-[#FF5A36]">
                    +{deltaOffers}
                  </td>
                </tr>

                {/* Row 6: Required Interviews */}
                <tr>
                  <td className="py-2 px-3 text-black font-bold uppercase border-r-2 border-black">
                    Interviews to Conduct
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums text-black border-r-2 border-black">
                    {baselineCalc.requiredInterviews.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums font-black bg-[#FAF7EE] text-black border-r-2 border-black">
                    {stressedCalc.requiredInterviews.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums font-black text-[#FF5A36]">
                    +{deltaInterviews.toLocaleString()}
                  </td>
                </tr>

                {/* Row 7: Total Sourced Talent Pool */}
                <tr>
                  <td className="py-2 px-3 text-black font-bold uppercase border-r-2 border-black">
                    Total Sourced Candidate Pipeline
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums text-black border-r-2 border-black">
                    {baselineCalc.requiredTotalApplicantPool.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums font-black bg-[#FAF7EE] text-black border-r-2 border-black">
                    {stressedCalc.requiredTotalApplicantPool.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums font-black text-[#FF5A36]">
                    +{deltaApplicantPool.toLocaleString()}
                  </td>
                </tr>

                {/* Row 8: Monthly Interview Velocity */}
                <tr>
                  <td className="py-2 px-3 text-black font-bold uppercase border-r-2 border-black">
                    Monthly Interview Pace Required
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums text-black border-r-2 border-black">
                    {baselineCalc.monthlyInterviewsNeeded}/mo
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums font-black bg-[#FAF7EE] text-black border-r-2 border-black">
                    {stressedCalc.monthlyInterviewsNeeded}/mo
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums font-black text-[#FF5A36]">
                    +{stressedCalc.monthlyInterviewsNeeded - baselineCalc.monthlyInterviewsNeeded}/mo
                  </td>
                </tr>

                {/* Row 9: Recruiter Capacity Utilization */}
                <tr>
                  <td className="py-2 px-3 text-black font-bold uppercase border-r-2 border-black">
                    Recruiter Team Capacity Load
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums text-black border-r-2 border-black">
                    {baselineCalc.recruiterCapacityUtilizationPct}%
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums font-black bg-[#FAF7EE] text-black border-r-2 border-black">
                    {stressedCalc.recruiterCapacityUtilizationPct}%
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums font-black text-[#FF5A36]">
                    {deltaRecruiterLoad > 0 ? `+${deltaRecruiterLoad}%` : `${deltaRecruiterLoad}%`}
                  </td>
                </tr>

                {/* Row 10: Feasibility Verdict */}
                <tr className="bg-[#FAF7EE] font-black uppercase">
                  <td className="py-2.5 px-3 text-black border-r-2 border-black">Feasibility Status</td>
                  <td className="py-2.5 px-3 text-right text-xs text-black border-r-2 border-black">
                    {baselineCalc.overallFeasibilityStatus}
                  </td>
                  <td className="py-2.5 px-3 text-right text-xs bg-black text-[#FFE500] border-r-2 border-black">
                    {stressedCalc.overallFeasibilityStatus}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[11px] text-neutral-600">
                    Stress Tested
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Stressed Feasibility Commentary */}
          <div className="p-4 border-3 border-black bg-white shadow-[3px_3px_0px_0px_#000] space-y-1.5">
            <div className="text-xs font-black uppercase text-black flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 stroke-[2.5] text-black" />
              <span>Stress Test Conclusion:</span>
            </div>
            <p className="text-xs text-neutral-800 leading-relaxed font-medium">
              {stressedCalc.feasibilityRationale}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
