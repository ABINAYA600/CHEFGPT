import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">

      {/* Floating Particles */}
      {[...Array(35)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: Math.random() * 100 + "%",
            animationDuration: 5 + Math.random() * 8 + "s",
            animationDelay: -Math.random() * 6 + "s"
          }}
        />
      ))}

      {/* CONTENT */}
      <div className="home-content">
        <h1 className="home-title">ChefGPT 🍳</h1>
        <p className="home-desc">
          Your personal AI-powered cooking assistant.  
          Generate recipes instantly, fix cooking mistakes with images,  
          explore global cuisines, and plan your meals — all in one place.
        </p>

        <div className="home-btn-area">
          <button className="home-btn" onClick={() => navigate("/signin")}>
            Sign In
          </button>

          <button className="home-btn-filled" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="wave"></div>
    </div>
  );
};

export default Home;
