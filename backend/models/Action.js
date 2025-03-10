const mongoose = require("mongoose");

const ActionSchema = new mongoose.Schema(
  {
    appId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AppIntegration",
      required: true,
    },
    actionName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    actionType: {
      type: String,
      enum: ["API Call", "Database Update", "Send Email"],
      default: "API Call",
    },
    apiEndpoint: {
      type: String,
      default: "",
    }, // API to perform the action
    requestMethod: {
      type: String,
      enum: ["GET", "POST", "PUT", "DELETE"],
      default: "GET",
    },
    requestHeaders: {
      type: Object,
      default: {},
    },
    requestBodyTemplate: {
      type: Object,
      default: {},
    }, // JSON structure expected in API call
    sampleResponse: {
      type: Object,
      default: {},
    }, // Example response
  },
  { timestamps: true }
);

module.exports = mongoose.model("Action", ActionSchema);
