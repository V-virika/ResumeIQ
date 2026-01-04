const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  student_id: mongoose.Schema.Types.ObjectId,
  text_content: String,
  skills: [String],
  experience: [String],
  education: [String],
  certifications: [String],
  uploaded_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Resume", ResumeSchema);
