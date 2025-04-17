import { useState, useEffect } from 'react';
import { Search, ChevronUp, MoreVertical } from 'lucide-react';

export default function TriggerAppSelector() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [searchEvents, setSearchEvents] = useState("");

  const apps = [
    { id: 1, name: 'WhatsApp Cloud API', icon: '💬', color: 'bg-green-500', logoClass: 'bg-green-50 text-green-600' },
    { id: 2, name: 'Router (Pabbly)', icon: '🔴', color: 'bg-pink-500' },
    { id: 3, name: 'Iterator (Pabbly)', icon: '🔄', color: 'bg-blue-500' },
    { id: 4, name: 'Delay (Pabbly)', icon: '⌛', color: 'bg-amber-500' },
    { id: 5, name: 'API (Pabbly)', icon: '🔌', color: 'bg-purple-500' },
    { id: 6, name: 'Pabbly Email Marketing', icon: '✉️', color: 'bg-blue-400' },
    { id: 7, name: 'Mailchimp', icon: '🐵', color: 'bg-red-500' },
    { id: 8, name: 'Trello', icon: '📋', color: 'bg-orange-400' },
    { id: 9, name: 'SendFox', icon: '🦊', color: 'bg-orange-500' },
    { id: 10, name: 'MailerLite Classic', icon: '📧', color: 'bg-purple-400' },
    { id: 11, name: 'Moosend', icon: '📬', color: 'bg-blue-600' },
    { id: 12, name: 'Twilio', icon: '📱', color: 'bg-blue-800' },
    { id: 13, name: 'Vonage', icon: '📞', color: 'bg-red-600' },
    { id: 14, name: 'Kit', icon: '🔧', color: 'bg-gray-400' },
  ];

  // App-specific events
  const appEvents = {
    'WhatsApp Cloud API': [
      { name: 'Send Template Message', description: 'Send a pre-approved message template' },
      { name: 'Send Text Message', description: 'Send a simple text message' },
      { name: 'Send Media Message', description: 'Send images, videos, or documents' },
      { name: 'Send Location', description: 'Share a location' },
      { name: 'Send Contact', description: 'Share a contact card' }
    ],
    'Router (Pabbly)': [
      { name: 'Route A', description: 'First routing path' },
      { name: 'Route B', description: 'Second routing path' },
      { name: 'Custom Route', description: 'Define custom routing logic' }
    ],
    'Iterator (Pabbly)': [
      { name: 'Loop Items', description: 'Iterate through a list of items' },
      { name: 'Map Data', description: 'Transform data while iterating' },
      { name: 'Filter Items', description: 'Filter items based on conditions' }
    ]
  };

  // Filter apps based on search query
  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter events based on search query and selected app
  const filteredEvents = selectedApp && appEvents[selectedApp.name] ?
    appEvents[selectedApp.name].filter(event =>
      event.name.toLowerCase().includes(searchEvents.toLowerCase()) ||
      event.description.toLowerCase().includes(searchEvents.toLowerCase())
    ) : [];

  // Clear search and reset selection
  const handleGoBack = () => {
    setSearchQuery("");
    setSelectedApp(null);
  };

  // Reset search events when changing apps
  useEffect(() => {
    setSearchEvents("");
  }, [selectedApp]);

  return (
    <div className="border border-gray-200 rounded-lg p-4 mt-4 max-w-8xl mx-auto bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedApp ? selectedApp.logoClass || 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-500'}`}>
            <div className="w-6 h-6">{selectedApp ? selectedApp.icon : '⚡'}</div>
          </div>
          <div>
            <p className="text-yellow-700 text-sm">Trigger : When this happens ...</p>
            <h2 className="text-lg font-semibold">{selectedApp ? selectedApp.name : 'Select an app'}</h2>
          </div>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronUp className={`w-5 h-5 text-gray-500 ${isExpanded ? '' : 'transform rotate-180'}`} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div>
          {!selectedApp ? (
            // App selection screen
            <>
              <p className="text-gray-700 mb-2">Select trigger app</p>
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search triggers..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {filteredApps.map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-yellow-400 cursor-pointer transition-all"
                    onClick={() => setSelectedApp(app)}
                  >
                    <div className="mb-2 text-2xl">{app.icon}</div>
                    <div className="text-center text-sm">{app.name}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            // Trigger event selection screen
            <>
              <p className="text-gray-700 mb-2">Select trigger app</p>
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={selectedApp.name}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  value={selectedApp.name}
                  readOnly
                  onClick={handleGoBack}
                />
              </div>

              <p className="text-gray-700 mb-2">Select trigger event</p>
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search events..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  value={searchEvents}
                  onChange={(e) => setSearchEvents(e.target.value)}
                />
              </div>

              {/* Event list */}
              <div className="space-y-2">
                {filteredEvents.map((event, index) => (
                  <div
                    key={index}
                    className="p-3 border border-gray-200 rounded-lg hover:border-yellow-400 cursor-pointer transition-all"
                  >
                    <div className="font-medium">{event.name}</div>
                    <div className="text-sm text-gray-500">{event.description}</div>
                  </div>
                ))}
                {filteredEvents.length === 0 && searchEvents && (
                  <div className="text-center py-4 text-gray-500">
                    No events found matching "{searchEvents}"
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}