const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: String,
  email: String,
  university: String,
  branch: String,
  cgpa: Number,
  resume_id: mongoose.Schema.Types.ObjectId,
  career_goal: String,
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Student", StudentSchema);
