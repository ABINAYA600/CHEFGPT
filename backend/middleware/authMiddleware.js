// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith("Bearer ")) {
      const token = auth.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id };
      return next();
    }
    return res.status(401).json({ message: "Not authorized, token missing" });
  } catch (err) {
    console.error("Auth Error:", err);
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};
