import React, { useState } from 'react';
import {
  Compass,
  X,
  User,
  Shield,
  Building,
  Check,
  ArrowRight,
  Lock,
  Mail,
  AlertCircle,
  Info,
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  onContinueAsGuest: () => void;
}

export const DEMO_PROFILES: UserProfile[] = [];

export const GUEST_USER: UserProfile = {
  id: 'guest-session',
  name: 'Guest Analyst',
  email: 'guest@gcc-compass.internal',
  role: 'Location & Talent Strategist',
  organization: 'Enterprise Guest Session',
  isGuest: true,
};

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
  onContinueAsGuest,
}) => {
  const [showSignInNotice, setShowSignInNotice] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  if (!isOpen) return null;

  const handleSignInAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSignInNotice(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Compass className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                GCC Compass Session
              </div>
              <div className="text-[11px] text-slate-500">
                Workspace access & authentication mode
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Active Status */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  {currentUser.name}
                </div>
                <div className="text-[11px] text-slate-500">
                  {currentUser.isGuest ? 'Active Guest Session' : currentUser.email}
                </div>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Session Active
            </span>
          </div>

          {/* Option 1: Continue as Guest */}
          <div className="border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <User className="w-4 h-4 text-emerald-600" />
                <span>Guest Analyst Mode</span>
              </div>
              <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                Operational
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provides full, unrestricted access to all 6 workspace tools, deterministic reverse funnel calculations, scenario presets, evidence library, and executive exports.
            </p>
            <button
              onClick={() => {
                onContinueAsGuest();
                onClose();
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <span>Keep Guest Analyst Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Option 2: Enterprise Sign-In (Prototype / Unavailable) */}
          <div className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <Lock className="w-4 h-4 text-slate-500" />
                <span>Enterprise Sign-In</span>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Prototype · Unavailable
              </span>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                <span>Authentication Unavailable in Preview</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800">
                Corporate Single Sign-On (SAML / Okta) is an enterprise module under active integration. Real authentication is not configured in this preview environment, and simulated logins are disabled.
              </p>
            </div>

            <form onSubmit={handleSignInAttempt} className="space-y-2.5">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="analyst@enterprise-corp.com"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-hidden"
              />
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-semibold bg-slate-200 text-slate-600 hover:bg-slate-300 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Corporate SSO Sign In (Disabled)</span>
              </button>
            </form>

            {showSignInNotice && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-1.5 animate-fadeIn">
                <Info className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                <span className="text-[11px]">
                  Real authentication is unavailable in this preview environment. Please continue as Guest Analyst.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
