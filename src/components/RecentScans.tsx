import React from "react";
import { X, Calendar, Trash2, ChevronRight, Leaf } from "lucide-react";
import { ScreenHistoryItem, WasteCategory } from "../types";

interface RecentScansProps {
  isOpen: boolean;
  onClose: () => void;
  history: ScreenHistoryItem[];
  onSelectHistoryItem: (item: ScreenHistoryItem) => void;
  onClearHistory: () => void;
}

export default function RecentScans({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onClearHistory,
}: RecentScansProps) {
  if (!isOpen) return null;

  const categoryBadges: Record<WasteCategory, string> = {
    Organic: "bg-emerald-50 text-emerald-800 border-emerald-200",
    Inorganic: "bg-blue-50 text-blue-800 border-blue-200",
    B3: "bg-rose-50 text-rose-800 border-rose-200",
    Residual: "bg-slate-50 text-slate-800 border-slate-200",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Drawer Panel */}
        <div className="w-screen max-w-md bg-[#f5f4e8] border-l border-[#143d26]/10 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#143d26]/10 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <Leaf className="text-[#143d26]" size={18} />
              <h2 className="font-bold text-lg text-gray-900">Your Screen History</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Leaf size={24} />
                </div>
                <h3 className="font-bold text-gray-700 text-sm">No scans yet</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                  Scan some trash with your live camera or upload an image to build your history!
                </p>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectHistoryItem(item);
                    onClose();
                  }}
                  className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md cursor-pointer flex gap-4 items-center group transition-all hover:-translate-y-0.5"
                >
                  {/* Item Image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm shrink-0 bg-gray-100">
                    <img
                      src={item.imageUrl}
                      alt={item.itemName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-gray-900 truncate group-hover:text-[#143d26] transition-colors">
                      {item.itemName}
                    </h4>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${categoryBadges[item.category]}`}>
                        {item.category}
                      </span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(item.timestamp).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-600 transition-colors shrink-0" />
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {history.length > 0 && (
            <div className="p-6 border-t border-[#143d26]/10 bg-white">
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to clear your scanning history?")) {
                    onClearHistory();
                  }
                }}
                className="w-full py-3 px-4 border border-rose-200 text-rose-700 font-semibold text-sm rounded-xl hover:bg-rose-50 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Clear All History
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
