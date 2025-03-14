import mongoose from "mongoose";

const contactUsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
});

// Prevent model recompilation
const ContactUs = mongoose.models.ContactUs || mongoose.model("ContactUs", contactUsSchema);

export default ContactUs;