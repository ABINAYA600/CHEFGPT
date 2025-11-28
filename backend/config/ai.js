import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const API_KEY = process.env.DEEPINFRA_API_KEY;
const MODEL_ID = process.env.DEEPINFRA_MODEL;

// Safety check
if (!API_KEY) console.error("❌ Missing DEEPINFRA_API_KEY in .env");
if (!MODEL_ID) console.error("❌ Missing DEEPINFRA_MODEL in .env");

/* ============================================================
   1️⃣ Generate Recipe (TEXT - Chat Completions)
   DeepInfra OpenAI-compatible endpoint
============================================================ */
export const generateRecipeAI = async (prompt) => {
  try {
    const response = await fetch(
      "https://api.deepinfra.com/v1/openai/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL_ID,
          messages: [
            {
              role: "user",
              content: `Generate a detailed cooking recipe including:

- Title
- Ingredients with quantity
- Step-by-step instructions
- Cooking tips
- Serving suggestions

Prompt: ${prompt}`
            }
          ]
        }),
      }
    );

    const data = await response.json();

    console.log("🟢 FULL DEEPINFRA RESPONSE:", JSON.stringify(data, null, 2));

    if (!data.choices || !data.choices.length) {
      throw new Error("DeepInfra returned no choices");
    }

    return data.choices[0].message.content;

  } catch (err) {
    console.error("🔥 DeepInfra Recipe Error:", err);
    throw err;
  }
};

/* ============================================================
   2️⃣ Generate Image (Stable Diffusion)
============================================================ */
export const generateImageAI = async (prompt) => {
  try {
    const response = await fetch(
      "https://api.deepinfra.com/v1/inference/stable-diffusion-v1-5",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          prompt,
          steps: 30,
          width: 512,
          height: 512,
        }),
      }
    );

    const data = await response.json();

    if (!data.output_url) {
      throw new Error("Image generation failed");
    }

    return data.output_url; // return image URL

  } catch (err) {
    console.error("🔥 DeepInfra Image Error:", err);
    throw err;
  }
};

/* ============================================================
   3️⃣ Analyze Food Image (Vision)
============================================================ */
export const analyzeFoodImageAI = async (base64Image, note) => {
  try {
    const prompt = `
You are a professional chef. Analyze this food image and provide:

1. What dish it looks like  
2. Problems or mistakes  
3. Fix steps  
4. Future prevention  
5. Taste improvement tips  

User note: ${note}
`;

    const response = await fetch(
      "https://api.deepinfra.com/v1/openai/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL_ID,
          messages: [
            {
              role: "user",
              content: prompt,
            }
          ],
          image: base64Image,
        }),
      }
    );

    const data = await response.json();

    console.log("🟢 FULL VISION RESPONSE:", JSON.stringify(data, null, 2));

    if (!data.choices || !data.choices.length) {
      throw new Error("DeepInfra returned no analysis result");
    }

    return data.choices[0].message.content;

  } catch (err) {
    console.error("🔥 DeepInfra Vision Error:", err);
    throw err;
  }
};
