const mongoose = require("mongoose");

const AppConnectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "App",
      required: true,
    },
    connectionName: {
      type: String,
      required: true,
    },
    authenticationData: {
      type: Object,
    }, // Stores OAuth tokens or API keys
  },
  { timestamps: true }
);

module.exports = mongoose.model("AppConnection", AppConnectionSchema);
