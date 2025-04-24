const Folder = require("../../models/Folder");
const Workflow = require("../../models/Workflow");

// Create a new folder
const createFolder = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { folderName } = req.body;
    // Validate inputs
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    if (!folderName) {
      return res.status(400).json({
        success: false,
        message: "Folder name is required",
      });
    }
    // Check if folder with same name exists under the same parent
    const existingFolder = await Folder.findOne({
      userId,
      folderName: { $regex: new RegExp(`^${folderName}$`, "i") },
    }).lean();

    if (existingFolder) {
      return res.status(400).json({
        success: false,
        message: "Folder with this name already exists in this location",
      });
    }

    // Create new folder with null parentFolder if none is specified
    const newFolder = new Folder({
      userId,
      folderName,
      isSpecial: false,
    });

    await newFolder.save();
    return res.status(201).json({
      success: true,
      message: "Folder created successfully",
      data: newFolder,
    });
  } catch (error) {
    console.error("Error in createFolder:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all folders
const getAllFolders = async (req, res) => {
  try {
    const { userId } = req.params;
    const folders = await Folder.find({ userId }).select(
      "_id folderName isSpecial workflows"
    );

    return res.status(200).json({
      success: true,
      folders,
    });
  } catch (error) {
    console.error("Error in getAllFolders:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update a folder
const updateFolder = async (req, res) => {
  try {
    const { userId, folderId } = req.params;
    const { folderName } = req.body;

    if (!userId || !folderId) {
      return res.status(400).json({
        success: false,
        message: "User ID and folder ID are required",
      });
    }

    const folder = await Folder.findById({
      _id: folderId,
      userId,
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    if (!folderName || folderName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Folder name is required",
      });
    }
    const existingFolder = await Folder.findOne({
      folderName: { $regex: new RegExp(`^${folderName}$`, "i") },
      userId,
      _id: { $ne: folderId },
    });
    if (existingFolder) {
      return res.status(400).json({
        success: false,
        message: "Folder already exists with this name",
      });
    }

    // update the folder name
    const updatedFolder = await Folder.findOneAndUpdate(
      {
        _id: folderId,
        userId,
      },
      { folderName },
      { new: true }
    );

    // update all workflows that are in the folder
    await Workflow.updateMany(
      { folderId: folderId },
      { $set: { folderId: updatedFolder._id } }
    );

    res.status(200).json({
      success: true,
      data: updatedFolder,
      message: "Folder updated successfully",
    });
  } catch (error) {
    console.log("error in update folder", error);
    res.status(500).json({
      success: false,
      message: "Failed to update folder",
    });
  }
};

// Delete a folder
const deleteFolder = async (req, res) => {
  try {
    const { userId, folderId } = req.params;
    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    if (folder.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // delete all workflows that are in the folder
    await Workflow.deleteMany({ folderId: folderId });
    // delete the folder
    await Folder.findOneAndDelete({
      _id: folderId,
      userId,
    });
    // log the folder deleted
    console.log("folder deleted");
    res.status(200).json({
      success: true,
      message: "Folder and Associated workflows deleted successfully",
    });
  } catch (error) {
    console.log("error in delete folder", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete folder",
    });
  }
};

module.exports = {
  createFolder,
  getAllFolders,
  deleteFolder,
  updateFolder,
};
