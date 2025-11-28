import React, { useState } from "react";
import { Search } from "lucide-react";
import "./Doubts.css";

export default function Doubts() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // TEXT DOUBT ONLY
  const askDoubt = async () => {
    if (!query.trim()) return alert("Enter your doubt!");

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("http://localhost:5000/api/ai/doubt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });

      const data = await res.json();
      setResult(data.answer || "No answer found.");
    } catch (err) {
      console.error(err);
      setResult("Error fetching answer.");
    }

    setLoading(false);
  };

  return (
    <div className="doubts-page">
      <h1 className="doubts-title">Ask Your Doubts</h1>

      <div className="doubts-center">
        {loading && <div className="status-text">Processing...</div>}

        {!loading && result && (
          <div className="result-card">
            <pre className="result-pre">{result}</pre>
          </div>
        )}
      </div>

      {/* Bottom Input Bar */}
      <div className="doubts-bottom">
        <div className="doubts-input-row">
          <input
            className="doubts-input"
            placeholder="Ask any doubt..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askDoubt()}
          />

          <button className="search-btn" onClick={askDoubt}>
            <Search size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
