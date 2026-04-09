const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isCompleted: { type: Boolean, default: false }
});

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    goal: {
      type: String,
      required: [true, "A goal is required"],
      trim: true,
    },
    duration: {
      type: Number, // Duration in minutes
      required: true,
      default: 25,
    },
    timeSpent: {
      type: Number, // Actual time spent in seconds
      default: 0,
    },
    status: {
      type: String,
      enum: ["planned", "active", "completed", "failed"],
      default: "planned",
    },
    subtasks: [subtaskSchema],
    reflection: {
      type: String,
      default: "",
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Session", sessionSchema);
