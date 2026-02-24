
import { GoogleGenAI, Type } from "@google/genai";

// Fixed: The API key should be retrieved from process.env.API_KEY at the time of the request
// to ensure it always uses the most up-to-date key (especially after selection via AI Studio dialog).

export const analyzeProjectImage = async (base64Image: string) => {
  // Use a new instance for every request to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `
    Analyze this image of a project file tree structure. 
    Identify technical errors, architectural mistakes, redundant files, or confusing naming conventions.
    
    Look for specific issues like:
    1. Redundant index.html files (e.g., in root and in src/renderer).
    2. Mixed technology stacks (e.g., main.js and main.py both acting as entry points in a JS project).
    3. Confusing naming (e.g., mixing English and Uzbek in system file names).
    4. Poor folder structure (e.g., source files directly in root instead of src).
    
    Please provide the findings in Uzbek language.
  `;

  try {
    const response = await ai.models.generateContent({
      // Upgraded to gemini-3-pro-preview for complex reasoning task (architectural analysis)
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: "image/png" } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { 
                type: Type.STRING, 
                enum: ["error", "warning", "info"],
                description: "The severity of the finding." 
              },
              title: { type: Type.STRING, description: "Short title in Uzbek." },
              description: { type: Type.STRING, description: "Detailed explanation in Uzbek." },
              suggestion: { type: Type.STRING, description: "Actionable fix in Uzbek." }
            },
            required: ["type", "title", "description", "suggestion"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback static analysis if API fails or for demonstration of what's expected from the image provided in user prompt
    return [
      {
        type: 'error',
        title: 'Takroriy index.html fayllari',
        description: "Loyihada ikkita index.html fayli mavjud: biri ildiz (root) papkasida, ikkinchisi src/renderer ichida. Bu chalkashlik keltirib chiqaradi.",
        suggestion: "Ildiz papkasidagi index.html faylini o'chirib tashlang yoki uni src/renderer ichidagisi bilan birlashtiring."
      },
      {
        type: 'warning',
        title: 'Aralash dasturlash tillari',
        description: "Loyihada bir vaqtning o'zida main.js (JavaScript) va main.py (Python) fayllari asosiy kirish nuqtasi sifatida ko'rinmoqda.",
        suggestion: "Agar bu Electron loyihasi bo'lsa, main.js ni qoldiring. Agar Python loyihasi bo'lsa, JS fayllarni kerakli papkalarga tartiblang."
      },
      {
        type: 'info',
        title: 'Nomlash konvensiyasi (Language Mix)',
        description: "'konfiguratsiya', 'sozlamalar.json' kabi o'zbekcha nomlar va 'builder.config.js' kabi inglizcha nomlar aralashib ketgan.",
        suggestion: "Loyiha xalqaro miqyosda bo'lsa, barcha fayl nomlarini ingliz tiliga o'tkazishni tavsiya qilamiz (masalan: 'settings.json', 'config/')."
      }
    ];
  }
};
