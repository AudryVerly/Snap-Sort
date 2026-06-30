import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up body parser with increased limits to accept base64 image data
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Lazy initializer for Gemini Client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please add it to your secrets or .env file.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API endpoint for trash screening
app.post("/api/screen-trash", async (req, res) => {
  try {
    const { image, mimeType } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Missing image data" });
    }

    // Clean base64 string if it contains standard data URI prefix
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const cleanMimeType = mimeType || "image/jpeg";

    const ai = getGeminiClient();

    const imagePart = {
      inlineData: {
        mimeType: cleanMimeType,
        data: base64Data,
      },
    };

    const textPart = {
      text: `Identify the item or items of waste in this image. Screen and classify it into exactly one of the following waste management categories:
- 'Organic': Food scraps, leaves, and biodegradable waste that can be composted into soil nutrients.
- 'Inorganic': Plastics, metals, and glass. Clean materials that can be processed into new circular products.
- 'B3': Batteries, electronics, and chemicals requiring special industrial handling to avoid contamination (Hazardous waste).
- 'Residual': Non-recyclable waste like diapers, used tissues, and heavily contaminated food wrappers.

Make sure to provide exact disposal instructions, environmental impact, recyclability status, and suggestions.`,
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [imagePart, textPart],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            itemName: {
              type: Type.STRING,
              description: "The identified name of the trash item (e.g., 'Plastic Water Bottle').",
            },
            category: {
              type: Type.STRING,
              description: "Must be exactly 'Organic', 'Inorganic', 'B3', or 'Residual'.",
            },
            confidence: {
              type: Type.NUMBER,
              description: "Classification confidence score as a percentage between 0 and 100.",
            },
            recyclable: {
              type: Type.BOOLEAN,
              description: "Whether this item is generally recyclable in local recycling programs.",
            },
            disposalMethod: {
              type: Type.STRING,
              description: "Clear, step-by-step instructions on how to prepare and dispose of this item (e.g. 'Rinse with water, compress, and place in the blue bin').",
            },
            environmentalImpact: {
              type: Type.STRING,
              description: "A short, engaging educational fact explaining the environmental impact of sorting this item correctly (e.g. 'Recycling one plastic bottle saves enough energy to power a lightbulb for 3 hours. It prevents it from persisting in landfills for 450 years').",
            },
            alternativeSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-3 practical eco-friendly alternatives (e.g. 'Use a stainless steel reusable water flask', 'Repurpose the bottle as a planter').",
            },
          },
          required: [
            "itemName",
            "category",
            "confidence",
            "recyclable",
            "disposalMethod",
            "environmentalImpact",
            "alternativeSuggestions",
          ],
        },
      },
    });

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error("Empty response from Gemini AI");
    }

    const data = JSON.parse(textResponse.trim());
    return res.json(data);
  } catch (error: any) {
    console.error("Error in /api/screen-trash:", error);
    return res.status(500).json({
      error: error.message || "Failed to analyze the trash image. Please make sure your GEMINI_API_KEY is configured.",
    });
  }
});

// Configure Vite or Static Assets depending on production / development environment
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
