const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    folderName: {
      type: String,
      required: true,
    },
    isSpecial: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Folder = mongoose.models.Folder || mongoose.model("Folder", folderSchema);

module.exports = Folder;
