import { jsPDF } from 'jspdf';
import {
  CityProfile,
  HiringPlanConfig,
  CalculationResult,
  EvidenceItem,
} from '../types';

/**
 * Generates a clean, professional, printer-friendly PDF document of the Executive Decision Brief.
 */
export function exportDecisionBriefPdf(
  city: CityProfile,
  config: HiringPlanConfig,
  calc: CalculationResult,
  evidenceList: EvidenceItem[]
): void {
  // Create document in A4 portrait
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Helper for page break check
  const ensureSpace = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      y = margin + 8; // Leave room for top running header
    }
  };

  // Helper to format text with auto wrap
  const writeWrappedText = (
    text: string,
    x: number,
    fontSize: number,
    fontStyle: 'normal' | 'bold' | 'italic',
    color: [number, number, number],
    lineHeight: number,
    maxWidth: number = contentWidth
  ): number => {
    doc.setFont('helvetica', fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(text, maxWidth);
    ensureSpace(lines.length * lineHeight);
    doc.text(lines, x, y);
    y += lines.length * lineHeight;
    return lines.length * lineHeight;
  };

  // Helper to draw horizontal divider
  const drawDivider = (customY?: number) => {
    const targetY = customY ?? y;
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.3);
    doc.line(margin, targetY, margin + contentWidth, targetY);
  };

  // --------------------------------------------------------------------------
  // Document Title & Executive Header
  // --------------------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('CONFIDENTIAL · GCC WORKFORCE EXPANSION MEMORANDUM', margin, y);
  doc.text(`DATE: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`, pageWidth - margin, y, { align: 'right' });
  y += 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // slate-900
  const titleLines = doc.splitTextToSize(`Workforce Feasibility Assessment: Hiring ${config.totalTargetHires} Tech Professionals in ${city.name}`, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 6 + 2;

  // Meta stats box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, y, contentWidth, 14, 'FD');

  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');

  const colW = contentWidth / 4;
  doc.text('LOCATION TARGET', margin + 3, y + 4.5);
  doc.text('PROJECT DEADLINE', margin + colW + 3, y + 4.5);
  doc.text('OFFER WINDOW (LAG)', margin + colW * 2 + 3, y + 4.5);
  doc.text('FEASIBILITY VERDICT', margin + colW * 3 + 3, y + 4.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`${city.name} (${city.tier})`, margin + 3, y + 10);
  doc.text(`${config.deadlineMonths} Months`, margin + colW + 3, y + 10);
  doc.text(`${calc.activeInterviewWindowMonths} Mo (${config.noticePeriodLagDays}d notice)`, margin + colW * 2 + 3, y + 10);

  // Verdict color
  if (calc.overallFeasibilityStatus === 'Mathematically Viable') {
    doc.setTextColor(4, 120, 87);
  } else if (calc.overallFeasibilityStatus === 'Capacity Constrained') {
    doc.setTextColor(180, 83, 9);
  } else {
    doc.setTextColor(190, 18, 60);
  }
  doc.text(calc.overallFeasibilityStatus, margin + colW * 3 + 3, y + 10);

  y += 18;

  // --------------------------------------------------------------------------
  // Section 1: Executive Summary & Core Verdict
  // --------------------------------------------------------------------------
  ensureSpace(25);
  writeWrappedText('1. EXECUTIVE SUMMARY & VERDICT', margin, 10, 'bold', [15, 23, 42], 4);
  y += 1.5;

  const execSummary = `This assessment models whether establishing a ${config.totalTargetHires}-person technology centre in ${city.name} within ${config.deadlineMonths} months is operationally viable. The deterministic model confirms that meeting this target demands an end-to-end recruitment funnel of ${calc.requiredTotalApplicantPool.toLocaleString()} sourced resumes, ${calc.requiredInterviews.toLocaleString()} technical interviews, and ${calc.requiredOffersExtended} formal job offers. A primary operational constraint is the ${config.noticePeriodLagDays}-day notice-period assumption, which shortens the active offer window to just ${calc.activeInterviewWindowMonths} months. Current in-house capacity (${calc.totalRecruiterMonthlyCapacity} interviews/mo) faces a utilization load of ${calc.recruiterCapacityUtilizationPct}%, resulting in a shortfall of ${calc.recruiterDeficit} recruiter(s).`;
  writeWrappedText(execSummary, margin, 8.5, 'normal', [51, 65, 85], 3.8);
  y += 2;

  // Epistemic note box
  ensureSpace(12);
  doc.setFillColor(254, 243, 199); // amber-100
  doc.setDrawColor(251, 191, 36);
  doc.rect(margin, y, contentWidth, 9, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(146, 64, 14); // amber-800
  doc.text('Epistemic Principle:', margin + 3, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.text('Mathematical calculations establish operational pipeline requirements; they do not guarantee candidate supply or willingness to join without localized employer branding.', margin + 32, y + 4, { maxWidth: contentWidth - 35 });
  y += 13;

  // --------------------------------------------------------------------------
  // Section 2: Deterministic Recruitment Funnel Sizing
  // --------------------------------------------------------------------------
  ensureSpace(40);
  writeWrappedText('2. DETERMINISTIC RECRUITMENT FUNNEL SIZING', margin, 10, 'bold', [15, 23, 42], 4);
  y += 2;

  // Funnel Table Header
  const tableX = margin;
  const thHeight = 6;
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(tableX, y, contentWidth, thHeight, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);

  const col1W = 55;
  const col2W = 32;
  const col3W = 40;
  const col4W = contentWidth - col1W - col2W - col3W;

  doc.text('FUNNEL STAGE', tableX + 3, y + 4.2);
  doc.text('VOLUME REQUIRED', tableX + col1W + 3, y + 4.2);
  doc.text('CONVERSION RATE', tableX + col1W + col2W + 3, y + 4.2);
  doc.text('OPERATIONAL SIGNIFICANCE', tableX + col1W + col2W + col3W + 3, y + 4.2);
  y += thHeight;

  // Funnel Table Rows
  const tableRows = [
    {
      stage: '1. Sourced Candidate Pool',
      vol: `${calc.requiredTotalApplicantPool.toLocaleString()} candidates`,
      rate: `${config.applicantToQualifiedRate}% screen pass`,
      note: 'Inbound portal volume + proactive outbound search',
    },
    {
      stage: '2. Qualified & Screened Pool',
      vol: `${calc.requiredQualifiedApplicants.toLocaleString()} candidates`,
      rate: `${config.qualifiedToInterviewRate}% interview opt-in`,
      note: 'Screened profiles clearing basic technical criteria',
    },
    {
      stage: '3. Technical Interviews',
      vol: `${calc.requiredInterviews.toLocaleString()} interviews`,
      rate: `${config.interviewToOfferRate}% pass to offer`,
      note: `Demands ${calc.engineeringInterviewHoursTotal.toLocaleString()} engineering panel hours`,
    },
    {
      stage: '4. Formal Offers Extended',
      vol: `${calc.requiredOffersExtended} offers`,
      rate: `${config.offerAcceptanceRate}% offer acceptance`,
      note: 'Formal written compensation packages released',
    },
    {
      stage: '5. Signed / Accepted Offers',
      vol: `${calc.requiredAcceptedOffers} signed`,
      rate: `${config.acceptedToJoiningRate}% Day-1 join rate`,
      note: `${100 - config.acceptedToJoiningRate}% reneged during notice period`,
    },
    {
      stage: '6. Final Day-1 Joiners',
      vol: `${calc.targetHires} joiners`,
      rate: `${((calc.targetHires / calc.requiredTotalApplicantPool) * 100).toFixed(2)}% net yield`,
      note: `Staffing target reached within ${config.deadlineMonths} months`,
      isTarget: true,
    },
  ];

  tableRows.forEach((row, i) => {
    ensureSpace(6);
    if (row.isTarget) {
      doc.setFillColor(236, 253, 245); // emerald-50
      doc.rect(tableX, y, contentWidth, 6, 'F');
      doc.setTextColor(6, 95, 70); // emerald-800
      doc.setFont('helvetica', 'bold');
    } else {
      if (i % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(tableX, y, contentWidth, 5.5, 'F');
      }
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'normal');
    }
    doc.setFontSize(7.5);
    doc.text(row.stage, tableX + 3, y + 4);
    doc.setFont('helvetica', 'bold');
    doc.text(row.vol, tableX + col1W + 3, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.text(row.rate, tableX + col1W + col2W + 3, y + 4);
    doc.setTextColor(100, 116, 139);
    doc.text(row.note, tableX + col1W + col2W + col3W + 3, y + 4, { maxWidth: col4W - 4 });
    y += row.isTarget ? 6.5 : 5.5;
  });

  drawDivider();
  y += 4;

  // --------------------------------------------------------------------------
  // Section 3: Recruitment Capacity & Operational Bottlenecks
  // --------------------------------------------------------------------------
  ensureSpace(35);
  writeWrappedText('3. RECRUITMENT CAPACITY & BOTTLENECK ANALYSIS', margin, 10, 'bold', [15, 23, 42], 4);
  y += 2;

  // Capacity stats
  const capacitySummary = `Monthly Interview Velocity Required: ${calc.monthlyInterviewsNeeded}/mo  |  In-House Recruiter Capacity: ${calc.totalRecruiterMonthlyCapacity}/mo (${config.dedicatedRecruiters} recruiters)  |  Capacity Utilization: ${calc.recruiterCapacityUtilizationPct}% (${calc.isRecruiterCapacityExceeded ? `Deficit of ${calc.recruiterDeficit} recruiter(s)` : 'Balanced'})  |  Engineering Panel Load: ${calc.engineeringInterviewHoursPerMonth} hrs/mo`;
  writeWrappedText(capacitySummary, margin, 7.5, 'bold', [71, 85, 105], 3.6);
  y += 3;

  calc.bottlenecks.forEach((b) => {
    ensureSpace(16);
    doc.setFillColor(b.severity === 'critical' ? 255 : 254, b.severity === 'critical' ? 241 : 243, b.severity === 'critical' ? 242 : 199);
    doc.setDrawColor(b.severity === 'critical' ? 254 : 251, b.severity === 'critical' ? 205 : 191, b.severity === 'critical' ? 211 : 36);
    doc.rect(margin, y, contentWidth, 14, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(b.severity === 'critical' ? 159 : 146, b.severity === 'critical' ? 18 : 64, b.severity === 'critical' ? 57 : 14);
    doc.text(`${b.title.toUpperCase()}  [Impact: ${b.impactMetric}]`, margin + 3, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    const descLines = doc.splitTextToSize(`${b.description} Action: ${b.suggestedMitigation}`, contentWidth - 6);
    doc.text(descLines.slice(0, 2), margin + 3, y + 8.5);

    y += 16;
  });

  // --------------------------------------------------------------------------
  // Section 4: Regional Labour Market Realities (Visakhapatnam Case Study)
  // --------------------------------------------------------------------------
  ensureSpace(28);
  writeWrappedText(`4. REGIONAL LABOUR MARKET REALITIES: ${city.name.toUpperCase()} (${city.tier})`, margin, 10, 'bold', [15, 23, 42], 4);
  y += 2;

  const seniorCount = config.roles
    .filter((r) => r.seniority.includes('Senior') || r.seniority.includes('Lead'))
    .reduce((sum, r) => sum + (Number(r.headcount) || 0), 0);

  const cityNotes = [
    `Senior Talent Density: The active senior technology workforce (6+ years experience) in ${city.name} is estimated at ${city.estimatedSeniorTechTalentPool}. Sourcing ${seniorCount} senior/lead technical roles represents recruiting from this defined experienced cohort.`,
    `Tier Retention Nuance: Voluntary attrition in ${city.name} is approximately ${city.typicalOfferDropoutRate}% annually, providing higher retention stability than Tier-1 mega-hubs.`,
    `Talent Sourcing Strategy: Sourcing cannot rely solely on lateral poaching from local incumbents without fast cannibalization. TA campaigns must proactively attract experienced professionals originating from the region who are currently working in Tier-1 hubs and wish to relocate home for family and quality of life.`,
  ];

  cityNotes.forEach((note) => {
    ensureSpace(9);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text('•', margin + 2, y + 3);
    doc.setFont('helvetica', 'normal');
    const noteLines = doc.splitTextToSize(note, contentWidth - 8);
    doc.text(noteLines, margin + 6, y + 3);
    y += noteLines.length * 3.5 + 1.5;
  });
  y += 2;

  // --------------------------------------------------------------------------
  // Section 5: Evidence & Uncertainty Audit Trail (Top Sourced Claims)
  // --------------------------------------------------------------------------
  ensureSpace(35);
  writeWrappedText('5. EVIDENCE & UNCERTAINTY AUDIT TRAIL', margin, 10, 'bold', [15, 23, 42], 4);
  y += 2;

  const topEvidence = evidenceList.slice(0, 4);
  topEvidence.forEach((ev) => {
    ensureSpace(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`[${ev.classification.toUpperCase().replace('_', ' ')}]`, margin, y + 3.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const claimLines = doc.splitTextToSize(ev.claim, contentWidth - 40);
    doc.text(claimLines, margin + 35, y + 3.5);
    y += claimLines.length * 3.5 + 1;

    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`Source: ${ev.sourceName} (${ev.publicationDate}) · Limitations: ${ev.limitations}`, margin + 35, y + 2.5, { maxWidth: contentWidth - 36 });
    y += 5.5;
  });

  // --------------------------------------------------------------------------
  // Section 6: Actionable Next Steps (PM Roadmap)
  // --------------------------------------------------------------------------
  ensureSpace(30);
  writeWrappedText('6. RECOMMENDED VALIDATION EXPERIMENTS (NEXT STEPS)', margin, 10, 'bold', [15, 23, 42], 4);
  y += 2;

  const nextSteps = [
    {
      title: '1. Recruiter Sourcing Pilot (14 Days)',
      desc: 'Execute a live outbound sourcing sprint targeting 100 Senior Backend Engineers in Visakhapatnam to verify whether the 35% response/screen rate holds locally.',
    },
    {
      title: '2. Local Compensation Calibration',
      desc: 'Calibrate regional salary benchmarks against Hyderabad/Bengaluru rates to determine the necessary relocation and signing premium.',
    },
    {
      title: '3. RPO Recruitment Partner Engagement',
      desc: `Contract a regional RPO search firm to absorb the ${calc.recruiterDeficit}-recruiter bandwidth shortfall and run daily candidate screen panels.`,
    },
    {
      title: '4. Institutional Campus Feeder Tie-Ups',
      desc: 'Establish direct placement partnerships with Andhra University and GITAM to convert 40-50 entry-level roles into dedicated graduate cohorts.',
    },
  ];

  nextSteps.forEach((st) => {
    ensureSpace(10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(st.title, margin + 2, y + 3);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const stLines = doc.splitTextToSize(st.desc, contentWidth - 6);
    doc.text(stLines, margin + 2, y + 6.5);
    y += stLines.length * 3.5 + 4;
  });

  // --------------------------------------------------------------------------
  // Running Headers & Footers on ALL Pages
  // --------------------------------------------------------------------------
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Top running header
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text('GCC Compass · Location Intelligence & Hiring Stress Test', margin, 8);
    doc.text(`Location: ${city.name} (${city.tier})`, pageWidth - margin, 8, { align: 'right' });
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.2);
    doc.line(margin, 9.5, pageWidth - margin, 9.5);

    // Bottom running footer
    doc.line(margin, pageHeight - 8.5, pageWidth - margin, pageHeight - 8.5);
    doc.text('Confidential · Prepared for GCC Strategy & Workforce Planning Committee', margin, pageHeight - 5);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 5, { align: 'right' });
  }

  // Trigger browser download
  const cleanCity = city.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  doc.save(`gcc-compass-decision-brief-${cleanCity}-${config.totalTargetHires}-hires.pdf`);
}
