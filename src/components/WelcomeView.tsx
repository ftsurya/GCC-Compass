import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  Shield,
  Lock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sliders,
  FileText,
  User,
  Info,
} from 'lucide-react';
import { UserProfile } from '../types';

interface WelcomeViewProps {
  onContinueAsGuest: () => void;
  onNavigateToBuilder: () => void;
  onBackToIntro: () => void;
  currentUser?: UserProfile;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  onContinueAsGuest,
  onNavigateToBuilder,
  onBackToIntro,
  currentUser,
}) => {
  const [showSignInNotice, setShowSignInNotice] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const handleSignInAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSignInNotice(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 space-y-10 animate-fadeIn">
      {/* Welcome Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-semibold text-slate-800">
          <Compass className="w-3.5 h-3.5 text-emerald-600" />
          <span>GCC Compass · Workspace Access</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          Welcome to GCC Compass
        </h1>

        <p className="text-base text-slate-600 leading-relaxed">
          Select an access option below to evaluate talent-market constraints, stress-test recruitment funnels, and build board-ready location briefs.
        </p>
      </div>

      {/* Access Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Option 1: Continue as Guest (Active & Fully Operational) */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-7 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg tracking-wider uppercase">
            Recommended
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <User className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Continue as Guest
                </h2>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Instant Workspace Access
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Launch directly into the full evaluation workspace as a Guest Analyst. No sign-in or corporate credentials required. All calculation engines and export tools are operational.
            </p>

            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <div className="text-xs font-semibold text-slate-700">
                Included in Guest Session:
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Full access to 4 Indian city ecosystem benchmarks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Deterministic reverse recruitment funnel calculator</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Adverse market stress testing & capacity deficit checks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Empirical evidence library & JSON bulk upload</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Executive exports (PDF, Markdown, and JSON)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 space-y-3">
            <button
              onClick={onContinueAsGuest}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm group"
            >
              <span>Continue as Guest Analyst</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onNavigateToBuilder}
              className="w-full text-center text-xs font-medium text-slate-600 hover:text-slate-900 py-1 transition-colors"
            >
              Directly Launch Plan Builder →
            </button>
          </div>
        </div>

        {/* Option 2: Sign In (Clearly Labeled Prototype / Unavailable) */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-7 sm:p-8 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center">
                <Lock className="w-6 h-6 text-slate-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Sign In
                </h2>
                <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Prototype · Preview Environment
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Corporate Single Sign-On (Okta / Azure AD SAML) and Google Workspace authentication are planned enterprise features. Real authentication is not configured in this preview environment.
            </p>

            {/* Prototype notice banner */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Feature Notice (Preview Only)</span>
              </div>
              <p className="leading-relaxed text-amber-800">
                To prevent simulated or misleading account states, corporate authentication is explicitly marked as unavailable in this demonstration build. Please use <strong>Continue as Guest</strong> to test the complete platform.
              </p>
            </div>

            {/* Prototype Form Input */}
            <form onSubmit={handleSignInAttempt} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Corporate Work Email
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="analyst@enterprise-gcc.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In via SSO (Unavailable in Preview)</span>
              </button>
            </form>

            {showSignInNotice && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 animate-fadeIn flex items-start gap-2">
                <Info className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Authentication Disabled:</strong> Production SSO identity providers are not active in this preview environment. Please select <strong>Continue as Guest</strong> to proceed.
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-200/80 text-center">
            <span className="text-[11px] text-slate-500">
              Deterministic calculations run client-side with full confidentiality.
            </span>
          </div>
        </div>
      </div>

      {/* Return to Intro link */}
      <div className="text-center pt-4">
        <button
          onClick={onBackToIntro}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-1"
        >
          <span>← Back to Platform Intro</span>
        </button>
      </div>
    </div>
  );
};
