import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function ProtectedLayout() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        background: "linear-gradient(160deg, #1a0b2e, #0b0a14)",
        display: "flex",
      }}
    >
      {/* FULL HEIGHT SIDEBAR */}
      <Sidebar />

      {/* PAGE CONTENT */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
