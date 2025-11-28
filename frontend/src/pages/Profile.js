import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="profile-page">
      <div className="profile-card">

        {/* Close Icon */}
        <div className="profile-close" onClick={() => navigate(-1)}>
          <X size={22} />
        </div>

        {/* Avatar */}
        <div className="profile-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        {/* User Info */}
        <h2 className="profile-name">{user?.name}</h2>
        <p className="profile-email">{user?.email}</p>

        <p className="profile-joined">
          Member since: <span>2025</span>
        </p>

        {/* Action Buttons */}
        <div className="profile-actions">
          <button className="profile-btn">Edit Profile</button>
          <button className="profile-btn">Change Password</button>
        </div>

      </div>
    </div>
  );
}
