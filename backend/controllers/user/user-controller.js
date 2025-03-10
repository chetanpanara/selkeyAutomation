const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const UserProfile = require("../../models/UserProfile");

//get user data
const fetchUserData = async (req, res) => {
  try {
    const { userId } = req.params;

    // fetch user data but not  _id
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    } else {
      // fetch user firstName and last name from User
      const userFirstName = user.firstName;
      const userLastName = user.lastName;

      // fetch user profile data
      const userProfile = await UserProfile.findOne({ userId: userId }).select(
        "address city state country contact -_id"
      );

      if (!userProfile) {
        return res.status(404).json({
          message: "User profile not found",
          success: false,
        });
      }
      // send response
      res.status(200).json({
        message: "User data fetched successfully",
        success: true,
        data: { userFirstName, userLastName, userProfile },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

//update user data
const updateUserData = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, address, city, state, country, contact } =
      req.body;

    // update user data
    const user = await User.findOne({ _id: userId });

    // check if user exists
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    } else {
      // update user
      await User.findOneAndUpdate(
        { _id: userId },
        { firstName, lastName },
        { new: true }
      );
      // update userProfile data
      await UserProfile.findOneAndUpdate(
        { userId: userId },
        {
          address,
          city,
          state,
          country,
          contact,
        },
        { new: true }
      );
      // send response
      res.status(200).json({
        message: "Profile updated successfully",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

//update user password
const updateUserPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    } else {
      // check if current password is correct
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isValidPassword) {
        return res.status(400).json({
          message: "Current password is incorrect",
          success: false,
        });
      }
      // check if new password is the same as the current password
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return res.status(400).json({
          message: "New password cannot be the same as the current password",
          success: false,
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { password: hashedPassword },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({
          message: "User not found",
          success: false,
        });
      }

      res.status(200).json({
        message: "Password updated successfully",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

module.exports = { fetchUserData, updateUserData, updateUserPassword };
