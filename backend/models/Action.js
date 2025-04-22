const mongoose = require("mongoose");

const ActionSchema = new mongoose.Schema(
  {
    appId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "App",
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
    link: {
      type: String,
      default: "",
    },
    helpText: {
      type: String,
      default: "",
    },
    responseType: {
      type: String,
      default: "Simple",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Action", ActionSchema);
