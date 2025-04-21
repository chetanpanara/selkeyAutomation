const App = require("../../models/App");
const Trigger = require("../../models/Trigger");

// create new trigger
const createTrigger = async (req, res) => {
  try {
    const { appId } = req.params;
    const {
      triggerName,
      description,
      triggerType,
      apiEndpoint,
      requestHeaders,
      requestParams,
      sampleResponse,
    } = req.body;

    console.log("App ID:", appId);
    const findTrigger = await Trigger.findOne({
      appId: appId,
      triggerName: triggerName,
    });

    if (findTrigger) {
      return res.status(400).json({
        success: false,
        message: "Trigger already exists with this name",
      });
    }

    const trigger = await Trigger.create({
      appId: appId,
      triggerName,
      description: description || "",
      triggerType: triggerType || "Webhook",
      apiEndpoint: apiEndpoint || "",
      requestHeaders: requestHeaders || {},
      requestParams: requestParams || {},
      sampleResponse: sampleResponse || {},
    });

    res.status(201).json({
      success: true,
      message: "Trigger created successfully",
      data: trigger,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

// Update Trigger
const updateTrigger = async (req, res) => {
  try {
    const { triggerId } = req.params;
    const {
      triggerName,
      description,
      triggerType,
      apiEndpoint,
      requestHeaders,
      requestParams,
      sampleResponse,
    } = req.body;

    const trigger = await Trigger.findById(triggerId);

    if (!trigger) {
      return res.status(404).json({
        success: false,
        message: "Trigger not found",
      });
    }

    const updatedTrigger = await Trigger.findByIdAndUpdate(
      { _id: triggerId },
      {
        triggerName: triggerName || trigger.triggerName,
        description: description || trigger.description,
        triggerType: triggerType || trigger.triggerType,
        apiEndpoint: apiEndpoint || trigger.apiEndpoint,
        requestHeaders: requestHeaders || trigger.requestHeaders,
        requestParams: requestParams || trigger.requestParams,
        sampleResponse: sampleResponse || trigger.sampleResponse,
      },
      { new: true, select: " -_id -createdAt -updatedAt -__v" }
    );

    res.status(200).json({
      success: true,
      message: "Trigger updated successfully",
      data: updatedTrigger,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

// Delete Trigger
const deleteTrigger = async (req, res) => {
  try {
    const { triggerId } = req.params;
    const trigger = await Trigger.findById(triggerId);
    if (!trigger) {
      return res.status(404).json({
        success: false,
        message: "Trigger not found",
      });
    }
    await Trigger.findByIdAndDelete(triggerId);
    res.status(200).json({
      success: true,
      message: "Trigger deleted successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

// get triggers
const getTriggers = async (req, res) => {
  try {
    const { appId } = req.params;
    if (!appId) {
      return res.status(400).json({
        success: false,
        message: "App ID is required",
      });
    }
    const triggers = await Trigger.find({ appId: appId }).select(
      "-createdAt -updatedAt -__v"
    );
    console.log("Triggers :", triggers);

    if (triggers.length === 0) {
      return res.json({
        success: false,
        message: "No triggers found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Triggers fetched successfully",
      triggers,
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  createTrigger,
  updateTrigger,
  deleteTrigger,
  getTriggers,
};
