import React, { useState } from "react";
import "./Recipecard.css";

export default function RecipeCard({ recipeText, onSave }) {
  const [open, setOpen] = useState(false);

  // Extract title (first line)
  const title = recipeText.split("\n")[0].replace("###", "").trim();

  // Short description
  const description = recipeText.substring(0, 120) + "...";

  return (
    <>
      <div className="rcard">
        <div className="rcard-body">
          <h3>{title}</h3>
          <p>{description}</p>

          <div className="rcard-actions">
            <button className="rcard-btn" onClick={() => setOpen(true)}>
              View Recipe
            </button>
            <button className="rcard-btn outlined" onClick={() => onSave(recipeText)}>
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Full recipe modal */}
      {open && (
        <div className="recipe-modal">
          <div className="recipe-modal-content">
            <button className="recipe-close" onClick={() => setOpen(false)}>✖</button>

            <h2 className="recipe-title">{title}</h2>

            <div className="recipe-text">
              {/* Professional formatting */}
              {recipeText.split("\n").map((line, index) => {
                if (line.startsWith("##")) {
                  return <h3 key={index} className="section-title">{line.replace("##", "").trim()}</h3>;
                }
                if (line.startsWith("-")) {
                  return <li key={index} className="recipe-item">{line.replace("-", "").trim()}</li>;
                }
                if (line.match(/^\d+\./)) {
                  return <p key={index} className="recipe-step">{line}</p>;
                }
                return <p key={index} className="recipe-line">{line}</p>;
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
