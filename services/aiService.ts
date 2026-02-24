
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const logActivity = (action: string) => {
  console.log(`[FluxCore-Engine] ${new Date().toLocaleTimeString()} - ${action}`);
};

export const performSearch = async (query: string) => {
  logActivity(`Search request initiated: ${query}`);
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview", 
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: "Siz Flux AI Search tizimisiz. Maqsadingiz foydalanuvchiga eng so'nggi va tasdiqlangan ma'lumotlarni taqdim etish. Javoblarni professional va tahliliy uslubda, O'zbek tilida yozing. Manbalarni aniq ko'rsating.",
    },
  });

  return {
    text: response.text || "Natija topilmadi.",
    links: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const codeAssistance = async (prompt: string, currentCode: string = '') => {
  logActivity(`Code assistance requested: ${prompt.substring(0, 30)}...`);
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `
      Current Code Context:
      \`\`\`
      ${currentCode}
      \`\`\`

      User Request: ${prompt}
    `,
    config: {
      systemInstruction: "Siz Flux IDE ning Intellektual Yordamchisisiz. Maqsadingiz foydalanuvchiga kod yozishda yordam berish. Faqat dasturlash bilan bog'liq javoblar bering. Agar foydalanuvchi yangi kod so'rasa, faqat kodni bering. Agar xatoni so'rasa, tushuntirish bilan birga to'g'irlangan kodni bering. Javoblar O'zbek tilida bo'lsin.",
    },
  });
  return response.text;
};

export const parseReminderIntent = async (input: string) => {
  logActivity(`Parsing reminder intent: ${input}`);
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: input,
    config: {
      responseMimeType: "application/json",
      systemInstruction: "Foydalanuvchi gapidan eslatma mazmuni (title), vaqti (time, HH:mm) va sanasini (date, YYYY-MM-DD) ajratib bering. Agar sana ko'rsatilmadi bo'lsa bugungi sanani qo'ying. Format: {title: string, time: string, date: string}. Faqat JSON qaytaring.",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          time: { type: Type.STRING },
          date: { type: Type.STRING }
        },
        required: ["title", "time", "date"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    return null;
  }
};

export const generateFluxImage = async (prompt: string, aspectRatio: string = "1:1") => {
  logActivity(`Nano Banana pipeline started for: ${prompt}`);
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `${prompt}, high quality, detailed, masterpiece style` }],
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any
      },
    } as any,
  });

  if (response.candidates && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        logActivity(`Nano Banana render successful.`);
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  
  throw new Error("Model tasvir qismini qaytarmadi. Promptni o'zgartirib ko'ring.");
};

export const startChatSession = (userName: string = 'Foydalanuvchi') => {
  logActivity(`Initializing neural network session for ${userName}.`);
  const ai = getAI();
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      temperature: 0.75,
      topP: 0.95,
      systemInstruction: `Siz Flux Browser AI tizimining rasmiy Intellektual Yordamchisisiz (Flux OS Engine 3.0). 
      Foydalanuvchi: ${userName}. 
      Sizning maqsadingiz: Foydalanuvchiga murakkab muammolarni hal qilishda yordam berish. 
      Sizda juda keng bilim bazasi bor. Javoblaringizni doimo O'zbek tilida, Markdown formatida, juda tushunarli va chiroyli qilib bering. 
      Texnik savollarga kod misollari bilan javob bering.`,
    },
  });
};
