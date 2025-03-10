const mongoose = require("mongoose");

const executionLogSchema = new mongoose.Schema(
  {
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workflow",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    request: {
      type: mongoose.Schema.Types.Mixed, // store API request data
    },
    response: {
      type: mongoose.Schema.Types.Mixed, // store API response data
    },
  },
  { timestamps: true }
);

const ExecutionLog = mongoose.model("ExecutionLog", executionLogSchema);

module.exports = ExecutionLog;
