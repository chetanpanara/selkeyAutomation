const express = require("express");
const router = express.Router();
const { upload } = require("../../helpers/cloudinary");
const appController = require("../../controllers/admin/app-controller");

const { handleImageUpload } = require("../../controllers/admin/app-controller");

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/addApp", appController.addNewApp);
router.put("/updateApp/:id", appController.updateApp);
router.get("/getAllApps", appController.getAllApps);
router.delete("/deleteApp/:id", appController.deleteApp);

module.exports = router;
