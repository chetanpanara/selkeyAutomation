const mongoose = require("mongoose");

const TriggerSchema = new mongoose.Schema(
  {
    appId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "App",
      required: true,
    },
    triggerName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    triggerType: {
      type: String,
      enum: ["Webhook", "Polling"],
      default: "Webhook",
    },
    apiEndpoint: {
      type: String,
      default: "",
    }, // API to fetch trigger data
    requestHeaders: {
      type: Object,
      default: {},
    }, // Optional headers
    requestParams: {
      type: Object,
      default: {},
    }, // Query params
    sampleResponse: {
      type: Object,
      default: {},
    }, // Example response
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trigger", TriggerSchema);
