import jwt from "jsonwebtoken";

// Middleware to protect routes by checking JWT token
export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Received Token:", token); // Debugging

  // If no token is provided, respond with an error
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // ✅ Check what's inside

    // If the token doesn't contain the userId, it's invalid
    if (!decoded.userId) {
      return res.status(401).json({ error: "Invalid token payload. User ID missing." });
    }

    // Attach the userId to the request object for further use in routes
    req.user = { _id: decoded.userId }; // Attach correct ID
    next(); // Continue to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token. Please log in again." });
  }
};

export default protect;
