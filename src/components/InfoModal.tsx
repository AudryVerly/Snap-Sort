import React from "react";
import { X, Sparkles, HelpCircle, Leaf, Check, Info } from "lucide-react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "how-it-works" | "impact";
}

export default function InfoModal({ isOpen, onClose, type }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content Card */}
      <div className="relative bg-[#f5f4e8] border border-[#143d26]/10 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden font-sans animate-scaleIn">
        {/* Header */}
        <div className="p-6 bg-white border-b border-[#143d26]/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {type === "how-it-works" ? (
              <>
                <HelpCircle className="text-[#143d26]" size={22} />
                <h2 className="font-bold text-lg text-gray-900">How SnapAndSort Works</h2>
              </>
            ) : (
              <>
                <Leaf className="text-emerald-700" size={22} />
                <h2 className="font-bold text-lg text-gray-900">Environmental Impact</h2>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body content depending on type */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {type === "how-it-works" ? (
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 mb-1">Snap or Upload</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Take a live snapshot of your trash item using your phone/webcam camera or upload a saved photo of any packaging, food scrap, or waste container.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 mb-1">AI Screening analysis</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Our backend routes the image to the Gemini AI model, which reads contours, textures, labeling, and item properties to classify it instantly into the correct stream.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 mb-1">Dispose of Correctly</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Receive custom cleaning preparation instructions (e.g. rinsing caps) and place it in the correct bin (Organic, Inorganic, B3, or Residual) to prevent pollution!
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-emerald-100 flex gap-3 items-start">
                <Sparkles size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-900 leading-relaxed">
                  Our algorithm is trained on international municipal protocols, highlighting alternative reusable options to help reduce overall personal packaging purchases.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="bg-white p-5 rounded-2xl border border-gray-100">
                <span className="text-[10px] uppercase font-bold text-[#143d26] tracking-wider block mb-1">
                  Global Challenge
                </span>
                <h4 className="font-bold text-sm text-gray-900 mb-2">The Crisis of Mis-sorting</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Over <strong>2.1 billion tons</strong> of solid municipal waste are generated yearly. Due to sorting errors, up to <strong>40% of recyclables</strong> are contaminated and end up dumped into municipal landfills or incinerators anyway.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100/60">
                  <h5 className="font-bold text-[#143d26] text-xs mb-1">Methane Control</h5>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Composting food waste avoids landfill pile-ups, directly cutting potent greenhouse gas emissions.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100/60">
                  <h5 className="font-bold text-blue-900 text-xs mb-1">Circular Flow</h5>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Properly cleaning and grouping inorganic containers turns plastic, glass, and metal back into raw industrial feeds.
                  </p>
                </div>
              </div>

              <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100/60 flex gap-3">
                <Info size={16} className="text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-rose-900 text-xs mb-1">Critical B3 Containment</h5>
                  <p className="text-[10px] text-rose-800 leading-relaxed">
                    Keeping hazardous electronics, lead, and chemicals out of common bins prevents heavy metals from leaking into drinking tables and nearby rivers.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#143d26]/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#143d26] text-[#f5f4e8] font-semibold text-xs hover:bg-[#143d26]/90 transition-all active:scale-[0.98]"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
