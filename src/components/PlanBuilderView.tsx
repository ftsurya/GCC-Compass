import React, { useState, useMemo } from 'react';
import {
  Sliders,
  RotateCcw,
  Plus,
  Trash2,
  Info,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Building2,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import {
  CityProfile,
  HiringPlanConfig,
  CalculationResult,
  RoleAllocation,
} from '../types';
import { CITIES_DATA, DEFAULT_ROLES } from '../data/defaultData';

interface PlanBuilderViewProps {
  cities: CityProfile[];
  config: HiringPlanConfig;
  calc: CalculationResult;
  hasActiveAssessment?: boolean;
  onChangeConfig: (newConfig: HiringPlanConfig) => void;
  onNavigateToStressTest: () => void;
  onNavigateToOverview?: () => void;
  onRunAssessment?: () => void;
  onResetDefaults: () => void;
}

export const PlanBuilderView: React.FC<PlanBuilderViewProps> = ({
  cities,
  config,
  calc,
  hasActiveAssessment,
  onChangeConfig,
  onNavigateToStressTest,
  onNavigateToOverview,
  onRunAssessment,
  onResetDefaults,
}) => {
  const [showFormulaDetails, setShowFormulaDetails] = useState<boolean>(true);

  const selectedCity = useMemo(
    () => cities.find((c) => c.id === config.cityId) || cities[0],
    [cities, config.cityId]
  );

  // Generic key update handler that triggers parent state change immediately
  const handleUpdate = <K extends keyof HiringPlanConfig>(
    key: K,
    value: HiringPlanConfig[K]
  ) => {
    onChangeConfig({
      ...config,
      [key]: value,
    });
  };

  // Adjust total target hires directly and proportionally adjust role headcounts
  const handleTotalTargetHiresChange = (targetHires: number) => {
    if (targetHires <= 0) {
      onChangeConfig({
        ...config,
        totalTargetHires: 0,
      });
      return;
    }

    const validTarget = targetHires;
    const currentTotal = config.roles.reduce(
      (acc, r) => acc + (Number(r.headcount) || 0),
      0
    );

    let updatedRoles = config.roles;
    if (currentTotal > 0 && config.roles.length > 0) {
      const ratio = validTarget / currentTotal;
      let allocatedSoFar = 0;
      updatedRoles = config.roles.map((r, index) => {
        if (index === config.roles.length - 1) {
          const remainder = Math.max(1, validTarget - allocatedSoFar);
          return { ...r, headcount: remainder };
        }
        const scaled = Math.max(1, Math.round((Number(r.headcount) || 1) * ratio));
        allocatedSoFar += scaled;
        return { ...r, headcount: scaled };
      });
    }

    onChangeConfig({
      ...config,
      totalTargetHires: validTarget,
      roles: updatedRoles,
    });
  };

  // Handle single role field change with instant total synchronization
  const handleRoleChange = (
    index: number,
    field: keyof RoleAllocation,
    value: string | number
  ) => {
    const updatedRoles = [...config.roles];
    updatedRoles[index] = {
      ...updatedRoles[index],
      [field]: value,
    };
    // Sync total target if headcount changed
    const newTotal = updatedRoles.reduce(
      (acc, r) => acc + (Number(r.headcount) || 0),
      0
    );
    onChangeConfig({
      ...config,
      roles: updatedRoles,
      totalTargetHires: Math.max(0, newTotal),
    });
  };

  // Add new role to the breakdown
  const handleAddRole = () => {
    const newRole: RoleAllocation = {
      id: `role-${Date.now()}`,
      title: 'New Engineering Role',
      seniority: 'Mid (3-5y)',
      headcount: 20,
      marketAvailabilityNotes: 'Custom role profile added to test plan.',
    };
    const updatedRoles = [...config.roles, newRole];
    const newTotal = updatedRoles.reduce((acc, r) => acc + (Number(r.headcount) || 0), 0);
    onChangeConfig({
      ...config,
      roles: updatedRoles,
      totalTargetHires: Math.max(1, newTotal),
    });
  };

  // Remove role from breakdown
  const handleDeleteRole = (index: number) => {
    if (config.roles.length <= 1) return;
    const updatedRoles = config.roles.filter((_, i) => i !== index);
    const newTotal = updatedRoles.reduce((acc, r) => acc + (Number(r.headcount) || 0), 0);
    onChangeConfig({
      ...config,
      roles: updatedRoles,
      totalTargetHires: Math.max(1, newTotal),
    });
  };

  // Quick scenario preset applicator
  const applyQuickPreset = (presetKey: string) => {
    switch (presetKey) {
      case 'baseline':
        onResetDefaults();
        break;
      case 'compressed-timeline':
        onChangeConfig({
          ...config,
          deadlineMonths: 4,
          noticePeriodLagDays: 60,
        });
        break;
      case 'high-dropout':
        onChangeConfig({
          ...config,
          acceptedToJoiningRate: 60, // 40% renege rate
          offerAcceptanceRate: 65,
        });
        break;
      case 'high-bar':
        onChangeConfig({
          ...config,
          interviewToOfferRate: 12, // 1 in 8 pass rate
          qualifiedToInterviewRate: 25,
        });
        break;
      case 'rpo-support':
        onChangeConfig({
          ...config,
          dedicatedRecruiters: 8,
          agencySupportEnabled: true,
          agencyCapacityMultiplier: 1.5,
          acceptedToJoiningRate: 80,
        });
        break;
      case 'ideal-funnel':
        onChangeConfig({
          ...config,
          applicantToQualifiedRate: 100,
          qualifiedToInterviewRate: 100,
          interviewToOfferRate: 100,
          offerAcceptanceRate: 100,
          acceptedToJoiningRate: 100,
        });
        break;
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header and Reset in Retro NeoBrutalism */}
      <div className="bg-[#FFFDF5] border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs mb-1">
            <span className="bg-black text-[#FFE500] px-2 py-0.5 font-black uppercase">
              CONFIGURATOR // MODULE 02
            </span>
            <span className="font-bold text-neutral-600">// DETERMINISTIC PLAN BUILDER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black uppercase font-display mt-1">
            Hiring Plan & Funnel Configurator
          </h1>
          <p className="text-xs text-neutral-800 mt-1 font-medium font-sans">
            Tune hiring targets, timeline constraints, conversion stages, and recruiter capacity. All outputs update in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 font-mono">
          <button
            onClick={onResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase text-black bg-white hover:bg-neutral-100 border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-colors"
            title="Reset to default 300-hire 6-month baseline"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
            Reset Baseline
          </button>
          {onRunAssessment && (
            <button
              onClick={onRunAssessment}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase text-black bg-[#00F0A8] hover:bg-[#00d694] border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] transition-all"
              title="Calculate and view complete results in Overview"
            >
              <CheckCircle className="w-3.5 h-3.5 stroke-[2.5]" />
              Run Assessment & View Overview
            </button>
          )}
          <button
            onClick={onNavigateToStressTest}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase text-black bg-[#FFE500] hover:bg-[#FFD000] border-2 border-black shadow-[3px_3px_0px_0px_#000] transition-all"
          >
            Compare in Stress Test
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Quick Scenario Presets Bar */}
      <div className="bg-white border-3 border-black p-4 shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-black uppercase text-black shrink-0">
          <Sparkles className="w-4 h-4 stroke-[2.5]" />
          <span>Quick Presets:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyQuickPreset('baseline')}
            className="px-2.5 py-1 bg-[#FAF7EE] hover:bg-[#FFE500] border-2 border-black font-bold uppercase transition-colors"
          >
            Standard Baseline (300 in 6m)
          </button>
          <button
            onClick={() => applyQuickPreset('compressed-timeline')}
            className="px-2.5 py-1 bg-[#FAF7EE] hover:bg-[#FFE500] border-2 border-black font-bold uppercase transition-colors"
          >
            Compressed Runway (4m)
          </button>
          <button
            onClick={() => applyQuickPreset('high-dropout')}
            className="px-2.5 py-1 bg-[#FAF7EE] hover:bg-[#FF5A36] hover:text-white border-2 border-black font-bold uppercase transition-colors"
          >
            High Reneging (40% dropout)
          </button>
          <button
            onClick={() => applyQuickPreset('high-bar')}
            className="px-2.5 py-1 bg-[#FAF7EE] hover:bg-[#FFE500] border-2 border-black font-bold uppercase transition-colors"
          >
            High Bar (12% pass)
          </button>
          <button
            onClick={() => applyQuickPreset('rpo-support')}
            className="px-2.5 py-1 bg-[#FAF7EE] hover:bg-[#00F0A8] border-2 border-black font-bold uppercase transition-colors"
          >
            RPO Support (8 TA + 1.5x)
          </button>
          <button
            onClick={() => applyQuickPreset('ideal-funnel')}
            className="px-2.5 py-1 bg-[#FAF7EE] hover:bg-neutral-200 border-2 border-black font-bold uppercase transition-colors"
            title="Sets 100% conversion at all stages for QA boundary verification"
          >
            100% Perfect (QA)
          </button>
        </div>
      </div>

      {/* Live Calculation Output Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* KPI 1: Target Joiners */}
        <div className="bg-white border-3 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
          <div className="text-[10px] font-black text-neutral-600 uppercase">
            Target Joiners
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono tracking-tight text-black tabular-nums">
              {calc.targetHires}
            </span>
            <span className="text-xs text-neutral-600">Day-1</span>
          </div>
          <div className="mt-1 text-[11px] text-neutral-600 border-t border-neutral-300 pt-1">
            {calc.monthlyPaceRequired} hires/mo
          </div>
        </div>

        {/* KPI 2: Total Sourced Pool */}
        <div className="bg-[#FFE500] border-3 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
          <div className="text-[10px] font-black text-black uppercase">
            Total Sourced Pool
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono tracking-tight text-black tabular-nums">
              {calc.requiredTotalApplicantPool.toLocaleString()}
            </span>
            <span className="text-xs text-black font-bold">resumes</span>
          </div>
          <div className="mt-1 text-[11px] text-black border-t border-black pt-1 truncate" title={`${calc.requiredQualifiedApplicants.toLocaleString()} qualified screens`}>
            {calc.requiredQualifiedApplicants.toLocaleString()} qualified
          </div>
        </div>

        {/* KPI 3: Interviews Required */}
        <div className="bg-white border-3 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
          <div className="text-[10px] font-black text-neutral-600 uppercase">
            Technical Interviews
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono tracking-tight text-black tabular-nums">
              {calc.requiredInterviews.toLocaleString()}
            </span>
            <span className="text-xs text-neutral-600">rounds</span>
          </div>
          <div className="mt-1 text-[11px] text-neutral-600 border-t border-neutral-300 pt-1">
            {calc.monthlyInterviewsNeeded}/mo needed
          </div>
        </div>

        {/* KPI 4: Recruiter Load */}
        <div className="bg-white border-3 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
          <div className="text-[10px] font-black text-neutral-600 uppercase">
            Recruiter Capacity
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span
              className={`text-2xl font-black font-mono tracking-tight tabular-nums px-1 ${
                calc.isRecruiterCapacityExceeded ? 'bg-[#FF5A36] text-white' : 'bg-[#00F0A8] text-black'
              }`}
            >
              {calc.recruiterCapacityUtilizationPct}%
            </span>
          </div>
          <div className="mt-1 text-[11px] text-neutral-600 border-t border-neutral-300 pt-1 truncate">
            {calc.isRecruiterCapacityExceeded
              ? `Deficit: ${calc.recruiterDeficit} TA`
              : `Cap: ${calc.totalRecruiterMonthlyCapacity}/mo`}
          </div>
        </div>

        {/* KPI 5: Feasibility Status */}
        <div className="bg-white border-3 border-black p-4 shadow-[4px_4px_0px_0px_#000] col-span-2 sm:col-span-1">
          <div className="text-[10px] font-black text-neutral-600 uppercase">
            Feasibility Verdict
          </div>
          <div className="mt-1">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 border border-black text-xs font-black uppercase ${
                calc.overallFeasibilityStatus === 'Mathematically Viable'
                  ? 'bg-[#00F0A8] text-black'
                  : calc.overallFeasibilityStatus === 'Capacity Constrained'
                  ? 'bg-[#FFE500] text-black'
                  : 'bg-[#FF5A36] text-white'
              }`}
            >
              {calc.overallFeasibilityStatus === 'Mathematically Viable' ? (
                <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
              ) : (
                <ShieldAlert className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
              {calc.overallFeasibilityStatus}
            </span>
          </div>
          <div className="mt-1 text-[10px] text-neutral-600 truncate border-t border-neutral-300 pt-1" title={calc.feasibilityRationale}>
            {calc.feasibilityRationale}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Input Controls & Roles Table */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Location & Project Timeline */}
          <div className="bg-white border-3 border-black p-6 shadow-[5px_5px_0px_0px_#000] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-black">
                01 // LOCATION, TARGET HEADCOUNT & TIMELINE CONSTRAINTS
              </h2>
              <span className="text-[11px] font-bold text-neutral-700">
                Active Runway: {calc.activeInterviewWindowMonths} Mo
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* City Selection */}
              <div>
                <label className="block text-xs font-black uppercase text-black mb-1">
                  Target Hub
                </label>
                <select
                  value={config.cityId}
                  onChange={(e) => handleUpdate('cityId', e.target.value)}
                  className="w-full text-xs font-bold bg-[#FAF7EE] border-2 border-black px-2.5 py-2 text-black focus:outline-none"
                >
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name} ({city.tier} · {city.state})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] text-neutral-600 truncate" title={selectedCity.estimatedSeniorTechTalentPool}>
                  {selectedCity.evidenceStatus}: {selectedCity.estimatedSeniorTechTalentPool}
                </p>
              </div>

              {/* Total Target Hires */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-black uppercase text-black">
                    Target Hires
                  </label>
                  <span className="text-xs font-black text-black bg-[#FFE500] px-1 border border-black">
                    {config.totalTargetHires}
                  </span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="5000"
                  value={config.totalTargetHires || ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                    handleTotalTargetHiresChange(isNaN(val) ? 1 : val);
                  }}
                  onBlur={() => {
                    if (!config.totalTargetHires || config.totalTargetHires < 1) {
                      handleTotalTargetHiresChange(1);
                    }
                  }}
                  className="w-full text-xs font-mono font-bold bg-white border-2 border-black px-2.5 py-2 text-black focus:outline-none shadow-[2px_2px_0px_0px_#000]"
                />
                <div className="mt-1 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleTotalTargetHiresChange(100)}
                    className="text-[10px] font-bold text-black hover:bg-[#FFE500] bg-[#FAF7EE] border border-black px-1.5 py-0.2"
                  >
                    100
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTotalTargetHiresChange(300)}
                    className="text-[10px] font-bold text-black hover:bg-[#FFE500] bg-[#FAF7EE] border border-black px-1.5 py-0.2"
                  >
                    300
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTotalTargetHiresChange(500)}
                    className="text-[10px] font-bold text-black hover:bg-[#FFE500] bg-[#FAF7EE] border border-black px-1.5 py-0.2"
                  >
                    500
                  </button>
                </div>
              </div>

              {/* Hiring Deadline (Months) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-black uppercase text-black">
                    Deadline (Mo)
                  </label>
                  <span className="text-xs font-black text-black">
                    {config.deadlineMonths} mo
                  </span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={config.deadlineMonths || ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                    handleUpdate('deadlineMonths', isNaN(val) ? 1 : Math.max(0, val));
                  }}
                  onBlur={() => {
                    if (!config.deadlineMonths || config.deadlineMonths < 1) {
                      handleUpdate('deadlineMonths', 1);
                    }
                  }}
                  className="w-full text-xs font-mono font-bold bg-white border-2 border-black px-2.5 py-2 text-black focus:outline-none shadow-[2px_2px_0px_0px_#000]"
                />
                <p className="mt-1 text-[10px] text-neutral-600">
                  Pace: {calc.monthlyPaceRequired} hires/mo
                </p>
              </div>

              {/* Indian Notice Period Lag */}
              <div>
                <label className="block text-xs font-black uppercase text-black mb-1">
                  Notice Lag
                </label>
                <select
                  value={config.noticePeriodLagDays}
                  onChange={(e) =>
                    handleUpdate('noticePeriodLagDays', Number(e.target.value) as 60 | 90)
                  }
                  className="w-full text-xs font-bold bg-[#FAF7EE] border-2 border-black px-2.5 py-2 text-black focus:outline-none"
                >
                  <option value={60}>60 Days (2 Mo Standard)</option>
                  <option value={90}>90 Days (3 Mo Strict Services)</option>
                </select>
                <p className="mt-1 text-[10px] text-neutral-600 truncate">
                  {calc.isTimelineImpossible
                    ? 'Infeasible: Notice ≥ Deadline'
                    : `Offer Cutoff: Mo ${calc.latestOfferCutoffMonth}`}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Roles & Seniority Allocation */}
          <div className="bg-white border-3 border-black p-6 shadow-[5px_5px_0px_0px_#000] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-black">
                  02 // ROLES, SENIORITY & HEADCOUNT BREAKDOWN
                </h2>
                <p className="text-[11px] text-neutral-600 mt-0.5">
                  Sum of role headcounts defines total target: {config.totalTargetHires} hires
                </p>
              </div>
              <button
                onClick={handleAddRole}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-black uppercase text-black bg-[#FFE500] hover:bg-[#FFD000] border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-colors"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                Add Role
              </button>
            </div>

            <div className="overflow-x-auto border-2 border-black shadow-[3px_3px_0px_0px_#000]">
              <table className="w-full text-left text-xs bg-white">
                <thead className="bg-black text-[#FFE500] border-b-2 border-black font-black uppercase">
                  <tr>
                    <th className="py-2.5 px-3 border-r border-neutral-700">Role Title</th>
                    <th className="py-2.5 px-3 w-36 border-r border-neutral-700">Seniority Tier</th>
                    <th className="py-2.5 px-3 w-28 text-right border-r border-neutral-700">Headcount</th>
                    <th className="py-2.5 px-3 border-r border-neutral-700">Market Note</th>
                    <th className="py-2.5 px-2 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y border-t border-black font-medium">
                  {config.roles.map((role, idx) => (
                    <tr key={role.id} className="hover:bg-[#FFF9D2]">
                      <td className="py-2 px-3 border-r border-black">
                        <input
                          type="text"
                          value={role.title}
                          onChange={(e) => handleRoleChange(idx, 'title', e.target.value)}
                          className="w-full bg-transparent border-0 border-b border-black font-bold text-xs text-black py-0.5 px-0 focus:outline-none"
                        />
                      </td>
                      <td className="py-2 px-3 border-r border-black">
                        <select
                          value={role.seniority}
                          onChange={(e) =>
                            handleRoleChange(
                              idx,
                              'seniority',
                              e.target.value as RoleAllocation['seniority']
                            )
                          }
                          className="w-full bg-white border border-black text-[11px] font-bold py-1 px-1 text-black"
                        >
                          <option value="Junior (0-2y)">Junior (0-2y)</option>
                          <option value="Mid (3-5y)">Mid (3-5y)</option>
                          <option value="Senior (6-9y)">Senior (6-9y)</option>
                          <option value="Lead / Principal (10y+)">Lead (10y+)</option>
                        </select>
                      </td>
                      <td className="py-2 px-3 text-right border-r border-black">
                        <input
                          type="number"
                          min="1"
                          max="2000"
                          value={role.headcount === 0 ? '' : role.headcount || ''}
                          onChange={(e) => {
                            const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                            handleRoleChange(idx, 'headcount', isNaN(val) ? 0 : Math.max(0, val));
                          }}
                          onBlur={() => {
                            if (!role.headcount || role.headcount < 1) {
                              handleRoleChange(idx, 'headcount', 1);
                            }
                          }}
                          className="w-20 text-right font-mono font-bold bg-[#FAF7EE] border border-black text-xs py-1 px-2 text-black focus:outline-none"
                        />
                      </td>
                      <td className="py-2 px-3 border-r border-black">
                        <span className="text-[11px] text-neutral-700 line-clamp-1" title={role.marketAvailabilityNotes}>
                          {role.marketAvailabilityNotes || 'Standard role'}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button
                          onClick={() => handleDeleteRole(idx)}
                          disabled={config.roles.length <= 1}
                          className="text-neutral-500 hover:text-black hover:bg-[#FF5A36] hover:text-white p-1 border border-black disabled:opacity-30 transition-colors"
                          title="Delete role"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#FFE500] border-t-2 border-black font-black text-black">
                  <tr>
                    <td colSpan={2} className="py-2 px-3 uppercase border-r border-black">
                      Total Target Hires
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-base border-r border-black">
                      {config.totalTargetHires}
                    </td>
                    <td colSpan={2} className="py-2 px-3 text-[11px]">
                      Hires in {config.deadlineMonths} mo ({calc.monthlyPaceRequired} hires/mo)
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Section 3: Funnel Conversion Assumptions */}
          <div className="bg-white border-3 border-black p-6 shadow-[5px_5px_0px_0px_#000] space-y-4">
            <div className="flex items-start justify-between gap-4 border-b-2 border-black pb-2">
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-black">
                  03 // RECRUITMENT FUNNEL CONVERSION ASSUMPTIONS
                </h2>
                <p className="text-[11px] text-neutral-600 mt-0.5">
                  Adjust conversion yields via slider or direct numeric percentage. Supports testing from 0% to 100%.
                </p>
              </div>
              <span className="text-[10px] font-black uppercase bg-[#FFE500] border border-black px-2 py-0.5 shrink-0">
                LIVE DETERMINISTIC ENGINE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
              {/* Rate 1: Applicant to Qualified */}
              <div className="p-3.5 bg-[#FAF7EE] border-2 border-black shadow-[2px_2px_0px_0px_#000] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-black">
                    Applicant-to-Qualified
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={config.applicantToQualifiedRate ?? ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        handleUpdate('applicantToQualifiedRate', isNaN(val) ? 0 : Math.max(0, Math.min(100, val)));
                      }}
                      className="w-14 text-right font-mono text-xs font-black text-black bg-white border border-black px-1.5 py-0.5"
                    />
                    <span className="text-xs font-bold text-black">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={config.applicantToQualifiedRate}
                  onChange={(e) =>
                    handleUpdate('applicantToQualifiedRate', parseInt(e.target.value, 10))
                  }
                  className="w-full accent-black cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-neutral-600 font-bold">
                  <span>Resume filter pass</span>
                  <span className="font-mono">{calc.requiredQualifiedApplicants.toLocaleString()} qualified</span>
                </div>
              </div>

              {/* Rate 2: Qualified to Interview */}
              <div className="p-3.5 bg-[#FAF7EE] border-2 border-black shadow-[2px_2px_0px_0px_#000] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-black">
                    Qualified-to-Interview
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={config.qualifiedToInterviewRate ?? ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        handleUpdate('qualifiedToInterviewRate', isNaN(val) ? 0 : Math.max(0, Math.min(100, val)));
                      }}
                      className="w-14 text-right font-mono text-xs font-black text-black bg-white border border-black px-1.5 py-0.5"
                    />
                    <span className="text-xs font-bold text-black">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={config.qualifiedToInterviewRate}
                  onChange={(e) =>
                    handleUpdate('qualifiedToInterviewRate', parseInt(e.target.value, 10))
                  }
                  className="w-full accent-black cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-neutral-600 font-bold">
                  <span>Interview scheduling</span>
                  <span className="font-mono">{calc.requiredInterviews.toLocaleString()} interviews</span>
                </div>
              </div>

              {/* Rate 3: Interview to Offer */}
              <div className="p-3.5 bg-[#FAF7EE] border-2 border-black shadow-[2px_2px_0px_0px_#000] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-black">
                    Interview-to-Offer
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={config.interviewToOfferRate ?? ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        handleUpdate('interviewToOfferRate', isNaN(val) ? 0 : Math.max(0, Math.min(100, val)));
                      }}
                      className="w-14 text-right font-mono text-xs font-black text-black bg-white border border-black px-1.5 py-0.5"
                    />
                    <span className="text-xs font-bold text-black">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={config.interviewToOfferRate}
                  onChange={(e) =>
                    handleUpdate('interviewToOfferRate', parseInt(e.target.value, 10))
                  }
                  className="w-full accent-black cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-neutral-600 font-bold">
                  <span>Panel clearing rate</span>
                  <span className="font-mono">{calc.requiredOffersExtended} offers</span>
                </div>
              </div>

              {/* Rate 4: Offer Acceptance Rate */}
              <div className="p-3.5 bg-[#FAF7EE] border-2 border-black shadow-[2px_2px_0px_0px_#000] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-black">
                    Offer Acceptance Rate
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={config.offerAcceptanceRate ?? ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        handleUpdate('offerAcceptanceRate', isNaN(val) ? 0 : Math.max(0, Math.min(100, val)));
                      }}
                      className="w-14 text-right font-mono text-xs font-black text-black bg-white border border-black px-1.5 py-0.5"
                    />
                    <span className="text-xs font-bold text-black">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={config.offerAcceptanceRate}
                  onChange={(e) =>
                    handleUpdate('offerAcceptanceRate', parseInt(e.target.value, 10))
                  }
                  className="w-full accent-black cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-neutral-600 font-bold">
                  <span>Signed formal offers</span>
                  <span className="font-mono">{calc.requiredAcceptedOffers} accepted</span>
                </div>
              </div>

              {/* Rate 5: Accepted to Joining Rate (The Notice-Period Reneging Factor) */}
              <div className="p-4 bg-[#FFE500] border-3 border-black shadow-[3px_3px_0px_0px_#000] space-y-2 md:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-black uppercase text-black">
                      Accepted-Offer-to-Joining Rate (Notice Period Reneging)
                    </label>
                    <span className="text-[10px] bg-black text-white px-2 py-0.5 border border-black uppercase font-bold">
                      RENEGE BUFFER
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={config.acceptedToJoiningRate ?? ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        handleUpdate('acceptedToJoiningRate', isNaN(val) ? 0 : Math.max(0, Math.min(100, val)));
                      }}
                      className="w-14 text-right font-mono text-xs font-black text-black bg-white border border-black px-1.5 py-0.5"
                    />
                    <span className="text-xs font-black text-black">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={config.acceptedToJoiningRate}
                  onChange={(e) =>
                    handleUpdate('acceptedToJoiningRate', parseInt(e.target.value, 10))
                  }
                  className="w-full accent-black cursor-pointer"
                />
                <div className="flex items-center justify-between text-[11px] text-black font-bold">
                  <span>
                    Day-1 joiners per 100 accepted ({Math.max(0, 100 - config.acceptedToJoiningRate)}% renege during {config.noticePeriodLagDays}d notice lag)
                  </span>
                  <span className="font-black bg-black text-[#FFE500] px-1.5 py-0.2">
                    {calc.targetHires} DAY-1 JOINERS
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Recruitment Capacity & Resourcing */}
          <div className="bg-white border-3 border-black p-6 shadow-[5px_5px_0px_0px_#000] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-black">
                04 // TALENT ACQUISITION CAPACITY & TEAM SIZE
              </h2>
              <span className="text-[11px] font-bold text-neutral-700">
                Monthly TA Capacity: {calc.totalRecruiterMonthlyCapacity} screens/mo
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-black uppercase text-black">
                    Dedicated TA
                  </label>
                  <span className="text-xs font-black text-black">
                    {config.dedicatedRecruiters} recruiters
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleUpdate('dedicatedRecruiters', Math.max(1, config.dedicatedRecruiters - 1))}
                    className="w-9 h-9 flex items-center justify-center bg-[#FAF7EE] hover:bg-[#FFE500] text-black border-2 border-black text-base font-black shadow-[1px_1px_0px_0px_#000]"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={config.dedicatedRecruiters || ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                      handleUpdate('dedicatedRecruiters', isNaN(val) ? 1 : Math.max(0, val));
                    }}
                    onBlur={() => {
                      if (!config.dedicatedRecruiters || config.dedicatedRecruiters < 1) {
                        handleUpdate('dedicatedRecruiters', 1);
                      }
                    }}
                    className="flex-1 text-xs font-mono font-bold text-center bg-white border-2 border-black py-2 text-black shadow-[2px_2px_0px_0px_#000]"
                  />
                  <button
                    type="button"
                    onClick={() => handleUpdate('dedicatedRecruiters', config.dedicatedRecruiters + 1)}
                    className="w-9 h-9 flex items-center justify-center bg-[#FAF7EE] hover:bg-[#FFE500] text-black border-2 border-black text-base font-black shadow-[1px_1px_0px_0px_#000]"
                  >
                    +
                  </button>
                </div>
                <p className="mt-1 text-[10px] text-neutral-600 font-bold">
                  In-house talent partners
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-black uppercase text-black">
                    Screens / TA / Mo
                  </label>
                  <span className="text-xs font-black text-black">
                    {config.monthlyInterviewsPerRecruiter}/mo
                  </span>
                </div>
                <input
                  type="number"
                  min="5"
                  max="150"
                  value={config.monthlyInterviewsPerRecruiter || ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                    handleUpdate('monthlyInterviewsPerRecruiter', isNaN(val) ? 5 : Math.max(0, val));
                  }}
                  onBlur={() => {
                    if (!config.monthlyInterviewsPerRecruiter || config.monthlyInterviewsPerRecruiter < 5) {
                      handleUpdate('monthlyInterviewsPerRecruiter', 5);
                    }
                  }}
                  className="w-full text-xs font-mono font-bold bg-white border-2 border-black px-2.5 py-2 text-black shadow-[2px_2px_0px_0px_#000]"
                />
                <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold">
                  <span>Presets:</span>
                  <button
                    type="button"
                    onClick={() => handleUpdate('monthlyInterviewsPerRecruiter', 25)}
                    className="hover:underline"
                  >
                    25
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => handleUpdate('monthlyInterviewsPerRecruiter', 35)}
                    className="bg-[#FFE500] px-1 border border-black"
                  >
                    35 (Std)
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => handleUpdate('monthlyInterviewsPerRecruiter', 50)}
                    className="hover:underline"
                  >
                    50
                  </button>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">
                    Agency / RPO
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-black">
                      <input
                        type="checkbox"
                        checked={config.agencySupportEnabled}
                        onChange={(e) => handleUpdate('agencySupportEnabled', e.target.checked)}
                        className="accent-black w-4 h-4 cursor-pointer"
                      />
                      <span>Enable RPO Multiplier</span>
                    </label>
                  </div>
                </div>

                {config.agencySupportEnabled ? (
                  <div className="mt-2 flex items-center gap-2">
                    <label className="text-[11px] font-bold text-neutral-700 shrink-0">Scale:</label>
                    <select
                      value={config.agencyCapacityMultiplier || 1.5}
                      onChange={(e) => handleUpdate('agencyCapacityMultiplier', parseFloat(e.target.value))}
                      className="text-xs font-bold bg-white border-2 border-black px-2 py-1 text-black"
                    >
                      <option value={1.25}>1.25x (+25% capacity)</option>
                      <option value={1.5}>1.50x (+50% capacity)</option>
                      <option value={1.75}>1.75x (+75% capacity)</option>
                      <option value={2.0}>2.00x (+100% capacity)</option>
                    </select>
                  </div>
                ) : (
                  <p className="mt-1 text-[10px] text-neutral-600 font-bold">
                    In-house talent partners only
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Live Mathematical Proof, Active Bottlenecks & City Context */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Bottlenecks & Operational Alerts */}
          <div className="bg-[#FFFDF5] border-4 border-black p-5 shadow-[5px_5px_0px_0px_#000] space-y-3">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h4 className="text-xs font-black uppercase text-black flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 stroke-[2.5]" />
                RISK ALERTS ({calc.bottlenecks.length})
              </h4>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 border border-black ${
                  calc.bottlenecks.length === 0
                    ? 'bg-[#00F0A8] text-black'
                    : calc.bottlenecks.some((b) => b.severity === 'critical')
                    ? 'bg-[#FF5A36] text-white'
                    : 'bg-[#FFE500] text-black'
                }`}
              >
                {calc.bottlenecks.length === 0 ? 'OPTIMAL' : calc.overallFeasibilityStatus}
              </span>
            </div>

            {calc.bottlenecks.length === 0 ? (
              <div className="p-3 bg-[#00F0A8] border-2 border-black flex items-start gap-2.5 text-xs text-black font-bold">
                <CheckCircle className="w-4 h-4 stroke-[2.5] shrink-0 mt-0.5" />
                <div>
                  <div className="uppercase">No Bottlenecks Detected</div>
                  <div className="text-[11px] font-medium mt-0.5">
                    Recruiter team capacity and runway comfortably support target volume within specified timeline.
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {calc.bottlenecks.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 border-2 border-black text-xs space-y-1 shadow-[2px_2px_0px_0px_#000] ${
                      alert.severity === 'critical'
                        ? 'bg-[#FF5A36] text-white'
                        : 'bg-[#FFE500] text-black'
                    }`}
                  >
                    <div className="flex items-center justify-between font-black uppercase">
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
                        {alert.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-white text-black border border-black">
                        {alert.impactMetric}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed font-bold">
                      {alert.description}
                    </p>
                    <div className="text-[10px] pt-1 border-t border-black/20 font-bold">
                      <span className="uppercase">Action:</span> {alert.suggestedMitigation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mathematical Proof & Funnel Trace */}
          <div className="bg-black text-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_#FFE500] space-y-5">
            <div className="flex items-center justify-between border-b-2 border-neutral-700 pb-3">
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-[#FFE500]">
                  Mathematical Proof // Trace
                </h3>
                <p className="text-[10px] text-neutral-400 uppercase">
                  Strict backward induction arithmetic
                </p>
              </div>
              <button
                onClick={() => setShowFormulaDetails(!showFormulaDetails)}
                className="text-[11px] font-bold text-[#FFE500] underline uppercase"
              >
                {showFormulaDetails ? 'Compact' : 'Expand'}
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              {/* Step 1 */}
              <div className="space-y-1">
                <div className="text-neutral-400 text-[10px] uppercase">1. Required Accepted Offers</div>
                <div className="text-white font-bold">
                  {config.totalTargetHires} ÷ {((config.acceptedToJoiningRate || 1) / 100).toFixed(2)} ={' '}
                  <span className="text-[#00F0A8] font-black">{calc.requiredAcceptedOffers}</span>
                </div>
                {showFormulaDetails && (
                  <div className="text-[10px] text-neutral-400">
                    Compensates for {Math.max(0, 100 - config.acceptedToJoiningRate)}% notice period dropouts.
                  </div>
                )}
              </div>

              {/* Step 2 */}
              <div className="space-y-1">
                <div className="text-neutral-400 text-[10px] uppercase">2. Required Formal Offers</div>
                <div className="text-white font-bold">
                  {calc.requiredAcceptedOffers} ÷ {((config.offerAcceptanceRate || 1) / 100).toFixed(2)} ={' '}
                  <span className="text-[#00F0A8] font-black">{calc.requiredOffersExtended}</span>
                </div>
                {showFormulaDetails && (
                  <div className="text-[10px] text-neutral-400">
                    Compensates for declined formal offers.
                  </div>
                )}
              </div>

              {/* Step 3 */}
              <div className="space-y-1">
                <div className="text-neutral-400 text-[10px] uppercase">3. Technical Interviews Needed</div>
                <div className="text-white font-bold">
                  {calc.requiredOffersExtended} ÷ {((config.interviewToOfferRate || 1) / 100).toFixed(2)} ={' '}
                  <span className="text-[#00F0A8] font-black">{calc.requiredInterviews.toLocaleString()}</span>
                </div>
              </div>

              {/* Step 4 */}
              <div className="space-y-1">
                <div className="text-neutral-400 text-[10px] uppercase">4. Qualified Screened Pool</div>
                <div className="text-white font-bold">
                  {calc.requiredInterviews} ÷ {((config.qualifiedToInterviewRate || 1) / 100).toFixed(2)} ={' '}
                  <span className="text-[#00F0A8] font-black">{calc.requiredQualifiedApplicants.toLocaleString()}</span>
                </div>
              </div>

              {/* Step 5 */}
              <div className="space-y-1">
                <div className="text-neutral-400 text-[10px] uppercase">5. Total Sourced Resumes</div>
                <div className="text-white font-bold">
                  {calc.requiredQualifiedApplicants} ÷ {((config.applicantToQualifiedRate || 1) / 100).toFixed(2)} ={' '}
                  <span className="text-[#FFE500] font-black text-sm bg-neutral-900 px-1 border border-[#FFE500]">{calc.requiredTotalApplicantPool.toLocaleString()}</span>
                </div>
              </div>

              {/* Capacity Math */}
              <div className="pt-3 border-t-2 border-neutral-700 space-y-1.5">
                <div className="text-neutral-400 text-[10px] uppercase">6. Recruiter Velocity & Gap</div>
                <div className="text-white">
                  Demand:{' '}
                  {calc.isTimelineImpossible ? (
                    <span className="text-[#FF5A36] font-black">{calc.requiredInterviews.toLocaleString()} (Infeasible)</span>
                  ) : (
                    <>
                      {calc.requiredInterviews.toLocaleString()} / {calc.activeInterviewWindowMonths} mo ={' '}
                      <span className="text-[#FFE500] font-black">{calc.monthlyInterviewsNeeded}/mo</span>
                    </>
                  )}
                </div>
                <div className="text-white">
                  Capacity: {config.dedicatedRecruiters} × {config.monthlyInterviewsPerRecruiter}
                  {config.agencySupportEnabled && ` × ${config.agencyCapacityMultiplier || 1.5}x`} ={' '}
                  <span className="text-[#00F0A8] font-black">{calc.totalRecruiterMonthlyCapacity}/mo</span>
                </div>
                <div className="text-[11px] text-neutral-300">
                  Load:{' '}
                  <span
                    className={
                      calc.isRecruiterCapacityExceeded ? 'text-[#FF5A36] font-black' : 'text-[#00F0A8] font-black'
                    }
                  >
                    {calc.recruiterCapacityUtilizationPct}%
                  </span>{' '}
                  ({calc.isRecruiterCapacityExceeded ? `Deficit: ${calc.recruiterDeficit} TA` : 'Within capacity'})
                </div>
              </div>

              {/* Engineering Panel Math */}
              <div className="pt-3 border-t-2 border-neutral-700 space-y-1.5">
                <div className="text-neutral-400 text-[10px] uppercase">7. Engineering Panel Workload</div>
                <div className="text-white">
                  {calc.requiredInterviews.toLocaleString()} interviews × 2.0 hrs ={' '}
                  <span className="text-[#FFE500] font-black">{calc.engineeringInterviewHoursTotal.toLocaleString()} total hrs</span>
                </div>
                <div className="text-[11px] text-neutral-400">
                  Monthly panel demand: ~{calc.engineeringInterviewHoursPerMonth.toLocaleString()} hrs/mo
                </div>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-neutral-400 border-t-2 border-neutral-700 uppercase">
              DETERMINISTIC FORMULAS GUARANTEE ZERO STATISTICAL DRIFT.
            </div>
          </div>

          {/* City Context Card */}
          <div className="bg-white border-3 border-black p-5 shadow-[4px_4px_0px_0px_#000] space-y-3">
            <h4 className="text-xs font-black uppercase text-black flex items-center gap-1.5 border-b-2 border-black pb-2">
              <Building2 className="w-4 h-4 stroke-[2.5]" />
              Selected Location: {selectedCity.name} ({selectedCity.tier})
            </h4>
            <p className="text-xs text-neutral-700 leading-relaxed font-medium">
              {selectedCity.caveats}
            </p>
            <div className="text-[11px] text-neutral-700 border-t-2 border-black pt-2 space-y-1 font-bold">
              <div>
                Known GCC Hubs: {selectedCity.knownGccPresence.slice(0, 3).join(', ')}...
              </div>
              <div className="text-black uppercase">
                Data Classification: {selectedCity.evidenceStatus}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
