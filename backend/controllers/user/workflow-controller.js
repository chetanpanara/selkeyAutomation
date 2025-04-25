const Workflow = require("../../models/Workflow");
const Folder = require("../../models/Folder");
// create workflow
const createWorkflow = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { folderId, workflowName } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    if (!folderId) {
      return res.status(400).json({
        success: false,
        message: "Folder ID is required",
      });
    }

    if (!workflowName) {
      return res.status(400).json({
        success: false,
        message: "Workflow name is required",
      });
    }

    const workflow = new Workflow({
      userId: userId,
      folderId: folderId,
      workflowName: workflowName,
    });

    await workflow.save();
    res.status(201).json({
      success: true,
      message: "Workflow created successfully",
      workflow: workflow,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//fetch all user workflows folder wise
const getAllWorkflows = async (req, res) => {
  const { userId } = req.params;
  console.log(userId ,"userid in workflow controller");
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required",
    });
  }
  //fetch all folders for the user
  const folders = await Folder.find({ userId: userId });
  //fetch all workflows for the user
  const workflows = await Workflow.find({ userId: userId }).lean();
  //create an object with folderId as key and workflows as value
  const folderWorkflows = {};
  for (const folder of folders) {
    folderWorkflows[folder._id] = workflows.filter(
      (workflow) => workflow.folderId.toString() === folder._id.toString()
    );
  }
  res.status(200).json({
    success: true,
    message: "Workflows fetched successfully",
    folderWorkflows: folderWorkflows,
  });
};

// delete workflow
const deleteWorkflow = async (req, res) => {
  try {
    const { workflowId } = req.params;
    if (!workflowId) {
      return res.status(400).json({
        success: false,
        message: "Workflow ID is required",
      });
    }

    // Find the workflow
    const workflow = await Workflow.findById(workflowId);
    if (!workflow) {
      return res.status(404).json({
        success: false,
        message: "Workflow not found",
      });
    }

    // Find the trash folder for this user
    const trashFolder = await Folder.findOne({
      userId: workflow.userId,
      folderName: "Trash",
    });

    if (!trashFolder) {
      return res.status(404).json({
        success: false,
        message: "Trash folder not found",
      });
    }

    // Move the workflow to trash folder
    workflow.folderId = trashFolder._id;
    await workflow.save();

    res.status(200).json({
      success: true,
      message: "Workflow moved to trash successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// permanently delete workflow from trash folder
const permanentlyDeleteWorkflow = async (req, res) => {
  const { workflowId } = req.params;
  if (!workflowId) {
    return res.status(400).json({
      success: false,
      message: "Workflow ID is required",
    });
  }
  const workflow = await Workflow.findByIdAndDelete({ _id: workflowId });
  if (!workflow) {
    return res.status(404).json({
      success: false,
      message: "Workflow not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "Workflow permanently deleted successfully",
  });
};
// get workflow counts and into folder object
const getWorkflowCounts = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    const folders = await Folder.find({ userId: userId });

    // get counts of workflows in each folder
    const counts = {};
    for (const folder of folders) {
      counts[folder._id] = await Workflow.countDocuments({
        userId: userId,
        folderId: folder._id,
      });
    }
    res.status(200).json({
      success: true,
      message: "Folder with workflow counts fetched successfully",
      counts: counts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete multiple workflows
const deleteMultipleWorkflows = async (req, res) => {
  try {
    const { workflowIds } = req.body;

    if (!workflowIds || workflowIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No workflows selected for deletion.",
      });
    }

    await Workflow.deleteMany({ _id: { $in: workflowIds } });

    res.status(200).json({
      success: true,
      message: "Workflows deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting workflows:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete workflows.",
    });
  }
};

// enable workflows
const enableWorkflows = async (req, res) => {
  try {
    const { workflowIds } = req.body;

    if (!workflowIds || workflowIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No workflows selected for enabling.",
      });
    }

    await Workflow.updateMany(
      { _id: { $in: workflowIds } },
      { $set: { status: "active" } }
    );

    res.status(200).json({
      success: true,
      message: "Workflows enabled successfully.",
    });
  } catch (error) {
    console.error("Error enabling workflows:", error);
    res.status(500).json({
      success: false,
      message: "Failed to enable workflows.",
    });
  }
};

// disable workflows
const disableWorkflows = async (req, res) => {
  try {
    const { workflowIds } = req.body;

    if (!workflowIds || workflowIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No workflows selected for disabling.",
      });
    }

    await Workflow.updateMany(
      { _id: { $in: workflowIds } },
      { $set: { status: "inactive" } }
    );

    res.status(200).json({
      success: true,
      message: "Workflows disabled successfully.",
    });
  } catch (error) {
    console.error("Error disabling workflows:", error);
    res.status(500).json({
      success: false,
      message: "Failed to disable workflows.",
    });
  }
};

// Add these to your module.exports
module.exports = {
  createWorkflow,
  getAllWorkflows,
  deleteWorkflow,
  getWorkflowCounts,
  permanentlyDeleteWorkflow,
  deleteMultipleWorkflows,
  enableWorkflows,
  disableWorkflows,
};
