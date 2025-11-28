import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cuisines.css";

// Import images
import indianImg from "../assets/indianfood.png";
import italianImg from "../assets/italianimage.png";
import japaneseImg from "../assets/japaneseimage.png";
import chineseImg from "../assets/chineseimage.png";
import mexicanImg from "../assets/mexicanimage.png";
import frenchImg from "../assets/frenchimage.png";

export default function Cuisines() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const cuisines = [
    {
      name: "Indian",
      tagline: "Spices, colors & rich traditional flavors",
      image: indianImg,
    },
    {
      name: "Italian",
      tagline: "Pasta, cheese, herbs & pure comfort",
      image: italianImg,
    },
    {
      name: "Japanese",
      tagline: "Elegance, balance & umami perfection",
      image: japaneseImg,
    },
    {
      name: "Chinese",
      tagline: "Bold flavors, wok-fried magic",
      image: chineseImg,
    },
    {
      name: "Mexican",
      tagline: "Tacos, chilies & fiesta of taste",
      image: mexicanImg,
    },
    {
      name: "French",
      tagline: "Luxury cooking & world-class techniques",
      image: frenchImg,
    },
  ];

  const filtered = cuisines.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  function openCuisine(cuisine) {
    navigate(`/cuisine/${cuisine.name.toLowerCase()}`, {
      state: { cuisine },
    });
  }

  return (
    <div className="cuisine-page-wrapper">

      <h1 className="cuisine-title">Explore World Cuisines</h1>

      <input
        type="text"
        className="cuisine-search"
        placeholder="Search cuisines—Italian, Indian, Chinese..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="cuisine-grid">
        {filtered.map((cuisine, idx) => (
          <div
            key={idx}
            className="cuisine-card"
            onClick={() => openCuisine(cuisine)}
          >
            <img src={cuisine.image} alt={cuisine.name} className="cuisine-img" />

            <h3 className="cuisine-name">{cuisine.name}</h3>
            <p className="cuisine-tagline">{cuisine.tagline}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
