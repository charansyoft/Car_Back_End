const mongoose = require('mongoose');

const collabSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
});

module.exports = mongoose.model('Collab', collabSchema);
