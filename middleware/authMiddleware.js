import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Received Token:", token); // Debugging

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // ✅ Check what's inside

    if (!decoded.userId) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.user = { _id: decoded.userId }; // ✅ Attach correct ID
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default authMiddleware;
