import React from "react";
import { Leaf, Info, HelpCircle, History } from "lucide-react";

interface HeaderProps {
  onShowHowItWorks: () => void;
  onShowImpact: () => void;
  onToggleHistory: () => void;
  historyCount: number;
}

export default function Header({
  onShowHowItWorks,
  onShowImpact,
  onToggleHistory,
  historyCount,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#f5f4e8]/90 backdrop-blur-md border-b border-[#143d26]/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="bg-[#143d26] p-1.5 rounded-lg text-[#f5f4e8]">
            <Leaf size={20} className="stroke-[2.5]" />
          </div>
          <span className="font-sans font-bold text-xl tracking-tight text-[#143d26]">
            SnapAndSort
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-sans text-sm font-medium text-[#143d26] relative py-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#143d26] transition-all"
          >
            Home
          </button>
          <button
            onClick={onShowHowItWorks}
            className="font-sans text-sm font-medium text-gray-600 hover:text-[#143d26] transition-colors"
          >
            How it Works
          </button>
          <button
            onClick={onShowImpact}
            className="font-sans text-sm font-medium text-gray-600 hover:text-[#143d26] transition-colors"
          >
            Environmental Impact
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* History Button with Counter */}
          <button
            onClick={onToggleHistory}
            className="relative p-2 text-gray-700 hover:text-[#143d26] hover:bg-[#143d26]/5 rounded-full transition-colors"
            title="Scan History"
          >
            <History size={20} />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#143d26] text-[#f5f4e8] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#f5f4e8]">
                {historyCount}
              </span>
            )}
          </button>

          {/* Help Button (Mobile) */}
          <button
            onClick={onShowHowItWorks}
            className="md:hidden p-2 text-gray-700 hover:text-[#143d26] hover:bg-[#143d26]/5 rounded-full transition-colors"
          >
            <HelpCircle size={20} />
          </button>

          {/* Sign In button */}
          <button className="px-5 py-2 rounded-full border border-[#143d26] text-[#143d26] font-sans text-sm font-semibold hover:bg-[#143d26] hover:text-[#f5f4e8] transition-all duration-300">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
}
