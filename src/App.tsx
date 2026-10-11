import React, { useState, useEffect, useMemo } from 'react';
import { TopBar, NavTab } from './components/TopBar';
import { IntroView } from './components/IntroView';
import { WelcomeView } from './components/WelcomeView';
import { HomeView } from './components/HomeView';
import { DashboardView } from './components/DashboardView';
import { PlanBuilderView } from './components/PlanBuilderView';
import { StressTestView } from './components/StressTestView';
import { EvidenceLibraryView } from './components/EvidenceLibraryView';
import { DecisionBriefView } from './components/DecisionBriefView';
import { MapIntelligenceView } from './components/MapIntelligenceView';
import { AuthModal, GUEST_USER } from './components/AuthModal';
import { HowItWorksModal } from './components/HowItWorksModal';

import {
  CITIES_DATA,
  DEFAULT_PLAN_CONFIG,
  EVIDENCE_LIBRARY,
  DEMO_SCENARIOS,
} from './data/defaultData';
import { HiringPlanConfig, EvidenceItem, UserProfile } from './types';
import { calculateHiringPlan } from './utils/calculator';

const CONFIG_STORAGE_KEY = 'gcc_compass_plan_config_v1';
const EVIDENCE_STORAGE_KEY = 'gcc_compass_evidence_v1';
const USER_STORAGE_KEY = 'gcc_compass_user_session_v1';
const ASSESSMENT_ACTIVE_KEY = 'gcc_compass_has_assessment_v1';
const ASSESSMENT_NAME_KEY = 'gcc_compass_assessment_name_v1';

export type AppRoute =
  | '/'
  | '/welcome'
  | '/app'
  | '/app/overview'
  | '/app/plan-builder'
  | '/app/map'
  | '/app/map-intelligence'
  | '/app/stress-test'
  | '/app/evidence'
  | '/app/decision-brief';

const routeToTabMap: Record<AppRoute, NavTab> = {
  '/': 'intro',
  '/welcome': 'welcome',
  '/app': 'home',
  '/app/overview': 'overview',
  '/app/plan-builder': 'plan-builder',
  '/app/map': 'map-intelligence',
  '/app/map-intelligence': 'map-intelligence',
  '/app/stress-test': 'stress-test',
  '/app/evidence': 'evidence-library',
  '/app/decision-brief': 'decision-brief',
};

const tabToRouteMap: Record<NavTab, AppRoute> = {
  'intro': '/',
  'welcome': '/welcome',
  'home': '/app',
  'overview': '/app/overview',
  'plan-builder': '/app/plan-builder',
  'map-intelligence': '/app/map',
  'stress-test': '/app/stress-test',
  'evidence-library': '/app/evidence',
  'decision-brief': '/app/decision-brief',
};

export function getAppBasePath(): string {
  if (typeof window === 'undefined') return '';
  const pathname = window.location.pathname;
  // If hosted on GitHub Pages (username.github.io/repo-name)
  const segments = pathname.split('/').filter(Boolean);
  if (window.location.hostname.endsWith('github.io') && segments.length > 0) {
    return '/' + segments[0];
  }
  // Generic fallback if pathname starts with /gcc-compass (case-insensitive)
  if (pathname.toLowerCase().startsWith('/gcc-compass')) {
    return pathname.slice(0, '/gcc-compass'.length);
  }
  return '';
}

function matchRoute(candidate: string): AppRoute {
  const c = candidate.toLowerCase().trim();

  if (c === '/welcome' || c === '/signin' || c === '/login' || c === '/auth') {
    return '/welcome';
  }
  if (c === '/app' || c === '/app/home' || c === '/home') {
    return '/app';
  }
  if (c === '/app/overview' || c === '/overview') {
    return '/app/overview';
  }
  if (c === '/app/plan-builder' || c === '/plan-builder' || c === '/builder') {
    return '/app/plan-builder';
  }
  if (
    c === '/app/map' ||
    c === '/app/map-intelligence' ||
    c === '/map' ||
    c === '/map-intelligence'
  ) {
    return '/app/map';
  }
  if (c === '/app/stress-test' || c === '/stress-test') {
    return '/app/stress-test';
  }
  if (
    c === '/app/evidence' ||
    c === '/app/evidence-library' ||
    c === '/evidence' ||
    c === '/evidence-library'
  ) {
    return '/app/evidence';
  }
  if (
    c === '/app/decision-brief' ||
    c === '/decision-brief' ||
    c === '/decision' ||
    c === '/brief'
  ) {
    return '/app/decision-brief';
  }
  if (c === '/' || c === '/intro' || c === '') {
    return '/';
  }

  return '/';
}

function getRouteFromLocation(): AppRoute {
  if (typeof window === 'undefined') return '/';

  // 1. Check hash first: e.g. #/app/plan-builder or #/welcome
  const rawHash = window.location.hash.replace(/^#\/?/, '/').trim();
  if (rawHash && rawHash !== '/') {
    const cleanHash = rawHash.replace(/\/+$/, '');
    const matched = matchRoute(cleanHash);
    if (matched !== '/') return matched;
  }

  // 2. Check query parameter fallback: e.g. ?p=/app/plan-builder or ?route=/app/plan-builder
  const searchParams = new URLSearchParams(window.location.search);
  const queryParam = searchParams.get('p') || searchParams.get('route');
  if (queryParam) {
    const cleanParam = ('/' + queryParam.replace(/^\/+/, '')).replace(/\/+$/, '');
    const matched = matchRoute(cleanParam);
    if (matched !== '/') return matched;
  }

  // 3. Check pathname: strip GitHub Pages project base path if present
  let pathname = window.location.pathname.replace(/\/index\.html$/, '').replace(/\/+$/, '') || '/';
  const basePath = getAppBasePath();
  if (basePath && pathname.toLowerCase().startsWith(basePath.toLowerCase())) {
    pathname = pathname.slice(basePath.length) || '/';
  }
  if (!pathname.startsWith('/')) {
    pathname = '/' + pathname;
  }

  return matchRoute(pathname);
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getRouteFromLocation);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  // Derived active tab from current route
  const activeTab: NavTab = routeToTabMap[currentRoute] || 'home';
  const isWorkspace = currentRoute.startsWith('/app');

  // Load persisted user or default to Guest Analyst
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(USER_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.name) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Failed to parse stored user profile:', e);
      }
    }
    return GUEST_USER;
  });

  // Assessment Lifecycle: Initial dashboard must not display completed results automatically
  const [hasActiveAssessment, setHasActiveAssessment] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(ASSESSMENT_ACTIVE_KEY);
        if (stored !== null) {
          return stored === 'true';
        }
      } catch (e) {
        console.warn('Failed to parse assessment active flag:', e);
      }
    }
    return false;
  });

  const [activeScenarioName, setActiveScenarioName] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem(ASSESSMENT_NAME_KEY);
      } catch (e) {
        console.warn('Failed to parse stored scenario name:', e);
      }
    }
    return null;
  });

  // Load persisted config or use baseline default
  const [config, setConfig] = useState<HiringPlanConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed.totalTargetHires === 'number') {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Failed to parse stored plan config:', e);
      }
    }
    return DEFAULT_PLAN_CONFIG;
  });

  // Load persisted evidence or use initial default
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(EVIDENCE_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Failed to parse stored evidence library:', e);
      }
    }
    return EVIDENCE_LIBRARY;
  });

  const [storageError, setStorageError] = useState<string | null>(null);

  // Persist user changes
  useEffect(() => {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
    } catch (e) {
      console.warn('Could not persist user session to localStorage:', e);
    }
  }, [currentUser]);

  // Persist assessment lifecycle state
  useEffect(() => {
    try {
      localStorage.setItem(ASSESSMENT_ACTIVE_KEY, String(hasActiveAssessment));
      if (activeScenarioName) {
        localStorage.setItem(ASSESSMENT_NAME_KEY, activeScenarioName);
      } else {
        localStorage.removeItem(ASSESSMENT_NAME_KEY);
      }
    } catch (e) {
      console.warn('Could not persist assessment lifecycle state:', e);
    }
  }, [hasActiveAssessment, activeScenarioName]);

  // Persist config changes
  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('Could not persist plan config to localStorage:', e);
      setStorageError(
        'Local browser storage quota exceeded or disabled. Plan configuration changes will persist only in the current session.'
      );
    }
  }, [config]);

  // Persist evidence changes
  useEffect(() => {
    try {
      localStorage.setItem(EVIDENCE_STORAGE_KEY, JSON.stringify(evidenceList));
    } catch (e) {
      console.warn('Could not persist evidence list to localStorage:', e);
      setStorageError(
        'Local browser storage quota exceeded. Bulk evidence items will persist in this session but could not be saved to offline storage.'
      );
    }
  }, [evidenceList]);

  // Listen for browser forward/back history & hash events
  useEffect(() => {
    const handleLocationChange = () => {
      const route = getRouteFromLocation();
      setCurrentRoute(route);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Programmatic navigation updating URL and state with GitHub Pages subpath preservation
  const navigateTo = (targetRoute: AppRoute) => {
    setCurrentRoute(targetRoute);
    if (typeof window !== 'undefined') {
      const basePath = getAppBasePath();
      const targetUrl =
        targetRoute === '/'
          ? (basePath ? `${basePath}/` : '/')
          : `${basePath ? `${basePath}/` : '/'}#${targetRoute}`;

      const currentUrl = window.location.pathname + window.location.search + window.location.hash;
      if (currentUrl !== targetUrl) {
        window.history.pushState(null, '', targetUrl);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Sync initial URL if loaded via direct pathname or SPA query redirect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initialRoute = getRouteFromLocation();
      if (initialRoute !== '/') {
        const basePath = getAppBasePath();
        const expectedTarget = `${basePath ? `${basePath}/` : '/'}#${initialRoute}`;
        const currentTarget = window.location.pathname + window.location.search + window.location.hash;
        if (currentTarget !== expectedTarget) {
          window.history.replaceState(null, '', expectedTarget);
        }
      }
    }
  }, []);

  // Tab selection handler maintaining backward compatibility
  const handleSelectTab = (tab: NavTab) => {
    const targetRoute = tabToRouteMap[tab] || '/app';
    navigateTo(targetRoute);
  };

  // Explicit Demo Scenario Loader: Loads selected scenario, activates assessment, navigates to overview
  const handleLoadDemoScenario = (scenarioKey: string) => {
    const scenario = DEMO_SCENARIOS.find((s) => s.key === scenarioKey);
    if (scenario) {
      setConfig(scenario.config);
      setHasActiveAssessment(true);
      setActiveScenarioName(scenario.title);
      navigateTo('/app/overview');
    }
  };

  // Explicit Assessment Runner: Activated when user runs calculations in Plan Builder
  const handleRunAssessment = () => {
    setHasActiveAssessment(true);
    setActiveScenarioName('Custom Organization Plan');
    navigateTo('/app/overview');
  };

  // Explicit transfer of explored city from Map Intelligence to Plan Builder without altering assessment state
  const handleTransferCityToBuilder = (cityId: string) => {
    setConfig((prev) => ({
      ...prev,
      cityId,
    }));
    navigateTo('/app/plan-builder');
  };

  // Reset / Clear Assessment: Returns dashboard to clean unassessed initial state
  const handleClearAssessment = () => {
    setHasActiveAssessment(false);
    setActiveScenarioName(null);
    try {
      localStorage.removeItem(ASSESSMENT_ACTIVE_KEY);
      localStorage.removeItem(ASSESSMENT_NAME_KEY);
    } catch (e) {
      console.warn('Could not clear assessment storage:', e);
    }
  };

  // Compute live calculations deterministically with memoization
  const calcResult = useMemo(() => calculateHiringPlan(config), [config]);

  // Current selected city profile memoized on cityId
  const selectedCity = useMemo(
    () => CITIES_DATA.find((c) => c.id === config.cityId) || CITIES_DATA[0],
    [config.cityId]
  );

  const handleResetDefaults = () => {
    setConfig(DEFAULT_PLAN_CONFIG);
    setHasActiveAssessment(false);
    setActiveScenarioName(null);
    try {
      localStorage.removeItem(CONFIG_STORAGE_KEY);
      localStorage.removeItem(ASSESSMENT_ACTIVE_KEY);
      localStorage.removeItem(ASSESSMENT_NAME_KEY);
    } catch (e) {
      console.warn('Could not clear stored config:', e);
    }
  };

  const handleAddEvidence = (item: EvidenceItem) => {
    setEvidenceList([item, ...evidenceList]);
  };

  const handleBulkAddEvidence = (items: EvidenceItem[]) => {
    setEvidenceList([...items, ...evidenceList]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7EE] text-black font-sans selection:bg-black selection:text-[#FFE500] overflow-x-hidden bg-blueprint-grid">
      {/* Top Bar with distinct headers for Public Intro, Welcome Access, and Internal Workspace */}
      <TopBar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onExportClick={() => handleSelectTab('decision-brief')}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onResetDefaults={handleResetDefaults}
        hasActiveAssessment={hasActiveAssessment}
        activeScenarioName={activeScenarioName}
        onClearAssessment={handleClearAssessment}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Storage Persistence Error Banner */}
        {storageError && (
          <div className="mb-6 p-4 bg-[#FFE500] border-2 border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-between text-xs text-black font-mono font-bold animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="bg-black text-[#FFE500] px-1.5 py-0.5 text-[10px] uppercase">STORAGE NOTICE:</span>
              <span>{storageError}</span>
            </div>
            <button
              onClick={() => setStorageError(null)}
              className="text-black hover:bg-black hover:text-white px-2 py-0.5 border border-black font-bold transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        {/* 1. Intro Page (Route: /) */}
        {currentRoute === '/' && (
          <IntroView
            city={selectedCity}
            config={config}
            calc={calcResult}
            currentUser={currentUser}
            onStartAssessment={() => handleSelectTab('plan-builder')}
            onNavigateToOverview={() => handleSelectTab('overview')}
            onNavigateToStressTest={() => handleSelectTab('stress-test')}
            onNavigateToEvidence={() => handleSelectTab('evidence-library')}
            onNavigateToBrief={() => handleSelectTab('decision-brief')}
            onOpenAuth={() => navigateTo('/welcome')}
            onNavigateToWelcome={() => navigateTo('/welcome')}
            onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
          />
        )}

        {/* 2. Welcome / Access Page (Route: /welcome) */}
        {currentRoute === '/welcome' && (
          <WelcomeView
            currentUser={currentUser}
            onContinueAsGuest={() => {
              setCurrentUser(GUEST_USER);
              navigateTo('/app');
            }}
            onNavigateToBuilder={() => {
              setCurrentUser(GUEST_USER);
              navigateTo('/app/plan-builder');
            }}
            onBackToIntro={() => navigateTo('/')}
          />
        )}

        {/* 3. Internal Workspace: Home (Route: /app) */}
        {currentRoute === '/app' && (
          <HomeView
            city={selectedCity}
            config={config}
            calc={calcResult}
            hasActiveAssessment={hasActiveAssessment}
            activeScenarioName={activeScenarioName}
            onStartAssessment={() => handleSelectTab('plan-builder')}
            onNavigateToBuilder={() => handleSelectTab('plan-builder')}
            onNavigateToOverview={() => handleSelectTab('overview')}
            onNavigateToStressTest={() => handleSelectTab('stress-test')}
            onNavigateToEvidence={() => handleSelectTab('evidence-library')}
            onNavigateToBrief={() => handleSelectTab('decision-brief')}
            onNavigateToIntro={() => handleSelectTab('intro')}
            onLoadDemoScenario={handleLoadDemoScenario}
            onClearAssessment={handleClearAssessment}
            onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
          />
        )}

        {/* 4. Internal Workspace: Overview (Route: /app/overview) */}
        {currentRoute === '/app/overview' && (
          <DashboardView
            city={selectedCity}
            config={config}
            calc={calcResult}
            hasActiveAssessment={hasActiveAssessment}
            activeScenarioName={activeScenarioName}
            onNavigateToBuilder={() => handleSelectTab('plan-builder')}
            onNavigateToStressTest={() => handleSelectTab('stress-test')}
            onNavigateToEvidence={() => handleSelectTab('evidence-library')}
            onLoadDemoScenario={handleLoadDemoScenario}
            onClearAssessment={handleClearAssessment}
          />
        )}

        {/* 5. Internal Workspace: Plan Builder (Route: /app/plan-builder) */}
        {currentRoute === '/app/plan-builder' && (
          <PlanBuilderView
            cities={CITIES_DATA}
            config={config}
            calc={calcResult}
            hasActiveAssessment={hasActiveAssessment}
            onChangeConfig={setConfig}
            onNavigateToStressTest={() => handleSelectTab('stress-test')}
            onNavigateToOverview={() => handleSelectTab('overview')}
            onRunAssessment={handleRunAssessment}
            onResetDefaults={handleResetDefaults}
          />
        )}

        {/* Map Intelligence (Route: /app/map or /app/map-intelligence) */}
        {(currentRoute === '/app/map' || currentRoute === '/app/map-intelligence') && (
          <MapIntelligenceView
            cities={CITIES_DATA}
            evidenceList={evidenceList}
            selectedCityId={config.cityId}
            hasActiveAssessment={hasActiveAssessment}
            onTransferCityToBuilder={handleTransferCityToBuilder}
            onNavigateToBuilder={() => handleSelectTab('plan-builder')}
          />
        )}

        {/* 6. Internal Workspace: Multi-Scenario Stress Test (Route: /app/stress-test) */}
        {currentRoute === '/app/stress-test' && (
          <StressTestView
            baselineConfig={config}
            baselineCalc={calcResult}
            city={selectedCity}
          />
        )}

        {/* 7. Internal Workspace: Empirical Evidence Library (Route: /app/evidence) */}
        {currentRoute === '/app/evidence' && (
          <EvidenceLibraryView
            evidenceList={evidenceList}
            onAddEvidence={handleAddEvidence}
            onBulkAddEvidence={handleBulkAddEvidence}
          />
        )}

        {/* 8. Internal Workspace: Board-Ready Decision Brief (Route: /app/decision-brief) */}
        {currentRoute === '/app/decision-brief' && (
          <DecisionBriefView
            city={selectedCity}
            config={config}
            calc={calcResult}
            evidenceList={evidenceList}
          />
        )}
      </main>

      {/* Account Access / Sign In Modal for session details inside workspace */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={(user) => {
          setCurrentUser(user);
          try {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
          } catch (e) {
            console.warn('Could not persist user session:', e);
          }
        }}
        onContinueAsGuest={() => {
          setCurrentUser(GUEST_USER);
          try {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(GUEST_USER));
          } catch (e) {
            console.warn('Could not persist user session:', e);
          }
        }}
      />

      {/* Accessible 7-Step "How GCC Compass Works" Analytical User Guide */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onStartExploring={() => handleSelectTab('plan-builder')}
        onOpenMapIntelligence={() => handleSelectTab('map-intelligence')}
      />

      {/* Enterprise Retro Product Footer */}
      <footer className="border-t-4 border-black bg-white py-6 text-xs text-black print:hidden font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-black bg-[#FFE500] px-2 py-0.5 border border-black uppercase">GCC COMPASS</span>
            <span aria-hidden="true" className="text-black font-bold">
              //
            </span>
            <span className="font-bold">LOCATION INTELLIGENCE & WORKFORCE FEASIBILITY</span>
          </div>

          {/* Context-aware footer links */}
          {isWorkspace ? (
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-black font-bold">
              <button
                onClick={() => navigateTo('/app')}
                className="hover:bg-[#FFE500] px-1 transition-colors underline"
              >
                Home
              </button>
              <span aria-hidden="true" className="text-black">
                ·
              </span>
              <button
                onClick={() => navigateTo('/app/overview')}
                className="hover:bg-[#FFE500] px-1 transition-colors underline"
              >
                Overview
              </button>
              <span aria-hidden="true" className="text-black">
                ·
              </span>
              <button
                onClick={() => navigateTo('/app/plan-builder')}
                className="hover:bg-[#FFE500] px-1 transition-colors underline"
              >
                Plan Builder
              </button>
              <span aria-hidden="true" className="text-black">
                ·
              </span>
              <button
                onClick={() => navigateTo('/app/map')}
                className="hover:bg-[#FFE500] px-1 transition-colors underline"
              >
                Map Intelligence
              </button>
              <span aria-hidden="true" className="text-black">
                ·
              </span>
              <button
                onClick={() => navigateTo('/app/stress-test')}
                className="hover:bg-[#FFE500] px-1 transition-colors underline"
              >
                Stress Test
              </button>
              <span aria-hidden="true" className="text-black">
                ·
              </span>
              <button
                onClick={() => navigateTo('/app/evidence')}
                className="hover:bg-[#FFE500] px-1 transition-colors underline"
              >
                Evidence Library
              </button>
              <span aria-hidden="true" className="text-black">
                ·
              </span>
              <button
                onClick={() => navigateTo('/app/decision-brief')}
                className="hover:bg-[#FFE500] px-1 transition-colors underline"
              >
                Decision Brief
              </button>
              <span aria-hidden="true" className="text-black">
                ·
              </span>
              <button
                onClick={() => navigateTo('/')}
                className="hover:bg-black hover:text-white px-1 transition-colors"
              >
                Exit to Intro
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-black font-bold">
              <button
                onClick={() => navigateTo('/')}
                className="hover:bg-[#FFE500] px-1 transition-colors underline"
              >
                Platform Intro
              </button>
              <span aria-hidden="true" className="text-black">
                ·
              </span>
              <button
                onClick={() => navigateTo('/welcome')}
                className="hover:bg-[#FFE500] px-1 transition-colors underline"
              >
                Workspace Access
              </button>
              <span aria-hidden="true" className="text-black">
                ·
              </span>
              <button
                onClick={() => navigateTo('/app/plan-builder')}
                className="bg-[#FFE500] px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] font-black uppercase text-black"
              >
                Launch Assessment
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-600">
            <span className="bg-black text-[#00F0A8] px-1.5 py-0.5 text-[10px] font-bold">AUDIT-GRADE DETERMINISTIC MODELING</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
