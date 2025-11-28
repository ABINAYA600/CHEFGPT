import React, { useState } from "react";
import "./RecipeDisplay.css";

export default function RecipeDisplay({ recipe }) {
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  async function saveRecipe() {
    setSaving(true);
    setSavedMsg("");

    try {
      const res = await fetch("http://localhost:5000/api/recipes/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipe),
      });

      const data = await res.json();

      if (data.success) {
        setSavedMsg("Recipe saved successfully! ⭐");
      } else {
        setSavedMsg("Already saved or error saving.");
      }
    } catch (err) {
      setSavedMsg("Server Error: " + err.message);
    }

    setSaving(false);
  }

  return (
    <div className="recipe-box">
      <div className="recipe-header">
        <h2 className="recipe-title">{recipe.title}</h2>

        {/* ⭐ Save Button */}
        <button className="save-btn" onClick={saveRecipe} disabled={saving}>
          {saving ? "Saving..." : "⭐ Save"}
        </button>
      </div>

      {savedMsg && <p className="saved-msg">{savedMsg}</p>}

      <p className="recipe-desc">{recipe.description}</p>

      {/* INGREDIENTS */}
      <h3>🧂 Ingredients</h3>
      <ul>
        {recipe.ingredients.map((ing, i) => (
          <li key={i}>
            <strong>{ing.name}</strong>: {ing.quantity}
          </li>
        ))}
      </ul>

      {/* STEPS */}
      <h3>👨‍🍳 Step-by-Step Preparation</h3>
      {recipe.steps.map((step, i) => (
        <div key={i} className="step-card">
          <h4>Step {step.stepNumber}</h4>
          <p>{step.instruction}</p>

          {/* AI step-image */}
          <img
            src={`https://image.pollinations.ai/prompt/${encodeURIComponent(
              step.imagePrompt
            )}`}
            alt="Step Visual"
            className="step-image"
          />
        </div>
      ))}

      {/* TUTORIALS */}
      <h3>🎥 Video Tutorials</h3>
      <ul>
        {recipe.tutorials.map((t, i) => (
          <li key={i}>
            <a href={t.url} target="_blank" rel="noreferrer">
              {t.title}
            </a>
          </li>
        ))}
      </ul>

      {/* FOLLOW-UP */}
      <h3>❓ Follow-Up Questions</h3>
      <ul>
        {recipe.followUpQuestions.map((q, i) => (
          <li key={i}>{q}</li>
        ))}
      </ul>
    </div>
  );
}
