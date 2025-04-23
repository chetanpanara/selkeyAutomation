const Action = require("../../models/Action");

// create action
const createAction = async (req, res) => {
  try {
    const { appId } = req.params;
    const { name } = req.body;

    console.log("id", appId);
    console.log("name", name);

    const action = await Action.findOne({
      appId: appId,
      actionName: name,
    });

    if (action) {
      return res.status(400).json({
        success: false,
        message: "Action with this name already exists in this app",
      });
    }
    const actionCreated = await Action.create({
      appId: appId,
      actionName: name,
    });

    res.status(201).json({
      success: true,
      message: "Action created successfully",
      data: actionCreated,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

// update action
const updateAction = async (req, res) => {
  try {
    const { actionId } = req.params;

    const action = await Action.findById(actionId);

    if (!action) {
      return res.status(404).json({
        success: false,
        message: "Action not found",
      });
    } else {
      const updatedAction = await Action.findByIdAndUpdate(
        { _id: actionId },
        {
          actionName: req.body.actionName || action.actionName,
          description: req.body.actionDescription || action.description,
          link: req.body.link || action.link,
          helpText: req.body.helpText || action.helpText,
          responseType: req.body.responseType || action.responseType,
        },
        { new: true, select: "-createdAt -updatedAt -__v" }
      );

      res.status(200).json({
        success: true,
        message: "Action updated successfully",
        data: updatedAction,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error updating action",
      error: e.message,
    });
  }
};

// delete action
const deleteAction = async (req, res) => {
  try {
    const { actionId } = req.params;
    
    const action = await Action.findById(actionId);
    
    if (!action) {
      return res.status(404).json({
        success: false,
        message: "Action not found",
      });
    }
    
    await Action.findByIdAndDelete(actionId);
    
    res.status(200).json({
      success: true,
      message: "Action deleted successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error deleting action",
      error: e.message,
    });
  }
};

// get actions
const getActions = async (req, res) => {
  try {
    const { appId } = req.params;
    console.log("appId", appId);

    if (!appId) {
      return res.status(400).json({
        success: false,
        message: "App ID is required",
      });
    } else {
      const actions = await Action.find({ appId: appId }).select();

      if (actions.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No actions found",
          actions: [],
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Actions fetched successfully",
          actions,
        });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error fetching actions",
      error: e.message,
    });
  }
};

module.exports = {
  createAction,
  updateAction,
  deleteAction,
  getActions,
};