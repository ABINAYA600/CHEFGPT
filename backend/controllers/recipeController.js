import Recipe from "../models/recipe.js";

// ✅ Test API (for Postman/browser)
export const testAPI = (req, res) => {
  res.send("🍳 ChefGPT API is working with static MongoDB dataset!");
};

// ✅ Get all recipes (Paginated for performance)
export const getAllRecipes = async (req, res) => {
  try {
    // Pagination support — optional query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50; // default 50 per page
    const skip = (page - 1) * limit;

    // Fetch recipes from MongoDB with pagination
    const recipes = await Recipe.find().skip(skip).limit(limit);

    // Total count for frontend pagination
    const totalRecipes = await Recipe.countDocuments();

    res.status(200).json({
      message: "✅ Recipes fetched successfully!",
      currentPage: page,
      totalPages: Math.ceil(totalRecipes / limit),
      totalRecipes,
      data: recipes,
    });
  } catch (err) {
    console.error("❌ Error fetching recipes:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ✅ Get recipe by dish name (Search)
export const getRecipeByTitle = async (req, res) => {
  try {
    const title = req.params.title;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "⚠️ Please provide a dish title to search." });
    }

    // Case-insensitive regex search
    const recipe = await Recipe.findOne({
      title: { $regex: new RegExp(title, "i") },
    });

    if (!recipe) {
      return res.status(404).json({ message: `No recipe found for "${title}"` });
    }

    res.status(200).json({
      message: `✅ Recipe found for "${title}"`,
      recipe,
    });
  } catch (err) {
    console.error("❌ Error fetching recipe by title:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
