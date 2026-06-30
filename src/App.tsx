import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ScannerZone from "./components/ScannerZone";
import ScreeningResult from "./components/ScreeningResult";
import CategoryCards from "./components/CategoryCard";
import RecentScans from "./components/RecentScans";
import InfoModal from "./components/InfoModal";
import Footer from "./components/Footer";
import { TrashScreenResult, ScreenHistoryItem } from "./types";
import { Sparkles, ArrowRight, ShieldCheck, TreePine, Award } from "lucide-react";

export default function App() {
  const [activeResult, setActiveResult] = useState<TrashScreenResult | null>(null);
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<ScreenHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<"how-it-works" | "impact" | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("snap_and_sort_scans");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load screen history", e);
    }
  }, []);

  // Save history to localStorage
  const saveHistory = (updatedHistory: ScreenHistoryItem[]) => {
    setHistory(updatedHistory);
    try {
      localStorage.setItem("snap_and_sort_scans", JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Failed to persist screen history", e);
    }
  };

  const handleScreeningResult = (result: TrashScreenResult, imageUrl: string) => {
    setActiveResult(result);
    setActiveImageUrl(imageUrl);

    // Save item to history
    const newItem: ScreenHistoryItem = {
      ...result,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      imageUrl,
    };

    const updated = [newItem, ...history];
    saveHistory(updated);
  };

  const handleSelectHistoryItem = (item: ScreenHistoryItem) => {
    setActiveResult(item);
    setActiveImageUrl(item.imageUrl);
  };

  const handleClearHistory = () => {
    saveHistory([]);
  };

  const handleReset = () => {
    setActiveResult(null);
    setActiveImageUrl(null);
  };

  return (
    <div className="min-h-screen bg-[#f5f4e8] text-gray-800 flex flex-col font-sans selection:bg-[#143d26]/20 selection:text-[#143d26]">
      {/* 1. Navigation Header */}
      <Header
        onShowHowItWorks={() => setInfoModalType("how-it-works")}
        onShowImpact={() => setInfoModalType("impact")}
        onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        historyCount={history.length}
      />

      {/* 2. Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 md:py-16 space-y-20">
        
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#143d26]/10 text-[#143d26] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={12} />
            AI-Powered Recycling Assistant
          </div>
          <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#143d26] tracking-tight leading-tight">
            Which bin does this actually go in?
          </h1>
          <p className="font-sans text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Upload or scan a photo to instantly identify the correct disposal method and minimize your environmental footprint.
          </p>
        </section>

        {/* Core Interactive Workspace (Scanner Zone or Results View) */}
        <section className="space-y-6">
          {!activeResult ? (
            <ScannerZone
              onResult={handleScreeningResult}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
          ) : (
            <ScreeningResult
              result={activeResult}
              imageUrl={activeImageUrl || ""}
              onReset={handleReset}
            />
          )}
        </section>

        {/* 3. Category Guidelines (The 4 columns matching the mockup) */}
        <section className="space-y-4">
          <div className="text-center max-w-xl mx-auto mb-2">
            <h2 className="font-sans font-extrabold text-2xl text-gray-900 tracking-tight">
              Classification Streams
            </h2>
            <p className="font-sans text-xs text-gray-500 mt-1">
              We separate materials into four primary streams according to international sustainable waste recycling standards.
            </p>
          </div>
          <CategoryCards />
        </section>

        {/* 4. Smarter Sorting Promo Section (Black rounded card from mockup) */}
        <section className="w-full">
          <div className="w-full bg-[#0c0f0a] rounded-3xl p-8 md:p-16 flex flex-col items-center justify-between gap-10 border border-white/5 relative overflow-hidden shadow-2xl">
            {/* Subtle light reflections */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="text-center max-w-2xl space-y-4 relative z-10">
              <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight">
                Smarter Sorting for a Greener Planet
              </h2>
              <p className="font-sans text-sm text-gray-400 leading-relaxed max-w-lg mx-auto">
                Join thousands of households using our vision AI to simplify their daily recycling routine.
              </p>
              <button
                onClick={() => setInfoModalType("impact")}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider group pt-2"
              >
                Explore our impact
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Simulated Modern Stainless Bin Mockup Image */}
            <div className="relative w-full max-w-2xl aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=1200"
                alt="Sleek modern waste segregation bins"
                className="w-full h-full object-cover select-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f0a]/80 via-[#0c0f0a]/10 to-transparent flex items-end p-6">
                <div className="flex flex-wrap gap-4 text-[10px] font-medium text-white/80 bg-[#0c0f0a]/50 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 w-full justify-around text-center">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span>Non-toxic Containment</span>
                  </div>
                  <div className="flex items-center gap-1.5 border-l border-white/10 pl-4">
                    <TreePine size={14} className="text-emerald-400" />
                    <span>Circular Composting</span>
                  </div>
                  <div className="flex items-center gap-1.5 border-l border-white/10 pl-4">
                    <Award size={14} className="text-emerald-400" />
                    <span>Eco-certified Protocol</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 5. Footer */}
      <Footer
        onShowHowItWorks={() => setInfoModalType("how-it-works")}
        onShowImpact={() => setInfoModalType("impact")}
      />

      {/* 6. Sidebar Scanning History list Drawer */}
      <RecentScans
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
      />

      {/* 7. Information Popup Modal */}
      <InfoModal
        isOpen={infoModalType !== null}
        onClose={() => setInfoModalType(null)}
        type={infoModalType || "how-it-works"}
      />
    </div>
  );
}
