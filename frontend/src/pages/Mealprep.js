import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./Mealprep.css";

export default function MealPrep() {
  const [prompt, setPrompt] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  const [persons, setPersons] = useState(2);

  const [editingIngredients, setEditingIngredients] = useState(false);
  const [ingredientsList, setIngredientsList] = useState([]);

  /* ------------------------------------------
     SCALE BUTTONS 
  ------------------------------------------- */
  const decrease = () => {
    if (persons > 1) setPersons(persons - 1);
  };

  const increase = () => {
    setPersons(persons + 1);
  };

  /* ------------------------------------------
     GENERATE RECIPE WITH SERVINGS SCALING (AI)
  ------------------------------------------- */
  async function generateRecipe() {
    if (!prompt.trim()) return alert("Enter a dish name");

    setLoading(true);
    setRecipe("");

    try {
      const res = await fetch("http://localhost:5000/api/ai/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          servings: persons,       // ⭐ SEND SERVINGS TO BACKEND
        }),
      });

      const data = await res.json();

      if (data.success) {
        setRecipe(data.recipe);

        // Extract ingredient lines
        const ing = data.recipe
          .split("\n")
          .filter((line) => line.trim().startsWith("-"));
        setIngredientsList(ing);
      }
    } catch (err) {
      console.error("Error:", err);
    }

    setLoading(false);
  }

  /* ------------------------------------------
     SAVE RECIPE TO MONGODB
  ------------------------------------------- */
  async function saveRecipe() {
    if (!recipe) return alert("No recipe to save!");

    try {
      const res = await fetch("http://localhost:5000/api/recipes/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: prompt,
          cuisine: "MealPrep",
          fullRecipe: recipe,
          source: "mealprep",
        }),
      });

      const data = await res.json();

      if (data.success) alert("Recipe saved 🎉");
      else alert("Save failed ❌");
    } catch (err) {
      console.error("Save Error:", err);
      alert("Error saving recipe");
    }
  }

  /* ------------------------------------------
     SAVE INGREDIENT EDITING
  ------------------------------------------- */
  function saveEditedIngredients() {
    const updated = `
## 🥗 Ingredients
${ingredientsList.join("\n")}

${recipe.split("## 🧑‍🍳 Instructions")[1] || ""}
`;

    setRecipe(updated);
    setEditingIngredients(false);
  }

  return (
    <div className="mealprep-wrapper">

      {/* ========= PARTICLES ========= */}
      <div className="mealprep-particles">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="mp-particle"
            style={{
              left: Math.random() * 100 + "%",
              animationDuration: 5 + Math.random() * 6 + "s",
              width: 6 + Math.random() * 8 + "px",
              height: 6 + Math.random() * 8 + "px",
            }}
          />
        ))}
      </div>

      {/* ========= LOADER ========= */}
      {loading && (
        <div className="cooking-loader">
          <span>🍳 Cooking your {persons}-serving recipe…</span>
        </div>
      )}

      {/* ========= RECIPE OUTPUT ========= */}
      <div className="mealprep-output">
        {recipe && (
          <div className="recipe-card-box">
            {!editingIngredients ? (
              <>
                <ReactMarkdown children={recipe} remarkPlugins={[remarkGfm]} />

                <button
                  className="edit-btn"
                  onClick={() => setEditingIngredients(true)}
                >
                  Edit Ingredients
                </button>

                <button className="save-btn" onClick={saveRecipe}>
                  Save Recipe
                </button>
              </>
            ) : (
              <div className="edit-ingredients-box">
                <h3>Edit Ingredients</h3>

                {ingredientsList.map((item, index) => (
                  <div className="ingredient-row" key={index}>
                    <input
                      value={item}
                      onChange={(e) => {
                        const updated = [...ingredientsList];
                        updated[index] = e.target.value;
                        setIngredientsList(updated);
                      }}
                    />

                    <button
                      className="remove-ing"
                      onClick={() =>
                        setIngredientsList(
                          ingredientsList.filter((_, i) => i !== index)
                        )
                      }
                    >
                      ✖
                    </button>
                  </div>
                ))}

                <button
                  className="add-ing"
                  onClick={() =>
                    setIngredientsList([...ingredientsList, "- New Ingredient"])
                  }
                >
                  + Add Ingredient
                </button>

                <button className="save-btn" onClick={saveEditedIngredients}>
                  Save Changes
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========= INPUT BAR (BOTTOM) ========= */}
      <div className="mealprep-inputbar">
        {/* SERVINGS */}
        <div className="servings-box">
          <span>Servings</span>
          <div className="servings-buttons">
            <button onClick={decrease}>−</button>
            <input type="text" value={persons} readOnly />
            <button onClick={increase}>+</button>
          </div>
        </div>

        {/* INPUT BAR */}
        <div className="input-container">
          <input
            type="text"
            placeholder="Ask ChefGPT… e.g., Paneer Butter Masala"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generateRecipe()}
          />

          <button onClick={generateRecipe}>Generate</button>
        </div>
      </div>
    </div>
  );
}
