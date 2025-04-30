import { useState } from "react";

const Sidebar = ({ onClose, appId, appName, logoUrl }) => {
  const [connectionType, setConnectionType] = useState("new"); // State to manage selected radio button

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose} // Close sidebar when clicking outside
      ></div>
      {/* Sidebar Content */}
      <div className="relative w-full sm:w-3/5 bg-gray-100 shadow-lg h-full overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          onClick={onClose} // Close button
        >
          ✕
        </button>
        <div className="p-2 sm:p-2 md:p-4 lg:p-6">
          {/* Header Section */}
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={logoUrl}
              alt={`${appName} logo`}
              className="w-16 h-16 rounded-full border border-gray-300"
            />
            <div>
              <h2 className="text-xl font-bold">{appName}</h2>
              <p className="text-sm text-gray-500">App ID: {appId}</p>
            </div>
          </div>

          {/* Connection Options */}
          <div className="mb-4 shadow-md p-4 rounded-lg bg-white">
            <h3 className="text-lg font-semibold mb-4">WhatsApp Cloud API</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="connectionType"
                  value="new"
                  className="form-radio text-blue-600"
                  checked={connectionType === "new"}
                  onChange={() => setConnectionType("new")}
                />
                <span className="text-gray-700">Add New Connection</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="connectionType"
                  value="existing"
                  className="form-radio text-blue-600"
                  checked={connectionType === "existing"}
                  onChange={() => setConnectionType("existing")}
                />
                <span className="text-gray-700">Select Existing Connection</span>
              </label>
            </div>
          </div>

          {/* Conditional Rendering Based on Selected Option */}
          {connectionType === "new" ? (
            <div className="space-y-4 shadow-md p-4 rounded-lg bg-white">
              {/* New Connection Form */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  New Connection Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Connection Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Name your connection with WhatsApp Cloud API account.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Token
                </label>
                <input
                  type="text"
                  placeholder="Enter the system's user-generated token here."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the system's user-generated token here.{" "}
                  <a
                    href="#"
                    className="text-blue-500 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn more
                  </a>
                  .
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number ID
                </label>
                <input
                  type="text"
                  placeholder="Enter Phone Number ID here."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter your Phone Number ID. Get the Phone number ID in the
                  left-hand menu of the App Dashboard, and navigate to WhatsApp
                  &gt; API Setup.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp Business Account ID
                </label>
                <input
                  type="text"
                  placeholder="Enter WhatsApp Business Account ID here."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter your WhatsApp Business Account ID here. You can get it
                  from the left-hand menu of the App Dashboard, by navigating to
                  WhatsApp &gt; API Setup.{" "} <br />
                  <span className="font-medium">
                    Note: Make sure you have added the payment gateway method to
                    your WhatsApp Cloud API Account.
                  </span>
                </p>
              </div>
            </div>
          ) : (
              <div className="space-y-4 shadow-md p-4 rounded-lg bg-white">
                {/* Existing Connection Dropdown */}
                <h3 className="text-lg font-semibold mb-4">Existing Connection</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Connections
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>WhatsApp Cloud API #1</option>
                  <option>WhatsApp Cloud API #2</option>
                  <option>WhatsApp Cloud API #3</option>
                </select>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-start mt-6 space-x-4">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
