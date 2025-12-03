import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CuisineDetail.css";

// PDF Tools
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";

export default function CuisineDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const cuisine = state?.cuisine;

  useEffect(() => {
    if (!cuisine) navigate("/cuisines");
  }, [cuisine, navigate]);

  const [trending, setTrending] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalRecipe, setModalRecipe] = useState("");
  const [modalDish, setModalDish] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [bottomLoading, setBottomLoading] = useState(false);
  const [bottomOutput, setBottomOutput] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  // ⭐ DOWNLOAD CARD AS PDF
  const downloadCardPDF = async (cardId, fileName) => {
    const element = document.getElementById(cardId);
    if (!element) return alert("Card not found!");

    const canvas = await html2canvas(element, { scale: 2 });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, width, height);
    pdf.save(`${fileName}.pdf`);
  };

  // ⭐ FIX – loadTrending now wrapped in useCallback (no warnings)
  const loadTrending = useCallback(async () => {
    try {
      setLoadingTrending(true);

      const res = await fetch(
        "https://chefgpt-backend.onrender.com/api/ai/cuisineDishes",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cuisine: cuisine?.name }),
        }
      );

      const data = await res.json();
      setTrending(data.dishes || []);
    } finally {
      setLoadingTrending(false);
    }
  }, [cuisine?.name]);

  // ⭐ Correct useEffect (NO WARNING)
  useEffect(() => {
    if (cuisine) loadTrending();
  }, [cuisine, loadTrending]);

  // Modal fetch
  async function openModal(dish) {
    setModalOpen(true);
    setModalDish(dish);
    setModalLoading(true);

    try {
      const res = await fetch(
        "https://chefgpt-backend.onrender.com/api/ai/recipe",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: dish.name }),
        }
      );

      const data = await res.json();
      setModalRecipe(data.recipe || "No recipe available");
    } catch {
      setModalRecipe("Error loading recipe.");
    }

    setModalLoading(false);
  }

  async function saveDish(dish) {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first!");

    try {
      const res = await fetch(
        "https://chefgpt-backend.onrender.com/api/recipes/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: dish.name,
            cuisine: cuisine.name,
            fullRecipe: modalRecipe,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("Recipe saved!");
        navigate("/saved");
      } else {
        alert(data.message || "Error saving");
      }
    } catch {
      alert("Save failed.");
    }
  }

  // Search input
  async function handleBottomSubmit() {
    if (!query.trim()) return;

    setBottomLoading(true);
    setBottomOutput("");

    const isRecipe = ["recipe", "how", "make", "prepare"].some((k) =>
      query.toLowerCase().includes(k)
    );

    try {
      if (isRecipe) {
        const res = await fetch(
          "https://chefgpt-backend.onrender.com/api/ai/recipe",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: query }),
          }
        );

        const data = await res.json();
        const full = data.recipe || "No recipe found";

        setSearchResult({
          name: full.split("\n")[0].replace(/[#*]/g, "").trim(),
          full,
        });
      } else {
        const res = await fetch(
          "https://chefgpt-backend.onrender.com/api/ai/cuisineDoubt",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cuisine: cuisine.name,
              question: query,
            }),
          }
        );

        const data = await res.json();
        setBottomOutput(data.answer || "No answer found.");
      }
    } catch {
      setBottomOutput("Error.");
    }

    setBottomLoading(false);
  }

  if (!cuisine) return null;

  return (
    <div className="cd-page">
      <div className="cd-container">
        <h1 className="cd-title">{cuisine.name} Cuisine</h1>
        <p className="cd-tag">{cuisine.tagline}</p>

        {/* Search Result Card */}
        {searchResult && (
          <div
            className="cd-card"
            id="search-card"
            style={{ position: "relative" }}
          >
            <button
              className="recipe-download-icon"
              onClick={() =>
                downloadCardPDF("search-card", searchResult.name)
              }
            >
              <Download size={18} />
            </button>

            <h3 className="cd-dish-title">{searchResult.name}</h3>
            <div className="cd-actions">
              <button className="cd-open" onClick={() => openModal(searchResult)}>
                Open
              </button>
            </div>
          </div>
        )}

        {/* Trending */}
        <div className="cd-head-row">
          <h2>Trending Dishes</h2>
          <button className="cd-refresh" onClick={loadTrending}>
            {loadingTrending ? "Loading…" : "Refresh"}
          </button>
        </div>

        <div className="cd-grid">
          {trending.map((d, idx) => (
            <div
              className="cd-card"
              id={`trend-card-${idx}`}
              style={{ position: "relative" }}
              key={idx}
            >
              <button
                className="recipe-download-icon"
                onClick={() =>
                  downloadCardPDF(`trend-card-${idx}`, d.name)
                }
              >
                <Download size={18} />
              </button>

              <h3 className="cd-dish-title">{d.name}</h3>
              <p className="cd-desc">{d.description}</p>

              <div className="cd-actions">
                <button className="cd-open" onClick={() => openModal(d)}>
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="cd-bottom">
        <div className="cd-bottom-row">
          <input
            placeholder={`Ask about ${cuisine.name}…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleBottomSubmit()}
          />

          <button className="cd-ask" onClick={handleBottomSubmit}>
            {bottomLoading ? "Thinking…" : "Ask ChefGPT"}
          </button>
        </div>

        {bottomOutput && (
          <div className="cd-answer">
            <pre>{bottomOutput}</pre>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="cd-modal-bg" onClick={() => setModalOpen(false)}>
          <div className="cd-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="cd-modal-title">{modalDish?.name}</h2>

            {modalLoading ? (
              <p>Loading…</p>
            ) : (
              <pre className="cd-modal-pre">{modalRecipe}</pre>
            )}

            <div className="cd-modal-buttons">
              <button className="cd-save" onClick={() => saveDish(modalDish)}>
                Save
              </button>
              <button className="cd-close" onClick={() => setModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
