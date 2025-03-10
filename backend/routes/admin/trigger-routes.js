const express = require("express");
const router = express.Router();
const {
  createTrigger,
  updateTrigger,
  deleteTrigger,
  getTriggers,
} = require("../../controllers/admin/trigger-controller");

router.post("/createTrigger/:appId", createTrigger);
router.put("/updateTrigger/:triggerId", updateTrigger);
router.delete("/deleteTrigger/:triggerId", deleteTrigger);
router.get("/getTriggers/:appId", getTriggers);

module.exports = router;
