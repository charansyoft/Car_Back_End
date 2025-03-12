const mongoose = require('mongoose');

const collabSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
});

// Prevent model recompilation
const Collab = mongoose.models.Collab || mongoose.model('Collab', collabSchema);

module.exports = Collab;
