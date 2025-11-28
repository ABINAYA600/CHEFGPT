import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

/* -----------------------------------
      PUBLIC PAGES (NO LOGIN NEEDED)
   These pages DO NOT connect to backend
--------------------------------------*/
import Home from "./pages/Home";
import Signin from "./pages/Signin";      // → connects to backend POST /auth/signin
import Signup from "./pages/Signup";      // → connects to backend POST /auth/signup

/* -----------------------------------
   PROTECTED LAYOUT (SIDEBAR + TOPBAR)
   This wrapper checks JWT token before loading
   If token missing → redirect to /signin
--------------------------------------*/
import ProtectedLayout from "./layout/ProtectedLayout";

/* -----------------------------------
   FEATURE PAGES (backend connected)
--------------------------------------*/
import MealPrep from "./pages/Mealprep";        // → calls POST /api/ai/recipe
import Cuisines from "./pages/Cuisines";        // → calls GET /api/cuisines
import CuisineDetail from "./pages/CuisineDetail";  // → calls GET /api/cuisines/:id
import Doubts from "./pages/Doubts";            // → calls POST /api/doubts
import SavedRecipes from "./pages/Savedrecipes"; // → calls GET /api/recipes/saved
import Planner from "./pages/Planner";          // → calls POST/GET /api/planner
import OwnRecipe from "./pages/ownrecipe";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/forgot-password";
   // → calls POST /api/recipes/create

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* -----------------------------------
            PUBLIC ROUTES (NO TOKEN REQUIRED)
           These routes DO NOT require backend auth
        ------------------------------------ */}
        <Route path="/" element={<Home />} />

        {/* SIGNIN connects to backend: POST /api/auth/signin */}
        <Route path="/signin" element={<Signin />} />

        {/* SIGNUP connects to backend: POST /api/auth/signup */}
        <Route path="/signup" element={<Signup />} />

        {/* -----------------------------------
           PROTECTED ROUTES (REQUIRE JWT TOKEN)
           Backend validation happens inside:
           → ProtectedLayout (middleware)
           → Each page sends: Authorization: Bearer <token>
        ------------------------------------ */}
        <Route element={<ProtectedLayout />}>

          {/* CONNECTED TO BACKEND: POST /api/ai/recipe */}
          <Route path="/mealprep" element={<MealPrep />} />

          {/* CONNECTED TO BACKEND: GET /api/cuisines */}
          <Route path="/cuisines" element={<Cuisines />} />

          {/* CONNECTED TO BACKEND: GET /api/cuisines/:id */}
          <Route path="/cuisine/:id" element={<CuisineDetail />} />

          {/* CONNECTED TO BACKEND: POST /api/doubts */}
          <Route path="/doubts" element={<Doubts />} />

          {/* CONNECTED TO BACKEND: GET /api/recipes/saved */}
          <Route path="/saved" element={<SavedRecipes />} />

          {/* CONNECTED TO BACKEND: GET + POST /api/planner */}
          <Route path="/planner" element={<Planner />} />

          {/* CONNECTED TO BACKEND: POST /api/recipes/create */}
         <Route path="/ownrecipe" element={<OwnRecipe />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />



        </Route>

      </Routes>
    </BrowserRouter>
  );
}
