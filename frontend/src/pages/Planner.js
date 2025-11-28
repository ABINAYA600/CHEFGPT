import React, { useState } from "react";
import "./Planner.css";

export default function Planner() {
  const [mode, setMode] = useState("Daily");
  const [groceries, setGroceries] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  // 📌 Generate Plan Using AI
  async function generatePlan() {
    if (!groceries.trim()) {
      alert("Please enter groceries before generating a plan.");
      return;
    }

    setLoading(true);
    setPlan("");

    try {
      const res = await fetch("http://localhost:5000/api/ai/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, groceries }),
      });

      const data = await res.json();
      setPlan(data.plan || "No plan generated.");
    } catch (err) {
      console.error("Planner Error:", err);
      setPlan("Error generating plan.");
    }

    setLoading(false);
  }

  // 📌 Save Plan to MONGODB (NOT localStorage)
  async function savePlan() {
    if (!plan.trim()) return alert("Nothing to save!");

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to save your meal plan.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/recipes/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: `${mode} Meal Plan`,  // Example: "Daily Meal Plan"
          cuisine: "Planner",
          fullRecipe: plan,
          source: "planner",
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Meal plan saved successfully!");
        window.location.href = "/saved"; // Redirect to Saved Recipes
      } else {
        alert("Failed to save plan: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Save Plan Error:", err);
      alert("Error saving plan.");
    }
  }

  return (
    <div className="planner-page">
      <h1 className="planner-title">ChefGPT – Smart Meal Planner</h1>

      <div className="planner-container">

        {/* 🔸 Planning Mode Selector */}
        <div className="planner-input-group">
          <label>Select Planning Mode:</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>

        {/* 🔸 Groceries Input */}
        <div className="planner-input-group">
          <label>Enter groceries you have:</label>
          <textarea
            placeholder="onion, tomato, paneer..."
            rows="4"
            value={groceries}
            onChange={(e) => setGroceries(e.target.value)}
          ></textarea>
        </div>

        {/* 🔸 Generate Button */}
        <button className="planner-btn" onClick={generatePlan}>
          {loading ? "Generating..." : "Create Plan From Groceries"}
        </button>

        {/* 🔸 Output Section */}
        {plan && (
          <div className="planner-output">
            <pre>{plan}</pre>

            <button className="save-plan-btn" onClick={savePlan}>
              Save Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
