import React, { useEffect, useState } from "react";
import AppSelector from "./AppSelector";
import { useDispatch, useSelector } from "react-redux";
import { getAllApps, setActiveAppId } from "@/store/slices/app-slice";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { GrDown } from "react-icons/gr";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { fetchAllWorkflows } from "@/store/slices/workflow-slice";
let userId = null;
function workflows() {

  const { user } = useSelector((state) => state.auth);
  userId = user?.id; // Get user ID from the user object

  const { apps } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const activeAppId = useSelector((state) => state.app.activeAppId);
  const [opendropdown, setOpendropdown] = useState(false);
  const [value, setValue] = useState("");

  // fetch all workflows folder wise
  useEffect(() => {
    if (user) {
      dispatch(fetchAllWorkflows({ userId: userId }))
        .then((res) => {
          if (res.payload.success) {
            console.log("Fetched workflows successfully:", res.payload.folderWorkflows);
          }
          else {
            console.error("Invalid API response format:", res);
          }
        })
        .catch((error) => {
          console.error("Error fetching workflows:", error); // Log any errors
        });
    }
  }, [user, userId]); // Add dependencies to ensure it runs only when `user` or `userId` changes


  useEffect(() => {
    dispatch(fetchAllWorkflows()).then((res) => {
      if (res?.payload?.success) {
        const appsData = res.payload.data;
        if (appsData.length > 0) {
          const storedActiveAppId = localStorage.getItem("activeAppId");
          const activeAppExists = appsData.some(
            (app) => app._id === storedActiveAppId
          );

          if (storedActiveAppId && activeAppExists) {
            dispatch(setActiveAppId(storedActiveAppId));
            const activeApp = appsData.find(
              (app) => app._id === storedActiveAppId
            );
            setValue(activeApp.appName);
          } else {
            dispatch(setActiveAppId(appsData[0]._id));
            setValue(appsData[0].appName);
          }
        }
      }
    });
  }, []);

  return (
    <>

      <div className="container  w-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 ">
          <div className="block">

            <div className="flex items-center">
              <div className="inline-flex rounded-md shadow-sm">
                <Button
                  variant="ghost"
                  className="rounded-r-none border border-r-0 font-medium text-sm  text-white bg-blue-400"
                >
                  Workflow
                </Button>
                <Popover open={opendropdown} onOpenChange={setOpendropdown}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={opendropdown}
                      className="rounded-l-none w-[250px] md:w-[300px] lg:w-[300px] justify-between"
                    >
                      {value || "Search Workflow..."}
                      <GrDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[250px] md:w-[300px] lg:w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search Workflow..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>No App found.</CommandEmpty>
                        <CommandGroup>
                          {apps
                            .slice()
                            .sort((a, b) => {
                              if (a._id === activeAppId) return -1;
                              if (b._id === activeAppId) return 1;
                              return a.appName.localeCompare(b.appName);
                            })
                            .map((app) => (
                              <CommandItem
                                key={app._id}
                                onSelect={() => {
                                  dispatch(setActiveAppId(app._id));
                                  setValue(app.appName);
                                  setOpendropdown(false);
                                }}
                              >
                                {app.appName}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>


            <p className="font-semibold text-2xl my-3">Workflows</p>
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