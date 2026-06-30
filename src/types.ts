export type WasteCategory = "Organic" | "Inorganic" | "B3" | "Residual";

export interface TrashScreenResult {
  itemName: string;
  category: WasteCategory;
  confidence: number;
  recyclable: boolean;
  disposalMethod: string;
  environmentalImpact: string;
  alternativeSuggestions: string[];
}

export interface ScreenHistoryItem extends TrashScreenResult {
  id: string;
  timestamp: string;
  imageUrl: string; // base64 or object URL of the scanned trash
}
