import React from "react";
import { Leaf, RefreshCw, AlertTriangle, Trash2 } from "lucide-react";
import { WasteCategory } from "../types";

interface CategoryData {
  id: WasteCategory;
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  borderColor: string;
}

const categories: CategoryData[] = [
  {
    id: "Organic",
    title: "Organic",
    description: "Food scraps, leaves, and biodegradable waste that can be composted into soil nutrients.",
    icon: <Leaf size={20} className="stroke-[2.5]" />,
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600 bg-emerald-100/60",
    borderColor: "border-emerald-100",
  },
  {
    id: "Inorganic",
    title: "Inorganic",
    description: "Plastics, metals, and glass. Clean materials that can be processed into new circular products.",
    icon: <RefreshCw size={20} className="stroke-[2.5]" />,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600 bg-blue-100/60",
    borderColor: "border-blue-100",
  },
  {
    id: "B3",
    title: "B3",
    description: "Batteries, electronics, and chemicals requiring special industrial handling to avoid contamination.",
    icon: <AlertTriangle size={20} className="stroke-[2.5]" />,
    bgColor: "bg-rose-50",
    iconColor: "text-rose-600 bg-rose-100/60",
    borderColor: "border-rose-100",
  },
  {
    id: "Residual",
    title: "Residual",
    description: "Non-recyclable waste like diapers, used tissues, and heavily contaminated food wrappers.",
    icon: <Trash2 size={20} className="stroke-[2.5]" />,
    bgColor: "bg-slate-100/70",
    iconColor: "text-slate-600 bg-slate-200/60",
    borderColor: "border-slate-200",
  },
];

export default function CategoryCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className={`flex flex-col p-6 rounded-2xl bg-white/90 border ${cat.borderColor} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
        >
          {/* Circular Icon bubble */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${cat.iconColor}`}>
            {cat.icon}
          </div>

          <h3 className="font-sans font-bold text-lg text-gray-900 mb-2">
            {cat.title}
          </h3>
          <p className="font-sans text-sm text-gray-600 leading-relaxed">
            {cat.description}
          </p>
        </div>
      ))}
    </div>
  );
}
