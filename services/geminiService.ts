import { GoogleGenAI, Type } from "@google/genai";
import { Trail } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const findTrailsAlongRoute = async (start: string, destination: string): Promise<Trail[]> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `I am planning a road trip from ${start} to ${destination}. 
    Identify 4 distinct, real hiking or mountain biking trails located geographically between these two points (along the general route). 
    Provide coordinates that are somewhat accurate to the real location.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              location: { type: Type.STRING, description: "City or Park name" },
              difficulty: { type: Type.STRING, enum: ["Easy", "Moderate", "Hard", "Extreme"] },
              rating: { type: Type.NUMBER },
              distance: { type: Type.STRING },
              duration: { type: Type.STRING },
              description: { type: Type.STRING },
              coordinates: {
                type: Type.OBJECT,
                properties: {
                  lat: { type: Type.NUMBER },
                  lng: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Trail[];
    }
    return [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Return dummy data in case of error/no key for preview purposes
    return [
      {
        id: "1",
        name: "Lost Coast Trail",
        location: "King Range Wilderness",
        difficulty: "Hard",
        rating: 4.8,
        distance: "24.6 mi",
        duration: "3 days",
        description: "A rugged coastal trail featuring black sand beaches and tide pools.",
        coordinates: { lat: 40.1, lng: -124.1 }
      },
      {
        id: "2",
        name: "Emerald Bay Loop",
        location: "Lake Tahoe",
        difficulty: "Moderate",
        rating: 4.9,
        distance: "4.5 mi",
        duration: "2h 15m",
        description: "Stunning views of the bay with moderately steep switchbacks.",
        coordinates: { lat: 38.9, lng: -120.1 }
      }
    ];
  }
};
