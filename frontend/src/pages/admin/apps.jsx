import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FaCopy, FaCog, FaPlus, FaMinus } from "react-icons/fa";
import { IoMdCloudDone } from "react-icons/io";
import AppImageUpload from "@/components/admin/image-upload";
import { addNewApp, getAllApps, updateApp } from "@/store/slices/app-slice";
import { useSelector, useDispatch } from "react-redux";
import { MoreVertical } from "lucide-react";

const tabs = [
  { id: "appDetails", label: "App Details" },
  { id: "appStatus", label: "App Status" },
];

const authTypes = [
  { id: "noAuth", label: "No Auth" },
  { id: "oauth2", label: "OAuth 2.0" },
  { id: "oauth1", label: "OAuth 1.0" },
  { id: "basicAuth", label: "Basic Auth" },
  { id: "awsSignature", label: "AWS Signature" },
  {
    id: "basicAuthAccessResponseToken",
    label: "Basic Auth (Access Response Token)",
  },
  { id: "bearerToken", label: "Bearer Token" },
  { id: "parameters", label: "Parameters" },
];

function Apps() {
  const [isAddAppDialogOpen, setIsAddAppDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("appDetails");
  const [checkedAuthTypes, setCheckedAuthTypes] = useState(
    authTypes.reduce((acc, auth) => ({ ...acc, [auth.id]: false }), {})
  );
  const [copied, setCopied] = useState(false);
  const [isHeaderPrefixChecked, setIsHeaderPrefixChecked] = useState(false);
  const [showSetAuthParams, setShowSetAuthParams] = useState(false);
  const [showReceivedAuthParams, setShowReceivedAuthParams] = useState(false);
  const [setAuthParams, setSetAuthParams] = useState([""]);
  const [receivedAuthParams, setReceivedAuthParams] = useState([""]);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [currentParamIndex, setCurrentParamIndex] = useState(null);
  const [isRequestBodyChecked, setIsRequestBodyChecked] = useState(false);
  const [oauth2RedirectUrl, setOauth2RedirectUrl] = useState("");
  const [oauth1RedirectUrl, setOauth1RedirectUrl] = useState("");
  const [awsRedirectUrl, setAwsRedirectUrl] = useState("");
  const [CURLVersion, setCURLVersion] = useState("default");

  // image upload
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  // New App
  const [formDataApp, setFormDataApp] = useState({
    appName: "",
    description: "",
    appLogo: "",
    authType: "",
  });

  // New state for selected value
  const [selectedValue, setSelectedValue] = useState("default_value");
  // Add these new state variables
  const [grantType, setGrantType] = useState("authorization_code");
  const [basicAuthType, setBasicAuthType] = useState("basicAuth");

  const { apps } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const [activeApp, setActiveApp] = useState("");
  const [showDropdown, setShowDropdown] = useState(null); // Changed from object to null

  // Effect to handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-trigger")) {
        setShowDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to copy text
  const handleCopy = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Function to handle closing the Add App dialog
  function handleAddAppDialogClose() {
    return setIsAddAppDialogOpen(false);
  }

  // Function to handle saving app details
  const handleSaveAppDetails = () => {
    console.log("App details saved!");
    console.log("Active app:", activeApp._id);
    dispatch(updateApp({ appId: activeApp._id, formData: formDataApp }));
  };

  // Function to handle checkbox change
  const handleAuthTypeChange = (authId) => {
    setCheckedAuthTypes((prev) => ({
      ...prev,
      [authId]: !prev[authId], // Toggle the checkbox state
    }));
  };
  const handleHeaderPrefixChange = () => {
    setIsHeaderPrefixChecked((prev) => !prev);
  };

  // Function to handle checkbox change for Set App Auth Parameters
  const handleSetAuthParamsChange = () => {
    setShowSetAuthParams((prev) => !prev);
  };

  // Function to handle checkbox change for Received App Auth Parameters
  const handleReceivedAuthParamsChange = () => {
    setShowReceivedAuthParams((prev) => !prev);
  };

  // Function to handle adding a new input field for Set Auth Params
  const handleAddSetAuthParam = () => {
    setSetAuthParams((prev) => [...prev, ""]);
  };

  // Function to handle removing an input field for Set Auth Params
  const handleRemoveSetAuthParam = (index) => {
    if (setAuthParams.length > 1) {
      setSetAuthParams((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Function to handle adding a new input field for Received Auth Params
  const handleAddReceivedAuthParam = () => {
    setReceivedAuthParams((prev) => [...prev, ""]);
  };

  // Function to handle removing an input field for Received Auth Params
  const handleRemoveReceivedAuthParam = (index) => {
    if (receivedAuthParams.length > 1) {
      setReceivedAuthParams((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Function to handle opening the settings modal
  const handleOpenSettingsModal = (index) => {
    setCurrentParamIndex(index);
    setIsSettingsModalOpen(true);
  };

  // Function to handle closing the settings modal
  const handleCloseSettingsModal = () => {
    setIsSettingsModalOpen(false);
    setCurrentParamIndex(null);
  };

  // Function to handle delete app
  const handleDeleteApp = (appId) => {
    console.log("delete is clicked", appId);
  };
  // On click for create new app
  function onSubmitNewApp(event) {
    event.preventDefault();
    if (!formDataApp.appName) {
      toast.error("App name is required");
      return;
    }
    dispatch(addNewApp({ appName: formDataApp.appName })).then((data) => {
      if (data?.payload?.success) {
        dispatch(getAllApps());
        setIsAddAppDialogOpen(false);
        setFormDataApp({ appName: "" });
        setImageFile(null);
        alert("App created successfully");
        window.location.reload();
      }
    });
  }

  useEffect(() => {
    dispatch(getAllApps());
  }, [dispatch]);

  // New handleChange function
  const handleChange = (e) => {
    setSelectedValue(e.target.value);
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 md:px-4">
      {/* Header */}
      <div className="w-full mb-6">
        <div className="flex flex-col w-full gap-2 md:flex-row md:items-center md:justify-between">
          <h1 className="text-xl md:text-2xl font-semibold">Apps</h1>
        </div>
        <span className="text-sm text-gray-500 mt-2">
          Configure basic details associated with your app like App Name,
          Description, Logo, and Authentication method.
        </span>

        <Button
          className="bg-blue-500 text-white hover:bg-blue-600 lg:float-right mt-4  lg:mt-0 block"
          onClick={() => setIsAddAppDialogOpen(true)}
        >
          Create New App
        </Button>
      </div>

      {/* Dialog */}
      <Dialog open={isAddAppDialogOpen} onOpenChange={handleAddAppDialogClose}>
        <DialogContent className="p-4 sm:p-6 w-[95vw] max-w-md mx-auto">
          <h2 className="font-semibold text-xl mb-2">Create App</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                App Name
              </label>
              <input
                value={formDataApp.appName}
                onChange={(e) =>
                  setFormDataApp({ ...formDataApp, appName: e.target.value })
                }
                placeholder="Enter App name here"
                className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button
              className="w-full p-5 bg-blue-600 text-white hover:bg-blue-400"
              onClick={onSubmitNewApp}
            >
              Create App
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isSettingsModalOpen}
        onOpenChange={handleCloseSettingsModal}
      >
        <DialogContent className="w-[95vw] max-w-md mx-auto p-4">
          <h2 className="text-xl font-semibold mb-4">
            Settings for Parameter {currentParamIndex + 1}
          </h2>
          {/* Add your settings content here based on currentParamIndex */}
          <p>Configure settings for parameter at index {currentParamIndex}.</p>
          <Button onClick={handleCloseSettingsModal}>Close</Button>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="flex flex-col md:grid md:grid-cols-4 gap-4">
        {/* Sidebar */}
        <div className="w-full bg-white rounded-lg shadow-md p-4">
          <h2 className="text-md font-semibold mb-2">Apps</h2>
          <hr className="border-gray-300 mb-4" />
          {/* render Apps list here */}
          {apps.map((app) => (
            <div
              key={app._id}
              className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                activeApp === app._id ? "bg-blue-50" : ""
              }`}
              onClick={() => {
                console.log("App clicked:", app);
                setActiveApp(app._id);
                setFormDataApp({
                  appName: app.appName,
                  description: app.description,
                  appLogo: app.appLogo,
                  authType: app.authType,
                });
              }}
            >
              <span>{app.appName}</span>
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(showDropdown === app._id ? null : app._id);
                  }}
                  className="dropdown-trigger rounded hover:bg-gray-100 text-gray-500"
                >
                  <MoreVertical size={18} />
                </button>
                {showDropdown === app._id && (
                  <div className="absolute right-0 mt-1 w-24 bg-white shadow-md text-black bg-muted rounded-md text-sm">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteApp(app._id);
                        setShowDropdown(null);
                      }}
                      className="block w-full px-3 py-1.5 text-left hover:bg-gray-200"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="w-full md:col-span-3 bg-white rounded-lg shadow-md p-4 space-x-2">
          {/* Tabs */}
          <div className="w-full overflow-x-auto">
            <div className="border-b border-gray-200 min-w-full">
              <nav className="flex space-x-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`py-2 px-1 text-sm font-medium border-b-2 ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "appDetails" && (
            <div className="mt-4 space-y-4">
              {/* App Name */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  App Name <span className="text-red-500">(Required)</span>
                </label>
                <input
                  type="text"
                  value={formDataApp.appName}
                  onChange={(e) =>
                    setFormDataApp({ ...formDataApp, appName: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                  placeholder="Enter app name"
                />
              </div>

              {/* Description */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">(Required)</span>
                </label>
                <textarea
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                  rows="4"
                  placeholder="Enter app description"
                  value={formDataApp.description}
                  onChange={(e) =>
                    setFormDataApp({
                      ...formDataApp,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              {/* App Logo */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">(Required)</span>
                </label>
                <AppImageUpload
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  uploadedImageUrl={uploadedImageUrl}
                  setUploadedImageUrl={setUploadedImageUrl}
                  setImageLoadingState={setImageLoadingState}
                  imageLoadingState={imageLoadingState}
                  isEditMode={currentEditedId !== null}
                />
              </div>

              {/* Auth Type */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auth Type <span className="text-red-500">(Required)</span>
                </label>
                <div className="space-y-2">
                  {authTypes.map((auth) => (
                    // Render a checkbox for each auth type
                    <div
                      key={auth.id}
                      className="flex flex-col items-start p-2 hover:bg-gray-50 rounded"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="auth-type"
                          value={auth.id}
                          className="mt-1 mr-2"
                          checked={checkedAuthTypes[auth.id] || false}
                          onChange={() => handleAuthTypeChange(auth.id)}
                        />
                        <span className="text-sm">{auth.label}</span>
                        <a
                          href="#"
                          className="block text-sm text-blue-500 hover:underline ml-2"
                        >
                          Learn more
                        </a>
                      </div>
                      <div
                        className={`mt-2 ml-6 w-11/12 transition-all duration-300 ease-in-out transform origin-top ${
                          checkedAuthTypes[auth.id]
                            ? "scale-y-100 opacity-100 h-auto"
                            : "scale-y-0 opacity-0 h-0"
                        }`}
                      >
                        {/* Add a unique form for each auth type here */}
                        {auth.id === "oauth2" && (
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Grant Type
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <select
                              className="w-full rounded-md border border-gray-300 px-3 py-2 mb-3 outline-none focus:outline-blue-300"
                              value={grantType}
                              onChange={(e) => setGrantType(e.target.value)}
                            >
                              <option value="authorization_code">
                                Authorization Code
                              </option>
                              <option value="authorization_code_pkce">
                                Authorization Code with PKCE
                              </option>
                            </select>

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Redirect URL
                            </label>
                            <div className="flex items-center mb-3">
                              <input
                                type="text"
                                className="w-full border border-gray-300 px-3 py-2 rounded-l-md outline-none focus:outline-blue-300 focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                                placeholder="https://selkey.com/callback.url"
                                value={oauth2RedirectUrl}
                                onChange={(e) =>
                                  setOauth2RedirectUrl(e.target.value)
                                }
                              />
                              <button
                                onClick={() => handleCopy(oauth2RedirectUrl)}
                                className="inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-blue-700 rounded-r-md hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                                type="button"
                              >
                                {copied ? (
                                  <IoMdCloudDone className="w-6 h-6 transition-transform duration-400 transform hover:scale-125" />
                                ) : (
                                  <FaCopy className="w-6 h-6 transition-transform duration-400 transform hover:scale-125" />
                                )}
                              </button>
                            </div>

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Authorize URL{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 mb-3 outline-none focus:outline-blue-300"
                              placeholder="Authorize URL"
                            />

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Token URL{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 mb-3 outline-none focus:outline-blue-300"
                              placeholder="Token URL"
                            />

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Refresh Token URL{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 mb-3 outline-none focus:outline-blue-300"
                              placeholder="Refresh Token URL"
                            />

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Scope{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 mb-3 outline-none focus:outline-blue-300"
                              placeholder="Scope"
                            />

                            {/* New Checkboxes */}
                            <div className="mt-1 pl-1 w-11/12">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  className="mr-2"
                                  onChange={handleHeaderPrefixChange}
                                />
                                Set Header Prefix before{" "}
                                <span className="font-semibold ml-1">
                                  Access Token
                                </span>
                              </label>
                              {isHeaderPrefixChecked && (
                                <input
                                  type="text"
                                  className="w-[109%] rounded-md border border-gray-300 px-3 py-2 mt-2 outline-none focus:outline-blue-300 mb-2"
                                  placeholder="Enter header prefix e.g. Bearer"
                                />
                              )}
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                Send Client Secret On{" "}
                                <span className="font-semibold ml-1">
                                  Access Token
                                </span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                Send Client Credentials On
                                <span className="font-semibold ml-1">
                                  Refresh Token
                                </span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                Enable User-Agent
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                Refresh Access Token on Expiration
                              </label>
                            </div>

                            {/* Client Authentication Dropdown */}
                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Client Authentication{" "}
                                <span className="text-red-500">(Required)</span>
                              </label>
                              <select
                                className="w-full rounded-md border border-gray-300 px-3 py-2 mb-3 outline-none focus:outline-blue-300"
                                value={basicAuthType}
                                onChange={(e) =>
                                  setBasicAuthType(e.target.value)
                                }
                              >
                                <option value="basicAuth">
                                  Send as Basic Auth header
                                </option>
                                <option value="clientCredentials">
                                  Send Client Credentials in body
                                </option>
                              </select>
                            </div>

                            {/* Checkboxes and Input Fields */}
                            <div className="mt-4 pl-2 w-11/12">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  className="mr-2"
                                  onChange={handleSetAuthParamsChange}
                                />
                                Set App Auth Parameters
                              </label>
                              {showSetAuthParams && (
                                <>
                                  {setAuthParams.map((param, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center mt-2"
                                    >
                                      <input
                                        type="text"
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                                        placeholder="Enter parameter key e.g. subdomain"
                                        value={param}
                                        onChange={(e) => {
                                          const newParams = [...setAuthParams];
                                          newParams[index] = e.target.value;
                                          setSetAuthParams(newParams);
                                        }}
                                      />
                                      <div className="flex items-end ml-2">
                                        <FaCog
                                          className="cursor-pointer text-gray-500 hover:text-blue-600"
                                          onClick={() =>
                                            handleOpenSettingsModal(index)
                                          }
                                        />
                                        <FaMinus
                                          className="ml-2 cursor-pointer text-gray-500 hover:text-blue-600"
                                          onClick={() =>
                                            handleRemoveSetAuthParam(index)
                                          }
                                        />
                                        <FaPlus
                                          className="ml-2 cursor-pointer text-gray-500 hover:text-blue-600"
                                          onClick={handleAddSetAuthParam}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </>
                              )}

                              <label className="flex items-center mt-4">
                                <input
                                  type="checkbox"
                                  className="mr-2"
                                  onChange={handleReceivedAuthParamsChange}
                                />
                                Received App Auth Parameters
                              </label>
                              {showReceivedAuthParams && (
                                <>
                                  {receivedAuthParams.map((param, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center mt-2"
                                    >
                                      <input
                                        type="text"
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                                        placeholder="Enter parameter key e.g. subdomain"
                                        value={param}
                                        onChange={(e) => {
                                          const newParams = [
                                            ...receivedAuthParams,
                                          ];
                                          newParams[index] = e.target.value;
                                          setReceivedAuthParams(newParams);
                                        }}
                                      />
                                      <div className="flex items-center ml-6">
                                        <FaMinus
                                          className="ml-2 cursor-pointer text-gray-500 hover:text-blue-600"
                                          onClick={() =>
                                            handleRemoveReceivedAuthParam(index)
                                          }
                                        />
                                        <FaPlus
                                          className="ml-2 cursor-pointer text-gray-500 hover:text-blue-600"
                                          onClick={handleAddReceivedAuthParam}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </>
                              )}
                            </div>
                          </div>
                        )}
                        {auth.id === "oauth1" && (
                          <div className="mt-1 space-y-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Redirect URL
                            </label>
                            <div className="flex items-center mb-3">
                              <input
                                type="text"
                                className="w-full border border-gray-300 px-3 py-2 rounded-l-md outline-none focus:outline-blue-300 focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                                placeholder="https://selkey.com/callback.url"
                                value={oauth1RedirectUrl}
                                onChange={(e) =>
                                  setOauth1RedirectUrl(e.target.value)
                                }
                              />
                              <button
                                onClick={() => handleCopy(oauth1RedirectUrl)}
                                className="inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-blue-700 rounded-r-md hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                                type="button"
                              >
                                {copied ? (
                                  <IoMdCloudDone className="w-6 h-6 transition-transform duration-400 transform hover:scale-125" />
                                ) : (
                                  <FaCopy className="w-6 h-6 transition-transform duration-400 transform hover:scale-125" />
                                )}
                              </button>
                            </div>

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Authorize URL{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 mb-3 outline-none focus:outline-blue-300"
                              placeholder="Authorize URL"
                            />

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Request Token URL{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              placeholder="Request Token URL"
                            />

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Access Token URL{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              placeholder="Access Token URL"
                            />
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Consumer Key{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              placeholder="Consumer Key"
                            />

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Consumer Secret{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              placeholder="Consumer Secret"
                            />

                            {/* New Checkbox for Encoding Parameters */}
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="mr-2"
                                // Add state handling if needed
                              />
                              <span className="text-sm">
                                Encode the parameters in the Authorization
                                header
                              </span>
                            </div>

                            {/* New Dropdown for Signature Method */}
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Signature Method{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <select className="w-full rounded-md border border-gray-300 px-3 py-2 mb-3 outline-none focus:outline-blue-300">
                              <option value="HMAC-SHA1" selected>
                                HMAC-SHA1
                              </option>
                              {/* Add more options if needed */}
                            </select>

                            {/* Checkboxes and Input Fields for OAuth1 */}
                            <div className="mt-4 pl-2 w-11/12">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  className="mr-2"
                                  onChange={handleSetAuthParamsChange}
                                />
                                Set App Auth Parameters
                              </label>
                              {showSetAuthParams && (
                                <>
                                  {setAuthParams.map((param, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center mt-2"
                                    >
                                      <input
                                        type="text"
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                                        placeholder="Enter parameter key e.g. subdomain"
                                        value={param}
                                        onChange={(e) => {
                                          const newParams = [...setAuthParams];
                                          newParams[index] = e.target.value;
                                          setSetAuthParams(newParams);
                                        }}
                                      />
                                      <div className="flex items-end ml-2">
                                        <FaCog
                                          className="cursor-pointer text-gray-500 hover:text-blue-600"
                                          onClick={() =>
                                            handleOpenSettingsModal(index)
                                          }
                                        />
                                        <FaMinus
                                          className="ml-2 cursor-pointer text-gray-500 hover:text-blue-600"
                                          onClick={() =>
                                            handleRemoveSetAuthParam(index)
                                          }
                                        />
                                        <FaPlus
                                          className="ml-2 cursor-pointer text-gray-500 hover:text-blue-600"
                                          onClick={handleAddSetAuthParam}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </>
                              )}

                              <label className="flex items-center mt-4">
                                <input
                                  type="checkbox"
                                  className="mr-2"
                                  onChange={handleReceivedAuthParamsChange}
                                />
                                Received App Auth Parameters
                              </label>
                              {showReceivedAuthParams && (
                                <>
                                  {receivedAuthParams.map((param, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center mt-2"
                                    >
                                      <input
                                        type="text"
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                                        placeholder="Enter parameter key e.g. subdomain"
                                        value={param}
                                        onChange={(e) => {
                                          const newParams = [
                                            ...receivedAuthParams,
                                          ];
                                          newParams[index] = e.target.value;
                                          setReceivedAuthParams(newParams);
                                        }}
                                      />
                                      <div className="flex items-center ml-6">
                                        <FaMinus
                                          className="ml-2 cursor-pointer text-gray-500 hover:text-blue-600"
                                          onClick={() =>
                                            handleRemoveReceivedAuthParam(index)
                                          }
                                        />
                                        <FaPlus
                                          className="ml-2 cursor-pointer text-gray-500 hover:text-blue-600"
                                          onClick={handleAddReceivedAuthParam}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </>
                              )}
                            </div>
                          </div>
                        )}
                        {auth.id === "basicAuth" && (
                          <div className="mt-1 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Username Label
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              placeholder="Enter your Username field label here e.g. API Key."
                            />

                            <label className="block text-sm font-medium text-gray-700">
                              Password Label
                            </label>
                            <input
                              type="password"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              placeholder="Enter your Password field label here e.g. API Secret Key."
                            />

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Help Text
                            </label>
                            <textarea
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              rows="3"
                              placeholder="Add Description Here..."
                            />
                          </div>
                        )}
                        {auth.id === "awsSignature" && (
                          <div className="mt-1 space-y-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Redirect URL
                            </label>
                            <div className="flex items-center mb-3">
                              <input
                                type="text"
                                className="w-full border border-gray-300 px-3 py-2 rounded-l-md outline-none focus:outline-blue-300 focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                                placeholder="https://selkey.com/callback-url"
                                value={awsRedirectUrl}
                                onChange={(e) =>
                                  setAwsRedirectUrl(e.target.value)
                                }
                              />
                              <button
                                onClick={() => handleCopy(awsRedirectUrl)}
                                className="inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-blue-700 rounded-r-md hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                                type="button"
                              >
                                {copied ? (
                                  <IoMdCloudDone className="w-6 h-6 transition-transform duration-400 transform hover:scale-125" />
                                ) : (
                                  <FaCopy className="w-6 h-6 transition-transform duration-400 transform hover:scale-125" />
                                )}
                              </button>
                            </div>

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Authorize URL{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              placeholder="Enter your Authorize URL here"
                            />

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Token URL{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              placeholder="Enter your Token URL here"
                            />

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Application ID{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              placeholder="Enter your Application ID here"
                            />

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Access Key{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              placeholder="Enter your Access Key here"
                            />

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Secret Key{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              placeholder="Enter your Secret Key here"
                            />

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Client ID{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              placeholder="Enter your Client ID here"
                            />

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Client Secret{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              placeholder="Enter your Client Secret here"
                            />

                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              Send Client Secret On
                              <span className="font-semibold ml-2">
                                Access Token
                              </span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              Sent Client Credentials On
                              <span className="font-semibold ml-2">
                                Refresh Token
                              </span>
                            </label>

                            {/* Client Authentication Dropdown */}
                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Client Authentication{" "}
                                <span className="text-red-500">(Required)</span>
                              </label>
                              <select
                                className="w-full rounded-md border border-gray-300 px-3 py-2 mb-3 outline-none focus:outline-blue-300"
                                value={selectedValue}
                                onChange={handleChange}
                              >
                                <option value="basicAuth" selected>
                                  Send as Basic Auth header
                                </option>
                                <option value="clientCredentials">
                                  Send Client Credentials in body
                                </option>
                              </select>
                            </div>

                            {/* Checkboxes and Input Fields */}
                            <div className="mt-4 pl-2 w-11/12">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  className="mr-2"
                                  onChange={handleSetAuthParamsChange}
                                />
                                Set App Auth Parameters
                              </label>
                              {showSetAuthParams && (
                                <>
                                  {setAuthParams.map((param, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center mt-2"
                                    >
                                      <input
                                        type="text"
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                                        placeholder="Enter parameter key e.g. subdomain"
                                        value={param}
                                        onChange={(e) => {
                                          const newParams = [...setAuthParams];
                                          newParams[index] = e.target.value;
                                          setSetAuthParams(newParams);
                                        }}
                                      />
                                      <div className="flex items-end ml-2">
                                        <FaCog
                                          className="cursor-pointer text-gray-500 hover:text-blue-600"
                                          onClick={() =>
                                            handleOpenSettingsModal(index)
                                          }
                                        />
                                        <FaMinus
                                          className="ml-2 cursor-pointer text-gray-500 hover:text-blue-600"
                                          onClick={() =>
                                            handleRemoveSetAuthParam(index)
                                          }
                                        />
                                        <FaPlus
                                          className="ml-2 cursor-pointer text-gray-500 hover:text-blue-600"
                                          onClick={handleAddSetAuthParam}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </>
                              )}

                              <label className="flex items-center mt-4">
                                <input
                                  type="checkbox"
                                  className="mr-2"
                                  onChange={handleReceivedAuthParamsChange}
                                />
                                Received App Auth Parameters
                              </label>
                              {showReceivedAuthParams && (
                                <>
                                  {receivedAuthParams.map((param, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center mt-2"
                                    >
                                      <input
                                        type="text"
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                                        placeholder="Enter parameter key e.g. subdomain"
                                        value={param}
                                        onChange={(e) => {
                                          const newParams = [
                                            ...receivedAuthParams,
                                          ];
                                          newParams[index] = e.target.value;
                                          setReceivedAuthParams(newParams);
                                        }}
                                      />
                                      <div className="flex items-center ml-6">
                                        <FaMinus
                                          className="ml-2 cursor-pointer text-gray-500 hover:text-blue-600"
                                          onClick={() =>
                                            handleRemoveReceivedAuthParam(index)
                                          }
                                        />
                                        <FaPlus
                                          className="ml-2 cursor-pointer text-gray-500 hover:text-blue-600"
                                          onClick={handleAddReceivedAuthParam}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </>
                              )}
                            </div>
                          </div>
                        )}
                        {auth.id === "basicAuthAccessResponseToken" && (
                          <div className="mt-1 space-y-3">
                            <label className="block text-sm font-medium text-gray-700 mt-2">
                              Access Token URL{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              placeholder="Enter your Access Token URL here"
                            />

                            <label className="block text-sm font-medium text-gray-700 mt-2">
                              Request Body Type (For Token)
                            </label>
                            <select
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              value={selectedValue}
                              onChange={handleChange}
                            >
                              <option value="JSON">JSON</option>
                              <option value="formData">Form data</option>
                              <option value="encodedFormData">
                                Encoded Form Data
                              </option>
                              <option value="text">Text</option>
                              <option value="html">HTML</option>
                              <option value="xml">XML</option>
                            </select>
                            <div className="mt-3 space-y-3">
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>HTTP Headers. Learn more</span>
                              </label>
                              <label className="flex items-center mt-4">
                                <input
                                  type="checkbox"
                                  className="mr-2"
                                  onChange={handleSetAuthParamsChange}
                                />
                                Set Body/Query/Path Parameters
                              </label>
                              {showSetAuthParams && (
                                <>
                                  {setAuthParams.map((param, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center mt-2"
                                    >
                                      <input
                                        type="text"
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                                        placeholder="Enter parameter key e.g. subdomain"
                                        value={param}
                                        onChange={(e) => {
                                          const newParams = [...setAuthParams];
                                          newParams[index] = e.target.value;
                                          setSetAuthParams(newParams);
                                        }}
                                      />
                                      <div className="flex items-end ml-2">
                                        <FaCog
                                          className="cursor-pointer text-gray-500 hover:text-blue-600"
                                          onClick={() =>
                                            handleOpenSettingsModal(index)
                                          }
                                        />
                                        <FaMinus
                                          className="ml-2 cursor-pointer text-gray-500 hover:text-blue-600"
                                          onClick={() =>
                                            handleRemoveSetAuthParam(index)
                                          }
                                        />
                                        <FaPlus
                                          className="ml-2 cursor-pointer text-gray-500 hover:text-blue-600"
                                          onClick={handleAddSetAuthParam}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </>
                              )}

                              <label className="flex items-center mt-4">
                                <input
                                  type="checkbox"
                                  className="mr-2"
                                  onChange={handleReceivedAuthParamsChange}
                                />
                                Received Parameters
                              </label>
                              {showReceivedAuthParams && (
                                <>
                                  {receivedAuthParams.map((param, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center mt-2"
                                    >
                                      <input
                                        type="text"
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                                        placeholder="Enter parameter key e.g. subdomain"
                                        value={param}
                                        onChange={(e) => {
                                          const newParams = [
                                            ...receivedAuthParams,
                                          ];
                                          newParams[index] = e.target.value;
                                          setReceivedAuthParams(newParams);
                                        }}
                                      />
                                      <div className="flex items-center ml-6">
                                        <FaMinus
                                          className="ml-2 cursor-pointer text-gray-500 hover:text-blue-600"
                                          onClick={() =>
                                            handleRemoveReceivedAuthParam(index)
                                          }
                                        />
                                        <FaPlus
                                          className="ml-2 cursor-pointer text-gray-500 hover:text-blue-600"
                                          onClick={handleAddReceivedAuthParam}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </>
                              )}
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Encode credentials</span>
                              </label>
                            </div>
                            <div className="mt-3 space-y-3">
                              <label className="block text-sm font-medium text-gray-700">
                                Token Key Name (Send){" "}
                                <span className="text-red-500">(Required)</span>
                              </label>
                              <input
                                type="text"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                                placeholder="Enter access token key here e.g. access_token"
                              />
                              <label className="block text-sm font-medium text-gray-700">
                                Token Key Name (Received){" "}
                                <span className="text-red-500">(Required)</span>
                              </label>
                              <input
                                type="text"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                                placeholder="Enter access token key here e.g. access_token"
                              />
                            </div>
                            <div className="mt-3">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Client Authentication (Required)
                              </label>
                              <select className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300">
                                <option value="header">
                                  Send token in header
                                </option>
                                <option value="body">Send token in body</option>
                              </select>
                            </div>
                            {/* checkbox */}
                            <div className="mt-3">
                              <input
                                type="checkbox"
                                onChange={() =>
                                  setIsRequestBodyChecked((prev) => !prev)
                                }
                              />
                              <span className="text-sm ml-2">
                                Request Body (Raw JSON).{" "}
                                <a
                                  href="#"
                                  className="text-sm text-blue-500 hover:underline"
                                >
                                  Learn more
                                </a>
                              </span>
                              {isRequestBodyChecked && (
                                <textarea
                                  className="w-full rounded-md border border-gray-300 px-3 py-2 mt-2 outline-none focus:outline-blue-300"
                                  placeholder="{'key': 'value'}"
                                />
                              )}
                            </div>
                          </div>
                        )}
                        {auth.id === "bearerToken" && (
                          <div className="mt-1 space-y-2">
                            <label className="block mb-1">Help Text</label>
                            <textarea
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              rows="3"
                              placeholder="Add Description Here..."
                            />
                          </div>
                        )}
                        {auth.id === "parameters" && (
                          <div className="mt-1 space-y-2">
                            <label className="flex items-center mt-4">
                              <input
                                type="checkbox"
                                className="mr-2"
                                onChange={handleSetAuthParamsChange}
                              />
                              Set Body/Query/Path Parameters
                              <span className="text-red-500 ml-2">
                                (Required)
                              </span>
                            </label>
                            {showSetAuthParams && (
                              <>
                                {setAuthParams.map((param, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center mt-2"
                                  >
                                    <input
                                      type="text"
                                      className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                                      placeholder="Enter parameter key e.g. subdomain"
                                      value={param}
                                      onChange={(e) => {
                                        const newParams = [...setAuthParams];
                                        newParams[index] = e.target.value;
                                        setSetAuthParams(newParams);
                                      }}
                                    />
                                    <div className="flex items-end ml-2">
                                      <FaCog
                                        className="cursor-pointer text-gray-500 hover:text-blue-600"
                                        onClick={() =>
                                          handleOpenSettingsModal(index)
                                        }
                                      />
                                      <FaMinus
                                        className="ml-2 cursor-pointer text-gray-500 hover:text-blue-600"
                                        onClick={() =>
                                          handleRemoveSetAuthParam(index)
                                        }
                                      />
                                      <FaPlus
                                        className="ml-2 cursor-pointer text-gray-500 hover:text-blue-600"
                                        onClick={handleAddSetAuthParam}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </>
                            )}
                            <label className="block mb-1">Help Text</label>
                            <textarea
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              rows="3"
                              placeholder="Add Description Here..."
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CURL HTTP Version (Optional)
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 mb-3 outline-none"
                  value={CURLVersion}
                  onChange={(e) => setCURLVersion(e.target.value)}
                >
                  <option value="default">Default</option>
                  <option value="CURL_HTTP_VERSION_NONE">
                    CURL_HTTP_VERSION_NONE
                  </option>
                  <option value="CURL_HTTP_VERSION_1_0">
                    CURL_HTTP_VERSION_1_0
                  </option>
                  <option value="CURL_HTTP_VERSION_1_1">
                    CURL_HTTP_VERSION_1_1
                  </option>
                  <option value="CURL_HTTP_VERSION_2_0">
                    CURL_HTTP_VERSION_2_0
                  </option>
                  <option value="CURL_HTTP_VERSION_2TLS">
                    CURL_HTTP_VERSION_2TLS
                  </option>
                  <option value="CURL_HTTP_VERSION_2_PRIOR_KNOWLEDGE">
                    CURL_HTTP_VERSION_2_PRIOR_KNOWLEDGE
                  </option>
                </select>
              </div>

              <Button
                className="w-full md:w-auto bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleSaveAppDetails}
              >
                Save
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Apps;
