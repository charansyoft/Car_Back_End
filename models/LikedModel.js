import mongoose from "mongoose";

const LikedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Products", required: true },
  name: String,
  price: Number,
  description: String,
  image: String,
});

const LikedModel = mongoose.model("UserLiked", LikedSchema);
export default LikedModel;
