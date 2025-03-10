const express = require("express");
const {
  fetchUserData,
  updateUserData,
  updateUserPassword,
} = require("../../controllers/user/user-controller");

const userRouter = express.Router();

userRouter.get("/getUserData/:userId", fetchUserData);
userRouter.put("/updateUserData/:userId", updateUserData);
userRouter.put("/updateUserPassword/:userId", updateUserPassword);

module.exports = userRouter;
