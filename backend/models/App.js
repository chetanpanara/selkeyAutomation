const mongoose = require("mongoose");

const AppSchema = new mongoose.Schema(
  {
    appName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    logoUrl: {
      type: String,
      default: "",
    },
    authenticationType: {
      type: mongoose.Schema.Types.Mixed,
    },
    authConfig: {
      type: Object,
      default: {},
    }, // Stores OAuth details or API key structure
  },
  { timestamps: true }
);

module.exports = mongoose.model("App", AppSchema);
