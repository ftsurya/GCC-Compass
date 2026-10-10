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
  LogOut,
  Shield,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { UserProfile } from '../types';

export type NavTab =
  | 'intro'
  | 'welcome'
  | 'home'
  | 'overview'
  | 'plan-builder'
  | 'stress-test'
  | 'evidence-library'
  | 'decision-brief';

// Listed for type validation & regression checks
export const WORKSPACE_TABS: NavTab[] = [
  'home',
  'overview',
  'plan-builder',
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
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onSelectTab,
  onExportClick,
  currentUser,
  onOpenAuth,
  onResetDefaults,
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
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-16">
            {/* Logo and Brand Name */}
            <div
              onClick={() => onSelectTab('intro')}
              className="flex items-center gap-2.5 shrink-0 cursor-pointer select-none group"
              title="GCC Compass"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
                <Compass className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-slate-900 leading-tight">
                  GCC Compass
                </span>
                <span className="text-[10px] font-medium text-slate-500 tracking-tight">
                  Location Intelligence & Feasibility
                </span>
              </div>
            </div>

            {/* Simple Public Navigation: How It Works, Sign In, Get Started */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={scrollToHowItWorks}
                className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-2 py-1"
              >
                How It Works
              </button>

              <button
                onClick={() => onSelectTab('welcome')}
                className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50"
              >
                Sign In
              </button>

              <button
                onClick={() => onSelectTab('welcome')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
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
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-16">
            {/* Logo and Brand Name */}
            <div
              onClick={() => onSelectTab('intro')}
              className="flex items-center gap-2.5 shrink-0 cursor-pointer select-none group"
              title="GCC Compass Home"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
                <Compass className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-slate-900 leading-tight">
                  GCC Compass
                </span>
                <span className="text-[10px] font-medium text-slate-500 tracking-tight">
                  Location Intelligence & Feasibility
                </span>
              </div>
            </div>

            {/* Back to Platform Intro */}
            <button
              onClick={() => onSelectTab('intro')}
              className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5"
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
  // Rendered ONLY after user enters workspace. Shows 6 workspace tabs:
  // Home, Overview, Plan Builder, Stress Test, Evidence Library, Decision Brief
  // ---------------------------------------------------------------------------
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Logo & Workspace Title */}
          <div
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 shrink-0 cursor-pointer select-none group"
            title="GCC Compass Workspace"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <Compass className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 leading-tight">
                GCC Compass
              </span>
              <span className="text-[10px] font-medium text-slate-500 tracking-tight">
                Workspace
              </span>
            </div>
          </div>

          {/* Internal Workspace Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-4 text-sm font-medium text-slate-600">
            <button
              onClick={() => onSelectTab('home')}
              className={`flex items-center gap-1.5 py-1 whitespace-nowrap shrink-0 transition-colors rounded-sm focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-hidden ${
                activeTab === 'home'
                  ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                  : 'hover:text-slate-900'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-slate-500" />
              <span>Home</span>
            </button>

            <button
              onClick={() => onSelectTab('overview')}
              className={`flex items-center gap-1.5 py-1 whitespace-nowrap shrink-0 transition-colors rounded-sm focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-hidden ${
                activeTab === 'overview'
                  ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                  : 'hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => onSelectTab('plan-builder')}
              className={`flex items-center gap-1.5 py-1 whitespace-nowrap shrink-0 transition-colors rounded-sm focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-hidden ${
                activeTab === 'plan-builder'
                  ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                  : 'hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span>Plan Builder</span>
            </button>

            <button
              onClick={() => onSelectTab('stress-test')}
              className={`flex items-center gap-1.5 py-1 whitespace-nowrap shrink-0 transition-colors rounded-sm focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-hidden ${
                activeTab === 'stress-test'
                  ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                  : 'hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Stress Test</span>
            </button>

            <button
              onClick={() => onSelectTab('evidence-library')}
              className={`flex items-center gap-1.5 py-1 whitespace-nowrap shrink-0 transition-colors rounded-sm focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-hidden ${
                activeTab === 'evidence-library'
                  ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                  : 'hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>Evidence Library</span>
            </button>

            <button
              onClick={() => onSelectTab('decision-brief')}
              className={`flex items-center gap-1.5 py-1 whitespace-nowrap shrink-0 transition-colors rounded-sm focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-hidden ${
                activeTab === 'decision-brief'
                  ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                  : 'hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Decision Brief</span>
            </button>
          </nav>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* User Session Pill */}
            {currentUser && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-expanded={isUserMenuOpen}
                  aria-label="User account menu"
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-colors text-xs text-left"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                    {userInitials}
                  </div>
                  <div className="hidden sm:flex flex-col min-w-0 max-w-[120px]">
                    <span className="font-semibold text-slate-900 truncate leading-tight">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate leading-tight">
                      {currentUser.isGuest ? 'Guest Analyst' : currentUser.organization}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-fadeIn">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="font-semibold text-slate-900 truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-slate-500 text-[11px] truncate">
                        {currentUser.email}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {currentUser.role} · {currentUser.organization}
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onSelectTab('welcome');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 hover:text-slate-900"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Change Access / Sign Out</span>
                      </button>

                      {onResetDefaults && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onResetDefaults();
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 hover:text-slate-900"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                          <span>Reset Model Defaults</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onSelectTab('intro');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 hover:text-slate-900 border-t border-slate-100"
                      >
                        <Compass className="w-3.5 h-3.5 text-slate-400" />
                        <span>Exit to Platform Intro</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Export CTA */}
            {onExportClick && (
              <button
                onClick={onExportClick}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                <span>Export Brief</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Workspace Navigation Sub-Bar (Shown only in workspace) */}
      <div className="lg:hidden border-t border-slate-200 bg-slate-50/90 px-4 py-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors shrink-0 ${
              activeTab === 'home'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onSelectTab('overview')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors shrink-0 ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onSelectTab('plan-builder')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors shrink-0 ${
              activeTab === 'plan-builder'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            Plan Builder
          </button>
          <button
            onClick={() => onSelectTab('stress-test')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors shrink-0 ${
              activeTab === 'stress-test'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            Stress Test
          </button>
          <button
            onClick={() => onSelectTab('evidence-library')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors shrink-0 ${
              activeTab === 'evidence-library'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            Evidence
          </button>
          <button
            onClick={() => onSelectTab('decision-brief')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors shrink-0 ${
              activeTab === 'decision-brief'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            Brief
          </button>
        </div>
      </div>
    </header>
  );
};
