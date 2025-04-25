const express = require("express");
const router = express.Router();
const {
  createWorkflow,
  getAllWorkflows,
  deleteWorkflow,
  getWorkflowCounts,
  permanentlyDeleteWorkflow,
  deleteMultipleWorkflows,
} = require("../../controllers/user/workflow-controller");

router.post("/createworkflow/:userId", createWorkflow);
router.get("/getallworkflows/:userId", getAllWorkflows);
router.put("/deleteworkflow/:workflowId", deleteWorkflow);
router.delete(
  "/permanentlydeleteworkflow/:workflowId",
  permanentlyDeleteWorkflow
);
router.get("/getworkflowcounts/:userId", getWorkflowCounts);
router.post("/deletemultiple", deleteMultipleWorkflows);

module.exports = router;
