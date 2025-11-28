import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  cuisine: { type: String, default: "General" },

  // Complete recipe text (from AI)
  fullRecipe: { type: String, required: true },

  // Optional structured fields
  ingredients: [{ type: String }],
  steps: [{ type: String }],
  
  source: { type: String, default: "unknown" } // cuisines | mealprep | planner | create | manual
}, { timestamps: true });

export default mongoose.model("Recipe", recipeSchema);
