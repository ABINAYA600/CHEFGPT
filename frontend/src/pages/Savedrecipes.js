// frontend/pages/SavedRecipes.js
import React, { useEffect, useState } from "react";
import "./SavedRecipes.css";

export default function SavedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  async function fetchSavedRecipes() {
    try {
      const res = await fetch("http://localhost:5000/api/recipes/all");
      const data = await res.json();

      if (data.success) {
        setRecipes(data.recipes);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  async function deleteRecipe(id) {
    if (!window.confirm("Do you want to delete this recipe?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/recipes/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        setRecipes((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  function toggleExpand(id) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  const filtered = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="saved-page">

      <h1 className="saved-title">Your Saved Recipes</h1>

      <input
        type="text"
        placeholder="Search recipes..."
        className="saved-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="saved-grid">
        {filtered.length === 0 ? (
          <p className="no-recipes">No saved recipes found.</p>
        ) : (
          filtered.map((recipe) => (
            <div className="saved-card" key={recipe._id}>

              <h2 className="recipe-title">{recipe.title}</h2>

              <button
                className="expand-btn"
                onClick={() => toggleExpand(recipe._id)}
              >
                {expandedId === recipe._id ? "Hide Recipe" : "View Recipe"}
              </button>

              {expandedId === recipe._id && (
                <div className="recipe-full">
                  <pre className="recipe-text">
                    {recipe.fullRecipe}
                  </pre>
                </div>
              )}

              <button
                className="delete-btn"
                onClick={() => deleteRecipe(recipe._id)}
              >
                Delete
              </button>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
