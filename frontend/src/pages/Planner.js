import React, { useState } from "react";
import "./Planner.css";

// PDF Tools
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";

export default function Planner() {
  const [mode, setMode] = useState("Daily");
  const [groceries, setGroceries] = useState("");
  const [daysData, setDaysData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 DOWNLOAD A SPECIFIC DAY CARD
  async function downloadPlanCardPDF(dayIndex) {
    const element = document.getElementById(`planner-card-${dayIndex}`);
    if (!element) return alert("No plan card found!");

    const canvas = await html2canvas(element, { scale: 2 });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, width, height);
    pdf.save(`${mode}-mealplan-day${dayIndex + 1}.pdf`);
  }

  // 🔹 SAVE ENTIRE PLAN (ONE BUTTON ONLY)
  async function saveFullPlan() {
    if (daysData.length === 0)
      return alert("No meal plan to save!");

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to save your meal plan.");
      return;
    }

    // Combine all day plans into one text
    const fullPlan = daysData
      .map(
        (d, i) =>
          `Day ${i + 1}\nBreakfast:\n${d.breakfast}\n\nLunch:\n${d.lunch}\n\nDinner:\n${d.dinner}`
      )
      .join("\n\n---------------------------------\n\n");

    try {
      const res = await fetch("http://localhost:5000/api/recipes/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: `${mode} Meal Plan`,
          cuisine: "Planner",
          fullRecipe: fullPlan,
          source: "planner",
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Meal plan saved!");
        window.location.href = "/saved";
      } else {
        alert("Failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      alert("Error saving plan.");
    }
  }

  // 🔹 PARSE MEALS FROM TEXT
  function parseMeals(text) {
    const breakfast = text.match(/Breakfast[:\-]*([\s\S]*?)(?=Lunch|Dinner|$)/i);
    const lunch = text.match(/Lunch[:\-]*([\s\S]*?)(?=Dinner|$)/i);
    const dinner = text.match(/Dinner[:\-]*([\s\S]*$)/i);

    return {
      breakfast: breakfast ? breakfast[1].trim() : "No breakfast found",
      lunch: lunch ? lunch[1].trim() : "No lunch found",
      dinner: dinner ? dinner[1].trim() : "No dinner found",
    };
  }

  // 🔹 SPLIT INTO DAY BLOCKS
  function parseDayBlocks(rawText, expectedDays) {
    const dayRegex =
      /(Day\s*\d+[:\-\s]*)([\s\S]*?)(?=Day\s*\d+[:\-\s]*|$)/gi;

    const blocks = [...rawText.matchAll(dayRegex)].map((m) =>
      m[2].trim()
    );

    if (blocks.length === 0) {
      return Array.from({ length: expectedDays }, () => rawText);
    }

    while (blocks.length < expectedDays) blocks.push(blocks[0]);

    return blocks.slice(0, expectedDays);
  }

  // 🔹 GENERATE PLAN
  async function generatePlan() {
    if (!groceries.trim()) return alert("Enter groceries");

    setLoading(true);
    setDaysData([]);

    const days =
      mode === "Monthly" ? 30 : mode === "Weekly" ? 7 : 1;

    try {
      const res = await fetch("http://localhost:5000/api/ai/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, groceries, days }),
      });

      const data = await res.json();
      const raw = data.plan || "";

      const blocks = parseDayBlocks(raw, days);

      const parsedDays = blocks.map((blk, i) => {
        const meals = parseMeals(blk);
        return {
          day: i + 1,
          breakfast: meals.breakfast,
          lunch: meals.lunch,
          dinner: meals.dinner,
        };
      });

      setDaysData(parsedDays);
    } catch (err) {
      alert("Error generating");
    }

    setLoading(false);
  }

  return (
    <div className="planner-page">
      <h1 className="planner-title">ChefGPT – Smart Meal Planner</h1>

      <div className="planner-container">

        {/* MODE SELECTOR */}
        <div className="planner-input-group">
          <label>Select Planning Mode:</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>

        {/* GROCERY INPUT */}
        <div className="planner-input-group">
          <label>Enter groceries you have:</label>
          <textarea
            placeholder="onion, tomato, paneer..."
            rows="4"
            value={groceries}
            onChange={(e) => setGroceries(e.target.value)}
          ></textarea>
        </div>

        {/* GENERATE BUTTON */}
        <button className="planner-btn" onClick={generatePlan}>
          {loading ? "Generating..." : "Create Plan"}
        </button>

        {/* DAY CARDS */}
        {daysData.length > 0 && (
          <>
            <div className="planner-days-grid">
              {daysData.map((day, idx) => (
                <div
                  key={idx}
                  id={`planner-card-${idx}`}
                  className="planner-day-card"
                  style={{ position: "relative" }}
                >
                  {/* PDF ICON */}
                  <button
                    className="recipe-download-icon"
                    onClick={() => downloadPlanCardPDF(idx)}
                  >
                    <Download size={18} />
                  </button>

                  <h3>Day {day.day}</h3>

                  <div className="planner-meal">
                    <h4>Breakfast</h4>
                    <pre>{day.breakfast}</pre>
                  </div>

                  <div className="planner-meal">
                    <h4>Lunch</h4>
                    <pre>{day.lunch}</pre>
                  </div>

                  <div className="planner-meal">
                    <h4>Dinner</h4>
                    <pre>{day.dinner}</pre>
                  </div>
                </div>
              ))}
            </div>

            {/* ⭐ ONLY ONE SAVE BUTTON HERE */}
            <button
              className="save-plan-btn"
              onClick={saveFullPlan}
            >
              Save Full Plan
            </button>
          </>
        )}
      </div>
    </div>
  );
}
