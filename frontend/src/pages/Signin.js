import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://chefgpt-backend.onrender.com/api/auth/signin",
        form
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/mealprep");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">

      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Sign In</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

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

        <button type="submit">Sign In</button>

        <p
          style={{
            color: "#ddd",
            cursor: "pointer",
            marginTop: "10px",
            fontSize: "15px",
          }}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </p>

        <p
          style={{ color: "#ddd", cursor: "pointer", marginTop: "12px" }}
          onClick={() => navigate("/signup")}
        >
          Don't have an account? Sign Up
        </p>
      </form>
    </div>
  );
};

export default Signin;
