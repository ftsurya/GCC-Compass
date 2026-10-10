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
  onChangeConfig: (newConfig: HiringPlanConfig) => void;
  onNavigateToStressTest: () => void;
  onResetDefaults: () => void;
}

export const PlanBuilderView: React.FC<PlanBuilderViewProps> = ({
  cities,
  config,
  calc,
  onChangeConfig,
  onNavigateToStressTest,
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
    <div className="space-y-6">
      {/* Header and Reset */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">GCC Compass Engine</span>
            <span aria-hidden="true">·</span>
            <span>Deterministic Plan Configurator</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Hiring Plan & Funnel Assumptions Configurator
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Tune hiring targets, timeline constraints, conversion stages, and recruiter capacity. All outputs update in real time.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Reset to default 300-hire 6-month baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Baseline
          </button>
          <button
            onClick={onNavigateToStressTest}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm"
          >
            Compare in Stress Test
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Scenario Presets Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700 font-semibold shrink-0">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Quick Scenario Presets:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyQuickPreset('baseline')}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md font-medium text-slate-700 transition-colors shadow-2xs"
          >
            Standard Baseline (300 in 6m)
          </button>
          <button
            onClick={() => applyQuickPreset('compressed-timeline')}
            className="px-2.5 py-1 bg-white hover:bg-amber-50 border border-amber-200 text-amber-900 rounded-md font-medium transition-colors shadow-2xs"
          >
            Compressed Runway (4m)
          </button>
          <button
            onClick={() => applyQuickPreset('high-dropout')}
            className="px-2.5 py-1 bg-white hover:bg-rose-50 border border-rose-200 text-rose-900 rounded-md font-medium transition-colors shadow-2xs"
          >
            High Reneging (40% dropout)
          </button>
          <button
            onClick={() => applyQuickPreset('high-bar')}
            className="px-2.5 py-1 bg-white hover:bg-purple-50 border border-purple-200 text-purple-900 rounded-md font-medium transition-colors shadow-2xs"
          >
            High Technical Bar (12% pass)
          </button>
          <button
            onClick={() => applyQuickPreset('rpo-support')}
            className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-md font-medium transition-colors shadow-2xs"
          >
            Scalable RPO Support (8 TA + 1.5x)
          </button>
          <button
            onClick={() => applyQuickPreset('ideal-funnel')}
            className="px-2.5 py-1 bg-white hover:bg-cyan-50 border border-cyan-200 text-cyan-900 rounded-md font-medium transition-colors shadow-2xs"
            title="Sets 100% conversion at all stages for QA boundary verification"
          >
            100% Perfect Pipeline (QA)
          </button>
        </div>
      </div>

      {/* Live Calculation Output Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* KPI 1: Target Joiners */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Target Joiners
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 tabular-nums">
              {calc.targetHires}
            </span>
            <span className="text-xs text-slate-500 font-sans">Day-1 hires</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Velocity: {calc.monthlyPaceRequired} hires/mo
          </div>
        </div>

        {/* KPI 2: Total Sourced Pool */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Sourced Pool
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tracking-tight text-indigo-600 tabular-nums">
              {calc.requiredTotalApplicantPool.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-sans">resumes</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 truncate" title={`${calc.requiredQualifiedApplicants.toLocaleString()} qualified screens`}>
            {calc.requiredQualifiedApplicants.toLocaleString()} qualified screens
          </div>
        </div>

        {/* KPI 3: Interviews Required */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Technical Interviews
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 tabular-nums">
              {calc.requiredInterviews.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-sans">total rounds</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {calc.monthlyInterviewsNeeded}/mo active demand
          </div>
        </div>

        {/* KPI 4: Recruiter Load */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Recruiter Capacity
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span
              className={`text-2xl font-bold font-mono tracking-tight tabular-nums ${
                calc.isRecruiterCapacityExceeded ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {calc.recruiterCapacityUtilizationPct}%
            </span>
            <span className="text-xs text-slate-500 font-sans">load</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 truncate">
            {calc.isRecruiterCapacityExceeded
              ? `Deficit: ${calc.recruiterDeficit} recruiter(s)`
              : `Capacity: ${calc.totalRecruiterMonthlyCapacity}/mo`}
          </div>
        </div>

        {/* KPI 5: Feasibility Status */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs col-span-2 sm:col-span-1">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Feasibility Verdict
          </div>
          <div className="mt-1">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
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
                <ShieldAlert className="w-3.5 h-3.5" />
              )}
              {calc.overallFeasibilityStatus}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 truncate" title={calc.feasibilityRationale}>
            {calc.feasibilityRationale}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Input Controls & Roles Table */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Location & Project Timeline */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                1. Location, Target Headcount & Timeline Constraints
              </h2>
              <span className="text-[11px] text-slate-500 font-medium">
                Active Interview Runway: {calc.activeInterviewWindowMonths} Months
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* City Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Indian Location / City
                </label>
                <select
                  value={config.cityId}
                  onChange={(e) => handleUpdate('cityId', e.target.value)}
                  className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name} ({city.tier} · {city.state})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-500 truncate" title={selectedCity.estimatedSeniorTechTalentPool}>
                  {selectedCity.evidenceStatus}: {selectedCity.estimatedSeniorTechTalentPool}
                </p>
              </div>

              {/* Total Target Hires */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Total Target Hires
                  </label>
                  <span className="font-mono text-xs font-bold text-slate-900">
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
                  className="w-full text-xs font-mono font-medium bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <div className="mt-1 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleTotalTargetHiresChange(100)}
                    className="text-[10px] text-slate-500 hover:text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded"
                  >
                    100
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTotalTargetHiresChange(300)}
                    className="text-[10px] text-slate-500 hover:text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded"
                  >
                    300
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTotalTargetHiresChange(500)}
                    className="text-[10px] text-slate-500 hover:text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded"
                  >
                    500
                  </button>
                </div>
              </div>

              {/* Hiring Deadline (Months) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Hiring Deadline (Mo)
                  </label>
                  <span className="font-mono text-xs font-bold text-slate-900">
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
                  className="w-full text-xs font-mono font-medium bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Velocity: {calc.monthlyPaceRequired} hires/mo
                </p>
              </div>

              {/* Indian Notice Period Lag */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notice Period Lag
                </label>
                <select
                  value={config.noticePeriodLagDays}
                  onChange={(e) =>
                    handleUpdate('noticePeriodLagDays', Number(e.target.value) as 60 | 90)
                  }
                  className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value={60}>60 Days (2 Mo Standard)</option>
                  <option value={90}>90 Days (3 Mo Strict Services)</option>
                </select>
                <p className="mt-1 text-[11px] text-slate-500 truncate">
                  {calc.isTimelineImpossible
                    ? 'Infeasible: Notice ≥ Deadline'
                    : `Offer Cutoff: Mo ${calc.latestOfferCutoffMonth}`}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Roles & Seniority Allocation */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  2. Roles, Seniority & Headcount Breakdown
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sum of role headcounts defines the target: {config.totalTargetHires} total hires
                </p>
              </div>
              <button
                onClick={handleAddRole}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Role
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Role Title</th>
                    <th className="py-2.5 px-3 w-36">Seniority Tier</th>
                    <th className="py-2.5 px-3 w-28 text-right">Headcount</th>
                    <th className="py-2.5 px-3">Local Market Note</th>
                    <th className="py-2.5 px-2 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {config.roles.map((role, idx) => (
                    <tr key={role.id} className="hover:bg-slate-50/70">
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={role.title}
                          onChange={(e) => handleRoleChange(idx, 'title', e.target.value)}
                          className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 focus:border-slate-900 focus:ring-0 text-xs text-slate-900 font-medium py-1 px-0"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <select
                          value={role.seniority}
                          onChange={(e) =>
                            handleRoleChange(
                              idx,
                              'seniority',
                              e.target.value as RoleAllocation['seniority']
                            )
                          }
                          className="w-full bg-white border border-slate-200 rounded text-[11px] py-1 px-1.5 text-slate-700"
                        >
                          <option value="Junior (0-2y)">Junior (0-2y)</option>
                          <option value="Mid (3-5y)">Mid (3-5y)</option>
                          <option value="Senior (6-9y)">Senior (6-9y)</option>
                          <option value="Lead / Principal (10y+)">Lead (10y+)</option>
                        </select>
                      </td>
                      <td className="py-2 px-3 text-right">
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
                          className="w-24 text-right font-mono tabular-nums bg-white border border-slate-200 rounded text-xs py-1 px-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <span className="text-[11px] text-slate-500 line-clamp-1" title={role.marketAvailabilityNotes}>
                          {role.marketAvailabilityNotes || 'Standard role'}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button
                          onClick={() => handleDeleteRole(idx)}
                          disabled={config.roles.length <= 1}
                          className="text-slate-400 hover:text-rose-600 disabled:opacity-30 transition-colors p-1"
                          title="Delete role"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 border-t border-slate-200 font-semibold text-slate-800">
                  <tr>
                    <td colSpan={2} className="py-2 px-3">
                      Total Workforce Target
                    </td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-900 font-bold">
                      {config.totalTargetHires}
                    </td>
                    <td colSpan={2} className="py-2 px-3 text-slate-500 text-[11px]">
                      Hires in {config.deadlineMonths} months ({calc.monthlyPaceRequired} hires/mo)
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Section 3: Funnel Conversion Assumptions */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  3. Recruitment Funnel Conversion Assumptions
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Adjust conversion yields via slider or direct numeric percentage. Supports testing from 0% to 100%.
                </p>
              </div>
              <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5 shrink-0 font-medium">
                Interactive Model Inputs
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* Rate 1: Applicant to Qualified */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800">
                    Applicant-to-Qualified Rate
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
                      className="w-14 text-right font-mono text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded px-1.5 py-0.5"
                    />
                    <span className="text-xs font-bold text-slate-600">%</span>
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
                  className="w-full accent-slate-900"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Inbound resume filtering pass rate</span>
                  <span className="font-mono">{calc.requiredQualifiedApplicants.toLocaleString()} qualified</span>
                </div>
              </div>

              {/* Rate 2: Qualified to Interview */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800">
                    Qualified-to-Interview Rate
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
                      className="w-14 text-right font-mono text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded px-1.5 py-0.5"
                    />
                    <span className="text-xs font-bold text-slate-600">%</span>
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
                  className="w-full accent-slate-900"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Screened candidates scheduling 1st tech round</span>
                  <span className="font-mono">{calc.requiredInterviews.toLocaleString()} interviews</span>
                </div>
              </div>

              {/* Rate 3: Interview to Offer */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800">
                    Interview-to-Offer Conversion Rate
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
                      className="w-14 text-right font-mono text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded px-1.5 py-0.5"
                    />
                    <span className="text-xs font-bold text-slate-600">%</span>
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
                  className="w-full accent-slate-900"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Technical panel clearing rate</span>
                  <span className="font-mono">{calc.requiredOffersExtended} offers</span>
                </div>
              </div>

              {/* Rate 4: Offer Acceptance Rate */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800">
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
                      className="w-14 text-right font-mono text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded px-1.5 py-0.5"
                    />
                    <span className="text-xs font-bold text-slate-600">%</span>
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
                  className="w-full accent-slate-900"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Formal offers formally accepted</span>
                  <span className="font-mono">{calc.requiredAcceptedOffers} accepted</span>
                </div>
              </div>

              {/* Rate 5: Accepted to Joining Rate (The Notice-Period Reneging Factor) */}
              <div className="p-3.5 bg-amber-50/70 rounded-lg border border-amber-200 space-y-2 md:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-amber-950">
                      Accepted-Offer-to-Joining Rate (Notice Period Reneging)
                    </label>
                    <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 border border-amber-300 rounded text-amber-900">
                      Ghosting / Counter-offers
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
                      className="w-14 text-right font-mono text-xs font-bold text-amber-950 bg-white border border-amber-300 rounded px-1.5 py-0.5"
                    />
                    <span className="text-xs font-bold text-amber-950">%</span>
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
                  className="w-full accent-amber-800"
                />
                <div className="flex items-center justify-between text-[11px] text-amber-900">
                  <span>
                    Day-1 joiners per 100 accepted ({Math.max(0, 100 - config.acceptedToJoiningRate)}% renege during {config.noticePeriodLagDays}d notice)
                  </span>
                  <span className="font-mono font-bold">{calc.targetHires} Day-1 joiners</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Recruitment Capacity & Resourcing */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                4. Talent Acquisition Capacity & Team Size
              </h2>
              <span className="text-[11px] text-slate-500 font-medium">
                Team Monthly Capacity: {calc.totalRecruiterMonthlyCapacity} interviews/mo
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Dedicated Recruiters
                  </label>
                  <span className="font-mono text-xs font-bold text-slate-900">
                    {config.dedicatedRecruiters} TA
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleUpdate('dedicatedRecruiters', Math.max(1, config.dedicatedRecruiters - 1))}
                    className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold"
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
                    className="flex-1 text-xs font-mono font-medium text-center bg-white border border-slate-300 rounded-lg py-1.5 text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => handleUpdate('dedicatedRecruiters', config.dedicatedRecruiters + 1)}
                    className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold"
                  >
                    +
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Full-time in-house talent partners
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Screens / Recruiter / Mo
                  </label>
                  <span className="font-mono text-xs font-bold text-slate-900">
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
                  className="w-full text-xs font-mono font-medium bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                />
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
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
                    className="hover:underline font-semibold text-slate-700"
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Agency / RPO Support
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                      <input
                        type="checkbox"
                        checked={config.agencySupportEnabled}
                        onChange={(e) => handleUpdate('agencySupportEnabled', e.target.checked)}
                        className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                      />
                      <span>Enable RPO Multiplier</span>
                    </label>
                  </div>
                </div>

                {config.agencySupportEnabled ? (
                  <div className="mt-2 flex items-center gap-2">
                    <label className="text-[11px] text-slate-500 shrink-0">Scale:</label>
                    <select
                      value={config.agencyCapacityMultiplier || 1.5}
                      onChange={(e) => handleUpdate('agencyCapacityMultiplier', parseFloat(e.target.value))}
                      className="text-xs bg-white border border-slate-300 rounded px-2 py-1 text-slate-900"
                    >
                      <option value={1.25}>1.25x (+25% capacity)</option>
                      <option value={1.5}>1.50x (+50% capacity)</option>
                      <option value={1.75}>1.75x (+75% capacity)</option>
                      <option value={2.0}>2.00x (+100% capacity)</option>
                    </select>
                  </div>
                ) : (
                  <p className="mt-1 text-[11px] text-slate-500">
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
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-slate-700" />
                Active Operational Risk Alerts ({calc.bottlenecks.length})
              </h4>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  calc.bottlenecks.length === 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : calc.bottlenecks.some((b) => b.severity === 'critical')
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {calc.bottlenecks.length === 0 ? 'Optimal' : calc.overallFeasibilityStatus}
              </span>
            </div>

            {calc.bottlenecks.length === 0 ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2.5 text-xs text-emerald-900">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">No Operational Bottlenecks Detected</div>
                  <div className="text-[11px] text-emerald-800 mt-0.5">
                    Current recruiter team capacity and interview runway can comfortably support the target volume within the specified timeline.
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {calc.bottlenecks.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border text-xs space-y-1 ${
                      alert.severity === 'critical'
                        ? 'bg-rose-50 border-rose-200 text-rose-950'
                        : 'bg-amber-50 border-amber-200 text-amber-950'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1">
                        <AlertTriangle className={`w-3.5 h-3.5 ${alert.severity === 'critical' ? 'text-rose-600' : 'text-amber-600'}`} />
                        {alert.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/80 border border-current">
                        {alert.impactMetric}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed opacity-90">
                      {alert.description}
                    </p>
                    <div className="text-[10px] pt-1 border-t border-black/5 opacity-80">
                      <span className="font-semibold">Action:</span> {alert.suggestedMitigation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mathematical Proof & Funnel Trace */}
          <div className="bg-slate-900 text-slate-100 rounded-xl p-6 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold tracking-tight text-white">
                  Mathematical Proof & Funnel Trace
                </h3>
                <p className="text-[11px] text-slate-400">
                  Strict backward induction arithmetic
                </p>
              </div>
              <button
                onClick={() => setShowFormulaDetails(!showFormulaDetails)}
                className="text-[11px] text-slate-400 hover:text-white underline"
              >
                {showFormulaDetails ? 'Compact' : 'Expand'}
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              {/* Step 1 */}
              <div className="space-y-1">
                <div className="text-slate-400 text-[11px]">1. Required Accepted Offers</div>
                <div className="text-white font-semibold">
                  {config.totalTargetHires} ÷ {((config.acceptedToJoiningRate || 1) / 100).toFixed(2)} ={' '}
                  <span className="text-emerald-400 font-bold">{calc.requiredAcceptedOffers}</span>
                </div>
                {showFormulaDetails && (
                  <div className="text-[10px] text-slate-400 font-sans">
                    Target / Joining Rate. Compensates for {Math.max(0, 100 - config.acceptedToJoiningRate)}% notice period dropouts.
                  </div>
                )}
              </div>

              {/* Step 2 */}
              <div className="space-y-1">
                <div className="text-slate-400 text-[11px]">2. Required Formal Offers</div>
                <div className="text-white font-semibold">
                  {calc.requiredAcceptedOffers} ÷ {((config.offerAcceptanceRate || 1) / 100).toFixed(2)} ={' '}
                  <span className="text-emerald-400 font-bold">{calc.requiredOffersExtended}</span>
                </div>
                {showFormulaDetails && (
                  <div className="text-[10px] text-slate-400 font-sans">
                    Accepted / Acceptance Rate. Compensates for declined offers.
                  </div>
                )}
              </div>

              {/* Step 3 */}
              <div className="space-y-1">
                <div className="text-slate-400 text-[11px]">3. Technical Interviews Needed</div>
                <div className="text-white font-semibold">
                  {calc.requiredOffersExtended} ÷ {((config.interviewToOfferRate || 1) / 100).toFixed(2)} ={' '}
                  <span className="text-emerald-400 font-bold">{calc.requiredInterviews.toLocaleString()}</span>
                </div>
                {showFormulaDetails && (
                  <div className="text-[10px] text-slate-400 font-sans">
                    Offers / Interview-to-Offer Rate.
                  </div>
                )}
              </div>

              {/* Step 4 */}
              <div className="space-y-1">
                <div className="text-slate-400 text-[11px]">4. Qualified Applicants Pool</div>
                <div className="text-white font-semibold">
                  {calc.requiredInterviews} ÷ {((config.qualifiedToInterviewRate || 1) / 100).toFixed(2)} ={' '}
                  <span className="text-emerald-400 font-bold">{calc.requiredQualifiedApplicants.toLocaleString()}</span>
                </div>
              </div>

              {/* Step 5 */}
              <div className="space-y-1">
                <div className="text-slate-400 text-[11px]">5. Total Sourced Resumes</div>
                <div className="text-white font-semibold">
                  {calc.requiredQualifiedApplicants} ÷ {((config.applicantToQualifiedRate || 1) / 100).toFixed(2)} ={' '}
                  <span className="text-emerald-400 font-bold">{calc.requiredTotalApplicantPool.toLocaleString()}</span>
                </div>
              </div>

              {/* Capacity Math */}
              <div className="pt-3 border-t border-slate-800 space-y-1.5">
                <div className="text-slate-400 text-[11px]">6. Recruiter Velocity & Gap</div>
                <div className="text-white">
                  Demand:{' '}
                  {calc.isTimelineImpossible ? (
                    <span className="text-rose-400 font-bold">{calc.requiredInterviews.toLocaleString()} (0 active mo - Infeasible)</span>
                  ) : (
                    <>
                      {calc.requiredInterviews.toLocaleString()} / {calc.activeInterviewWindowMonths} mo ={' '}
                      <span className="text-amber-300 font-bold">{calc.monthlyInterviewsNeeded}/mo</span>
                    </>
                  )}
                </div>
                <div className="text-white">
                  Capacity: {config.dedicatedRecruiters} × {config.monthlyInterviewsPerRecruiter}
                  {config.agencySupportEnabled && ` × ${config.agencyCapacityMultiplier || 1.5}x (RPO)`} ={' '}
                  <span className="text-cyan-300 font-bold">{calc.totalRecruiterMonthlyCapacity}/mo</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  Load:{' '}
                  <span
                    className={
                      calc.isRecruiterCapacityExceeded ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'
                    }
                  >
                    {calc.recruiterCapacityUtilizationPct}%
                  </span>{' '}
                  ({calc.isRecruiterCapacityExceeded ? `Deficit: ${calc.recruiterDeficit} recruiters` : 'Within capacity'})
                </div>
              </div>

              {/* Engineering Panel Math */}
              <div className="pt-3 border-t border-slate-800 space-y-1.5">
                <div className="text-slate-400 text-[11px]">7. Engineering Panel Workload</div>
                <div className="text-white">
                  {calc.requiredInterviews.toLocaleString()} interviews × 2.0 hrs ={' '}
                  <span className="text-purple-300 font-bold">{calc.engineeringInterviewHoursTotal.toLocaleString()} total hrs</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  Monthly panel demand: ~{calc.engineeringInterviewHoursPerMonth.toLocaleString()} hrs/mo
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800">
              Deterministic calculations ensure zero floating-point drift or mock estimations.
            </div>
          </div>

          {/* City Context Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-600" />
              Selected Location: {selectedCity.name} ({selectedCity.tier})
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedCity.caveats}
            </p>
            <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-2 space-y-1">
              <div>
                Known GCC Hubs: {selectedCity.knownGccPresence.slice(0, 3).join(', ')}...
              </div>
              <div className="font-semibold text-slate-700">
                Data Classification: {selectedCity.evidenceStatus}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
