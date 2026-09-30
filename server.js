import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

const SYSTEM_INSTRUCTION = `
You are EduGenie, a friendly learning assistant for students.
Your job is to explain concepts clearly, use age-appropriate language,
break difficult ideas into steps, give examples, and encourage learning.
Do not simply do assessed work when the student appears to be taking a live test.
For normal study questions, provide explanations and worked examples.
When asked for quizzes, create questions and keep the answer key separate.
Never request or expose secret API keys.
`;

async function askGemini(prompt) {
  if (!ai) {
    throw new Error("GEMINI_API_KEY is not configured. Copy .env.example to .env and add your key.");
  }

  const interaction = await ai.interactions.create({
    model: "gemini-3.8-flash",
    input: `${SYSTEM_INSTRUCTION}\n\nStudent request:\n${prompt}`
  });

  return interaction.output_text || "I couldn't generate a response. Please try again.";
}

app.post("/api/chat", async (req, res) => {
  try {
    const { message, mode = "explain" } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Please enter a question." });
    }

    const prompts = {
      explain: `Explain this topic for a student. Start with a simple definition, then give key points and one example:\n${message}`,
      quiz: `Create a 5-question quiz about this topic. Mix multiple choice and short answer. Put an ANSWER KEY after a divider so the student can attempt the questions first:\n${message}`,
      flashcards: `Create 8 concise flashcards for this topic. Format each as "Q: ..." followed by "A: ...":\n${message}`,
      plan: `Create a practical 7-day study plan for this topic. Include daily goals, a short study session, practice, and a review task:\n${message}`
    };

    const answer = await askGemini(prompts[mode] || prompts.explain);
    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Something went wrong." });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, configured: Boolean(process.env.GEMINI_API_KEY) });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`EduGenie running at http://localhost:${PORT}`);
});
