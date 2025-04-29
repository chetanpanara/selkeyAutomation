import { useState, useEffect, useRef } from "react";
import { Search, ChevronUp, ChevronDown, MoreVertical } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllApps } from "@/store/slices/app-slice";
import { getTriggers } from "@/store/slices/trigger-slice";

const AppSelector = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [isTriggerExpanded, setIsTriggerExpanded] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState(null);
  const [webhookUrl, setWebhookUrl] = useState(
    "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTY4MDYzNTA0MzE1MjY4NTUzMDUxMzli"
  );
  const [showWebhookSection, setShowWebhookSection] = useState(false);
  const dropdownRef = useRef(null);
  const triggerDropdownRef = useRef(null);

  const [appList, setAppList] = useState([]);
  const [triggerEvents, setTriggerEvents] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllApps()).then((data) => {
      setAppList(data.payload.data);
    });
  }, []);

  useEffect(() => {
    if (selectedApp) {
      dispatch(getTriggers(selectedApp._id)).then((data) => {
        setTriggerEvents(data.payload.triggers);
      });
    }
  }, [selectedApp]);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
      if (
        triggerDropdownRef.current &&
        !triggerDropdownRef.current.contains(event.target)
      ) {
        setIsTriggerExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle app selection
  const handleAppSelect = (app) => {
    setSelectedApp(app);
    setSearchTerm(app.appName); // Set the app name in the search bar
    setIsExpanded(false);
  };

  // Handle trigger selection
  const handleTriggerSelect = (trigger) => {
    setSelectedTrigger(trigger.triggerName);
    setWebhookUrl(trigger.link);
    setIsTriggerExpanded(false);
    setShowWebhookSection(true);
  };

  // Display app logo (either emoji or custom element based on app)
  const renderAppLogo = (app) => {
    if (!app) return null;
    return (
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white">
        <img src={app} alt="" />
      </div>
    );
  };

  // Handle the search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // If search is cleared, reset everything
    if (value === "") {
      setSelectedApp(null);
      setSelectedTrigger(null);
      setShowWebhookSection(false);
      setIsExpanded(true); // Show all apps again
    }
  };

  // Handle search input focus
  const handleSearchFocus = () => {
    // Clear search term and reset selection when focusing on search
    setSearchTerm("");
    setSelectedApp(null);
    setSelectedTrigger(null);
    setShowWebhookSection(false);
    setIsExpanded(true); // Show all apps
  };

  // Handle copy webhook URL
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    // Could add a toast notification here
  };

  return (
    <div
      className="w-full mx-auto p-4 bg-white rounded-lg shadow-md border border-orange-300"
      ref={dropdownRef}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {selectedApp ? (
              <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center">
                <span className="text-white text-xl">
                  {renderAppLogo(selectedApp?.logoUrl)}
                </span>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center">
                <span className="text-white text-xl">
                  <img src="../public/img/logo.svg" alt="" />
                </span>
              </div>
            )}
          </div>
          <div>
            {selectedApp ? (
              <>
                <div className="text-gray-600 text-sm">
                  Trigger : When this happens ...
                </div>
                <div className="font-bold text-lg flex items-center">
                  1. {selectedApp.appName}
                </div>
              </>
            ) : (
              <>
                <div className="text-gray-600 text-sm">
                  Trigger : When this happens ...
                </div>
                <div className="font-bold text-lg flex items-center">
                  1. Choose Your First Application :
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex space-x-3">
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-md">
            Free Task
          </span>
          <div className="flex space-x-1">
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical size={20} />
            </button>
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* App Selection Section */}
      <div>
        <h3 className="font-medium text-lg mb-4">Choose App</h3>

        {/* Search Box */}
        <div className="relative mb-4">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Search apps or type / and describe your task..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </div>
        </div>

        {/* App Grid - Only shown when expanded with vertical scrolling */}
        {isExpanded && (
          <div className="bg-white rounded-md">
            <div className="overflow-y-auto max-h-72 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 mt-4">
                {appList.map((app) => {
                  const isSelected = selectedApp && selectedApp.id === app._id;
                  const isFiltered = searchTerm
                    ? app.name.toLowerCase().includes(searchTerm.toLowerCase())
                    : true;

                  return (
                    isFiltered && (
                      <div
                        key={app._id}
                        className={`flex border border-gray-300 items-center p-2 py-5 rounded-md cursor-pointer ${
                          isSelected ? "bg-blue-100" : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleAppSelect(app)}
                      >
                        <div className="flex flex-col items-center justify-center w-full">
                          <img src={app.logoUrl} alt="" className="w-11 h-11 rounded-full mb-2" />
                          <span className="text-lg text-center">{app.appName}</span>
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
              {appList.length === 0 && (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  No apps found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Trigger Event Dropdown - Only shown when an app is selected */}
      {selectedApp && (
        <div className="mt-4" ref={triggerDropdownRef}>
          <h3 className="font-medium text-lg mb-2">Trigger Event</h3>
          <div className="relative">
            <div
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none cursor-pointer flex items-center justify-between"
              onClick={() => setIsTriggerExpanded(!isTriggerExpanded)}
            >
              <span>
                {selectedTrigger ? selectedTrigger : "Search & select"}
              </span>
              <ChevronDown
                size={18}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              />
            </div>

            {isTriggerExpanded && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {triggerEvents.map((trigger) => (
                  <div
                    key={trigger._id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleTriggerSelect(trigger)}
                  >
                    <div>{trigger.triggerName}</div>
                    <div className="text-sm text-gray-500">
                      {trigger.description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Webhook URL Section - Only shown when a trigger is selected */}
      {showWebhookSection && selectedTrigger && (
        <div className="mt-6">
          <h3 className="font-medium text-lg mb-2">Webhook URL</h3>
          <div className="flex items-center mb-4">
            <input
              type="text"
              className="flex-grow pl-4 py-2 border border-gray-300 rounded-l-md focus:outline-none"
              value={webhookUrl|| " No Webhook Url Found" }
              readOnly
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
              onClick={handleCopyUrl}
            >
              Copy
            </button>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2">Follow the steps below:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Log in to the application where you want to enter the webhook
                URL.
              </li>
              <li>
                Copy the webhook URL and add it under the webhook section of the
                application.
              </li>
              <li>
                Click on the below "Capture Webhook Response" button and do a
                test record so that the webhook response can be captured here.
              </li>
            </ul>
          </div>

          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 mb-4">
            <h4 className="font-medium">Important Note:</h4>
            <p>
              The webhook URL is unique for every workflow. Webhook URLs of two
              different workflows may look similar but they are not exactly the
              same.
            </p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="mr-3">Simple Response</span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500">
            Capture Webhook Response
          </button>
        </div>
      )}
    </div>
  );
};

export default AppSelector;
