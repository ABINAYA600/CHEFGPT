import express from "express";
import multer from "multer";
import { chatCompletion } from "../services/aiService.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/* ------------------------------------------------------
   1) ADVANCED RECIPE GENERATOR WITH REAL SERVING SCALING
------------------------------------------------------- */
router.post("/recipe", async (req, res) => {
  try {
    const { prompt, servings } = req.body;

    const systemMessage = `
You are ChefGPT.
You ALWAYS obey the user's serving count.
You NEVER guess ingredients.
You ALWAYS apply real math when scaling quantities.
Base recipe is ALWAYS for 2 servings.
`;

    const userMessage = `
Create a recipe for "${prompt}" scaled to EXACTLY **${servings} servings**.

📌 **SCALING RULE (VERY IMPORTANT)**  
Assume ORIGINAL recipe = 2 servings.

Scale each ingredient like this:

scaled_quantity = original_quantity × (${servings} / 2)

NEVER approximate. NEVER write ranges.  
Only use numbers and correct units.

📌 **OUTPUT FORMAT (MUST FOLLOW EXACTLY)**

Title: <Dish Name>

Servings: ${servings} people

Ingredients:
- <scaled quantity> <ingredient>
- <scaled quantity> <ingredient>
(Every item MUST be mathematically scaled)

Instructions:
1. Step 1
2. Step 2
3. Step 3
NO mention of "scaling" in instructions.
`;

    const result = await chatCompletion([
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage }
    ]);

    const recipeText = result.choices?.[0]?.message?.content || "";

    return res.json({ success: true, recipe: recipeText });

  } catch (err) {
    console.error("🔥 Recipe Error:", err);
    return res.status(500).json({
      success: false,
      error: "Recipe generation failed",
    });
  }
});

/* ------------------------------------------------------
   2) CUISINE DOUBT ANSWER
------------------------------------------------------- */
router.post("/cuisineDoubt", async (req, res) => {
  try {
    const { cuisine, question } = req.body;

    if (!question?.trim())
      return res.json({ success: false, answer: "Please enter a valid doubt." });

    const result = await chatCompletion([
      {
        role: "system",
        content: `You are an expert ${cuisine} chef. Be clear and simple.`,
      },
      { role: "user", content: question },
    ]);

    return res.json({
      success: true,
      answer: result.choices?.[0]?.message?.content || "",
    });

  } catch (err) {
    console.error("🔥 Cuisine Doubt Error:", err);
    return res.json({ success: false, answer: "Error generating response." });
  }
});

/* ------------------------------------------------------ 
   3) GENERAL COOKING DOUBTS
------------------------------------------------------- */
router.post("/doubt", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question?.trim()) {
      return res.json({
        success: false,
        answer: "Please enter your doubt.",
      });
    }

    const prompt = `
User Question: ${question}
Answer in simple steps. Keep it cooking-related.
    `;

    const result = await chatCompletion([
      { role: "system", content: "You are ChefGPT cooking assistant." },
      { role: "user", content: prompt }
    ]);

    return res.json({
      success: true,
      answer: result.choices?.[0]?.message?.content || "",
    });

  } catch (err) {
    console.error("🔥 Doubt Error:", err);
    return res.status(500).json({
      success: false,
      answer: "Error fetching answer.",
    });
  }
});

/* ------------------------------------------------------
   4) CUISINE TRENDING DISHES
------------------------------------------------------- */
router.post("/cuisineDishes", async (req, res) => {
  try {
    const { cuisine } = req.body;

    const systemPrompt = `
Return EXACTLY 8 dishes in JSON array:

[
  { "name": "Dish name", "description": "Short description" }
]

NO markdown, no extra text.
    `;

    const result = await chatCompletion([
      { role: "system", content: systemPrompt },
      { role: "user", content: `List 8 popular dishes from ${cuisine} cuisine.` },
    ]);

    let raw = result.choices?.[0]?.message?.content || "[]";

    let dishes = [];

    try {
      dishes = JSON.parse(raw);
    } catch (err) {
      dishes = [];
    }

    return res.json({ success: true, dishes });

  } catch (err) {
    console.error("🔥 Cuisine Error:", err);
    return res.status(500).json({ success: false, dishes: [] });
  }
});

/* ------------------------------------------------------ 
   5) MEAL PLANNER — CLEAN & SIMPLE
------------------------------------------------------- */
router.post("/planner", async (req, res) => {
  try {
    const { groceries, mode, days } = req.body;

    const prompt = `
Using ONLY these groceries:
${groceries}

Create a ${mode} meal plan for ${days} days.

Each day must have:
- Breakfast (short dish name only)
- Lunch (short dish name only)
- Dinner (short dish name only)

NO instructions.
NO descriptions.
NO paragraphs.

FORMAT:
Day 1:
Breakfast: <name>
Lunch: <name>
Dinner: <name>

Day 2:
...
    `;

    const result = await chatCompletion([
      { role: "system", content: "You are ChefGPT meal planning expert." },
      { role: "user", content: prompt },
    ]);

    return res.json({
      success: true,
      plan: result.choices?.[0]?.message?.content || "",
    });

  } catch (err) {
    console.error("🔥 Planner Error:", err);
    return res.status(500).json({ success: false, plan: "Error generating plan." });
  }
});

export default router;
