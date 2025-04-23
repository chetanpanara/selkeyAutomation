import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllApps } from "@/store/slices/app-slice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppSelector from "./AppSelector";

function workflows() {
  const { user } = useSelector((state) => state.auth);
  const { apps } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllApps());
  }, [dispatch]);
  return (
    <div className="w-full min-h-screen bg-white md:px-4">
      <div className="w-full mb-6">
        <div className="flex flex-col w-full gap-2 md:flex-row md:items-center md:justify-between">
          <h1 className="text-xl md:text-2xl font-semibold">Workflows</h1>
        </div>
        <span className="text-gray-500 text-sm ">
          Create automation workflow below.
        </span>
      </div>
      {/* main grid */}
      {/* <div className="max-w-full mx-auto mt-6">
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

      <AppSelector/>
    </div>
  );
}

export default workflows;
