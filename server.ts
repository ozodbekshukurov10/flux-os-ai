import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[Flux-Server] ${req.method} ${req.url}`);
  next();
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", version: "3.1-enterprise" });
});

// Auth API
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  
  if (email === "ozodbek201024@gmail.com" && password === "ozodbek2010") {
    return res.json({ success: true, user: { name: "Ozodbek", email, role: "admin" } });
  }
  
  if (email && password) {
    return res.json({ success: true, user: { name: email.split('@')[0], email, role: "user" } });
  }
  
  return res.status(401).json({ success: false, message: "Email va parol kiritilishi shart" });
});

// AI Chat API
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ success: false, message: "API kaliti topilmadi" });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
    });
    
    res.json({ success: true, reply: response.text });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ success: false, message: error.message || "Xatolik yuz berdi" });
  }
});

// Serve static files from the root directory
app.use(express.static(__dirname));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[Flux-Server] Running at http://localhost:${PORT}`);
});
