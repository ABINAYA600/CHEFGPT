import React, { useState } from "react";
import "./CreateRecipe.css";

// PDF Tools
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";

export default function CreateRecipe() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  /* ------------------------------------------
      AI RECIPE REFINING
  ------------------------------------------ */
  async function refineRecipe() {
    if (!input.trim()) return;
    setLoading(true);
    setOutput("");

    try {
      const res = await fetch("http://localhost:5000/api/ai/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      setOutput(data.recipe || "No refined recipe generated.");
    } catch (err) {
      setOutput("Error refining recipe.");
    }
    setLoading(false);
  }

  /* ------------------------------------------
      SAVE CUSTOM RECIPE
  ------------------------------------------ */
  async function saveCustomRecipe() {
    if (!output.trim()) return alert("No recipe to save!");

    const recipeTitle = output.split("\n")[0].replace(/[#*]/g, "").trim();

    try {
      const res = await fetch("http://localhost:5000/api/recipes/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: recipeTitle || "Custom Recipe",
          cuisine: "Custom",
          fullRecipe: output,
          source: "create",
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Recipe saved successfully!");
        window.location.href = "/saved";
      } else {
        alert("Failed to save recipe");
      }
    } catch (err) {
      alert("Error saving recipe.");
    }
  }

  /* ------------------------------------------
      DOWNLOAD ONLY THE RECIPE CARD AS PDF
  ------------------------------------------ */
  async function downloadRecipeCardPDF() {
    const element = document.getElementById("custom-recipe-card");
    if (!element) return alert("No recipe card found!");

    const canvas = await html2canvas(element, { scale: 2 });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, width, height);
    pdf.save("custom-recipe.pdf");
  }

  return (
    <div className="create-page">
      <h1 className="create-title">CHEFGPT – Refine or Create Your Recipe</h1>

      {/* OUTPUT CARD */}
      {output && (
        <div
          className="create-output-box"
          id="custom-recipe-card"
          style={{ position: "relative" }}
        >
          {/* PDF Icon */}
          <button
            className="recipe-download-icon"
            onClick={downloadRecipeCardPDF}
          >
            <Download size={18} />
          </button>

          <h2 className="create-refined-title">Refined Recipe</h2>

          <pre className="create-recipe-text">{output}</pre>

          <button className="create-save-btn" onClick={saveCustomRecipe}>
            Save Recipe
          </button>
        </div>
      )}

      {/* INPUT BAR */}
      <div className="create-bottom-bar">
        <textarea
          className="create-bar-input"
          placeholder="Paste your recipe or ingredients to refine..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button className="create-bar-btn" onClick={refineRecipe}>
          {loading ? "Refining…" : "Refine"}
        </button>
      </div>
    </div>
  );
}
