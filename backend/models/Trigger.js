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
    link: {
      type: String,
      default: "",
    },
    triggerType: {
      type: String,
      default: "",
    },
    responseType: {
      type: String,
      enum: ["Simple", "Advance"],
      default: "Simple",
    }, // Example response
    instructions: {
      type: String,
      default: "",
    },
    helptext: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trigger", TriggerSchema);
