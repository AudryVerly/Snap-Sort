import React from "react";
import { Leaf } from "lucide-react";

interface FooterProps {
  onShowHowItWorks: () => void;
  onShowImpact: () => void;
}

export default function Footer({ onShowHowItWorks, onShowImpact }: FooterProps) {
  return (
    <footer className="bg-[#efeee0] border-t border-[#143d26]/10 pt-16 pb-12 px-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-[#143d26] p-1.5 rounded-lg text-[#f5f4e8]">
                <Leaf size={18} className="stroke-[2.5]" />
              </div>
              <span className="font-bold text-lg text-[#143d26] tracking-tight">
                SnapAndSort
              </span>
            </div>
            <p className="text-sm text-gray-600 max-w-sm leading-relaxed">
              Revolutionizing waste management with accessible AI technology for everyone. Learn to sort, reduce contamination, and foster a healthy planet.
            </p>
          </div>

          {/* Resources Links Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-sm text-[#143d26] tracking-wider uppercase">
              Resources
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <button onClick={onShowHowItWorks} className="hover:text-[#143d26] transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={onShowImpact} className="hover:text-[#143d26] transition-colors">
                  Case Studies
                </button>
              </li>
              <li>
                <span className="text-gray-400 cursor-not-allowed">API Access</span>
              </li>
            </ul>
          </div>

          {/* Company Links Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-sm text-[#143d26] tracking-wider uppercase">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <button onClick={onShowHowItWorks} className="hover:text-[#143d26] transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={onShowImpact} className="hover:text-[#143d26] transition-colors">
                  Environmental Mission
                </button>
              </li>
              <li>
                <a href="mailto:contact@snapandsort.org" className="hover:text-[#143d26] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#143d26]/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 SnapAndSort. All rights reserved.</p>
          <div className="flex gap-6">
            <button className="hover:text-[#143d26] transition-colors">Privacy Policy</button>
            <button className="hover:text-[#143d26] transition-colors">Terms of Service</button>
            <button className="hover:text-[#143d26] transition-colors">Cookie Settings</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
