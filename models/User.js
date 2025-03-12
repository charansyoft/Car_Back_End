import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Prevent model recompilation
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User; // ✅ Use ES Modules export
