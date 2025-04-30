import { useState, useEffect, useRef } from "react";
import { Search, ChevronUp, ChevronDown, MoreVertical } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllApps } from "@/store/slices/app-slice";
import { getTriggers } from "@/store/slices/trigger-slice";
import { getActions } from "@/store/slices/action-slice";

const AppSelector = () => {
  // Common state (shared between trigger and action)
  const [appList, setAppList] = useState([]);
  const dispatch = useDispatch();

  // Trigger section state
  const [triggerIsExpanded, setTriggerIsExpanded] = useState(true);
  const [triggerSearchTerm, setTriggerSearchTerm] = useState("");
  const [selectedTriggerApp, setSelectedTriggerApp] = useState(null);
  const [isTriggerEventExpanded, setIsTriggerEventExpanded] = useState(false);
  const [selectedTriggerEvent, setSelectedTriggerEvent] = useState(null);
  const [webhookUrl, setWebhookUrl] = useState(
    "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTY4MDYzNTA0MzE1MjY4NTUzMDUxMzli"
  );
  const [showWebhookSection, setShowWebhookSection] = useState(false);
  const [triggerEvents, setTriggerEvents] = useState([]);
  const [selectedTriggerHelptext, setSelectedTriggerHelptext] = useState(""); // State to store helptext of the selected trigger
  const [selectedTriggerInstruction, setSelectedTriggerInstruction] = useState(""); // State to store Instruction of the selected trigger
  const triggerDropdownRef = useRef(null);
  const triggerEventDropdownRef = useRef(null);
  const triggerSectionRef = useRef(null);

  // Action section state
  const [actionIsExpanded, setActionIsExpanded] = useState(true);
  const [actionSearchTerm, setActionSearchTerm] = useState("");
  const [selectedActionApp, setSelectedActionApp] = useState(null);
  const [isActionEventExpanded, setIsActionEventExpanded] = useState(false);
  const [selectedActionEvent, setSelectedActionEvent] = useState(null);
  const [actionEvents, setActionEvents] = useState([]);
  const actionDropdownRef = useRef(null);
  const actionEventDropdownRef = useRef(null);
  const actionSectionRef = useRef(null);

  // Load all apps on component mount
  useEffect(() => {
    dispatch(getAllApps()).then((data) => {
      setAppList(data.payload.data);
    });
  }, []);

  // Load trigger events when a trigger app is selected
  useEffect(() => {
    if (selectedTriggerApp) {
      dispatch(getTriggers(selectedTriggerApp._id)).then((data) => {
        setTriggerEvents(data.payload.triggers);
      });
    }
  }, [selectedTriggerApp]);

  // Load action events when an action app is selected
  useEffect(() => {
    if (selectedActionApp) {
      dispatch(getActions(selectedActionApp._id)).then((data) => {
        setActionEvents(data.payload.actions);
      });
    }
  }, [selectedActionApp]);

  // Close dropdowns when clicking outside - separate handlers for trigger and action
  useEffect(() => {
    const handleTriggerClickOutside = (event) => {
      // Only handle clicks outside the trigger section
      if (triggerSectionRef.current && !triggerSectionRef.current.contains(event.target)) {
        return; // Don't close if clicked elsewhere
      }

      // Handle trigger dropdowns
      if (triggerDropdownRef.current && !triggerDropdownRef.current.contains(event.target)) {
        setTriggerIsExpanded(false);
      }

      if (triggerEventDropdownRef.current && !triggerEventDropdownRef.current.contains(event.target)) {
        setIsTriggerEventExpanded(false);
      }
    };

    const handleActionClickOutside = (event) => {
      // Only handle clicks outside the action section
      if (actionSectionRef.current && !actionSectionRef.current.contains(event.target)) {
        return; // Don't close if clicked elsewhere
      }

      // Handle action dropdowns
      if (actionDropdownRef.current && !actionDropdownRef.current.contains(event.target)) {
        setActionIsExpanded(false);
      }

      if (actionEventDropdownRef.current && !actionEventDropdownRef.current.contains(event.target)) {
        setIsActionEventExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleTriggerClickOutside);
    document.addEventListener("mousedown", handleActionClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleTriggerClickOutside);
      document.removeEventListener("mousedown", handleActionClickOutside);
    };
  }, []);

  // Render app logo
  const renderAppLogo = (app) => {
    if (!app) return null;
    return (
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white">
        <img src={app} alt="" />
      </div>
    );
  };

  // TRIGGER SECTION HANDLERS
  const handleTriggerAppSelect = (app) => {
    setSelectedTriggerApp(app);
    setTriggerSearchTerm(app.appName);
    setTriggerIsExpanded(false);
  };

  const handleTriggerEventSelect = (trigger) => {
    setSelectedTriggerEvent(trigger.triggerName);
    setWebhookUrl(trigger.link);
    setIsTriggerEventExpanded(false);
    setShowWebhookSection(true);
    setSelectedTriggerHelptext(trigger.helptext); // Store helptext for the selected trigger
    setSelectedTriggerInstruction(trigger.instructions);
  };

  const handleTriggerSearchChange = (e) => {
    const value = e.target.value;
    setTriggerSearchTerm(value);

    if (value === "") {
      setSelectedTriggerApp(null);
      setSelectedTriggerEvent(null);
      setShowWebhookSection(false);
      setTriggerIsExpanded(true);
    }
  };

  const handleTriggerSearchFocus = () => {
    setTriggerSearchTerm("");
    setSelectedTriggerApp(null);
    setSelectedTriggerEvent(null);
    setShowWebhookSection(false);
    setTriggerIsExpanded(true);
  };

  // ACTION SECTION HANDLERS
  const handleActionAppSelect = (app) => {
    setSelectedActionApp(app);
    setActionSearchTerm(app.appName);
    setActionIsExpanded(false);
  };

  const handleActionEventSelect = (action) => {
    setSelectedActionEvent(action.actionName);
    setIsActionEventExpanded(false);
  };

  const handleActionSearchChange = (e) => {
    const value = e.target.value;
    setActionSearchTerm(value);

    if (value === "") {
      setSelectedActionApp(null);
      setSelectedActionEvent(null);
      setActionIsExpanded(true);
    }
  };

  const handleActionSearchFocus = () => {
    setActionSearchTerm("");
    setSelectedActionApp(null);
    setSelectedActionEvent(null);
    setActionIsExpanded(true);
  };

  // Handle copy webhook URL
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    // Could add a toast notification here
  };

  return (
    <>
      {/* TRIGGER SECTION */}
      <div
        className="w-full mx-auto p-4 bg-white rounded-lg shadow-md border-2 border-orange-300"
        ref={triggerSectionRef}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {selectedTriggerApp ? (
                <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center">
                  <span className="text-white text-xl">
                    {renderAppLogo(selectedTriggerApp?.logoUrl)}
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
              {selectedTriggerApp ? (
                <>
                  <div className="text-gray-600 text-sm">
                    Trigger : When this happens ...
                  </div>
                  <div className="font-bold text-lg flex items-center">
                    1. {selectedTriggerApp.appName}
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
              value={triggerSearchTerm}
              onChange={handleTriggerSearchChange}
              onFocus={handleTriggerSearchFocus}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </div>
          </div>

          {/* App Grid - Only shown when expanded with vertical scrolling */}
          {triggerIsExpanded && (
            <div className="bg-white rounded-md" ref={triggerDropdownRef}>
              <div className="overflow-y-auto max-h-72 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 mt-4">
                  {appList.map((app) => {
                    const isSelected = selectedTriggerApp && selectedTriggerApp.id === app._id;
                    const isFiltered = triggerSearchTerm
                      ? app.appName.toLowerCase().includes(triggerSearchTerm.toLowerCase())
                      : true;

                    return (
                      isFiltered && (
                        <div
                          key={app._id}
                          className={`flex border border-gray-300 items-center py-3 rounded-md cursor-pointer ${isSelected ? "bg-blue-100" : "hover:bg-gray-50"
                            }`}
                          onClick={() => handleTriggerAppSelect(app)}
                        >
                          <div className="flex flex-col items-center justify-center w-full">
                            <img src={app.logoUrl} alt="" className="w-8 h-8 rounded-full mb-2" />
                            <span className="text-md text-center">{app.appName}</span>
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
        {selectedTriggerApp && (
          <div className="mt-4" ref={triggerEventDropdownRef}>
            <h3 className="font-medium text-lg mb-2">Trigger Event</h3>
            <div className="relative">
              <div
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none cursor-pointer flex items-center justify-between"
                onClick={() => setIsTriggerEventExpanded(!isTriggerEventExpanded)}
              >
                <span>
                  {selectedTriggerEvent ? selectedTriggerEvent : "Search & select"}
                </span>
                <ChevronDown
                  size={18}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                />
              </div>

              {isTriggerEventExpanded && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  {triggerEvents.map((trigger) => (
                    <div
                      key={trigger._id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleTriggerEventSelect(trigger)}
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
        {showWebhookSection && selectedTriggerEvent && (
          <div className="mt-6">
            <h3 className="font-medium text-lg mb-2">Webhook URL</h3>
            <div className="flex items-center mb-4">
              <input
                type="text"
                className="flex-grow pl-4 py-2 border border-gray-300 rounded-l-md focus:outline-none"
                value={webhookUrl || " No Webhook Url Found"}
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
              <h3 className="font-medium mb-2">Follow the Instruction below:</h3>
              <p>{selectedTriggerInstruction || "No additional information available."}</p>
            </div>

            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 mb-4">
              <h4 className="font-medium">Important Note:</h4>
              <p>{selectedTriggerHelptext || "No additional information available."}</p>
            </div>

            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500">
              Capture Webhook Response
            </button>
          </div>
        )}
      </div>

      {/* ACTION SECTION */}
      <div
        className="w-full mx-auto p-4 bg-white rounded-lg shadow-md border-2 border-blue-300 mt-10"
        ref={actionSectionRef}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {selectedActionApp ? (
                <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center">
                  <span className="text-white text-xl">
                    {renderAppLogo(selectedActionApp?.logoUrl)}
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
              {selectedActionApp ? (
                <>
                  <div className="text-gray-600 text-sm">
                    Action : Do this …
                  </div>
                  <div className="font-bold text-lg flex items-center">
                    1. {selectedActionApp.appName}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-gray-600 text-sm">
                    Action : Do this …
                  </div>
                  <div className="font-bold text-lg flex items-center">
                    1. Choose Your Next Application :
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
              value={actionSearchTerm}
              onChange={handleActionSearchChange}
              onFocus={handleActionSearchFocus}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </div>
          </div>

          {/* App Grid - Only shown when expanded with vertical scrolling */}
          {actionIsExpanded && (
            <div className="bg-white rounded-md" ref={actionDropdownRef}>
              <div className="overflow-y-auto max-h-72 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 mt-4">
                  {appList.map((app) => {
                    const isSelected = selectedActionApp && selectedActionApp.id === app._id;
                    const isFiltered = actionSearchTerm
                      ? app.appName.toLowerCase().includes(actionSearchTerm.toLowerCase())
                      : true;

                    return (
                      isFiltered && (
                        <div
                          key={`action-${app._id}`}
                          className={`flex border border-gray-300 items-center py-3 rounded-md cursor-pointer ${isSelected ? "bg-blue-100" : "hover:bg-gray-50"
                            }`}
                          onClick={() => handleActionAppSelect(app)}
                        >
                          <div className="flex flex-col items-center justify-center w-full">
                            <img src={app.logoUrl} alt="" className="w-8 h-8 rounded-full mb-2" />
                            <span className="text-md text-center">{app.appName}</span>
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

        {/* Action Event Dropdown - Only shown when an app is selected */}
        {selectedActionApp && (
          <div className="mt-4" ref={actionEventDropdownRef}>
            <h3 className="font-medium text-lg mb-2">Action Event</h3>
            <div className="relative">
              <div
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none cursor-pointer flex items-center justify-between"
                onClick={() => setIsActionEventExpanded(!isActionEventExpanded)}
              >
                <span>
                  {selectedActionEvent ? selectedActionEvent : "Search & select"}
                </span>
                <ChevronDown
                  size={18}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                />
              </div>

              {isActionEventExpanded && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  {actionEvents.map((action) => (
                    <div
                      key={action._id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleActionEventSelect(action)}
                    >
                      <div>{action.actionName}</div>
                      <div className="text-sm text-gray-500">
                        {action.description}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AppSelector;