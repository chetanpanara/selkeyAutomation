const express = require("express");

const {
  createFolder,
  getAllFolders,
  deleteFolder,
  updateFolder,
} = require("../../controllers/user/folder-controller");

const router = express.Router();

router.post("/createfolder/:userId", createFolder);
router.get("/getallfolders/:userId", getAllFolders);
router.delete("/deletefolder/:userId/:folderId", deleteFolder);
router.put("/updatefolder/:userId/:folderId", updateFolder);

module.exports = router;
