import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserData,
  updateUserData,
  updateUserPassword,
} from "../../store/slices/user-slice";
import { TextField, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
const tabs = [
  { id: "profile", label: "Profile" },
  { id: "password", label: "Password" },
  { id: "settings", label: "Settings" },
];
const countryStates = {
  "United States": [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
  ],
  Canada: [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Nova Scotia",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
  ],
  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
  Australia: [
    "New South Wales",
    "Queensland",
    "South Australia",
    "Tasmania",
    "Victoria",
    "Western Australia",
    "Northern Territory",
    "Australian Capital Territory",
  ],
  India: [
    "Andhra Pradesh",
    "Gujarat",
    "Karnataka",
    "Kerala",
    "Maharashtra",
    "Punjab",
    "Tamil Nadu",
    "Uttar Pradesh",
    "West Bengal",
    "Delhi",
  ],
};
const initialFormData = {
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  state: "",
  country: "",
  contact: "",
};
const initialPasswordData = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const Myaccount = () => {
  //fetch user data
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [availableStates, setAvailableStates] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState(initialFormData);
  const [passwordData, setPasswordData] = useState(initialPasswordData);

  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    setAvailableStates(countryStates[formData.country] || []);
    if (!countryStates[formData.country]?.includes(formData.state)) {
      setFormData((prev) => ({ ...prev, state: "" }));
    }
  }, [formData.country]);

  useEffect(() => {
    const storedTab = localStorage.getItem("activeTab");
    if (storedTab) {
      setActiveTab(storedTab);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    try {
      dispatch(getUserData(user?.id))
        .unwrap()
        .then((res) => {
          if (res.success && res.data) {
            const newFormData = {
              firstName: res.data?.firstName || "",
              lastName: res.data?.lastName || "",
              address: res.data?.address || "",
              city: res.data?.city || "",
              state: res.data?.state || "",
              country: res.data?.country || "",
              contact: res.data?.contact || "",
            };
            setFormData(newFormData);
            // Set available states based on the country from API
            if (res.data.userProfile?.country) {
              setAvailableStates(
                countryStates[res.data.userProfile.country] || []
              );
            }
          }
        });
    } catch (e) {
      console.log(e);
    }
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    localStorage.setItem("activeTab", tabId);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setFormData((prevState) => ({
      ...prevState,
      country: selectedCountry,
      state: "",
    }));
    setAvailableStates(countryStates[selectedCountry] || []);
  };
  function clearFormData() {
    setFormData(initialFormData);
    setPasswordData(initialPasswordData);
  }

  async function handleUpdateUserData(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    try {
      dispatch(updateUserData({ userId: user.id, data }))
        .unwrap()
        .then((res) => {
          if (res.success) {
            alert(res.message || "Profile updated successfully");
            window.location.reload();
          } else {
            alert(res.message || "Failed to update profile");
          }
        })
        .catch((error) => {
          alert(
            error?.message || "Something went wrong while updating profile"
          );
          console.error("Profile update error:", error);
        });
    } catch (error) {
      alert(error?.message || "Something went wrong while updating profile");
      console.error("Profile update error:", error);
    }
  }

  async function handleUpdatePassword(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (data.newPassword !== data.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    try {
      const response = await dispatch(
        updateUserPassword({
          userId: user.id,
          data: {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          },
        })
      ).unwrap();

      if (response.success) {
        alert(response.message || "Password updated successfully");
        clearFormData();
      } else {
        alert(response.message || "Failed to update password");
      }
    } catch (error) {
      alert(error?.message || "Something went wrong while updating password");
      console.error("Password update error:", error);
    }
  }

  return (
    <div className="bg-slate-100 p-2 shadow-md w-full">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="block">
          <p className="font-semibold text-3xl mb-4">My Account</p>
          <div className="block">
            <span className="text-gray-500 text-sm">
              Manage your account settings and preferences here.
            </span>
          </div>
          <br />
          <br />
          <div>
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
              <ul
                className="flex flex-wrap -mb-px text-sm font-medium text-center"
                role="tablist"
              >
                {tabs.map((tab) => (
                  <li className="me-2" role="presentation" key={tab.id}>
                    <button
                      className={`inline-block p-4 border-b-2 rounded-t-lg ${
                        activeTab === tab.id
                          ? "text-blue-700 border-blue-700 dark:text-white"
                          : "hover:text-blue-700 hover:border-gray-300 dark:hover:text--300"
                      }`}
                      onClick={() => handleTabChange(tab.id)}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      title={tab.tooltip}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {activeTab === "profile" && (
                <form className="w-full " onSubmit={handleUpdateUserData}>
                  <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-5 group">
                      <TextField
                        label="First Name"
                        variant="outlined"
                        name="firstName"
                        size="small"
                        className="block w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                      <TextField
                        label="Last Name"
                        variant="outlined"
                        name="lastName"
                        size="small"
                        className="block w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="relative z-0 w-full mb-5 group">
                    <TextField
                      label="Address"
                      variant="outlined"
                      name="address"
                      size="small"
                      className="block w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-5 group">
                      <TextField
                        label="City"
                        variant="outlined"
                        name="city"
                        size="small"
                        className="block w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            city: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                      <FormControl fullWidth size="small" className="mb-5">
                        <InputLabel id="country-label">Country</InputLabel>
                        <Select
                          labelId="country-label"
                          id="country-select"
                          name="country"
                          value={formData.country}
                          label="Country"
                          onChange={handleCountryChange}
                          className="block w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
                        >
                          {Object.keys(countryStates).map((country) => (
                            <MenuItem key={country} value={country}>
                              {country}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-5 group">
                      <FormControl fullWidth size="small" className="mb-5">
                        <InputLabel id="state-label">State/Province</InputLabel>
                        <Select
                          labelId="state-label"
                          id="state-select"
                          name="state"
                          value={formData.state}
                          label="State/Province"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              state: e.target.value,
                            })
                          }
                          className="block w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
                        >
                          <MenuItem value="">
                            <em>Select State/Province</em>
                          </MenuItem>
                          {availableStates.map((state) => (
                            <MenuItem key={state} value={state}>
                              {state}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                      <TextField
                        label="Contact Number"
                        variant="outlined"
                        name="contact"
                        size="small"
                        className="block w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
                        value={formData.contact}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Save
                  </button>
                </form>
              )}

              {activeTab === "password" && (
                <div className="p-4 rounded-lg bg-gray-50">
                  <form className="w-full" onSubmit={handleUpdatePassword}>
                    <div className="relative z-0 w-full mb-5 group">
                      <TextField
                        label="Current Password"
                        variant="outlined"
                        type={showPassword.current ? "text" : "password"}
                        name="currentPassword"
                        size="small"
                        required
                        className="block w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-3 top-3"
                      >
                        {showPassword.current ? <FaEye /> : <FaEyeSlash />}
                      </button>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                      <TextField
                        label="New Password"
                        variant="outlined"
                        type={showPassword.new ? "text" : "password"}
                        name="newPassword"
                        size="small"
                        required
                        className="block w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute right-3 top-3"
                      >
                        {showPassword.new ? <FaEye /> : <FaEyeSlash />}
                      </button>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                      <TextField
                        label="Confirm New Password"
                        variant="outlined"
                        type={showPassword.confirm ? "text" : "password"}
                        name="confirmPassword"
                        size="small"
                        required
                        className="block w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-3 top-3"
                      >
                        {showPassword.confirm ? <FaEye /> : <FaEyeSlash />}
                      </button>
                    </div>
                    <button
                      type="submit"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                      Change Password
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="p-4 rounded-lg bg-gray-50">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-500">
                          Receive email updates about your account activity
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">
                          Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-gray-500">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Myaccount;
