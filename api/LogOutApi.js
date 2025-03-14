import express from "express";

const router = express.Router();

router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logout successful" });
});

export default router;
