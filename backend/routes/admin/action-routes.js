const express = require("express");
const router = express.Router();
const {
  createAction,
  updateAction,
  deleteAction,
  getActions,
} = require("../../controllers/admin/action-controller");

router.post("/createAction/:appId", createAction);
router.put("/updateAction/:actionId", updateAction);
router.delete("/deleteAction/:actionId", deleteAction);
router.get("/getActions/:appId", getActions);

module.exports = router;
