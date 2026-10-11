# GCC Compass: Location Intelligence & Hiring Plan Stress Tester

[![Tests: 111 Passed](https://img.shields.io/badge/Tests-111%20Passed-00F0A8?style=for-the-badge&logo=vitest&logoColor=black)](src/tests/regression.test.ts)
[![TypeScript: Strict](https://img.shields.io/badge/TypeScript-Strict%20%7C%200%20Errors-FFE500?style=for-the-badge&logo=typescript&logoColor=black)](tsconfig.json)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](package.json)
[![Vite: 8.3](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](vite.config.ts)
[![Theme: NeoBrutalist](https://img.shields.io/badge/Theme-NeoBrutalism-black?style=for-the-badge)](src/index.css)

> **Evidence-backed strategic decision platform for global enterprises establishing or expanding Global Capability Centres (GCCs) in India.**
> Replaces intuitive consultancy decks with deterministic backward-induction hiring funnels, audited city-level location intelligence across 6 hubs, and transparent source provenance.

**GitHub Repository:** [https://github.com/ftsurya/GCC-Compass](https://github.com/ftsurya/GCC-Compass)
**Target Branch:** `main`
**Deployment Status:** Prototype runs locally (`http://localhost:3000`). No public cloud hosting is configured.

---

## 1. Executive Summary & Problem Statement

Setting up a Global Capability Centre (GCC) in India represents a multi-million-dollar capital commitment. Despite substantial investments, over **40% of offshore technology centre expansion plans fail to meet scheduled launch milestones**. This chronic underperformance stems from three critical enterprise blind spots:

1. **The 90-Day Notice Period Paradox:**
   In India's mature tech ecosystem, notice periods for software engineers typically span 60 to 90 days. A linear hiring model assuming 300 joiners across 6 months is mathematically impossible: offers must be fully accepted by Month 3 or 4 to account for notice period lags. Without modeling this constraint, enterprises face catastrophic hiring cliff shortages on launch day.
2. **Recruiter Capacity Under-Allocation:**
   Sourcing a 300-headcount technical workforce requires screening over 32,000 candidates and conducting nearly 2,900 technical interviews. Traditional plans allocate 4–5 internal recruiters (handling ~175 interviews) against a true 715/month interview demand, causing top-of-funnel collapse.
3. **Conflated Location Data & Facility Hallucinations:**
   Standard consultancy decks routinely conflate third-party IT services delivery centers (e.g., Infosys, TCS, Cognizant) with genuine multinational captive R&D centers. Furthermore, physical desk seating capacities are frequently cited as live employee headcounts, and commercial lease benchmarks are cited without transparent observation dates.

**GCC Compass** solves these challenges by providing an auditable, deterministic application where strategic leaders can evaluate locations, model recruitment funnels with backward induction, stress-test attrition and reneging scenarios, and export executive decision briefs.

---

## 2. Intended Users & Primary Use Cases

| Persona | Role & Mandate | Primary Pain Point Solved |
| :--- | :--- | :--- |
| **Global Head of GCC / VP Corporate Strategy** | Evaluates Tier-1 vs Tier-2 hub trade-offs, talent depth, and operational economics. | Replaces $50k+ static PDF reports with real-time comparative models across lease costs, state policies, and captive presence. |
| **VP of Talent Acquisition / Head of HR** | Responsible for hiring delivery, recruiter allocation, and interview velocity. | Quantifies exact sourcing pool requirements and alerts leadership to recruiter capacity deficits and notice period cutoff dates. |
| **Global CFO & Investment Committee** | Approves capex budgets, long-term commercial leases, and RPO staffing commitments. | Validates hiring feasibility through Monte Carlo and sensitivity stress tests before authorizing multi-year lease agreements. |

---

## 3. Core Capabilities & User Workflows

GCC Compass guides leadership through a 4-stage operational workflow:

```
[ 1. Map Intelligence ] ──> [ 2. Plan Builder ] ──> [ 3. Stress Testing ] ──> [ 4. Executive Brief ]
   Explore 6 Hubs,              Backward-Induction        Simulate Reneging,         Export Audit Brief
   Grade-A Lease Costs,         Funnel & Recruiter        Notice Period Lags,        (PDF, Markdown,
   Captive Taxonomy             Capacity Calculation      Capacity Deficits          JSON, Clipboard)
```

### 1. Map Intelligence View (`/app/map-intelligence`)
- **Interactive Multi-Hub Atlas:** Covers 6 audited Indian technology hubs: **Bengaluru, Hyderabad, Pune, Visakhapatnam, Coimbatore, and Bhubaneswar**.
- **Grade-A Lease Benchmarks:** Displays verified commercial real estate cost ranges (e.g., ₹120–175/sq ft in Bengaluru vs ₹38–52/sq ft in Visakhapatnam), strictly cited from H1 2024 JLL and Colliers market reports.
- **State Policy Frameworks:** Details official state incentives (Karnataka IT Policy, Telangana ICT Policy 2021-26, Maharashtra IT/ITeS Policy 2023, AP IT Policy 4.0, Tamil Nadu IT Policy, Odisha IT Policy 2022).
- **Strict Geographic Isolation:** Zero cross-city pollution; marker exploration does not mutate the active workspace without explicit transfer.

### 2. Reactive Plan Builder (`/app/plan-builder`)
- **Backward-Induction Funnel Math:** Given a target joiner count, the engine calculates required volumes backward through each funnel stage:
  $$\text{Accepted Offers} = \lceil \text{Target Hires} / \text{Join Rate} \rceil$$
  $$\text{Offers Extended} = \lceil \text{Accepted Offers} / \text{Offer Acceptance Rate} \rceil$$
  $$\text{Interviews Conducted} = \lceil \text{Offers Extended} / \text{Interview-to-Offer Rate} \rceil$$
  $$\text{Qualified Screens} = \lceil \text{Interviews} / \text{Screen-to-Interview Rate} \rceil$$
  $$\text{Sourced Resumes} = \lceil \text{Qualified Screens} / \text{Sourced-to-Screen Rate} \rceil$$
- **Notice-Period Cutoff Detection:** Subtracts candidate notice lag (e.g., 60–90 days) from total project runway to establish the hard cutoff month after which no further offers can produce timely joiners.
- **Recruiter Capacity Deficit Detection:** Calculates monthly interview demand against in-house talent acquisition bandwidth (assuming 35 interviews/recruiter/month) and flags recruiter deficit or recommended RPO partner engagement.

### 3. Hiring Plan Stress Tester (`/app/stress-test`)
- **Sensitivity Controls:** Real-time toggles for candidate reneging spikes (up to 40%), offer acceptance drops, and notice period extensions.
- **Infeasibility Guardrails:** Mathematical alerts when runway $\le$ notice lag (e.g., 2-month deadline with 60-day notice) or when recruiter strain exceeds operational thresholds.
- **Side-by-Side Scenario Delta:** Compares baseline targets against stressed parameters, showing required delta in applicant volume, interview hours, and recruiter headcount.

### 4. Executive Decision Brief (`/app/decision-brief`)
- **Board-Ready Deliverable:** Aggregates location economics, deterministic funnel milestones, recruiter requirements, and risk factors into a formatted briefing.
- **Multi-Format Export Engine:**
  - 📄 **Direct Markdown (`.md`) Download:** Clean, portable document for internal wikis.
  - 📊 **Audit-Grade JSON (`.json`):** Full serialized parameter configuration and funnel calculations.
  - 📑 **Native PDF (`.pdf`):** Styled report generated client-side via jsPDF.
  - 📋 **System Clipboard:** Plain-text copy for email and Slack dissemination.

---

## 4. Audited Hubs & Epistemic Data Taxonomy

### Supported Cities
1. **Bengaluru** (Tier-1): 1,500,000+ tech workforce; Grade-A ₹120–175/sq ft/mo; 8 verified entities.
2. **Hyderabad** (Tier-1): 900,000+ tech workforce; Grade-A ₹70–95/sq ft/mo; 6 verified entities.
3. **Pune** (Tier-1): 550,000+ tech workforce; Grade-A ₹68–95/sq ft/mo; 5 verified entities.
4. **Visakhapatnam** (Tier-2): 35,000+ tech workforce; Grade-A ₹38–52/sq ft/mo; 4 cataloged entities.
5. **Coimbatore** (Tier-2): 50,000+ tech workforce; Grade-A ₹38–55/sq ft/mo; 4 cataloged entities.
6. **Bhubaneswar** (Tier-2): 35,000+ tech workforce; Grade-A ₹40–58/sq ft/mo; 4 cataloged entities.

### Strict Entity Classification
To prevent talent-pool inflation and false market sizing, all 28 cataloged entities are explicitly categorized:

- **Verified Captive / Global Capability Centre (17 entities):**
  *Examples:* Goldman Sachs, Google, Microsoft, Wells Fargo (Bengaluru); Qualcomm, Micron, Novartis (Hyderabad); Barclays, Deutsche Bank, Nvidia, BNY Mellon (Pune); WNS Vuram (Coimbatore).
- **IT Services or Consulting Company (8 entities):**
  *Examples:* TCS, Infosys, Wipro, Cognizant, PwC, Deloitte. These represent outsourced vendor capacity, not captive product engineering.
- **Software / Product Company (2 entities):**
  *Examples:* Kovai.co (Coimbatore enterprise B2B SaaS); Novac Technology Solutions.
- **Confirmed Facility / GCC Status Unverified (1 entity):**
  *Example:* Bosch Global Software Coimbatore (regional liaison development facility).

### Seating Capacity vs Employee Headcount
In Tier-2 markets, media announcements frequently report physical desk counts of real estate campuses rather than current staff. GCC Compass strictly isolates these:
- **Infosys Visakhapatnam Campus:** Categorized as `facility_seating_capacity` (~1,000 seats announced) with explicit epistemic limitations, preventing it from being counted as active workforce.

### Anti-Hallucination Conventions
Where corporate disclosures do not provide verified city-level headcounts (e.g., Nvidia Pune or Alliant Mobile Vizag), the platform labels them:
- `"Data unavailable"` or `"requires_verification"`
- Never generates synthetic figures to fill charts.

---

## 5. Five Pre-Configured Enterprise Scenarios

The platform includes 5 production demo scenarios that calculate deterministically:

1. **Bengaluru Tech Campus (Baseline):** 300 hires, 6-month deadline, 60-day notice $\rightarrow$ **32,688 applicant pool**, 16 TA member deficit.
2. **Hyderabad Rapid Expansion:** 350 hires, 9-month deadline, 60-day notice $\rightarrow$ **38,172 applicant pool**, 8 TA member deficit.
3. **Visakhapatnam Coastal Center:** 250 hires, 12-month deadline, 60-day notice $\rightarrow$ **36,688 applicant pool**, 3 TA member deficit.
4. **Coimbatore Product Engineering:** 200 hires, 6-month deadline, 60-day notice $\rightarrow$ **50,944 applicant pool**, 21 TA member deficit (high bar).
5. **Enterprise RPO-Mitigated Scale:** 400 hires, 8-month deadline, 60-day notice with 1.5x RPO multiplier $\rightarrow$ **40,860 applicant pool**, 5 TA member deficit.

---

## 6. Installation & Local Development Guide

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher (or `bun`)
- **Python (Optional for slides):** v3.10+ with `python-pptx`, `pymupdf`, `pywin32`

### Setup Instructions

```bash
# 1. Clone repository
git clone https://github.com/ftsurya/GCC-Compass.git
cd GCC-Compass

# 2. Install dependencies
# Note: Use --legacy-peer-deps due to peer resolution between Vite 8 and esbuild
npm install --legacy-peer-deps

# 3. Start local development server
npm run dev
# The application will launch at http://localhost:3000
```

### Verification & Testing Commands

```bash
# Run automated regression and calculator test suites (111 tests)
npm test

# Run TypeScript static type check and lint
npm run lint

# Build production bundle
npm run build
```

---

## 7. Verification & Quality Results

| Verification Check | Command | Result | Details |
| :--- | :--- | :--- | :--- |
| **Automated Tests** | `npm test` | **PASS (111 / 111)** | Backward-induction math, notice period lag, demo scenarios, schema validation, city isolation. |
| **Static Type Safety** | `npm run lint` | **PASS (0 Errors)** | `tsc --noEmit` validates all types and strict entity classifications. |
| **Production Build** | `npm run build` | **PASS (Exit 0)** | Built in 1.21s with Vite 8.3 + React 19. All assets cleanly bundled in `dist/`. |
| **Browser Smoke Test** | `http://localhost:3000` | **PASS** | Validated across all 16 user workflows, interactive funnel sliders, and report exports. |

---

## 8. Known Data Boundaries & Epistemic Limitations

1. **Commercial Real Estate Benchmarks:** Office lease rates reflect H1 2024 JLL and Colliers benchmarks. Real-time updates for H2 2024 and 2025 require dynamic indexing.
2. **Private Captive Headcount Disclosures:** Exact local headcount for multinational GCCs (e.g., Nvidia Pune, State Street) is undisclosed by parent corporations; preserved as `"Data unavailable"`.
3. **Deployment Scope:** Currently runs locally. No public URL has been deployed to avoid external hosting dependencies.

---

## 9. Internship Assignment Deliverables

Located in the [`presentation/`](presentation/) directory:

- 📊 **PowerPoint Slide Deck (`.pptx`):**
  [`presentation/GCC_Compass_Product_Presentation.pptx`](presentation/GCC_Compass_Product_Presentation.pptx)
  *10-slide editable widescreen (16:9) presentation with NeoBrutalist styling, genuine application screenshots, competitive matrices, and test verification.*
- 📑 **PDF Presentation Deck (`.pdf`):**
  [`presentation/GCC_Compass_Product_Presentation.pdf`](presentation/GCC_Compass_Product_Presentation.pdf)
  *10-page high-resolution PDF exported directly via PowerPoint COM automation.*
- 🛠️ **Slide Generator Script:**
  [`presentation/generate_presentation.py`](presentation/generate_presentation.py)
- 🖼️ **Slide Previews & Application Assets:**
  [`presentation/assets/`](presentation/assets/)

---

## 10. Repository & License

- **GitHub Repository:** [https://github.com/ftsurya/GCC-Compass](https://github.com/ftsurya/GCC-Compass)
- **Branch:** `main`
- **License:** MIT License (or Academic / Evaluation use)
