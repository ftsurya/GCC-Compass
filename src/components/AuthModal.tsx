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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 font-mono animate-fadeIn">
      <div className="bg-[#FFFDF5] border-4 border-black shadow-[10px_10px_0px_0px_#000] max-w-xl w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b-3 border-black flex items-center justify-between bg-[#FFE500]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-black text-[#FFE500] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
              <Compass className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-sm font-black uppercase text-black font-display">
                GCC Compass Session
              </div>
              <div className="text-[11px] text-black font-sans font-medium">
                Workspace access & authentication mode
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white hover:bg-[#FF5A36] hover:text-white text-black border-2 border-black font-black text-sm flex items-center justify-center shadow-[2px_2px_0px_0px_#000] transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Active Status */}
          <div className="p-4 bg-white border-2 border-black flex items-center justify-between shadow-[3px_3px_0px_0px_#000]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-black bg-black text-[#FFE500] flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_0px_#000]">
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>
              <div>
                <div className="text-xs font-black uppercase text-black">
                  {currentUser.name}
                </div>
                <div className="text-[11px] text-neutral-600 font-mono">
                  {currentUser.isGuest ? 'Active Guest Session' : currentUser.email}
                </div>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase text-black bg-[#00F0A8] px-2.5 py-1 border-2 border-black shadow-[1px_1px_0px_0px_#000]">
              Session Active
            </span>
          </div>

          {/* Option 1: Continue as Guest */}
          <div className="border-3 border-black p-5 space-y-3 bg-[#FFFDF5] shadow-[4px_4px_0px_0px_#000]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-black uppercase text-sm text-black">
                <User className="w-4 h-4 stroke-[2.5]" />
                <span>Guest Analyst Mode</span>
              </div>
              <span className="text-[10px] font-black uppercase text-black bg-[#FFE500] px-2 py-0.5 border border-black">
                Operational
              </span>
            </div>
            <p className="text-xs text-neutral-800 leading-relaxed font-sans font-medium">
              Provides full, unrestricted access to all 6 workspace tools, deterministic reverse funnel calculations, scenario presets, evidence library, and executive exports.
            </p>
            <button
              onClick={() => {
                onContinueAsGuest();
                onClose();
              }}
              className="w-full py-2.5 px-4 text-xs font-black uppercase bg-[#FFE500] hover:bg-[#FFD000] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Keep Guest Analyst Session</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>

          {/* Option 2: Enterprise Sign-In (Prototype / Unavailable) */}
          <div className="border-3 border-black p-5 space-y-3 bg-white shadow-[4px_4px_0px_0px_#000]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-black uppercase text-sm text-black">
                <Lock className="w-4 h-4 stroke-[2.5]" />
                <span>Enterprise Sign-In</span>
              </div>
              <span className="text-[10px] font-black uppercase text-black bg-neutral-200 px-2 py-0.5 border border-black">
                Prototype · Unavailable
              </span>
            </div>

            <div className="p-3 bg-[#FAF7EE] border-2 border-black text-xs text-black space-y-1">
              <div className="flex items-center gap-1.5 font-black uppercase text-xs">
                <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Authentication Unavailable in Preview</span>
              </div>
              <p className="text-[11px] leading-relaxed text-neutral-800 font-sans font-medium">
                Corporate Single Sign-On (SAML / Okta) is an enterprise module under active integration. Real authentication is not configured in this preview environment, and simulated logins are disabled.
              </p>
            </div>

            <form onSubmit={handleSignInAttempt} className="space-y-2.5">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="analyst@enterprise-corp.com"
                className="w-full px-3 py-2 text-xs border-2 border-black bg-white text-black focus:outline-none focus:bg-[#FFF9D2] font-mono shadow-[2px_2px_0px_0px_#000]"
              />
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-black uppercase bg-neutral-200 text-neutral-700 hover:bg-neutral-300 border-2 border-black transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Corporate SSO Sign In (Disabled)</span>
              </button>
            </form>

            {showSignInNotice && (
              <div className="p-2.5 bg-[#FF5A36] text-white border-2 border-black text-xs flex items-start gap-1.5 shadow-[2px_2px_0px_0px_#000] font-mono font-bold animate-fadeIn">
                <Info className="w-4 h-4 stroke-[2.5] shrink-0 mt-0.5" />
                <span className="text-[11px]">
                  Real authentication is unavailable in this preview environment. Please continue as Guest Analyst.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FAF7EE] border-t-3 border-black flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-black uppercase text-black bg-white hover:bg-neutral-100 border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
