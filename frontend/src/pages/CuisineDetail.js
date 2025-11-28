import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CuisineDetail.css";

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

  // Load trending dishes
  useEffect(() => {
    if (cuisine) loadTrending();
  }, [cuisine]);

  async function loadTrending() {
    try {
      setLoadingTrending(true);
      const res = await fetch("http://localhost:5000/api/ai/cuisineDishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cuisine: cuisine.name }),
      });
      const data = await res.json();
      setTrending(data.dishes || []);
    } finally {
      setLoadingTrending(false);
    }
  }

  // Open recipe modal
  async function openModal(dish) {
    setModalOpen(true);
    setModalDish(dish);
    setModalLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/ai/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: dish.name }),
      });

      const data = await res.json();
      setModalRecipe(data.recipe || "No recipe available");
    } catch {
      setModalRecipe("Error fetching recipe.");
    }

    setModalLoading(false);
  }

  // SAVE DISH + REDIRECT TO /saved
  async function saveDish(dish) {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to save this recipe!");
      return;
    }

    if (modalLoading) {
      alert("Please wait, recipe is still loading...");
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
          title: dish.name,
          cuisine: cuisine.name,
          fullRecipe: modalRecipe || "No recipe available",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Recipe saved successfully!");
        navigate("/saved");
      } else {
        alert("Failed to save recipe: " + (data.message || "Error"));
      }
    } catch {
      alert("Error saving recipe.");
    }
  }

  // Bottom Input Search
  async function handleBottomSubmit() {
    if (!query.trim()) return;

    setBottomLoading(true);
    setBottomOutput("");
    setSearchResult(null);

    const isRecipe = ["recipe", "how to", "make", "prepare"].some((k) =>
      query.toLowerCase().includes(k)
    );

    try {
      if (isRecipe) {
        const res = await fetch("http://localhost:5000/api/ai/recipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: query }),
        });

        const data = await res.json();
        const fullRecipe = data.recipe || "No recipe found.";
        const recipeTitle =
          fullRecipe.split("\n")[0].replace(/[#*]/g, "").trim();

        setSearchResult({
          name: recipeTitle || "Generated Recipe",
          full: fullRecipe,
        });
      } else {
        const res = await fetch("http://localhost:5000/api/ai/cuisineDoubt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cuisine: cuisine.name,
            question: query,
          }),
        });

        const data = await res.json();
        setBottomOutput(data.answer || "No answer found.");
      }
    } catch {
      setBottomOutput("Error fetching response.");
    }

    setBottomLoading(false);
  }

  if (!cuisine) return null;

  return (
    <div className="cd-page">

      <div className="cd-container">
        <h1 className="cd-title">{cuisine.name} Cuisine</h1>
        <p className="cd-tag">{cuisine.tagline}</p>

        {/* Search Result */}
        {searchResult && (
          <div className="cd-card">
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
          {trending.length === 0 && <p>No trending dishes.</p>}

          {trending.map((d, idx) => (
            <div className="cd-card" key={idx}>
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

      {/* Bottom Search */}
      <div className="cd-bottom">
        <div className="cd-bottom-row">
          <input
            placeholder={`Ask a recipe or doubt about ${cuisine.name}…`}
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

      {/* MODAL WITH SAVE BUTTON */}
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
                Save Recipe
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
