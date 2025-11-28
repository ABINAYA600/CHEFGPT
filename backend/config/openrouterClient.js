// backend/config/openrouterClient.js
import axios from "axios";

const client = axios.create({
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
  },
  timeout: 60000, // 60s timeout
});

export default client;
