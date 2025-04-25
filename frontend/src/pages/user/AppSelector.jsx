import { useState, useEffect, useRef } from 'react';
import { Search, ChevronUp, ChevronDown, MoreVertical } from 'lucide-react';

// App data with name and logo information
const appList = [
  { id: 1, name: 'Webhook by Pabbly', icon: '🛠️' },
  { id: 2, name: 'Router (Pabbly)', icon: '📍' },
  { id: 3, name: 'Iterator (Pabbly)', icon: '🔄' },
  { id: 4, name: 'Delay (Pabbly)', icon: '⌛' },
  { id: 5, name: 'API (Pabbly)', icon: '🔌' },
  { id: 6, name: 'Pabbly Email Marketing', icon: '📧' },
  { id: 7, name: 'Mailchimp', icon: '🐵' },
  { id: 8, name: 'Trello', icon: '📋' },
  { id: 9, name: 'SendFox', icon: '🦊' },
  { id: 10, name: 'MailerLite Classic', icon: '✉️' },
  { id: 11, name: 'Moosend', icon: '📬' },
  { id: 12, name: 'Twilio', icon: '📱' },
  { id: 13, name: 'Vonage', icon: '📞' },
  { id: 14, name: 'WhatsApp Cloud API', icon: '📱' },
  { id: 15, name: 'Google Sheets', icon: '📊' },
  { id: 16, name: 'Slack', icon: '💬' },
  { id: 17, name: 'Discord', icon: '🎮' },
  { id: 18, name: 'Facebook', icon: '📘' },
];

// Trigger event options
const triggerEvents = [
  { id: 1, name: 'trigger1' },
  { id: 2, name: 'trigger2' }
];

const AppSelector = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [isTriggerExpanded, setIsTriggerExpanded] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState(null);
  const dropdownRef = useRef(null);
  const triggerDropdownRef = useRef(null);

  // Filter apps based on search term
  const filteredApps = appList.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
      if (triggerDropdownRef.current && !triggerDropdownRef.current.contains(event.target)) {
        setIsTriggerExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle app selection
  const handleAppSelect = (app) => {
    setSelectedApp(app);
    setIsExpanded(false);
  };

  // Handle trigger selection
  const handleTriggerSelect = (trigger) => {
    setSelectedTrigger(trigger);
    setIsTriggerExpanded(false);
  };

  // Display app logo (either emoji or custom element based on app)
  const renderAppLogo = (app) => {
    if (!app) return null;

    return (
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white">
        {app.icon}
      </div>
    );
  };

  return (
    <div className="w-full mx-auto p-4 bg-white rounded-lg shadow-md border border-orange-300" ref={dropdownRef}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {selectedApp ? (
              <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center">
                <span className="text-white text-xl">{renderAppLogo(selectedApp)}</span>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center">
                <span className="text-white text-xl"><img src="../public/img/logo.svg" alt="" /></span>
              </div>
            )}
          </div>
          <div>
            {selectedApp ? (
              <>
                <div className="text-gray-600 text-sm">Trigger : When this happens ...</div>
                <div className="font-bold text-lg flex items-center">
                  1. {selectedApp.name} :
                </div>
              </>
            ) : (
              <>
                <div className="text-gray-600 text-sm">Trigger : When this happens ...</div>
                <div className="font-bold text-lg flex items-center">
                  1. Choose Your First Application :
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex space-x-3">
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-md">Free Task</span>
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

        {/* Search Box - Always shows selected app name if an app is selected */}
        <div className="relative mb-4">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Search apps or type / and describe your task..."
            value={selectedApp ? selectedApp.name : searchTerm}
            onChange={(e) => {
              if (!selectedApp) {
                setSearchTerm(e.target.value);
              }
            }}
            onClick={() => {
              if (!isExpanded) {
                setIsExpanded(true);
              }
            }}
            readOnly={selectedApp !== null}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </div>
        </div>

        {/* App Grid - Only shown when expanded */}
        {isExpanded && (
          <div className="bg-white rounded-md">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 mt-4">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="border border-gray-200 rounded-md py-2 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleAppSelect(app)}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2">
                    <span className="text-xl">{app.icon}</span>
                  </div>
                  <span className="text-sm text-center">{app.name}</span>
                </div>
              ))}
            </div>

            {filteredApps.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No apps found matching "{searchTerm}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Trigger Event Dropdown - Always shown when an app is selected */}
      {selectedApp && (
        <div className="mt-4" ref={triggerDropdownRef}>
          <h3 className="font-medium text-lg mb-2">Trigger Event</h3>
          <div className="relative">
            <div
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none cursor-pointer flex items-center justify-between"
              onClick={() => setIsTriggerExpanded(!isTriggerExpanded)}
            >
              <span>{selectedTrigger ? selectedTrigger.name : 'Search & select'}</span>
              <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2" />
            </div>

            {isTriggerExpanded && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {triggerEvents.map((trigger) => (
                  <div
                    key={trigger.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleTriggerSelect(trigger)}
                  >
                    {trigger.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppSelector;