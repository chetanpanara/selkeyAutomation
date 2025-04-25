
import React, { useEffect } from "react";
import AppSelector from "./AppSelector";

function workflows() {
  
  return (
    <>
    
      <div className="container  w-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 ">
          <div className="block">
            <p className="font-semibold text-3xl mb-3">Workflows</p>
            <span className="text-gray-500 text-sm ">
              Create automation workflow below.
            </span>
          </div>
        </div>
      </div>

      {/*if apps found then it can be display main grid */}
      {/* <div className="w-full mx-auto mt-2 px-1 sm:px-2">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/3 bg-blue-50 rounded-lg p-4">
              <img
                src="../img/workflow.png"
                alt="Workflow illustration"
                className="w-full h-auto"
              />
            </div>

            <div className="w-full md:w-2/3">
              <h2 className="text-2xl font-bold mb-4">
                Add <span className="text-blue-600">new</span> Workflow
              </h2>

              <p className="text-gray-600 mb-6">
                Start by creating the automation workflow and integrate your applications together.
              </p>

              <div className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium mt-1">
                    Trigger
                  </span>
                  <span className="text-gray-600">Choose your trigger which will fire the workflow</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium mt-1">
                    Action
                  </span>
                  <span className="text-gray-600">Send data to a different application via API</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2 mr-2 bg-gray-400 rounded-full"></span>
                  <span className="text-gray-600">Save your workflow and let the automation work</span>
                </li>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <AppSelector />
      
    </>
   
  );
}

export default workflows;
