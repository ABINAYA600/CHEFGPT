import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", form);
      alert("Signup successful!");
      navigate("/signin");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-page">
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: Math.random() * 100 + "%",
            animationDuration: 5 + Math.random() * 6 + "s",
            animationDelay: -Math.random() * 6 + "s",
          }}
        />
      ))}

      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          name="name"
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Sign Up</button>

        <p
          style={{ color: "#ddd", cursor: "pointer", marginTop: "12px" }}
          onClick={() => navigate("/signin")}
        >
          Already have an account? Sign In
        </p>
      </form>
    </div>
  );
};

export default Signup;
