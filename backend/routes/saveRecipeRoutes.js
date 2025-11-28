// backend/routes/saveRecipeRoutes.js
import express from "express";
import Recipe from "../models/recipe.js";

const router = express.Router();

/* ---------------------------------------------
   SAVE A RECIPE
--------------------------------------------- */
router.post("/save", async (req, res) => {
  try {
    const recipe = req.body;

    // Prevent duplicate titles
    const exists = await Recipe.findOne({ title: recipe.title });
    if (exists) {
      return res.json({ success: false, message: "Recipe already saved" });
    }

    const newRecipe = new Recipe(recipe);
    await newRecipe.save();

    res.json({
      success: true,
      message: "Recipe saved successfully",
      id: newRecipe._id,
    });
  } catch (err) {
    console.error("Save Recipe Error:", err);
    res.status(500).json({ success: false, message: "Save failed" });
  }
});

/* ---------------------------------------------
   GET ALL SAVED RECIPES
--------------------------------------------- */
router.get("/all", async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    return res.json({ success: true, recipes });
  } catch (err) {
    console.error("Fetch Recipes Error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching recipes",
    });
  }
});

/* ---------------------------------------------
   DELETE A RECIPE
--------------------------------------------- */
router.delete("/:id", async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Recipe deleted" });
  } catch (err) {
    console.error("Delete Recipe Error:", err);
    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
});

export default router;
