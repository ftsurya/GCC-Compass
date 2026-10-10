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
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Sensitivity & Stress Analysis</span>
              <span aria-hidden="true">·</span>
              <span>Comparative Scenario Testing</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{city.name}</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Baseline vs Stressed Scenario Comparison
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              Stress-test the {baselineConfig.totalTargetHires}-hire hiring plan under adverse market conditions (severe offer reneges, compressed deadlines, or stricter technical bars).
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded">
              Deterministic Comparative Delta
            </span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 mr-1">Load Preset:</span>
          <button
            onClick={() => applyPreset('high-dropout')}
            className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors"
          >
            Severe Offer Reneging (35% Drop)
          </button>
          <button
            onClick={() => applyPreset('compressed-timeline')}
            className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors"
          >
            Compressed 4-Month Rush
          </button>
          <button
            onClick={() => applyPreset('high-bar')}
            className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors"
          >
            Stricter Interview Bar (12% Pass)
          </button>
          <button
            onClick={() => applyPreset('mitigated-scale')}
            className="px-2.5 py-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg transition-colors"
          >
            Mitigated Scale-Up (8 Recruiters + RPO)
          </button>
          <button
            onClick={() => applyPreset('reset')}
            className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 ml-auto flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Clone Baseline
          </button>
        </div>
      </div>

      {/* Delta Callout Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Delta 1: Offers Extended */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Offers Required Delta</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {stressedCalc.requiredOffersExtended}
            </span>
            <span
              className={`text-xs font-mono font-bold ${
                deltaOffers > 0 ? 'text-rose-600' : deltaOffers < 0 ? 'text-emerald-600' : 'text-slate-500'
              }`}
            >
              {deltaOffers > 0 ? `+${deltaOffers}` : deltaOffers}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            vs {baselineCalc.requiredOffersExtended} in Baseline
          </div>
        </div>

        {/* Delta 2: Interviews */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Interviews Conducted Delta</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {stressedCalc.requiredInterviews.toLocaleString()}
            </span>
            <span
              className={`text-xs font-mono font-bold ${
                deltaInterviews > 0 ? 'text-rose-600' : deltaInterviews < 0 ? 'text-emerald-600' : 'text-slate-500'
              }`}
            >
              {deltaInterviews > 0 ? `+${deltaInterviews.toLocaleString()}` : deltaInterviews.toLocaleString()}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            vs {baselineCalc.requiredInterviews.toLocaleString()} in Baseline
          </div>
        </div>

        {/* Delta 3: Recruiter Load */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Recruiter Team Load Delta</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {stressedCalc.recruiterCapacityUtilizationPct}%
            </span>
            <span
              className={`text-xs font-mono font-bold ${
                deltaRecruiterLoad > 0 ? 'text-rose-600' : deltaRecruiterLoad < 0 ? 'text-emerald-600' : 'text-slate-500'
              }`}
            >
              {deltaRecruiterLoad > 0 ? `+${deltaRecruiterLoad}%` : `${deltaRecruiterLoad}%`}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            vs {baselineCalc.recruiterCapacityUtilizationPct}% in Baseline
          </div>
        </div>

        {/* Delta 4: Engineering Time */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Engineering Hours Delta</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {stressedCalc.engineeringInterviewHoursTotal.toLocaleString()}h
            </span>
            <span
              className={`text-xs font-mono font-bold ${
                deltaEngHours > 0 ? 'text-rose-600' : deltaEngHours < 0 ? 'text-emerald-600' : 'text-slate-500'
              }`}
            >
              {deltaEngHours > 0 ? `+${deltaEngHours.toLocaleString()}h` : `${deltaEngHours.toLocaleString()}h`}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            vs {baselineCalc.engineeringInterviewHoursTotal.toLocaleString()}h in Baseline
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Stressed Sliders + Side-by-Side Comparison Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Stress Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Tune Stressed Assumptions
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Adjust variables to test elasticity of recruitment operations
            </p>
          </div>

          <div className="space-y-4">
            {/* Control: Accepted-to-Joining Rate */}
            <div className="space-y-1.5 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">
                  Accepted-to-Joining Rate
                </span>
                <span className="font-mono font-bold text-slate-900">
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
                className="w-full accent-slate-900"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Severe ghosting (40%)</span>
                <span>Baseline: {baselineConfig.acceptedToJoiningRate}%</span>
                <span>High stickiness (95%)</span>
              </div>
            </div>

            {/* Control: Interview-to-Offer Rate */}
            <div className="space-y-1.5 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">
                  Interview-to-Offer Pass Rate
                </span>
                <span className="font-mono font-bold text-slate-900">
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
                className="w-full accent-slate-900"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Elite bar (5%)</span>
                <span>Baseline: {baselineConfig.interviewToOfferRate}%</span>
                <span>Relaxed (50%)</span>
              </div>
            </div>

            {/* Control: Deadline in Months */}
            <div className="space-y-1.5 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">
                  Hiring Deadline (Months)
                </span>
                <span className="font-mono font-bold text-slate-900">
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
                className="w-full accent-slate-900"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Compressed (2 mo)</span>
                <span>Baseline: {baselineConfig.deadlineMonths} mo</span>
                <span>Extended (12 mo)</span>
              </div>
            </div>

            {/* Control: Dedicated Recruiters */}
            <div className="space-y-1.5 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">
                  Dedicated In-house Recruiters
                </span>
                <span className="font-mono font-bold text-slate-900">
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
                className="w-full accent-slate-900"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Understaffed (1)</span>
                <span>Baseline: {baselineConfig.dedicatedRecruiters}</span>
                <span>Scaled (20)</span>
              </div>
            </div>

            {/* Agency Support Toggle */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">
                  RPO Partner Augmentation
                </span>
                <span className="text-[11px] text-slate-500">
                  Adds 1.5x throughput bandwidth
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={stressedConfig.agencySupportEnabled}
                  onChange={(e) => handleUpdate('agencySupportEnabled', e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right: Side-by-Side Comparison Table (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Side-by-Side Deterministic Matrix
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Exact mathematical divergence between scenarios
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Metric / Parameter</th>
                  <th className="py-2.5 px-3 font-mono text-right w-28">Baseline</th>
                  <th className="py-2.5 px-3 font-mono text-right w-28 bg-slate-100/70 text-slate-900">
                    Stressed
                  </th>
                  <th className="py-2.5 px-3 font-mono text-right w-24">Impact Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {/* Row 1: Target Hires */}
                <tr>
                  <td className="py-2 px-3 text-slate-700 font-medium">Target Hires</td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-600">
                    {baselineCalc.targetHires}
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold bg-slate-50/50 text-slate-900">
                    {stressedCalc.targetHires}
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-500">
                    —
                  </td>
                </tr>

                {/* Row 2: Deadline & Active Window */}
                <tr>
                  <td className="py-2 px-3 text-slate-700 font-medium">
                    Offer Window ({baselineConfig.noticePeriodLagDays}d notice)
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-600">
                    {baselineCalc.activeInterviewWindowMonths} Months
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold bg-slate-50/50 text-slate-900">
                    {stressedCalc.activeInterviewWindowMonths} Months
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums font-medium text-slate-700">
                    {stressedCalc.activeInterviewWindowMonths - baselineCalc.activeInterviewWindowMonths} mo
                  </td>
                </tr>

                {/* Row 3: Joining Drop-off */}
                <tr>
                  <td className="py-2 px-3 text-slate-700 font-medium">
                    Accepted-to-Joining Rate
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-600">
                    {baselineConfig.acceptedToJoiningRate}%
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold bg-slate-50/50 text-slate-900">
                    {stressedConfig.acceptedToJoiningRate}%
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-rose-600 font-semibold">
                    {stressedConfig.acceptedToJoiningRate - baselineConfig.acceptedToJoiningRate}%
                  </td>
                </tr>

                {/* Row 4: Required Accepted Offers */}
                <tr>
                  <td className="py-2 px-3 text-slate-700 font-medium">
                    Required Signed Offers
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-600">
                    {baselineCalc.requiredAcceptedOffers}
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold bg-slate-50/50 text-slate-900">
                    {stressedCalc.requiredAcceptedOffers}
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold text-rose-600">
                    +{stressedCalc.requiredAcceptedOffers - baselineCalc.requiredAcceptedOffers}
                  </td>
                </tr>

                {/* Row 5: Required Formal Offers */}
                <tr>
                  <td className="py-2 px-3 text-slate-700 font-medium">
                    Total Formal Offers Extended
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-600">
                    {baselineCalc.requiredOffersExtended}
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold bg-slate-50/50 text-slate-900">
                    {stressedCalc.requiredOffersExtended}
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold text-rose-600">
                    +{deltaOffers}
                  </td>
                </tr>

                {/* Row 6: Required Interviews */}
                <tr>
                  <td className="py-2 px-3 text-slate-700 font-medium">
                    Interviews to Conduct
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-600">
                    {baselineCalc.requiredInterviews.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold bg-slate-50/50 text-slate-900">
                    {stressedCalc.requiredInterviews.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold text-rose-600">
                    +{deltaInterviews.toLocaleString()}
                  </td>
                </tr>

                {/* Row 7: Total Sourced Talent Pool */}
                <tr>
                  <td className="py-2 px-3 text-slate-700 font-medium">
                    Total Sourced Candidate Pipeline
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-600">
                    {baselineCalc.requiredTotalApplicantPool.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold bg-slate-50/50 text-slate-900">
                    {stressedCalc.requiredTotalApplicantPool.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold text-rose-600">
                    +{deltaApplicantPool.toLocaleString()}
                  </td>
                </tr>

                {/* Row 8: Monthly Interview Velocity */}
                <tr>
                  <td className="py-2 px-3 text-slate-700 font-medium">
                    Monthly Interview Pace Required
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-600">
                    {baselineCalc.monthlyInterviewsNeeded}/mo
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold bg-slate-50/50 text-slate-900">
                    {stressedCalc.monthlyInterviewsNeeded}/mo
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold text-rose-600">
                    +{stressedCalc.monthlyInterviewsNeeded - baselineCalc.monthlyInterviewsNeeded}/mo
                  </td>
                </tr>

                {/* Row 9: Recruiter Capacity Utilization */}
                <tr>
                  <td className="py-2 px-3 text-slate-700 font-medium">
                    Recruiter Team Capacity Load
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-600">
                    {baselineCalc.recruiterCapacityUtilizationPct}%
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold bg-slate-50/50 text-slate-900">
                    {stressedCalc.recruiterCapacityUtilizationPct}%
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold text-rose-600">
                    {deltaRecruiterLoad > 0 ? `+${deltaRecruiterLoad}%` : `${deltaRecruiterLoad}%`}
                  </td>
                </tr>

                {/* Row 10: Feasibility Verdict */}
                <tr className="bg-slate-50 font-semibold">
                  <td className="py-2.5 px-3 text-slate-900">Feasibility Status</td>
                  <td className="py-2.5 px-3 text-right text-xs">
                    {baselineCalc.overallFeasibilityStatus}
                  </td>
                  <td className="py-2.5 px-3 text-right text-xs bg-slate-100 text-slate-900">
                    {stressedCalc.overallFeasibilityStatus}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[11px] text-slate-500">
                    Stress Tested
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Stressed Feasibility Commentary */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Stress Test Conclusion:</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {stressedCalc.feasibilityRationale}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
