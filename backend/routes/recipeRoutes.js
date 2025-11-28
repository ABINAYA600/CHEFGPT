import express from "express";
import Recipe from "../models/recipe.js";

const router = express.Router();

/* ---------------------------------------------
   TEST API
--------------------------------------------- */
router.get("/", (req, res) => {
  res.json({ success: true, message: "Recipe API Working" });
});

/* ---------------------------------------------
   GET ALL SAVED RECIPES
   (Used by SavedRecipes.js)
   Disk sorting enabled to prevent memory errors
--------------------------------------------- */
router.get("/all", async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .sort({ createdAt: -1 })
      .allowDiskUse(true);   // 🚀 Fix MongoDB sort memory error

    res.json({ success: true, recipes });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

/* ---------------------------------------------
   SAVE A NEW RECIPE
--------------------------------------------- */
router.post("/save", async (req, res) => {
  try {
    const { title, cuisine, fullRecipe, source } = req.body;

    if (!title || !fullRecipe) {
      return res.json({
        success: false,
        message: "Missing title or recipe text",
      });
    }

    const saved = await Recipe.create({
      title,
      cuisine: cuisine || "General",
      fullRecipe,
      source: source || "unknown",
    });

    res.json({ success: true, recipe: saved });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

/* ---------------------------------------------
   DELETE A RECIPE
--------------------------------------------- */
router.delete("/:id", async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

export default router;
