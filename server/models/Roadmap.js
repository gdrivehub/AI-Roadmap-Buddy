const mongoose = require("mongoose");

const stepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tasks: [{ type: String }],
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  order: { type: Number, default: 0 },
});

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
});

const roadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: false,
      default: "anonymous",
    },
    goal: { type: String, required: true, trim: true },
    timeline: { type: String, default: "" },
    steps: [stepSchema],
    resources: [resourceSchema],
    completionPercentage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-calculate completion percentage before save
roadmapSchema.pre("save", function (next) {
  if (this.steps && this.steps.length > 0) {
    const completed = this.steps.filter((s) => s.status === "completed").length;
    this.completionPercentage = Math.round((completed / this.steps.length) * 100);
  }
  next();
});

module.exports = mongoose.model("Roadmap", roadmapSchema);
