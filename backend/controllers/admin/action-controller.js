const Action = require("../../models/Action");

// create action
const createAction = async (req, res) => {
  try {
    const { appId } = req.params;
    const { actionName } = req.body;

    const action = await Action.findOne({
      appId: appId,
      actionName: actionName,
    });

    if (action) {
      return res.status(400).json({
        success: false,
        message: "Action with this name already exists in this app",
      });
    }
    const actionCreated = await Action.create({
      appId: appId,
      actionName: actionName,
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
          description: req.body.actionDescription || action.actionDescription,
          actionType: req.body.actionType || action.actionType,
          apiEndpoint: req.body.apiEndpoint || action.apiEndpoint,
          requestMethod: req.body.actionMethod || action.requestMethod,
          requestHeaders: req.body.actionHeaders || action.requestHeaders,
          requestBodyTemplate:
            req.body.actionBody || action.requestBodyTemplate,
          sampleResponse: req.body.actionResponse || action.sampleResponse,
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
  }
};

// delete action
const deleteAction = async (req, res) => {
  try {
    const { actionId } = req.params;
  } catch (e) {
    console.log(e);
  }
};

// get actions
const getActions = async (req, res) => {
  try {
    const { appId } = req.params;

    if (!appId) {
      return res.status(400).json({
        success: false,
        message: "App ID is required",
      });
    } else {
      const actions = await Action.find({ appId: appId }).select(
        "-createdAt -updatedAt -__v"
      );

      if (actions.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No actions found",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Actions fetched successfully",
          data: actions,
        });
      }
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  createAction,
  updateAction,
  deleteAction,
  getActions,
};
