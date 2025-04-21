import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FaCopy, FaCog, FaPlus, FaMinus } from "react-icons/fa";
import { IoMdCloudDone } from "react-icons/io";
import AppImageUpload from "@/components/admin/image-upload";
import {
  addNewApp,
  deleteApp,
  getAllApps,
  updateApp,
  setActiveAppId,
} from "@/store/slices/app-slice";
import { useSelector, useDispatch } from "react-redux";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdminHeader from "@/components/admin/header";

const tabs = [
  { id: "appDetails", label: "App Details" },
  { id: "appStatus", label: "App Status" },
];

const appMenu = {
  id: "delete",
  name: "Delete",
};

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
  const [copied, setCopied] = useState(false);
  const [isHeaderPrefixChecked, setIsHeaderPrefixChecked] = useState(false);
  const [showSetAuthParams, setShowSetAuthParams] = useState(false);
  const [showReceivedAuthParams, setShowReceivedAuthParams] = useState(false);
  const [setAuthParams, setSetAuthParams] = useState([""]);
  const [receivedAuthParams, setReceivedAuthParams] = useState([""]);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [currentParamIndex, setCurrentParamIndex] = useState(null);
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
  const { apps } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const activeAppId = useSelector((state) => state.app.activeAppId); // Get activeAppId from Redux store

  // Add new state for auth configuration
  const [authConfig, setAuthConfig] = useState({
    noAuth: { enabled: false },
    oauth2: {
      enabled: false,
      grantType: "authorization_code",
      redirectUrl: "",
      authorizeUrl: "",
      tokenUrl: "",
      refreshTokenUrl: "",
      scope: "",
      headerPrefix: false,
      headerPrefixValue: "",
      clientAuth: "basicAuth",
      sendClientSecretOn: false,
      sendClientCredentialsOnRefresh: false,
      enableUserAgent: false,
      refreshTokenOnExpiration: false,
    },
    oauth1: {
      enabled: false,
      redirectUrl: "",
      authorizeUrl: "",
      requestTokenUrl: "",
      accessTokenUrl: "",
      consumerKey: "",
      consumerSecret: "",
      encodeParameters: false,
      signatureMethod: "HMAC-SHA1",
    },
    basicAuth: {
      enabled: false,
      usernameLabel: "",
      passwordLabel: "",
      helpText: "",
    },
    awsSignature: {
      enabled: false,
      redirectUrl: "",
      authorizeUrl: "",
      tokenUrl: "",
      applicationId: "",
      accessKey: "",
      secretKey: "",
      clientId: "",
      clientSecret: "",
      sendClientSecretOn: false,
      sendClientCredentialsOnRefresh: false,
      clientAuth: "basicAuth",
    },
    basicAuthAccessResponseToken: {
      enabled: false,
      accessTokenUrl: "",
      requestBodyType: "JSON",
      tokenKeyNameSend: "",
      tokenKeyNameReceived: "",
      clientAuth: "header",
      encodeCredentials: false,
      requestBody: "",
    },
    bearerToken: {
      enabled: false,
      helpText: "",
    },
    parameters: {
      enabled: false,
      helpText: "",
    },
  });

  // Fetch all apps on component mount
  useEffect(() => {
    dispatch(getAllApps()).then((res) => {
      if (res?.payload?.success) {
        const appsData = res.payload.data;
        if (appsData.length > 0) {
          const storedActiveAppId = localStorage.getItem("activeAppId");
          const activeAppExists = appsData.some(
            (app) => app._id === storedActiveAppId
          );

          if (storedActiveAppId && activeAppExists) {
            dispatch(setActiveAppId(storedActiveAppId));
            const activeApp = appsData.find(
              (app) => app._id === storedActiveAppId
            );
            setFormDataApp({
              appName: activeApp.appName || "",
              description: activeApp.description || "",
              appLogo: activeApp.appLogo || "",
              authType: activeApp.authType || "",
            });
          } else {
            dispatch(setActiveAppId(appsData[0]._id));
            setFormDataApp({
              appName: appsData[0].appName || "",
              description: appsData[0].description || "",
              appLogo: appsData[0].appLogo || "",
              authType: appsData[0].authType || "",
            });
          }
        }
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (activeAppId) {
      localStorage.setItem("activeAppId", activeAppId);
      console.log(activeAppId);
    }
  }, [activeAppId]);

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

  // Function to handle checkbox change
  function handleAuthTypeChange(authId) {
    setAuthConfig((prev) => {
      // Create copy of previous state
      const newConfig = { ...prev };

      // Toggle the enabled state for this auth type
      newConfig[authId] = {
        ...newConfig[authId],
        enabled: !newConfig[authId].enabled,
      };

      return newConfig;
    });
  }

  // Function to handle checkbox change for Set Auth Params
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
      setAuthParams((prev) => prev.filter((_, i) => i !== index));
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

  // On click for create new app
  function onSubmitNewApp(event) {
    event.preventDefault();
    if (!formDataApp.appName) {
      toast.error("App name is required");
      return;
    }
    try {
      dispatch(addNewApp({ appName: formDataApp.appName })).then((data) => {
        if (data?.payload?.success) {
          dispatch(getAllApps());
          setIsAddAppDialogOpen(false);
          setFormDataApp({ appName: "" });
          setImageFile(null);
          window.location.reload();
        } else {
          // Handle error print message from server response
          alert(data.payload.message);
        }
      });
    } catch (e) {
      console.log(e);
      alert(e);
    }
  }
  // Function to handle saving app details
  function handleSaveAppDetails() {
    console.log("Active app:", activeAppId);

    try {
      // Get all enabled auth types and their configs
      const enabledAuthConfigs = Object.entries(authConfig)
        .filter(([_, config]) => config.enabled)
        .reduce((acc, [type, config]) => {
          acc[type] = config;
          return acc;
        }, {});

      const formdata = {
        appName: formDataApp.appName,
        description: formDataApp.description,
        appLogo: uploadedImageUrl,
        authConfig: {
          enabledTypes: Object.keys(enabledAuthConfigs),
          configurations: enabledAuthConfigs,
        },
      };

      console.log("Form data:", formdata);
      dispatch(
        updateApp({
          id: activeAppId,
          formData: formdata,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(getAllApps());
          alert("App updated successfully");
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Function to handle delete app
  const handleDeleteApp = (appId) => {
    if (window.confirm("Are you sure you want to delete this app?")) {
      dispatch(deleteApp(appId)).then((data) => {
        if (data?.payload?.success) {
          dispatch(getAllApps()).then((res) => {
            if (res?.payload?.success) {
              const appsData = res.payload.data;
              if (appsData.length > 0) {
                const newActiveAppId = appsData[0]._id;
                dispatch(setActiveAppId(newActiveAppId));
                localStorage.setItem("activeAppId", newActiveAppId);
              } else {
                localStorage.removeItem("activeAppId");
              }
            }
          });
          alert("App deleted successfully");
          window.location.reload();
        }
      });
    }
  };

  // Update form input handlers for auth configuration
  const updateAuthConfig = (authType, field, value) => {
    setAuthConfig((prev) => ({
      ...prev,
      [authType]: {
        ...prev[authType],
        [field]: value,
      },
    }));
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 md:px-4 p-4">
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
          {/* if no Apps not found */}
          {apps.length === 0 && (
            <div className="text-center text-gray-500">
              No apps found. <br />
              create a new app to get started.
            </div>
          )}
          {/* render apps */}
          {apps
            .slice()
            .sort((a, b) => {
              if (a._id === activeAppId) return -1;
              if (b._id === activeAppId) return 1;
              return a.appName.localeCompare(b.appName);
            })
            .map((app) => (
              <div
                key={app._id}
                className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                  activeAppId === app._id ? "bg-blue-50" : ""
                }`}
                onClick={() => {
                  dispatch(setActiveAppId(app._id)); // Update activeAppId in Redux store
                  setImageFile(null);
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <MoreVertical className="w-6 h-6 text-gray-500 hover:cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side="top"
                      className="w-24  bg-white rounded-md shadow-md"
                      style={{
                        backgroundColor: "white",
                      }}
                    >
                      {appMenu.name === "Delete" && (
                        <DropdownMenuItem
                          onClick={() => handleDeleteApp(app._id)}
                        >
                          {appMenu.name}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                          checked={authConfig[auth.id]?.enabled || false}
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
                          authConfig[auth.id]?.enabled
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
                              value={authConfig.oauth2.grantType}
                              onChange={(e) =>
                                updateAuthConfig(
                                  "oauth2",
                                  "grantType",
                                  e.target.value
                                )
                              }
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
                                value={authConfig.oauth2.redirectUrl}
                                onChange={(e) =>
                                  updateAuthConfig(
                                    "oauth2",
                                    "redirectUrl",
                                    e.target.value
                                  )
                                }
                              />
                              <button
                                onClick={() =>
                                  handleCopy(authConfig.oauth2.redirectUrl)
                                }
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
                              value={authConfig.oauth2.authorizeUrl}
                              onChange={(e) =>
                                updateAuthConfig(
                                  "oauth2",
                                  "authorizeUrl",
                                  e.target.value
                                )
                              }
                            />

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Token URL{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 mb-3 outline-none focus:outline-blue-300"
                              placeholder="Token URL"
                              value={authConfig.oauth2.tokenUrl}
                              onChange={(e) =>
                                updateAuthConfig(
                                  "oauth2",
                                  "tokenUrl",
                                  e.target.value
                                )
                              }
                            />

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Refresh Token URL{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 mb-3 outline-none focus:outline-blue-300"
                              placeholder="Refresh Token URL"
                              value={authConfig.oauth2.refreshTokenUrl}
                              onChange={(e) =>
                                updateAuthConfig(
                                  "oauth2",
                                  "refreshTokenUrl",
                                  e.target.value
                                )
                              }
                            />

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Scope{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 mb-3 outline-none focus:outline-blue-300"
                              placeholder="Scope"
                              value={authConfig.oauth2.scope}
                              onChange={(e) =>
                                updateAuthConfig(
                                  "oauth2",
                                  "scope",
                                  e.target.value
                                )
                              }
                            />

                            {/* New Checkboxes */}
                            <div className="mt-1 pl-1 w-11/12">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  className="mr-2"
                                  checked={authConfig.oauth2.headerPrefix}
                                  onChange={() =>
                                    updateAuthConfig(
                                      "oauth2",
                                      "headerPrefix",
                                      !authConfig.oauth2.headerPrefix
                                    )
                                  }
                                />
                                Set Header Prefix before{" "}
                                <span className="font-semibold ml-1">
                                  Access Token
                                </span>
                              </label>
                              {authConfig.oauth2.headerPrefix && (
                                <input
                                  type="text"
                                  className="w-[109%] rounded-md border border-gray-300 px-3 py-2 mt-2 outline-none focus:outline-blue-300 mb-2"
                                  placeholder="Enter header prefix e.g. Bearer"
                                  value={authConfig.oauth2.headerPrefixValue}
                                  onChange={(e) =>
                                    updateAuthConfig(
                                      "oauth2",
                                      "headerPrefixValue",
                                      e.target.value
                                    )
                                  }
                                />
                              )}
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  className="mr-2"
                                  checked={authConfig.oauth2.sendClientSecretOn}
                                  onChange={() =>
                                    updateAuthConfig(
                                      "oauth2",
                                      "sendClientSecretOn",
                                      !authConfig.oauth2.sendClientSecretOn
                                    )
                                  }
                                />
                                Send Client Secret On{" "}
                                <span className="font-semibold ml-1">
                                  Access Token
                                </span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  className="mr-2"
                                  checked={
                                    authConfig.oauth2
                                      .sendClientCredentialsOnRefresh
                                  }
                                  onChange={() =>
                                    updateAuthConfig(
                                      "oauth2",
                                      "sendClientCredentialsOnRefresh",
                                      !authConfig.oauth2
                                        .sendClientCredentialsOnRefresh
                                    )
                                  }
                                />
                                Send Client Credentials On
                                <span className="font-semibold ml-1">
                                  Refresh Token
                                </span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  className="mr-2"
                                  checked={authConfig.oauth2.enableUserAgent}
                                  onChange={() =>
                                    updateAuthConfig(
                                      "oauth2",
                                      "enableUserAgent",
                                      !authConfig.oauth2.enableUserAgent
                                    )
                                  }
                                />
                                Enable User-Agent
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  className="mr-2"
                                  checked={
                                    authConfig.oauth2.refreshTokenOnExpiration
                                  }
                                  onChange={() =>
                                    updateAuthConfig(
                                      "oauth2",
                                      "refreshTokenOnExpiration",
                                      !authConfig.oauth2
                                        .refreshTokenOnExpiration
                                    )
                                  }
                                />
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
                                value={authConfig.oauth2.clientAuth}
                                onChange={(e) =>
                                  updateAuthConfig(
                                    "oauth2",
                                    "clientAuth",
                                    e.target.value
                                  )
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
                                value={authConfig.oauth1.redirectUrl}
                                onChange={(e) =>
                                  updateAuthConfig(
                                    "oauth1",
                                    "redirectUrl",
                                    e.target.value
                                  )
                                }
                              />
                              <button
                                onClick={() =>
                                  handleCopy(authConfig.oauth1.redirectUrl)
                                }
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
                              value={authConfig.oauth1.authorizeUrl}
                              onChange={(e) =>
                                updateAuthConfig(
                                  "oauth1",
                                  "authorizeUrl",
                                  e.target.value
                                )
                              }
                            />

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Request Token URL{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              placeholder="Request Token URL"
                              value={authConfig.oauth1.requestTokenUrl}
                              onChange={(e) =>
                                updateAuthConfig(
                                  "oauth1",
                                  "requestTokenUrl",
                                  e.target.value
                                )
                              }
                            />

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Access Token URL{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              placeholder="Access Token URL"
                              value={authConfig.oauth1.accessTokenUrl}
                              onChange={(e) =>
                                updateAuthConfig(
                                  "oauth1",
                                  "accessTokenUrl",
                                  e.target.value
                                )
                              }
                            />
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Consumer Key{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              placeholder="Consumer Key"
                              value={authConfig.oauth1.consumerKey}
                              onChange={(e) =>
                                updateAuthConfig(
                                  "oauth1",
                                  "consumerKey",
                                  e.target.value
                                )
                              }
                            />

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Consumer Secret{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              placeholder="Consumer Secret"
                              value={authConfig.oauth1.consumerSecret}
                              onChange={(e) =>
                                updateAuthConfig(
                                  "oauth1",
                                  "consumerSecret",
                                  e.target.value
                                )
                              }
                            />

                            {/* New Checkbox for Encoding Parameters */}
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="mr-2"
                                checked={authConfig.oauth1.encodeParameters}
                                onChange={() =>
                                  updateAuthConfig(
                                    "oauth1",
                                    "encodeParameters",
                                    !authConfig.oauth1.encodeParameters
                                  )
                                }
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
                            <select
                              className="w-full rounded-md border border-gray-300 px-3 py-2 mb-3 outline-none focus:outline-blue-300"
                              value={authConfig.oauth1.signatureMethod}
                              onChange={(e) =>
                                updateAuthConfig(
                                  "oauth1",
                                  "signatureMethod",
                                  e.target.value
                                )
                              }
                            >
                              <option value="HMAC-SHA1">HMAC-SHA1</option>
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
                              value={authConfig.basicAuth.usernameLabel}
                              onChange={(e) =>
                                updateAuthConfig(
                                  "basicAuth",
                                  "usernameLabel",
                                  e.target.value
                                )
                              }
                            />

                            <label className="block text-sm font-medium text-gray-700">
                              Password Label
                            </label>
                            <input
                              type="password"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              placeholder="Enter your Password field label here e.g. API Secret Key."
                              value={authConfig.basicAuth.passwordLabel}
                              onChange={(e) =>
                                updateAuthConfig(
                                  "basicAuth",
                                  "passwordLabel",
                                  e.target.value
                                )
                              }
                            />

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Help Text
                            </label>
                            <textarea
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              rows="3"
                              placeholder="Add Description Here..."
                              value={authConfig.basicAuth.helpText}
                              onChange={(e) =>
                                updateAuthConfig(
                                  "basicAuth",
                                  "helpText",
                                  e.target.value
                                )
                              }
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
                                value={authConfig.awsSignature.redirectUrl}
                                onChange={(e) =>
                                  updateAuthConfig(
                                    "awsSignature",
                                    "redirectUrl",
                                    e.target.value
                                  )
                                }
                              />
                              <button
                                onClick={() =>
                                  handleCopy(
                                    authConfig.awsSignature.redirectUrl
                                  )
                                }
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
                              value={authConfig.awsSignature.authorizeUrl}
                              onChange={(e) =>
                                updateAuthConfig(
                                  "awsSignature",
                                  "authorizeUrl",
                                  e.target.value
                                )
                              }
                            />

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Token URL{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              placeholder="Enter your Token URL here"
                              value={authConfig.awsSignature.tokenUrl}
                              onChange={(e) =>
                                updateAuthConfig(
                                  "awsSignature",
                                  "tokenUrl",
                                  e.target.value
                                )
                              }
                            />

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Application ID{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              placeholder="Enter your Application ID here"
                              value={authConfig.awsSignature.applicationId}
                              onChange={(e) =>
                                updateAuthConfig(
                                  "awsSignature",
                                  "applicationId",
                                  e.target.value
                                )
                              }
                            />

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Access Key{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              placeholder="Enter your Access Key here"
                              value={authConfig.awsSignature.accessKey}
                              onChange={(e) =>
                                updateAuthConfig(
                                  "awsSignature",
                                  "accessKey",
                                  e.target.value
                                )
                              }
                            />

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Secret Key{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              placeholder="Enter your Secret Key here"
                              value={authConfig.awsSignature.secretKey}
                              onChange={(e) =>
                                updateAuthConfig(
                                  "awsSignature",
                                  "secretKey",
                                  e.target.value
                                )
                              }
                            />

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Client ID{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              placeholder="Enter your Client ID here"
                              value={authConfig.awsSignature.clientId}
                              onChange={(e) =>
                                updateAuthConfig(
                                  "awsSignature",
                                  "clientId",
                                  e.target.value
                                )
                              }
                            />

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Client Secret{" "}
                              <span className="text-red-500">(Required)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              placeholder="Enter your Client Secret here"
                              value={authConfig.awsSignature.clientSecret}
                              onChange={(e) =>
                                updateAuthConfig(
                                  "awsSignature",
                                  "clientSecret",
                                  e.target.value
                                )
                              }
                            />

                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                className="mr-2"
                                checked={
                                  authConfig.awsSignature.sendClientSecretOn
                                }
                                onChange={() =>
                                  updateAuthConfig(
                                    "awsSignature",
                                    "sendClientSecretOn",
                                    !authConfig.awsSignature.sendClientSecretOn
                                  )
                                }
                              />
                              Send Client Secret On
                              <span className="font-semibold ml-2">
                                Access Token
                              </span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                className="mr-2"
                                checked={
                                  authConfig.awsSignature
                                    .sendClientCredentialsOnRefresh
                                }
                                onChange={() =>
                                  updateAuthConfig(
                                    "awsSignature",
                                    "sendClientCredentialsOnRefresh",
                                    !authConfig.awsSignature
                                      .sendClientCredentialsOnRefresh
                                  )
                                }
                              />
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
                                value={authConfig.awsSignature.clientAuth}
                                onChange={(e) =>
                                  updateAuthConfig(
                                    "awsSignature",
                                    "clientAuth",
                                    e.target.value
                                  )
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
                              value={
                                authConfig.basicAuthAccessResponseToken
                                  .accessTokenUrl
                              }
                              onChange={(e) =>
                                updateAuthConfig(
                                  "basicAuthAccessResponseToken",
                                  "accessTokenUrl",
                                  e.target.value
                                )
                              }
                            />

                            <label className="block text-sm font-medium text-gray-700 mt-2">
                              Request Body Type (For Token)
                            </label>
                            <select
                              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                              value={
                                authConfig.basicAuthAccessResponseToken
                                  .requestBodyType
                              }
                              onChange={(e) =>
                                updateAuthConfig(
                                  "basicAuthAccessResponseToken",
                                  "requestBodyType",
                                  e.target.value
                                )
                              }
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
                                value={
                                  authConfig.basicAuthAccessResponseToken
                                    .tokenKeyNameSend
                                }
                                onChange={(e) =>
                                  updateAuthConfig(
                                    "basicAuthAccessResponseToken",
                                    "tokenKeyNameSend",
                                    e.target.value
                                  )
                                }
                              />
                              <label className="block text-sm font-medium text-gray-700">
                                Token Key Name (Received){" "}
                                <span className="text-red-500">(Required)</span>
                              </label>
                              <input
                                type="text"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                                placeholder="Enter access token key here e.g. access_token"
                                value={
                                  authConfig.basicAuthAccessResponseToken
                                    .tokenKeyNameReceived
                                }
                                onChange={(e) =>
                                  updateAuthConfig(
                                    "basicAuthAccessResponseToken",
                                    "tokenKeyNameReceived",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="mt-3">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Client Authentication (Required)
                              </label>
                              <select
                                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-blue-300"
                                value={
                                  authConfig.basicAuthAccessResponseToken
                                    .clientAuth
                                }
                                onChange={(e) =>
                                  updateAuthConfig(
                                    "basicAuthAccessResponseToken",
                                    "clientAuth",
                                    e.target.value
                                  )
                                }
                              >
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
                                checked={
                                  authConfig.basicAuthAccessResponseToken
                                    .requestBody
                                }
                                onChange={() =>
                                  updateAuthConfig(
                                    "basicAuthAccessResponseToken",
                                    "requestBody",
                                    !authConfig.basicAuthAccessResponseToken
                                      .requestBody
                                  )
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
                              {authConfig.basicAuthAccessResponseToken
                                .requestBody && (
                                <textarea
                                  className="w-full rounded-md border border-gray-300 px-3 py-2 mt-2 outline-none focus:outline-blue-300"
                                  placeholder="{'key': 'value'}"
                                  value={
                                    authConfig.basicAuthAccessResponseToken
                                      .requestBody
                                  }
                                  onChange={(e) =>
                                    updateAuthConfig(
                                      "basicAuthAccessResponseToken",
                                      "requestBody",
                                      e.target.value
                                    )
                                  }
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
                              value={authConfig.bearerToken.helpText}
                              onChange={(e) =>
                                updateAuthConfig(
                                  "bearerToken",
                                  "helpText",
                                  e.target.value
                                )
                              }
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
                              value={authConfig.parameters.helpText}
                              onChange={(e) =>
                                updateAuthConfig(
                                  "parameters",
                                  "helpText",
                                  e.target.value
                                )
                              }
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
