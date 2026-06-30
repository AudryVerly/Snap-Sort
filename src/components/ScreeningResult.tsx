import React from "react";
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight, Share2, CornerUpLeft, BookOpen, Heart, RefreshCw } from "lucide-react";
import { TrashScreenResult, WasteCategory } from "../types";

interface ScreeningResultProps {
  result: TrashScreenResult;
  imageUrl: string;
  onReset: () => void;
}

export default function ScreeningResult({ result, imageUrl, onReset }: ScreeningResultProps) {
  const { itemName, category, confidence, recyclable, disposalMethod, environmentalImpact, alternativeSuggestions } = result;

  // Determine styling based on the waste category
  const categoryConfigs: Record<
    WasteCategory,
    {
      label: string;
      bgTheme: string;
      bgBadge: string;
      borderTheme: string;
      textTheme: string;
      description: string;
    }
  > = {
    Organic: {
      label: "Organic",
      bgTheme: "bg-emerald-50/50",
      bgBadge: "bg-emerald-100 text-emerald-800 border-emerald-200",
      borderTheme: "border-emerald-200",
      textTheme: "text-emerald-800",
      description: "Biodegradable materials compostable into rich soil.",
    },
    Inorganic: {
      label: "Inorganic",
      bgTheme: "bg-blue-50/50",
      bgBadge: "bg-blue-100 text-blue-800 border-blue-200",
      borderTheme: "border-blue-200",
      textTheme: "text-blue-800",
      description: "Recyclable materials (plastics, glass, metals) for reprocessing.",
    },
    B3: {
      label: "B3 (Hazardous)",
      bgTheme: "bg-rose-50/50",
      bgBadge: "bg-rose-100 text-rose-800 border-rose-200",
      borderTheme: "border-rose-200",
      textTheme: "text-rose-800",
      description: "Hazardous electronic or chemical wastes requiring specialty facilities.",
    },
    Residual: {
      label: "Residual",
      bgTheme: "bg-slate-100/50",
      bgBadge: "bg-slate-200 text-slate-800 border-slate-300",
      borderTheme: "border-slate-300",
      textTheme: "text-slate-800",
      description: "Non-recyclable household waste heading to safe municipal landfills.",
    },
  };

  const config = categoryConfigs[category] || categoryConfigs.Residual;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `SnapAndSort - Screened ${itemName}`,
        text: `I just screened a ${itemName} with SnapAndSort! It goes in the ${category} bin.`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`Item: ${itemName}\nCategory: ${category}\nDisposal: ${disposalMethod}`);
      alert("Disposal instructions copied to clipboard!");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-fadeIn">
      {/* Visual Header / Banner */}
      <div className={`p-6 sm:p-8 border-b ${config.borderTheme} ${config.bgTheme} flex flex-col md:flex-row gap-6 items-center`}>
        {/* Scanned Image Thumb */}
        <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden shadow-md border-4 border-white shrink-0">
          <img
            src={imageUrl}
            alt={itemName}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Core analysis info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${config.bgBadge}`}>
              {config.label} Bin
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
              {confidence}% Confidence
            </span>
            {recyclable ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100/70 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 size={12} /> Recyclable
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100/70 text-rose-800 border border-rose-200 flex items-center gap-1">
                <XCircle size={12} /> Non-Recyclable
              </span>
            )}
          </div>

          <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-gray-900 tracking-tight leading-tight mb-2">
            {itemName}
          </h2>

          <p className="font-sans text-sm text-gray-600">
            {config.description}
          </p>
        </div>
      </div>

      {/* Grid Content */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Step-by-Step Preparation & Disposal */}
        <div className="space-y-3">
          <h3 className="font-sans font-bold text-gray-900 text-base flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <BookOpen size={16} />
            </span>
            Disposal Instructions
          </h3>
          <div className="p-5 rounded-2xl bg-indigo-50/30 border border-indigo-100/50">
            <p className="font-sans text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {disposalMethod}
            </p>
          </div>
        </div>

        {/* Educational Environmental Impact Facts */}
        <div className="space-y-3">
          <h3 className="font-sans font-bold text-gray-900 text-base flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Heart size={16} />
            </span>
            Environmental Footprint Fact
          </h3>
          <div className="p-5 rounded-2xl bg-emerald-50/30 border border-emerald-100/50">
            <p className="font-sans text-sm text-emerald-950 italic leading-relaxed">
              "{environmentalImpact}"
            </p>
          </div>
        </div>

        {/* Alternative Solutions */}
        {alternativeSuggestions && alternativeSuggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-sans font-bold text-gray-900 text-sm tracking-wide uppercase">
              Eco-Friendly Alternatives
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {alternativeSuggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-[#143d26]/10 text-[#143d26] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="font-sans text-xs text-gray-700 leading-relaxed">
                    {suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#143d26] text-[#f5f4e8] font-sans text-sm font-semibold hover:bg-[#143d26]/90 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 shadow-md shadow-[#143d26]/20"
          >
            <RefreshCw size={16} />
            Scan Another Item
          </button>

          <button
            onClick={handleShare}
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-gray-200 text-gray-700 font-sans text-sm font-semibold hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Share2 size={16} />
            Share Instructions
          </button>
        </div>
      </div>
    </div>
  );
}
