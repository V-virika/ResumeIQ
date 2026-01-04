const mongoose = require("mongoose");

const RecommendationSchema = new mongoose.Schema({
  student_id: mongoose.Schema.Types.ObjectId,
  missing_skills: [String],
  suggested_courses: [String],
  suggested_roles: [String],
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Recommendation", RecommendationSchema);
