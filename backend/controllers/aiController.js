import {
  generateRecipeAI,
  generateImageAI,
  analyzeFoodImageAI,
} from "../config/ai.js";

/* ================================
   1️⃣ Generate Recipe Controller
================================ */
export const generateRecipe = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: "Prompt is required",
      });
    }

    // Calls DeepInfra logic in ai.js
    const recipe = await generateRecipeAI(prompt);

    res.json({ success: true, recipe });

  } catch (err) {
    console.error("🔥 Recipe Controller Error:", err);
    res.status(500).json({
      success: false,
      error: "Recipe generation failed",
      details: err.message,
    });
  }
};

/* ================================
   2️⃣ Generate Image Controller
================================ */
export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: "Prompt is required",
      });
    }

    const image = await generateImageAI(prompt);

    res.json({ success: true, image });

  } catch (err) {
    console.error("🔥 Image Controller Error:", err);
    res.status(500).json({
      success: false,
      error: "Image generation failed",
      details: err.message,
    });
  }
};

/* ================================
   3️⃣ Analyze Food Image (Doubts)
================================ */
export const analyzeFoodImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No image uploaded",
      });
    }

    const base64Image = req.file.buffer.toString("base64");
    const note = req.body.note || "";

    const analysis = await analyzeFoodImageAI(base64Image, note);

    res.json({ success: true, analysis });

  } catch (err) {
    console.error("🔥 Analyze Controller Error:", err);
    res.status(500).json({
      success: false,
      error: "Image analysis failed",
      details: err.message,
    });
  }
};
