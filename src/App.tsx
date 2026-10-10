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

function getRouteFromLocation(): AppRoute {
  if (typeof window === 'undefined') return '/';

  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const hash = window.location.hash.replace(/^#\/?/, '/').trim();

  // Prefer hash if explicitly set with an app path, otherwise use pathname
  const candidate = (hash && hash !== '/' ? hash : pathname).toLowerCase();

  if (candidate === '/welcome' || candidate === '/signin' || candidate === '/login' || candidate === '/auth') {
    return '/welcome';
  }
  if (candidate === '/app' || candidate === '/app/home' || candidate === '/home') {
    return '/app';
  }
  if (candidate === '/app/overview' || candidate === '/overview') {
    return '/app/overview';
  }
  if (candidate === '/app/plan-builder' || candidate === '/plan-builder' || candidate === '/builder') {
    return '/app/plan-builder';
  }
  if (
    candidate === '/app/map' ||
    candidate === '/app/map-intelligence' ||
    candidate === '/map' ||
    candidate === '/map-intelligence'
  ) {
    return '/app/map';
  }
  if (candidate === '/app/stress-test' || candidate === '/stress-test') {
    return '/app/stress-test';
  }
  if (
    candidate === '/app/evidence' ||
    candidate === '/app/evidence-library' ||
    candidate === '/evidence' ||
    candidate === '/evidence-library'
  ) {
    return '/app/evidence';
  }
  if (
    candidate === '/app/decision-brief' ||
    candidate === '/decision-brief' ||
    candidate === '/decision' ||
    candidate === '/brief'
  ) {
    return '/app/decision-brief';
  }
  if (candidate === '/' || candidate === '/intro') {
    return '/';
  }

  return '/';
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getRouteFromLocation);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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

  // Programmatic navigation updating URL and state
  const navigateTo = (targetRoute: AppRoute) => {
    setCurrentRoute(targetRoute);
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== targetRoute) {
        window.history.pushState(null, '', targetRoute);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white overflow-x-hidden">
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
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Storage Persistence Error Banner */}
        {storageError && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-800">Storage Notice:</span>
              <span>{storageError}</span>
            </div>
            <button
              onClick={() => setStorageError(null)}
              className="text-amber-700 hover:text-amber-900 font-bold px-2 py-0.5"
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

      {/* Enterprise Product Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">GCC Compass</span>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <span>Location Intelligence & Workforce Feasibility</span>
          </div>

          {/* Context-aware footer links */}
          {isWorkspace ? (
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
              <button
                onClick={() => navigateTo('/app')}
                className="hover:text-slate-900 transition-colors"
              >
                Home
              </button>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <button
                onClick={() => navigateTo('/app/overview')}
                className="hover:text-slate-900 transition-colors"
              >
                Overview
              </button>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <button
                onClick={() => navigateTo('/app/plan-builder')}
                className="hover:text-slate-900 transition-colors"
              >
                Plan Builder
              </button>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <button
                onClick={() => navigateTo('/app/map')}
                className="hover:text-slate-900 transition-colors"
              >
                Map Intelligence
              </button>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <button
                onClick={() => navigateTo('/app/stress-test')}
                className="hover:text-slate-900 transition-colors"
              >
                Stress Test
              </button>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <button
                onClick={() => navigateTo('/app/evidence')}
                className="hover:text-slate-900 transition-colors"
              >
                Evidence Library
              </button>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <button
                onClick={() => navigateTo('/app/decision-brief')}
                className="hover:text-slate-900 transition-colors"
              >
                Decision Brief
              </button>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <button
                onClick={() => navigateTo('/')}
                className="text-slate-400 hover:text-slate-700 transition-colors"
              >
                Exit to Intro
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
              <button
                onClick={() => navigateTo('/')}
                className="hover:text-slate-900 transition-colors"
              >
                Platform Intro
              </button>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <button
                onClick={() => navigateTo('/welcome')}
                className="hover:text-slate-900 transition-colors"
              >
                Workspace Access
              </button>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <button
                onClick={() => navigateTo('/app/plan-builder')}
                className="hover:text-slate-900 transition-colors font-medium text-slate-900"
              >
                Launch Assessment
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>Audit-Grade Deterministic Modeling</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
