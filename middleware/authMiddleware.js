import jwt from "jsonwebtoken";

// Middleware to protect routes by checking JWT token
export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Received Token:", token); // Debugging

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // ✅ Check what's inside

    if (!decoded.userId) {
      return res.status(401).json({ error: "Invalid token payload. User ID missing." });
    }

    // Attach user ID to request object
    req.user = { _id: decoded.userId };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token. Please log in again." });
  }
};

export default protect;
