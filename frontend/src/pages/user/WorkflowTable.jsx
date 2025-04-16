import { useState } from 'react';
import { Plus, Filter } from 'lucide-react';

function WorkflowTable() {
  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      status: 'Active',
      date: '4/16/2025, 11:27:49 AM',
      application: { hasT: true, hasPlus: true, hasA: true },
      name: 'facebook to Instagram',
      user: 'chetankumar',
      tasksConsumed: 0,
      freeTasksConsumed: 0,
      selected: true
    },
    {
      id: 2,
      status: 'Active',
      date: '4/16/2025, 11:28:40 AM',
      application: { hasT: true, hasPlus: true, hasA: true },
      name: 'facebook to linkedin',
      user: 'chetankumar',
      tasksConsumed: 0,
      freeTasksConsumed: 0,
      selected: false
    }
  ]);

  const toggleSelection = (id) => {
    setWorkflows(workflows.map(workflow =>
      workflow.id === id ? { ...workflow, selected: !workflow.selected } : workflow
    ));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow mt-3">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">chetankumar</h2>
        <div className="flex gap-2">
          <div className="relative">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              Select Actions
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>
         
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="p-4">
                <input type="checkbox" className="w-4 h-4" />
              </th>
              <th className="p-4 text-left font-semibold">STATUS / DATE</th>
              <th className="p-4 text-left font-semibold">APPLICATION</th>
              <th className="p-4 text-left font-semibold">WORKFLOW NAME</th>
              <th className="p-4 text-left font-semibold">TASK CONSUMPTION</th>
            </tr>
          </thead>
          <tbody>
            {workflows.map((workflow) => (
              <tr key={workflow.id} className="border-b border-gray-200">
                <td className="p-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={workflow.selected}
                    onChange={() => toggleSelection(workflow.id)}
                  />
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="bg-emerald-500 text-white py-1 px-3 rounded-md text-sm w-fit">
                      {workflow.status}
                    </span>
                    <span className="text-gray-500 text-sm mt-1">{workflow.date}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex">
                    {workflow.application.hasT && (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-1">
                        <span>T</span>
                      </div>
                    )}
                    {workflow.application.hasPlus && (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-1">
                        <Plus size={16} />
                      </div>
                    )}
                    {workflow.application.hasA && (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span>A</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-blue-500">{workflow.name}</span>
                    <span className="text-gray-500 text-sm">{workflow.user}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span>{workflow.tasksConsumed} Tasks Consumed</span>
                    <span className="text-green-500 text-sm">{workflow.freeTasksConsumed} Free Tasks Consumed</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WorkflowTable;