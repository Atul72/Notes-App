const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A note must have a title"],
    maxlength: 100,
  },
  content: {
    type: String,
    required: [true, "A note must have a content."],
    maxlength: [2000, "Note must not be greater than 2000 words."],
  },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const Note = new mongoose.model("Note", notesSchema);

module.exports = Note;
