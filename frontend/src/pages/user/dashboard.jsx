import { useState } from 'react';
import { Search, Plus, Filter, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import Chart from './Chart';

function UserDashboard() {
  const [dense, setDense] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 rounded-lg p-2 md:p-3">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">
              Create & manage all of your automation workflows in one place with Pabbly Connect Dashboard.
              <a href="#" className="text-blue-500 ml-1">Learn more</a>
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 text-white rounded-md px-4 py-2 flex items-center gap-2">
            <Plus size={20} />
            <span className="hidden md:inline">Create Workflow</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
          <StatCard
            value="100"
            label="Tasks Allotted"
            iconColor="bg-amber-100 text-amber-500"
            icon="⊙"
          />
          <StatCard
            value="0"
            label="Tasks Consumed"
            iconColor="bg-blue-100 text-blue-500"
            icon="◔"
          />
          <StatCard
            value="100"
            label="Tasks Remaining"
            iconColor="bg-green-100 text-green-500"
            icon="◔"
          />
          <StatCard
            value="0"
            label="Free Tasks Consumed"
            iconColor="bg-cyan-100 text-cyan-500"
            icon="FREE"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">

          {/* Sidebar */}
          <div className="md:col-span-3  lg:col-span-3 bg-white rounded-lg p-4 shadow-md">
            <div className="flex  justify-between items-center mb-4">
              <h2 className="font-medium text-gray-700">Folders</h2>
              <button className="bg-blue-600 hover:bg-blue-500 text-white p-1 rounded-md">
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-1">
              <FolderItem name="Home" count="3" />
              <div className="h-px bg-gray-200 my-3"></div>
              <FolderItem name="folder new" count="0" active={true} />
              <div className="h-px bg-gray-200 my-3"></div>
              <FolderItem name="Trash" count="2" />
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-9 lg:col-span-9 bg-white rounded-lg p-4 shadow-md">
            <h2 className="font-medium text-gray-700 mb-4">Home</h2>

            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row gap-1 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by workflow name..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md"
                />
              </div>
              <button className="bg-blue-600 hover:bg-blue-500 text-white rounded-md px-4 py-2 flex items-center gap-2">
                <Plus size={20} />
                <span>Select Actions</span>
              </button>
  
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left">
                      <input type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm " />
                    </th>
                    <th className="py-3 px-4 text-left">
                      <div className="flex items-center gap-1">
                        <span>Status/Date</span>
                        <span>↑</span>
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left">Application</th>
                    <th className="py-3 px-4 text-left">Workflow Name</th>
                    <th className="py-3 px-4 text-left">Task Consumption</th>
                    <th className="py-3 px-4 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm " />
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="bg-green-100 text-green-600 text-xs font-medium px-2 py-0.5 rounded">Active</span>
                      </div>
                      <div className="text-sm text-gray-500">Apr 23, 2025 09:14:46</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-green-500 text-white rounded-full p-2">P</div>
                        <div className="bg-gray-200 rounded-full p-2">+</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-blue-500">Untitled Workflow</div>
                      <div className="text-sm text-gray-500">Home</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>0 Tasks Consumed</div>
                      <div className="text-sm text-gray-500">0 Free Tasks Consumed</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button>
                        <MoreVertical size={20} className="text-gray-500" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="mt-4 flex flex-col sm:flex-row justify-end items-center gap-3">
        
              <div className="flex items-center gap-4">
                <div className="flex  items-center gap-2">
                  <span className="text-sm text-gray-600">Rows per page:</span>
                  <select className="border border-gray-300 rounded px-2 py-1">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                  </select>
                </div>

                <div className="text-sm text-gray-600">1-1 of 1</div>

                <div className="flex gap-1">
                  <button className="p-1 rounded border border-gray-300 text-gray-500">
                    <ChevronLeft size={20} />
                  </button>
                  <button className="p-1 rounded border border-gray-300 text-gray-500">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, iconColor, icon }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-3xl font-bold mb-1">{value}</div>
          <div className="text-gray-600">{label}</div>
        </div>
        <div className={`${iconColor} w-10 h-10 rounded-full flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function FolderItem({ name, count, active = false }) {
  return (
    <div className={`flex justify-between items-center px-3 py-2 rounded-md ${active ? 'bg-blue-50' : 'hover:bg-gray-100'}`}>
      <span className={active ? 'text-blue-500' : 'text-gray-700'}>{name}</span>
      <div className="flex items-center gap-2">
        <span className="text-gray-400">({count})</span>
        {name !== "Home" && name !== "Trash" && (
          <MoreVertical size={16} className="text-gray-400" />
        )}
      </div>
    </div>
  );
}

export default UserDashboard;