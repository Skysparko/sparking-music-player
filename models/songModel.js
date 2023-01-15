const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
  },
  duration: {
    type: String,
  },
  audience: {
    type: String,
  },
});

songSchema.index({ name: "name", artist: "artist" });

module.exports = mongoose.model("Song", songSchema);
