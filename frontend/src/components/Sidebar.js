import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Utensils, List, Save, Menu, Calendar, PenTool } from "lucide-react";
import logo from "../assets/logo.png";
import "./Sidebar.css";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/signin";
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-inner">

        {/* LOGO + TITLE */}
        <div className="side-header">
          <img src={logo} alt="logo" className="side-logo" />
          {!collapsed && <h2 className="side-title">ChefGPT</h2>}
        </div>

        {/* TOGGLE BUTTON */}
        <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
          <Menu size={22} />
        </button>

        {/* MENU LIST */}
        <ul className="nav-list">
          <li><Link to="/mealprep"><Home size={18} /> {!collapsed && <span>Meal Prep</span>}</Link></li>
          <li><Link to="/cuisines"><Utensils size={18} /> {!collapsed && <span>Cuisines</span>}</Link></li>
          <li><Link to="/doubts"><List size={18} /> {!collapsed && <span>Doubts</span>}</Link></li>
          <li><Link to="/saved"><Save size={18} /> {!collapsed && <span>Saved Recipes</span>}</Link></li>
          <li><Link to="/planner"><Calendar size={18} /> {!collapsed && <span>Planner</span>}</Link></li>
          <li><Link to="/ownrecipe"><PenTool size={18} /> {!collapsed && <span>Create Recipe</span>}</Link></li>
        </ul>
      </div>

      {/* ========================
         PROFILE ICON AT BOTTOM
      ========================= */}
      <div className="sidebar-profile">
        <div 
          className="sidebar-profile-icon" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        {/* DROPDOWN MENU */}
        {menuOpen && (
          <div className={`sidebar-profile-menu ${collapsed ? "collapsed-menu" : ""}`}>
            <p onClick={() => navigate("/profile")}>My Profile</p>
            <p onClick={handleLogout}>Logout</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
