import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

async function listModels() {
  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No API key found");
    return;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    // There is no direct listModels in the JS SDK, we have to use fetch
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
}

listModels();
