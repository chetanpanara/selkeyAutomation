const { imageUploadUtil } = require("../../helpers/cloudinary");
const App = require("../../models/App");

// handle image upload
const handleImageUpload = async (req, res) => {
  try {
    console.log("upload image called");
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Error occurred during image upload:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred during image upload",
    });
  }
};

// Add a new App
const addNewApp = async (req, res) => {
  try {
    const { appName } = req.body;
    console.log("appName :", appName);

    if (!appName) {
      return res.status(400).json({
        success: false,
        message: "App Name is required",
      });
    }

    const newCreatedApp = new App({
      appName: appName,
      description: "",
      appLogo: "",
      authType: "",
    });

    await newCreatedApp.save();

    res.status(201).json({
      success: true,
      message: "App Creted successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

// Update a app
const updateApp = async (req, res) => {
  try {
    const { id } = req.params;
    const { appName, description, logoUrl, authenticationType, authConfig } =
      req.body;

    console.log("id :", id);
    console.log("appName :", appName);
    console.log("description :", description);
    console.log("logoUrl :", logoUrl);
    console.log("authenticationType :", authenticationType);
    console.log("authConfig :", authConfig);

    const app = await App.findById(id);

    if (!app) {
      return res.status(404).json({
        success: false,
        message: "App not found",
      });
    }

    const updatedApp = await App.findByIdAndUpdate(
      id,
      {
        appName: appName || app.appName,
        description: description || app.description,
        logoUrl: logoUrl || app.logoUrl,
        authenticationType: authenticationType || app.authenticationType,
        authConfig: authConfig || app.authConfig,
      },
      { new: true, select: " -_id -createdAt -updatedAt -__v" }
    );

    res.status(200).json({
      success: true,
      message: "App updated successfully",
      data: updatedApp,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

// Get all apps
const getAllApps = async (req, res) => {
  try {
    const apps = await App.find(
      {},
      "_id appName description appLogo authenticationType authConfig"
    );
    res.status(200).json({
      success: true,
      data: apps,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

// delete a app
const deleteApp = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        message: "Invalid app ID format",
      });
    }

    const app = await App.findById(id);
    if (!app) {
      return res.status(404).json({
        success: false,
        message: "App not found",
      });
    }

    await App.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "App deleted successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred while deleting app",
    });
  }
};

module.exports = {
  handleImageUpload,
  addNewApp,
  updateApp,
  getAllApps,
  deleteApp,
};
