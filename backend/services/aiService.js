import axios from "axios";

export const chatCompletion = async (messages) => {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      console.log("❌ OPENROUTER_API_KEY missing!");
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-exp:free",
        messages,
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
          "X-Title": process.env.APP_NAME || "ChefGPT",
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("🔥 OpenRouter Error:", err.response?.data || err.message);
    throw err;
  }
};
