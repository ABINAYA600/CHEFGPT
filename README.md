🍽️ ChefGPT – AI-Powered Cooking Assistant

Your personal AI chef that helps you generate recipes, plan meals, explore cuisines, ask cooking doubts, save dishes, and more!

🚀 Project Overview

ChefGPT is a full-stack AI application built using:

React.js (Frontend)

Node.js + Express (Backend)

MongoDB (Database)

OpenRouter / OpenAI-compatible models (AI recipes & cuisine logic)

This app allows users to:

✅ Generate recipes using AI
✅ Explore trending dishes in multiple cuisines
✅ Ask cooking doubts
✅ Save recipes to profile
✅ Plan weekly meals
✅ Create your own custom recipes
✅ Image analysis & step-by-step recipe generation (Coming soon)
✅ Authentication system (Signup, Sign-in, Reset password)

📌 Features
⭐ AI Features

🍳 AI Recipe Generator – Get clean, structured recipes with ingredients & steps

🌍 Cuisine Explorer – Browse cuisine-wise trending dishes

💬 AI Doubt Assistant – Ask any cooking question

🧠 Meal Planner – Generate meal plans based on your ingredients

⭐ User Features

🔐 Login / Signup (JWT Auth)

❤️ Save any AI-generated recipe

📚 View Saved Recipes

📅 Meal Planner Page

✏️ Custom recipe creation

🔄 Reset Password (local only, no email needed)

⭐ Coming Soon

🖼️ Image-based recipe analysis

🧑‍🍳 Step-by-step cooking detection from images

📸 Upload dish → Get recipe

🛠️ Tech Stack
Frontend

React.js

React Router

CSS

Lucide Icons

Backend

Node.js

Express.js

Multer

JWT Authentication

MongoDB

OpenRouter AI API

📂 Project Structure
CHEFGPT/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── server.js
│   └── .env (ignored)
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── .env (optional)
│
├── README.md
└── .gitignore

⚙️ Backend Setup

Go to backend folder:

cd backend
npm install


Create .env:

PORT=5000
MONGO_URL=your_mongo_url
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_api_key


Start backend:

npm start

🎨 Frontend Setup

Go to frontend folder:

cd frontend
npm install
npm start


Open:
👉 http://localhost:3000

🔐 Authentication Flow

User signs up

Password is hashed using bcrypt

JWT token is created

Token is stored in LocalStorage

Protected routes use ProtectedLayout.js





🗂️ GitHub Best Practices

.env files are ignored

node_modules ignored

Clear commit history

Professional folder structure

🤝 Contributing

Pull requests are welcome.
For major changes, open an issue first.

📜 License

This project is licensed under the MIT License.

⭐ Support the Project

If you like ChefGPT, please consider giving a ⭐ star on GitHub!