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
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-[#FFE500] border-2 border-black font-mono text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
          <Compass className="w-4 h-4 stroke-[2.5]" />
          <span>WORKSPACE ACCESS // AUTH MATRIX</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-black uppercase font-display">
          Welcome to GCC Compass
        </h1>

        <p className="text-base text-neutral-800 leading-relaxed font-medium">
          Select an access option below to evaluate talent-market constraints, stress-test recruitment funnels, and build board-ready location briefs.
        </p>
      </div>

      {/* Access Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch font-mono">
        {/* Option 1: Continue as Guest (Active & Fully Operational) */}
        <div className="bg-[#FFFDF5] border-4 border-black p-7 sm:p-8 shadow-[8px_8px_0px_0px_#000] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#FFE500] text-black border-b-2 border-l-2 border-black text-xs font-black px-3 py-1 uppercase tracking-wider">
            RECOMMENDED
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 border-2 border-black bg-[#FFE500] text-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
                <User className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-xl font-black text-black uppercase font-display">
                  Continue as Guest
                </h2>
                <span className="text-xs font-black text-black bg-[#00F0A8] px-2 py-0.5 border border-black inline-block mt-0.5 uppercase">
                  INSTANT WORKSPACE ACCESS
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-800 leading-relaxed font-medium">
              Launch directly into the full evaluation workspace as a Guest Analyst. No sign-in or corporate credentials required. All calculation engines and export tools are operational.
            </p>

            <div className="space-y-2.5 pt-3 border-t-2 border-black">
              <div className="text-xs font-black text-black uppercase">
                Included in Guest Session:
              </div>
              <ul className="space-y-2 text-xs text-neutral-800 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-black stroke-[2.5] shrink-0" />
                  <span>Full access to 6 Indian city ecosystem benchmarks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-black stroke-[2.5] shrink-0" />
                  <span>Deterministic reverse recruitment funnel calculator</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-black stroke-[2.5] shrink-0" />
                  <span>Adverse market stress testing & capacity deficit checks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-black stroke-[2.5] shrink-0" />
                  <span>Empirical evidence library & JSON bulk upload</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-black stroke-[2.5] shrink-0" />
                  <span>Executive exports (PDF, Markdown, and JSON)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 space-y-3">
            <button
              onClick={onContinueAsGuest}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 font-black text-xs uppercase tracking-wider bg-[#FFE500] hover:bg-[#FFD000] text-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000] transition-all group"
            >
              <span>Continue as Guest Analyst</span>
              <ArrowRight className="w-4 h-4 stroke-[3] transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onNavigateToBuilder}
              className="w-full text-center text-xs font-bold uppercase text-black hover:underline py-1 transition-colors"
            >
              Directly Launch Plan Builder →
            </button>
          </div>
        </div>

        {/* Option 2: Sign In (Clearly Labeled Prototype / Unavailable) */}
        <div className="bg-white border-4 border-black p-7 sm:p-8 shadow-[8px_8px_0px_0px_#000] flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 border-2 border-black bg-neutral-200 text-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
                <Lock className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-xl font-black text-black uppercase font-display">
                  Sign In
                </h2>
                <span className="text-xs font-black text-black bg-[#FFE500] px-2 py-0.5 border border-black inline-block mt-0.5 uppercase">
                  Prototype · Preview Environment
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-800 leading-relaxed font-medium">
              Corporate Single Sign-On (Okta / Azure AD SAML) and Google Workspace authentication are planned enterprise features. Real authentication is not configured in this preview environment.
            </p>

            {/* Prototype notice banner */}
            <div className="p-4 bg-[#FAF7EE] border-2 border-black shadow-[2px_2px_0px_0px_#000] text-xs text-black space-y-1.5">
              <div className="flex items-center gap-1.5 font-black uppercase text-xs">
                <AlertCircle className="w-4 h-4 stroke-[2.5] shrink-0" />
                <span>Feature Notice (Preview Only)</span>
              </div>
              <p className="leading-relaxed font-medium">
                To prevent simulated or misleading account states, corporate authentication is explicitly marked as unavailable in this demonstration build. Please use <strong>Continue as Guest</strong> to test the complete platform.
              </p>
            </div>

            {/* Prototype Form Input */}
            <form onSubmit={handleSignInAttempt} className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-black uppercase text-neutral-700 mb-1">
                  Corporate Work Email
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="analyst@enterprise-gcc.com"
                  className="w-full px-3.5 py-2.5 text-xs border-2 border-black bg-white text-black focus:outline-none focus:bg-[#FFF9D2] font-mono shadow-[2px_2px_0px_0px_#000]"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 font-black text-xs uppercase bg-neutral-200 text-neutral-700 border-2 border-black hover:bg-neutral-300 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Sign In via SSO (Unavailable in Preview)</span>
              </button>
            </form>

            {showSignInNotice && (
              <div className="p-3 bg-[#FF5A36] text-white border-2 border-black font-mono text-xs font-bold animate-fadeIn flex items-start gap-2 shadow-[2px_2px_0px_0px_#000]">
                <Info className="w-4 h-4 stroke-[2.5] shrink-0 mt-0.5" />
                <div>
                  <strong>AUTHENTICATION DISABLED:</strong> Production SSO identity providers are not active in this preview environment. Please select <strong>Continue as Guest</strong> to proceed.
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t-2 border-black text-center">
            <span className="text-[11px] font-mono text-neutral-600">
              Deterministic calculations run client-side with full confidentiality.
            </span>
          </div>
        </div>
      </div>

      {/* Return to Intro link */}
      <div className="text-center pt-2 font-mono">
        <button
          onClick={onBackToIntro}
          className="text-xs font-black uppercase text-black hover:bg-[#FFE500] px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-colors inline-flex items-center gap-1"
        >
          <span>← Back to Platform Intro</span>
        </button>
      </div>
    </div>
  );
};
