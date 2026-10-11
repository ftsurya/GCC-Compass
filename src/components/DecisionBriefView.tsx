import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Printer,
  Download,
  FileDown,
  Check,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import {
  CityProfile,
  HiringPlanConfig,
  CalculationResult,
  EvidenceItem,
} from '../types';
import { generateExecutiveSummary } from '../utils/calculator';
import { exportDecisionBriefPdf } from '../utils/pdfExport';

interface DecisionBriefViewProps {
  city: CityProfile;
  config: HiringPlanConfig;
  calc: CalculationResult;
  evidenceList: EvidenceItem[];
}

export const DecisionBriefView: React.FC<DecisionBriefViewProps> = ({
  city,
  config,
  calc,
  evidenceList,
}) => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Compute senior headcount and labels dynamically
  const seniorHeadcount = config.roles
    .filter((r) => r.seniority.includes('Senior') || r.seniority.includes('Lead'))
    .reduce((sum, r) => sum + (Number(r.headcount) || 0), 0);

  const seniorRolesLabel =
    config.roles
      .filter((r) => r.seniority.includes('Senior') || r.seniority.includes('Lead'))
      .map((r) => `${r.headcount} ${r.title}`)
      .slice(0, 2)
      .join(' and ') || `${seniorHeadcount} senior roles`;

  const regionalInstitutions =
    city.id === 'vizag'
      ? 'Andhra University and GITAM University'
      : city.id === 'hyderabad'
      ? 'IIT Hyderabad, IIIT, and Osmania University'
      : city.id === 'bengaluru'
      ? 'IISc, RVCE, and PES University'
      : city.id === 'coimbatore'
      ? 'PSG Tech, CIT, and Amrita Vishwa Vidyapeetham'
      : city.id === 'bhubaneswar'
      ? 'IIT Bhubaneswar, NIT Rourkela, and KIIT'
      : city.id === 'pune'
      ? 'COEP Technological University, Pune University (SPPU), and Cummins College'
      : 'regional state engineering institutions';

  const handleDownloadPdf = () => {
    try {
      setIsGeneratingPdf(true);
      exportDecisionBriefPdf(city, config, calc, evidenceList);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setTimeout(() => setIsGeneratingPdf(false), 800);
    }
  };

  const markdownContent = `# EXECUTIVE DECISION BRIEF: GCC COMPASS LOCATION INTELLIGENCE
**Subject:** Feasibility Evaluation for Establishing Tech Workforce in ${city.name}, ${city.state}
**Target:** ${config.totalTargetHires} Tech Professionals within ${config.deadlineMonths} Months
**Epistemic Status:** Deterministic Funnel Modeling & Evidence Audit

---

## 1. Executive Summary & Verdict
- **Target Day-1 Joined Headcount:** ${calc.targetHires} professionals
- **Active Offer Closure Window:** ${calc.activeInterviewWindowMonths} Months (enforcing ${config.noticePeriodLagDays}-day Indian notice period lag)
- **Feasibility Verdict:** **${calc.overallFeasibilityStatus.toUpperCase()}**
- **Core Rationale:** ${calc.feasibilityRationale}

---

## 2. Deterministic Recruitment Funnel Sizing
| Funnel Stage | Volume Required | Conversion / Yield Rate | Operational Notes |
|---|---|---|---|
| 1. Sourced Resume Pool | ${calc.requiredTotalApplicantPool.toLocaleString()} | ${config.applicantToQualifiedRate}% screen pass rate | Top-of-funnel inbound + proactive headhunting |
| 2. Qualified Candidates | ${calc.requiredQualifiedApplicants.toLocaleString()} | ${config.qualifiedToInterviewRate}% reach 1st interview | Tech resume match & compensation fit |
| 3. Final Interviews Conducted | ${calc.requiredInterviews.toLocaleString()} | ${config.interviewToOfferRate}% pass to offer | Demands ${calc.engineeringInterviewHoursTotal.toLocaleString()} engineering interviewer hours |
| 4. Formal Offers Extended | ${calc.requiredOffersExtended} | ${config.offerAcceptanceRate}% offer acceptance | Industry standard compensation band |
| 5. Signed / Accepted Offers | ${calc.requiredAcceptedOffers} | ${config.acceptedToJoiningRate}% Day-1 joined | ${100 - config.acceptedToJoiningRate}% reneged during notice period |
| 6. Final Day-1 Joiners | **${calc.targetHires}** | **${((calc.targetHires / calc.requiredTotalApplicantPool) * 100).toFixed(2)}% overall yield** | Target workforce achieved |

---

## 3. Operational Load & Capacity Deficit
- **Required Monthly Interview Velocity:** ${calc.monthlyInterviewsNeeded} interviews/month
- **Current In-house Recruiter Capacity:** ${calc.totalRecruiterMonthlyCapacity} interviews/month (${config.dedicatedRecruiters} recruiters @ ${config.monthlyInterviewsPerRecruiter} screens/mo)
- **Recruiter Team Load:** **${calc.recruiterCapacityUtilizationPct}%** (${calc.isRecruiterCapacityExceeded ? `Deficit of ${calc.recruiterDeficit} recruiter(s)` : 'Balanced'})
- **Engineering Interview Tax:** ${calc.engineeringInterviewHoursPerMonth} engineering hours/month required from senior tech staff.

---

## 4. Key Bottlenecks & Risk Factors
${calc.bottlenecks.map((b, idx) => `### ${idx + 1}. ${b.title} (${b.impactMetric})\n- **Constraint:** ${b.description}\n- **Mitigation:** ${b.suggestedMitigation}`).join('\n\n')}

---

## 5. Regional Labour Market Reality: ${city.name} (${city.tier})
- **Senior Talent Pool Context:** Estimated at ${city.estimatedSeniorTechTalentPool}. Sourcing ${seniorHeadcount} senior/lead technical roles (${seniorRolesLabel}) represents recruiting from the city's active experienced talent base.
- **Location Nuance:** ${city.techEcosystemSummary}
- **Retention Baseline:** Estimated voluntary turnover in ${city.name} is ~${city.typicalOfferDropoutRate}%.
- **Notice Period Reality:** Local employers typically enforce ${city.averageNoticePeriodDays}-day notice periods.

---

## 6. Recommended Next Validation Steps for Strategy & TA Teams
1. **Recruiter Sourcing Pilot (14 Days):** Run a live sourcing sprint on LinkedIn Recruiter and local portals targeting 100 experienced engineers in ${city.name} to test actual response rates.
2. **Local Salary Benchmark Calibration:** Compare local ${city.tier} compensation against Tier-1 metro rates to determine required premium for attracting returning talent.
3. **Institutional Feeder Partnerships:** Engage ${regionalInstitutions} for campus pipelines to unburden lateral mid-level targets.
4. **Notice Period Retention Program:** Institute joining incentive milestones (e.g. 50% on Day 1, 50% at Month 3) to suppress notice period renege rates below 20%.

*Generated via GCC Compass Location Intelligence Platform.*
`;

  const handleCopyMarkdown = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(markdownContent);
        setCopied(true);
        setCopyError(false);
        setTimeout(() => setCopied(false), 2500);
        return;
      }
    } catch (err) {
      console.warn('Clipboard API blocked, using textarea fallback:', err);
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = markdownContent;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (successful) {
        setCopied(true);
        setCopyError(false);
        setTimeout(() => setCopied(false), 2500);
        return;
      }
    } catch (fallbackErr) {
      console.error('Fallback copy failed:', fallbackErr);
    }

    setCopyError(true);
    setTimeout(() => setCopyError(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    try {
      const data = {
        briefTitle: `GCC Compass Location Intelligence Brief: ${city.name}`,
        dateGenerated: new Date().toISOString(),
        location: city,
        planConfig: config,
        deterministicResults: calc,
        evidenceCitations: evidenceList.map((e) => ({
          id: e.id,
          claim: e.claim,
          metricValue: e.metricValue,
          sourceName: e.sourceName,
          sourceUrl: e.sourceUrl,
          publicationDate: e.publicationDate,
          dateChecked: e.dateChecked,
          geography: e.geography,
          jobCategories: e.jobCategories,
          classification: e.classification,
          confidenceScore: e.confidenceScore,
          limitations: e.limitations,
        })),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gcc-compass-decision-brief-${city.id}-${config.totalTargetHires}-hires.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download JSON brief:', err);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Action Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Executive Intelligence Report</span>
            <span aria-hidden="true">·</span>
            <span>Decision Memorandum</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Executive Decision Brief
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied!</span>
              </>
            ) : copyError ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span className="text-rose-700 font-semibold">Copy Blocked</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadJson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>JSON Brief</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print View</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm"
          >
            <FileDown className="w-3.5 h-3.5 text-white" />
            <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Brief Document Container */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 shadow-sm space-y-8 text-slate-900 print:border-none print:shadow-none print:p-0">
        {/* Memo Header */}
        <div className="border-b border-slate-200 pb-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-mono uppercase tracking-wider">
              CONFIDENTIAL · GCC WORKFORCE EXPANSION MEMORANDUM
            </span>
            <span className="font-mono">DATE: OCTOBER 2024</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Workforce Feasibility Assessment: Hiring {config.totalTargetHires} Technology Professionals in {city.name}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs">
            <div>
              <span className="text-slate-500 block">Location Target:</span>
              <strong className="text-slate-800 font-semibold">
                {city.name}, {city.state} ({city.tier})
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Project Deadline:</span>
              <strong className="text-slate-800 font-semibold font-mono">
                {config.deadlineMonths} Months
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Offer Window:</span>
              <strong className="text-slate-800 font-semibold font-mono">
                {calc.activeInterviewWindowMonths} Months ({config.noticePeriodLagDays}d notice)
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Feasibility Verdict:</span>
              <strong
                className={`font-semibold ${
                  calc.isRecruiterCapacityExceeded ? 'text-amber-700' : 'text-emerald-700'
                }`}
              >
                {calc.overallFeasibilityStatus}
              </strong>
            </div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            1. Executive Summary & Core Verdict
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            This stress test assesses whether establishing a <strong>{config.totalTargetHires}-person technology center in {city.name}</strong> within <strong>{config.deadlineMonths} months</strong> is operationally feasible. 
            While the hiring target is mathematically achievable, our model exposes a critical recruitment capacity strain: in-house recruiters can fulfill only <strong>{calc.totalRecruiterMonthlyCapacity}</strong> of the required <strong>{calc.monthlyInterviewsNeeded}</strong> monthly interviews. Furthermore, the <strong>{config.noticePeriodLagDays}-day notice-period assumption</strong> compresses the active offer window to just <strong>{calc.activeInterviewWindowMonths} months</strong>.
          </p>
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 space-y-1">
            <strong>Key Distinction:</strong> Mathematical calculations establish operational pipeline requirements; they do not guarantee candidate supply or willingness to join without active employer branding in {city.name}.
          </div>
        </div>

        {/* Section 2: Deterministic Recruitment Sizing */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            2. Recruitment Funnel Sizing (Deterministic Trace)
          </h3>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Funnel Stage</th>
                  <th className="py-2.5 px-3 font-mono text-right">Required Volume</th>
                  <th className="py-2.5 px-3 font-mono text-right">Conversion Rate</th>
                  <th className="py-2.5 px-3">Operational Significance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-800">1. Sourced Pipeline Pool</td>
                  <td className="py-2 px-3 text-right font-mono font-bold tabular-nums text-slate-900">
                    {calc.requiredTotalApplicantPool.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-600">
                    {config.applicantToQualifiedRate}% screen pass
                  </td>
                  <td className="py-2 px-3 text-[11px] text-slate-500">
                    Proactive outbound sourcing & portal inbound volume
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-800">2. Qualified Candidates</td>
                  <td className="py-2 px-3 text-right font-mono font-bold tabular-nums text-slate-900">
                    {calc.requiredQualifiedApplicants.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-600">
                    {config.qualifiedToInterviewRate}% interview opt-in
                  </td>
                  <td className="py-2 px-3 text-[11px] text-slate-500">
                    Screened candidates scheduled for 1st round
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-800">3. Technical Interviews</td>
                  <td className="py-2 px-3 text-right font-mono font-bold tabular-nums text-slate-900">
                    {calc.requiredInterviews.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-600">
                    {config.interviewToOfferRate}% pass rate
                  </td>
                  <td className="py-2 px-3 text-[11px] text-slate-500">
                    Requires {calc.engineeringInterviewHoursTotal.toLocaleString()} engineering interviewer hours
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-800">4. Formal Offers Extended</td>
                  <td className="py-2 px-3 text-right font-mono font-bold tabular-nums text-slate-900">
                    {calc.requiredOffersExtended}
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-600">
                    {config.offerAcceptanceRate}% acceptance
                  </td>
                  <td className="py-2 px-3 text-[11px] text-slate-500">
                    Total written offer letters released
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-800">5. Signed / Accepted Offers</td>
                  <td className="py-2 px-3 text-right font-mono font-bold tabular-nums text-slate-900">
                    {calc.requiredAcceptedOffers}
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-600">
                    {config.acceptedToJoiningRate}% Day-1 join rate
                  </td>
                  <td className="py-2 px-3 text-[11px] text-slate-500">
                    {100 - config.acceptedToJoiningRate}% expected reneges during notice period
                  </td>
                </tr>
                <tr className="bg-emerald-50/60 font-semibold text-emerald-950">
                  <td className="py-2.5 px-3">6. Final Day-1 Joined Staff</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums">
                    {calc.targetHires}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                    {((calc.targetHires / calc.requiredTotalApplicantPool) * 100).toFixed(2)}% net yield
                  </td>
                  <td className="py-2.5 px-3 text-[11px]">
                    Target staffing complete within {config.deadlineMonths} months
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Operational Capacity & Bottlenecks */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            3. Operational Capacity Constraints & Bottlenecks
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {calc.bottlenecks.map((bottleneck) => (
              <div
                key={bottleneck.id}
                className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <strong className="text-slate-900 font-bold">{bottleneck.title}</strong>
                  <span className="font-mono text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                    {bottleneck.impactMetric}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {bottleneck.description}
                </p>
                <div className="pt-2 border-t border-slate-200 text-[11px]">
                  <span className="font-semibold text-slate-800">Action: </span>
                  <span className="text-slate-600">{bottleneck.suggestedMitigation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Local Talent Realities */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            4. Local Labour Market Realities: {city.name}
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            {city.name} offers distinct advantages as a {city.tier} GCC destination, including {city.techEcosystemSummary} However, lateral recruitment for <strong>{seniorHeadcount} senior & lead technical roles</strong> within {config.deadlineMonths} months presents specific operational realities:
          </p>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5">
            <li>
              <strong>Senior Talent Density:</strong> The active senior tech workforce (6+ years) in {city.name} is estimated at <strong>{city.estimatedSeniorTechTalentPool}</strong>. Sourcing {seniorHeadcount} senior roles represents recruiting from this defined experienced cohort.
            </li>
            <li>
              <strong>Talent Sourcing Strategy:</strong> Sourcing cannot rely solely on local lateral cannibalization. Talent acquisition campaigns must also attract professionals originating from the region currently working in major Tier-1 technology hubs who seek to relocate for quality of life and family proximity.
            </li>
            <li>
              <strong>Notice Period Rigidity:</strong> Regional employers typically enforce <strong>{city.averageNoticePeriodDays}-day notice periods</strong>, dictating an active offer cutoff by Month {calc.latestOfferCutoffMonth}.
            </li>
          </ul>
        </div>

        {/* Section 5: Actionable Validation Roadmap */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            5. Recommended Next Validation Steps (Product & TA Roadmap)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 border border-slate-200 rounded-lg">
              <strong className="text-slate-900 block mb-1">
                1. Recruiter Sourcing Sprint (14 Days)
              </strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Run a live outbound sourcing test targeting 100 experienced engineers in {city.name} to measure response rates and verify whether the assumed {config.qualifiedToInterviewRate}% screening conversion rate holds locally.
              </p>
            </div>

            <div className="p-3 border border-slate-200 rounded-lg">
              <strong className="text-slate-900 block mb-1">
                2. Compensation Benchmark Study
              </strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Commission a local compensation calibration against Tier-1 rates to establish the appropriate cost-competitiveness band without triggering elevated offer declines.
              </p>
            </div>

            <div className="p-3 border border-slate-200 rounded-lg">
              <strong className="text-slate-900 block mb-1">
                3. RPO Partner Engagement
              </strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {calc.isRecruiterCapacityExceeded
                  ? `Retain an executive search or RPO partner to absorb the projected ${calc.recruiterDeficit}-recruiter bandwidth shortfall.`
                  : 'Maintain current in-house recruiting team while engaging contingency search partners for senior technical leadership.'}
              </p>
            </div>

            <div className="p-3 border border-slate-200 rounded-lg">
              <strong className="text-slate-900 block mb-1">
                4. University Placement Allotment
              </strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Initiate campus placement partnerships with {regionalInstitutions} to convert entry-level roles into dedicated graduate cohorts.
              </p>
            </div>
          </div>
        </div>

        {/* Sign-off & Audit Stamp */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span>Prepared for: GCC Expansion & Workforce Planning Committee</span>
            <div className="text-[11px]">System Model: GCC Compass Workforce Intelligence Engine</div>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Audit-Grade Mathematical Rigor</span>
          </div>
        </div>
      </div>
    </div>
  );
};
