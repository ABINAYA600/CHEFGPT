// src/pages/ForgotPassword.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.email.trim()) return setError("Please enter your email.");
    if (form.password !== form.confirm)
      return setError("Passwords do not match.");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters.");

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          email: form.email,
          password: form.password,
        }
      );

      setLoading(false);

      if (res.data.success) {
        setSuccess("Password updated successfully!");
        setTimeout(() => navigate("/signin"), 1500);
      } else {
        setError(res.data.message || "Error resetting password");
      }
    } catch (err) {
      setLoading(false);
      setError("Error resetting password");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>

        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        {/* EMAIL FIELD REQUIRED */}
        <input
          name="email"
          type="email"
          placeholder="Enter your registered email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="New password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          name="confirm"
          type="password"
          placeholder="Confirm password"
          value={form.confirm}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>

        <p
          style={{ color: "#ccc", cursor: "pointer", marginTop: "10px" }}
          onClick={() => navigate("/signin")}
        >
          Back to Sign In
        </p>
      </form>
    </div>
  );
}
