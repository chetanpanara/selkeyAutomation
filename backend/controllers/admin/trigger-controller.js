const Trigger = require("../../models/Trigger");

// create new trigger
const createTrigger = async (req, res) => {
  try {
    const { appId } = req.params;
    const { triggerName } = req.body;
    console.log("appId :", appId);
    console.log("triggerName :", triggerName);

    const trigger = await Trigger.create({
      appId: appId,
      triggerName: triggerName,
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
      message: "Error occured",
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

    if (triggers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No triggers found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Triggers fetched successfully",
      data: triggers,
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
