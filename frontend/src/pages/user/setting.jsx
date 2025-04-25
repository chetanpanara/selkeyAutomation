import React, { useState } from 'react'
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiCopy } from 'react-icons/fi'

function Settings() {
  const [activeTab, setActiveTab] = useState("task-summary");
  const [visibleApiKeys, setVisibleApiKeys] = useState({});

  // Sample data for team members
  const teamMembers = [
    { name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
    { name: "Jane Smith", email: "jane@example.com", role: "Editor", status: "Pending" },
    { name: "Mike Johnson", email: "mike@example.com", role: "Viewer", status: "Active" },
  ];

  // Sample data for API keys
  const apiKeys = [
    { name: "Production API Key", key: "pk_live_123456789", created: "2024-03-15", lastUsed: "2024-03-20" },
    { name: "Development API Key", key: "pk_test_987654321", created: "2024-03-10", lastUsed: "2024-03-18" },
  ];

  // Sample data for webhook URLs
  const webhooks = [
    { name: "Order Notification", url: "https://api.example.com/webhooks/orders", status: "Active" },
    { name: "User Registration", url: "https://api.example.com/webhooks/users", status: "Inactive" },
  ];

  // Sample data for variables
  const variables = [
    { name: "API_ENDPOINT", value: "https://api.example.com", type: "String", lastModified: "2024-03-20" },
    { name: "MAX_RETRIES", value: "3", type: "Number", lastModified: "2024-03-19" },
  ];

  // Time zones data
  const timeZones = [
    { value: "UTC", label: "UTC (Coordinated Universal Time)" },
    { value: "IST", label: "IST (Indian Standard Time)" },
    { value: "EST", label: "EST (Eastern Standard Time)" },
    { value: "PST", label: "PST (Pacific Standard Time)" },
    { value: "GMT", label: "GMT (Greenwich Mean Time)" },
  ];

  const Dashboard = [
    { name: "TASKS ALLOTTED", number: "1000", img: "../img/d2.png" },
    { name: "TASKS CONSUMED", number: "00", img: "../img/d1.png" },
    { name: "TASKS REMAINING", number: "600", img: "../img/d3.png" },
    { name: "FREE TASKS CONSUMED", number: "5000", img: "../img/d4.png" },
  ];

  const tabs = [
    { id: "task-summary", label: "Task Summary" },
    { id: "connections", label: "Connections" },
    { id: "variables", label: "Variables" },
    { id: "team-members", label: "Team Members" },
    { id: "api-webhooks", label: "API & Webhooks" },
    { id: "time-zone", label: "Time Zone" },
  ];

  return (
    <>
      <div className="container max-w-full p-4">
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "task-summary" && (
          <>
            <div className="grid grid-cols-1 mt-4">
              <div className="block">
                <p className="font-semibold text-2xl mb-3">Task Summary</p>
                <span className="text-gray-500 text-sm">
                  View all of your task summaries. Any action being performed in your workflow is considered a task. Triggers are not calculated as tasks, and internal applications of Pabbly Connect, such as the filter, router, and formatter, are also not counted as tasks. Note that the task summary is only available for the last 30 days.
                </span>
              </div>
            </div>

            <div className="mt-10 bg-slate-100 rounded-lg">
              <div className="grid lg:grid-cols-4 md:grid-cols-2 p-2 gap-3">
                {Dashboard.map((item) => (
                  <div key={item.name} className="flex border-1 rounded-lg shadow-md p-6 bg-white">
                    <img
                      src={item.img}
                      className="w-10 h-10 rounded-full"
                      alt=""
                    />
                    <div className="block ml-5">
                      <span className="font-semibold text-sm uppercase text-gray-600 tracking-wider">
                        {item.name}
                      </span>{" "}
                      <br />
                      <span className="font-semibold text-xl">{item.number}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        {activeTab === "connections" && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Connections</h2>
              <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                <FiPlus className="mr-2" /> Add New Connection
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center border rounded-md px-3 py-2 mb-4 w-64">
                <FiSearch className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search connections..."
                  className="outline-none w-full"
                />
              </div>
              <div className="text-gray-500 text-center py-8">
                No connections found. Add a new connection to get started.
              </div>
            </div>
          </div>
        )}

        {activeTab === "variables" && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Variables</h2>
                <p className="text-gray-500 mt-2">Create and manage global variables that can be used across all your workflows</p>
              </div>
              <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                <FiPlus className="mr-2" /> Add Variable
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Modified</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {variables.map((variable) => (
                    <tr key={variable.name}>
                      <td className="px-6 py-4 whitespace-nowrap">{variable.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{variable.value}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{variable.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{variable.lastModified}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-blue-500 hover:text-blue-700 mr-3">
                          <FiEdit2 />
                        </button>
                        <button className="text-red-500 hover:text-red-700">
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "team-members" && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Team Members</h2>
                <p className="text-gray-500 mt-2">Manage your team members and their access permissions</p>
              </div>
              <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                <FiPlus className="mr-2" /> Invite Member
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teamMembers.map((member) => (
                    <tr key={member.email}>
                      <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{member.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{member.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-blue-500 hover:text-blue-700 mr-3">
                          <FiEdit2 />
                        </button>
                        <button className="text-red-500 hover:text-red-700">
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "api-webhooks" && (
          <div className="mt-4">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">API & Webhooks</h2>
              <p className="text-gray-500 mt-2">Manage your API keys and webhook endpoints</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">API Keys</h3>
                  <button className="flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm">
                    <FiPlus className="mr-1.5" /> Generate API Key
                  </button>
                </div>
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.key} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{apiKey.name}</h4>
                          <div className="mt-2 flex items-center">
                            <input
                              type={visibleApiKeys[apiKey.key] ? "text" : "password"}
                              value={apiKey.key}
                              readOnly
                              className="bg-gray-50 px-3 py-1 rounded"
                            />
                            <button
                              onClick={() => setVisibleApiKeys(prev => ({
                                ...prev,
                                [apiKey.key]: !prev[apiKey.key]
                              }))}
                              className="ml-2 text-blue-500 hover:text-blue-700"
                            >
                              {visibleApiKeys[apiKey.key] ? "Hide" : "Show"}
                            </button>
                            <button className="ml-2 text-blue-500 hover:text-blue-700">
                              <FiCopy />
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          <div>Created: {apiKey.created}</div>
                          <div>Last used: {apiKey.lastUsed}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Webhook URLs</h3>
                  <button className="flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm">
                    <FiPlus className="mr-1.5" /> Add Webhook
                  </button>
                </div>
                <div className="space-y-4">
                  {webhooks.map((webhook) => (
                    <div key={webhook.name} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{webhook.name}</h4>
                          <div className="mt-2">
                            <input
                              type="text"
                              value={webhook.url}
                              readOnly
                              className="bg-gray-50 px-3 py-1 rounded w-96"
                            />
                          </div>
                        </div>
                        <div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            webhook.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {webhook.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "time-zone" && (
          <div className="mt-4">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Time Zone Settings</h2>
              <p className="text-gray-500 mt-2">Configure your account's time zone preferences</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time Zone
                </label>
                <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                  <option>UTC (Coordinated Universal Time)</option>
                  <option>IST (Indian Standard Time)</option>
                  {/* Add more time zones */}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Settings;
