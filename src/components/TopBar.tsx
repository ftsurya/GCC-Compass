import React, { useState, useRef, useEffect } from 'react';
import {
  Home,
  Layers,
  FileText,
  BarChart3,
  Sliders,
  BookOpen,
  Compass,
  ArrowRight,
  User,
  ChevronDown,
  RotateCcw,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../types';

export type NavTab =
  | 'intro'
  | 'welcome'
  | 'home'
  | 'overview'
  | 'plan-builder'
  | 'map-intelligence'
  | 'stress-test'
  | 'evidence-library'
  | 'decision-brief';

// Listed for type validation & regression checks
export const WORKSPACE_TABS: NavTab[] = [
  'home',
  'overview',
  'plan-builder',
  'map-intelligence',
  'stress-test',
  'evidence-library',
  'decision-brief',
];

interface TopBarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onExportClick?: () => void;
  currentUser?: UserProfile;
  onOpenAuth?: () => void;
  onResetDefaults?: () => void;
  hasActiveAssessment?: boolean;
  activeScenarioName?: string | null;
  onClearAssessment?: () => void;
  onOpenHowItWorks?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onSelectTab,
  onExportClick,
  currentUser,
  onResetDefaults,
  hasActiveAssessment = false,
  activeScenarioName,
  onOpenHowItWorks,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isPublicIntro = activeTab === 'intro';
  const isPublicWelcome = activeTab === 'welcome';
  const isWorkspace = !isPublicIntro && !isPublicWelcome;

  const scrollToHowItWorks = () => {
    if (onOpenHowItWorks) {
      onOpenHowItWorks();
      return;
    }
    const el = document.getElementById('how-it-works-section') || document.getElementById('intro-methodology-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const userInitials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'GA';

  // ---------------------------------------------------------------------------
  // PUBLIC INTRO PAGE HEADER (Route: /)
  // Shows ONLY: Logo, How It Works, Sign In, Get Started. No internal tabs!
  // ---------------------------------------------------------------------------
  if (isPublicIntro) {
    return (
      <header className="sticky top-0 z-40 bg-[#FAF7EE] border-b-4 border-black">
        {/* Retro top hazard ticker bar */}
        <div className="bg-black text-[#FFE500] font-mono text-[11px] font-bold tracking-widest px-4 py-1 flex items-center justify-between border-b-2 border-black overflow-hidden select-none">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 bg-[#00F0A8]"></span>
              SYSTEM // INDIA GCC INTELLIGENCE MATRIX v2.4
            </span>
            <span className="hidden md:inline text-neutral-400">|</span>
            <span className="hidden md:inline text-neutral-300">6 HUBS VERIFIED · EMPIRICAL DATA ONLY</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-[#FFE500] text-black px-1.5 py-0.2 text-[10px] font-black uppercase">AUDITED</span>
            <span className="hidden sm:inline text-neutral-300 font-mono">STATUS: OPERATIONAL</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-18">
            {/* Logo and Brand Name */}
            <div
              onClick={() => onSelectTab('intro')}
              className="flex items-center gap-3 shrink-0 cursor-pointer select-none group"
              title="GCC Compass"
            >
              <div className="w-10 h-10 border-2 border-black bg-[#FFE500] text-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000] group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] group-hover:shadow-[4px_4px_0px_0px_#000] transition-all">
                <Compass className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-black uppercase font-display">
                    GCC COMPASS
                  </span>
                  <span className="bg-black text-[#00F0A8] font-mono text-[10px] font-bold px-1.5 py-0.5 border border-black uppercase">
                    PRO
                  </span>
                </div>
                <span className="text-[11px] font-bold text-neutral-700 tracking-tight font-mono">
                  LOCATION INTELLIGENCE & FEASIBILITY
                </span>
              </div>
            </div>

            {/* Simple Public Navigation: How It Works, Sign In, Get Started */}
            <div className="flex items-center gap-3">
              <button
                onClick={scrollToHowItWorks}
                className="hidden sm:inline-flex items-center px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-black bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FFE500] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] transition-all"
              >
                How It Works
              </button>

              <button
                onClick={() => onSelectTab('welcome')}
                className="inline-flex items-center px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-black bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FFE500] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] transition-all"
              >
                Sign In
              </button>

              <button
                onClick={() => onSelectTab('welcome')}
                className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-black uppercase tracking-wider bg-[#FFE500] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:bg-[#FFD000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000] transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // ---------------------------------------------------------------------------
  // PUBLIC WELCOME / ACCESS HEADER (Route: /welcome)
  // Shows Logo and clean Back to Intro link. No internal tabs!
  // ---------------------------------------------------------------------------
  if (isPublicWelcome) {
    return (
      <header className="sticky top-0 z-40 bg-[#FAF7EE] border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-18">
            {/* Logo and Brand Name */}
            <div
              onClick={() => onSelectTab('intro')}
              className="flex items-center gap-3 shrink-0 cursor-pointer select-none group"
              title="GCC Compass Home"
            >
              <div className="w-10 h-10 border-2 border-black bg-[#FFE500] text-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
                <Compass className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-black uppercase font-display">
                  GCC COMPASS
                </span>
                <span className="text-[11px] font-bold text-neutral-700 tracking-tight font-mono">
                  LOCATION INTELLIGENCE & FEASIBILITY
                </span>
              </div>
            </div>

            {/* Back to Platform Intro */}
            <button
              onClick={() => onSelectTab('intro')}
              className="px-4 py-2 text-xs font-black uppercase tracking-wider text-black bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:bg-[#FFE500] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] transition-all inline-flex items-center gap-2"
            >
              <span>← Back to Intro</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  // ---------------------------------------------------------------------------
  // INTERNAL WORKSPACE HEADER (Routes: /app/*)
  // Rendered ONLY after user enters workspace. Shows workspace tabs:
  // Home, Overview, Plan Builder, Map Intelligence, Stress Test, Evidence Library, Decision Brief
  // ---------------------------------------------------------------------------
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7EE] border-b-4 border-black">
      {/* Retro system banner strip */}
      <div className="bg-black text-[#FFE500] font-mono text-[11px] font-bold tracking-widest px-4 py-1 flex items-center justify-between border-b-2 border-black overflow-hidden select-none">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 bg-[#00F0A8]"></span>
            WORKSPACE // GCC STRATEGIC DECISION MATRIX
          </span>
          {hasActiveAssessment && (
            <span className="bg-[#00F0A8] text-black px-1.5 py-0.2 text-[10px] font-black uppercase">
              ACTIVE: {activeScenarioName || 'CUSTOM RUN'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-neutral-400 font-mono text-[10px] hidden sm:inline">ENGINE: DETERMINISTIC</span>
          <span className="bg-[#FFE500] text-black px-1.5 py-0.2 text-[10px] font-black uppercase">PRO MODE</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2.5 h-14 sm:h-16">
          {/* Logo & Workspace Title */}
          <div
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2 shrink-0 cursor-pointer select-none group"
            title="GCC Compass Workspace"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 border-2 border-black bg-[#FFE500] text-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] group-hover:shadow-[3px_3px_0px_0px_#000] transition-all">
              <Compass className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-black uppercase font-display leading-none">
                  GCC COMPASS
                </span>
              </div>
              <span className="text-[9px] font-bold text-neutral-600 tracking-wider font-mono uppercase mt-0.5">
                RESEARCH WORKSPACE
              </span>
            </div>
          </div>

          {/* Internal Workspace Navigation Tabs (Compact Retro NeoBrutalist rectangular buttons) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs font-bold">
            <button
              onClick={() => onSelectTab('home')}
              className={`flex items-center gap-1 xl:gap-1.5 px-2 py-1.5 xl:px-2.5 xl:py-1.5 border-2 border-black transition-all select-none uppercase tracking-wide font-mono text-[11px] xl:text-xs whitespace-nowrap ${
                activeTab === 'home'
                  ? 'bg-[#FFE500] text-black shadow-[3px_3px_0px_0px_#000] translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-white text-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FFF9D2] hover:shadow-[3px_3px_0px_0px_#000]'
              }`}
            >
              <Home className="w-3 h-3 xl:w-3.5 xl:h-3.5 stroke-[2.5] shrink-0" />
              <span>Home</span>
            </button>

            <button
              onClick={() => onSelectTab('overview')}
              className={`flex items-center gap-1 xl:gap-1.5 px-2 py-1.5 xl:px-2.5 xl:py-1.5 border-2 border-black transition-all select-none uppercase tracking-wide font-mono text-[11px] xl:text-xs whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-[#FFE500] text-black shadow-[3px_3px_0px_0px_#000] translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-white text-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FFF9D2] hover:shadow-[3px_3px_0px_0px_#000]'
              }`}
            >
              <BarChart3 className="w-3 h-3 xl:w-3.5 xl:h-3.5 stroke-[2.5] shrink-0" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => onSelectTab('plan-builder')}
              className={`flex items-center gap-1 xl:gap-1.5 px-2 py-1.5 xl:px-2.5 xl:py-1.5 border-2 border-black transition-all select-none uppercase tracking-wide font-mono text-[11px] xl:text-xs whitespace-nowrap ${
                activeTab === 'plan-builder'
                  ? 'bg-[#FFE500] text-black shadow-[3px_3px_0px_0px_#000] translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-white text-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FFF9D2] hover:shadow-[3px_3px_0px_0px_#000]'
              }`}
            >
              <Sliders className="w-3 h-3 xl:w-3.5 xl:h-3.5 stroke-[2.5] shrink-0" />
              <span>Plan Builder</span>
            </button>

            <button
              onClick={() => onSelectTab('map-intelligence')}
              className={`flex items-center gap-1 xl:gap-1.5 px-2 py-1.5 xl:px-2.5 xl:py-1.5 border-2 border-black transition-all select-none uppercase tracking-wide font-mono text-[11px] xl:text-xs whitespace-nowrap ${
                activeTab === 'map-intelligence'
                  ? 'bg-[#FFE500] text-black shadow-[3px_3px_0px_0px_#000] translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-white text-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FFF9D2] hover:shadow-[3px_3px_0px_0px_#000]'
              }`}
            >
              <MapPin className="w-3 h-3 xl:w-3.5 xl:h-3.5 stroke-[2.5] shrink-0" />
              <span>Map Intelligence</span>
            </button>

            <button
              onClick={() => onSelectTab('stress-test')}
              className={`flex items-center gap-1 xl:gap-1.5 px-2 py-1.5 xl:px-2.5 xl:py-1.5 border-2 border-black transition-all select-none uppercase tracking-wide font-mono text-[11px] xl:text-xs whitespace-nowrap ${
                activeTab === 'stress-test'
                  ? 'bg-[#FFE500] text-black shadow-[3px_3px_0px_0px_#000] translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-white text-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FFF9D2] hover:shadow-[3px_3px_0px_0px_#000]'
              }`}
            >
              <Layers className="w-3 h-3 xl:w-3.5 xl:h-3.5 stroke-[2.5] shrink-0" />
              <span>Stress Test</span>
            </button>

            <button
              onClick={() => onSelectTab('evidence-library')}
              className={`flex items-center gap-1 xl:gap-1.5 px-2 py-1.5 xl:px-2.5 xl:py-1.5 border-2 border-black transition-all select-none uppercase tracking-wide font-mono text-[11px] xl:text-xs whitespace-nowrap ${
                activeTab === 'evidence-library'
                  ? 'bg-[#FFE500] text-black shadow-[3px_3px_0px_0px_#000] translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-white text-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FFF9D2] hover:shadow-[3px_3px_0px_0px_#000]'
              }`}
            >
              <BookOpen className="w-3 h-3 xl:w-3.5 xl:h-3.5 stroke-[2.5] shrink-0" />
              <span>Evidence</span>
            </button>

            <button
              onClick={() => onSelectTab('decision-brief')}
              className={`flex items-center gap-1 xl:gap-1.5 px-2 py-1.5 xl:px-2.5 xl:py-1.5 border-2 border-black transition-all select-none uppercase tracking-wide font-mono text-[11px] xl:text-xs whitespace-nowrap ${
                activeTab === 'decision-brief'
                  ? 'bg-[#FFE500] text-black shadow-[3px_3px_0px_0px_#000] translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-white text-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FFF9D2] hover:shadow-[3px_3px_0px_0px_#000]'
              }`}
            >
              <FileText className="w-3 h-3 xl:w-3.5 xl:h-3.5 stroke-[2.5] shrink-0" />
              <span>Decision Brief</span>
            </button>
          </nav>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Quick Export CTA */}
            {onExportClick && (
              <button
                onClick={onExportClick}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-black uppercase tracking-wider text-black bg-[#00F0A8] hover:bg-[#00d694] border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] transition-all"
              >
                <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Export Brief</span>
              </button>
            )}

            {/* User Session Pill */}
            {currentUser && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-expanded={isUserMenuOpen}
                  aria-label="User account menu"
                  className="flex items-center gap-2 px-2.5 py-1.5 border-2 border-black bg-white hover:bg-[#FFFDF5] shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] transition-all text-xs"
                >
                  <div className="w-6 h-6 border border-black bg-[#FFE500] text-black flex items-center justify-center font-black text-[10px] shrink-0 font-mono">
                    {userInitials}
                  </div>
                  <div className="hidden sm:flex flex-col text-left min-w-0 max-w-[110px]">
                    <span className="font-bold text-black truncate leading-tight font-mono text-[11px]">
                      {currentUser.name}
                    </span>
                    <span className="text-[9px] text-neutral-600 truncate font-mono">
                      {currentUser.isGuest ? 'GUEST ANALYST' : currentUser.organization}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 stroke-[3] text-black" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border-2 border-black shadow-[6px_6px_0px_0px_#000] py-2 z-50 text-xs animate-fadeIn">
                    <div className="px-4 py-2 border-b-2 border-black bg-[#FFFDF5]">
                      <div className="font-bold text-black truncate font-mono">
                        {currentUser.name}
                      </div>
                      <div className="text-neutral-600 text-[11px] truncate font-mono">
                        {currentUser.email}
                      </div>
                      <div className="text-[10px] font-bold text-black mt-1 uppercase font-mono bg-[#FFE500] px-1 py-0.5 inline-block border border-black">
                        {currentUser.role} · {currentUser.organization}
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onSelectTab('welcome');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#FFF9D2] flex items-center gap-2 font-bold text-black font-mono"
                      >
                        <User className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Change Access / Sign Out</span>
                      </button>

                      {onResetDefaults && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onResetDefaults();
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-[#FFF9D2] flex items-center gap-2 font-bold text-black font-mono border-t border-neutral-200"
                        >
                          <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Reset Model Defaults</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onSelectTab('intro');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#FFF9D2] flex items-center gap-2 font-bold text-black font-mono border-t-2 border-black"
                      >
                        <Compass className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Exit to Platform Intro</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Workspace Navigation Sub-Bar (Shown below lg breakpoint) */}
      <div className="lg:hidden border-t-2 border-black bg-[#FAF7EE] px-3 py-1.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase border-2 border-black shrink-0 whitespace-nowrap transition-all ${
              activeTab === 'home'
                ? 'bg-[#FFE500] text-black shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white text-black hover:bg-[#FFF9D2]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onSelectTab('overview')}
            className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase border-2 border-black shrink-0 whitespace-nowrap transition-all ${
              activeTab === 'overview'
                ? 'bg-[#FFE500] text-black shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white text-black hover:bg-[#FFF9D2]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onSelectTab('plan-builder')}
            className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase border-2 border-black shrink-0 whitespace-nowrap transition-all ${
              activeTab === 'plan-builder'
                ? 'bg-[#FFE500] text-black shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white text-black hover:bg-[#FFF9D2]'
            }`}
          >
            Plan Builder
          </button>
          <button
            onClick={() => onSelectTab('map-intelligence')}
            className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase border-2 border-black shrink-0 whitespace-nowrap transition-all ${
              activeTab === 'map-intelligence'
                ? 'bg-[#FFE500] text-black shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white text-black hover:bg-[#FFF9D2]'
            }`}
          >
            Map Intelligence
          </button>
          <button
            onClick={() => onSelectTab('stress-test')}
            className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase border-2 border-black shrink-0 whitespace-nowrap transition-all ${
              activeTab === 'stress-test'
                ? 'bg-[#FFE500] text-black shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white text-black hover:bg-[#FFF9D2]'
            }`}
          >
            Stress Test
          </button>
          <button
            onClick={() => onSelectTab('evidence-library')}
            className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase border-2 border-black shrink-0 whitespace-nowrap transition-all ${
              activeTab === 'evidence-library'
                ? 'bg-[#FFE500] text-black shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white text-black hover:bg-[#FFF9D2]'
            }`}
          >
            Evidence
          </button>
          <button
            onClick={() => onSelectTab('decision-brief')}
            className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase border-2 border-black shrink-0 whitespace-nowrap transition-all ${
              activeTab === 'decision-brief'
                ? 'bg-[#FFE500] text-black shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white text-black hover:bg-[#FFF9D2]'
            }`}
          >
            Decision Brief
          </button>
        </div>
      </div>
    </header>
  );
};
