import { useState, useEffect } from 'react';
import { Search, MessageSquare, Activity, ChevronUp, MoreVertical, X } from 'lucide-react';

export default function AppSelector() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [searchEventTerm, setSearchEventTerm] = useState('');

  const apps = [
    { id: 1, name: 'Kit', icon: '🛠️' },
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
  ];

  // Filter apps based on search term - always returns all apps when searchTerm is empty
  const filteredApps = searchTerm.trim() === ''
    ? apps
    : apps.filter(app => app.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAppSelect = (app) => {
    setSelectedApp(app);
    setSearchTerm('');
  };

  const clearSearch = () => {
    setSearchTerm('');
    // No need for additional logic - the filteredApps will update automatically
  };

  const clearEventSearch = () => {
    setSearchEventTerm('');
  };

  const goBackToAppSelection = () => {
    setSelectedApp(null);
    setSearchTerm('');
    setSearchEventTerm('');
  };

  return (
    <div className="p-6 max-w-8xl mx-auto">
      <div className="bg-white border border-yellow-300 rounded-lg shadow-md p-4">
        {selectedApp ? (
          <>
            <div className="flex items-center mb-4">
              <div className="rounded-full p-2 mr-3" style={{ backgroundColor: "#f1f8e9" }}>
                <MessageSquare color={selectedApp.logoColor} size={20} />
              </div>
              <div>
                <h2 className="text-amber-800 text-sm font-medium">Trigger : When this happens ...</h2>
                <h1 className="text-lg font-bold">{selectedApp.name}</h1>
              </div>
              <div className="ml-auto flex">
                <button className="p-2" onClick={goBackToAppSelection}>
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                </button>
                <button className="p-2">
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Select trigger app</h3>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={selectedApp.name}
                  readOnly
                />
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Select trigger event</h3>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search events..."
                  value={searchEventTerm}
                  onChange={(e) => setSearchEventTerm(e.target.value)}
                />
                {searchEventTerm && (
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={clearEventSearch}
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center mb-4">
              <div className="bg-yellow-100 rounded-full p-2 mr-3">
                <Activity className="text-yellow-500" size={20} />
              </div>
              <div>
                <h2 className="text-amber-800 text-sm font-medium">Trigger : When this happens ...</h2>
                <h1 className="text-lg font-bold">Select an app</h1>
              </div>
              <div className="ml-auto flex">
                <button className="p-2">
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                </button>
                <button className="p-2">
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Select trigger app</h3>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search triggers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={clearSearch}
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {filteredApps.map((app) => (
                <button
                  key={app.id}
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => handleAppSelect(app)}
                >
                  <div className="mb-2">
                    {app.icon}
                  </div>
                  <span className="text-xs text-center">{app.name}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}