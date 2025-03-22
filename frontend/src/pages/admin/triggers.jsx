import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FaQuestionCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  createTrigger,
  getTriggers,
  deleteTrigger,
} from "@/store/slices/trigger-slice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

const triggerMenu = [
  {
    id: "delete",
    name: "Delete",
  },
];

function Triggers() {
  const [isAddTriggerDialogOpen, setIsAddTriggerDialogOpen] = useState(false);
  const [triggerNewData, setTriggerNewData] = useState({
    triggerName: "",
    description: "",
  });

  const [triggerType, setTriggerType] = useState("");
  const [responseType, setResponseType] = useState("");
  const activeAppId = useSelector((state) => state.app.activeAppId); // Get activeAppId from Redux store
  const { triggers = [] } = useSelector((state) => state.trigger); // Get triggers from Redux store with default value

  const dispatch = useDispatch();

  const handleAddTriggerDialogClose = () => {
    setIsAddTriggerDialogOpen(false);
  };

  useEffect(() => {
    if (activeAppId) {
      dispatch(getTriggers(activeAppId));
    }
  }, [activeAppId, dispatch]);

  function SaveTriggerName() {
    dispatch(
      createTrigger({
        triggerData: { ...triggerNewData, appId: activeAppId },
        id: activeAppId,
      })
    ).then((res) => {
      if (res.payload.success) {
        console.log("Trigger name saved successfully");
      }
      alert("Trigger name saved successfully!");
      window.location.reload();
    });

    handleAddTriggerDialogClose();
  }

  // Function to handle delete trigger
  const handleDeleteTrigger = (triggerId) => {
    if (window.confirm("Are you sure you want to delete this trigger?")) {
      dispatch(deleteTrigger({ id: triggerId })).then((data) => {
        if (data?.payload?.success) {
          dispatch(getTriggers(activeAppId));
          alert("Trigger deleted successfully");
          window.location.reload();
        }
      });
    }
  };

  console.log("Triggers:", triggers);

  return (
    <div className="bg-slate-100 p-4 rounded-lg">
      <div className="block">
        <p className="font-semibold text-2xl mb-4">Triggers</p>
      </div>
      <div className="block">
        <span className="text-gray-500 text-sm ">
          Configure your app trigger details like name, description, and API
          details.
        </span>
        <Button
          className="bg-blue-500 text-white hover:bg-blue-600 lg:float-right mt-4 lg:mt-0 block"
          onClick={() => setIsAddTriggerDialogOpen(true)}
        >
          Create New Trigger
        </Button>
      </div>

      <Dialog
        open={isAddTriggerDialogOpen}
        onOpenChange={handleAddTriggerDialogClose}
      >
        <DialogContent className="p-6 max-w-md bg-white shadow-lg rounded-lg">
          <h2 className="font-semibold text-xl mb-4">Create New Trigger</h2>
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Trigger Event Name
          </Label>
          <input
            type="text"
            value={triggerNewData.triggerName}
            onChange={(e) =>
              setTriggerNewData({
                ...triggerNewData,
                triggerName: e.target.value,
              })
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 mb-3 outline-none focus:outline-blue-300"
            placeholder="Enter trigger event name"
          />
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Trigger Event Description
          </Label>
          <textarea
            value={triggerNewData.description}
            onChange={(e) =>
              setTriggerNewData({
                ...triggerNewData,
                description: e.target.value,
              })
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 mb-3 outline-none focus:outline-blue-300"
            rows={3}
            placeholder="Enter trigger event description"
          ></textarea>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={SaveTriggerName}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>

      <div className="block mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 col-span-1 h-64">
            <div className="block">
              <div className="border-b border-gray-300 mt-2">
                <h1 className="text-md font-semibold mt-4 mb-4">Triggers</h1>
              </div>
              <hr className="border-gray-300" />
            </div>
            {/* Display Trigger list */}
            {triggers.length === 0 && (
              <div className="text-center text-gray-500">
                No Trigger found. <br />
              </div>
            )}
            {triggers.map((trigger) => (
              <div
                key={trigger._id}
                className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                  activeAppId === trigger._id ? "bg-blue-50" : ""
                }`}
                onClick={() => {
                  console.log("Trigger Clicked:", trigger);
                }}
              >
                <span>{trigger.triggerName}</span>
                <div className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <MoreVertical className="w-6 h-6 text-gray-500 hover:cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side="top"
                      className="w-24  bg-white rounded-md shadow-md"
                      style={{
                        backgroundColor: "white",
                      }}
                    >
                      <DropdownMenuItem
                        onClick={() => handleDeleteTrigger(trigger._id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white p-4 mr-2 lg:mr-0 col-span-3">
            <div className="block">
              <div className="border-b border-gray-300 mt-2">
                <h1 className="text-md font-semibold mt-4 mb-4">
                  Trigger Details{" "}
                  <span className="inline-flex items-center">
                    {<FaQuestionCircle />}
                  </span>
                </h1>
              </div>
              <hr className="border-gray-300 w-full" />
            </div>
            <div className=" mt-4">
              <div className="flex items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Trigger Event Name
                </label>
                <p className="text-red-500 ml-2">(Required)</p>
                {/* <Button className="bg-background text-blue-500 border border-blue-500 hover:bg-blue-600 lg:float-right block">AI Suggestion</Button> */}
              </div>
              <input
                type="text"
                className="outline-none bg-slate-100 focus:outline-blue-500 border border-gray-300 rounded-md p-2 w-full"
                required
              />
            </div>
            <div className="mt-4">
              <div className="flex items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Trigger Event Description
                </label>
                <p className="text-red-500 ml-2">(Required)</p>
              </div>
              {/* <Button className=" bg-background text-blue-500 border border-blue-500 hover:bg-blue-600 lg:float-right block">AI Suggestion</Button> */}
              <textarea
                className=" bg-slate-100 border border-gray-300 outline-none focus:outline-blue-500 rounded-md p-2 w-full"
                rows="3"
                placeholder="Enter description"
                required
              ></textarea>
            </div>
            <div className="mt-3">
              <div className="flex items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Documentation/YouTube Tutorial Link
                </label>
              </div>
              <input
                type="text"
                className="outline-none bg-slate-100 focus:outline-blue-500 border border-gray-300 rounded-md p-2 w-full"
                required
              />
            </div>
            <div className="mt-3">
              <div className="flex items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Trigger Type
                </label>
                <p className="text-red-500 ml-2">(Required)</p>
              </div>
              <select
                value={triggerType}
                onChange={(e) => setTriggerType(e.target.value)}
                className="w-full bg-slate-200 border border-gray-300 rounded-md p-2"
                required
              >
                <option value="webhooks_instructions">
                  Webhooks Setup by Instructions (Highly Recommended)
                </option>
                <option value="webhooks_api_request">
                  Webhooks Setup by API Request (Recommended)
                </option>
                <option value="polling_check">
                  Polling to Check New Data (Not Recommended)
                </option>
              </select>
            </div>
            <div className="mt-3">
              <div className="flex items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Trigger Response Type
                </label>
                <p className="text-red-500 ml-2">(Required)</p>
              </div>
              <select
                value={responseType}
                onChange={(e) => setResponseType(e.target.value)}
                className="w-full bg-slate-200 border border-gray-300 rounded-md p-2"
                required
              >
                <option value="simple">Simple (Default)</option>
                <option value="advance">Advance</option>
              </select>
            </div>
            <div className="mt-3">
              <div className="flex items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Response type
                </label>
              </div>
              <input
                type="text"
                className="outline-none bg-slate-100 focus:outline-blue-500 border border-gray-300 rounded-md p-2 w-full"
                placeholder="Enter response type"
                required
              />
              <div className="mt-3 space-y-2">
                <label className="font-medium text-sm text-gray-700">
                  Trigger Setup Instructions (Shown In Front)
                </label>
                <textarea
                  className=" bg-slate-100 border border-gray-300 outline-none focus:outline-blue-500 rounded-md p-2 w-full"
                  rows="3"
                ></textarea>

                <label className="font-medium text-sm text-gray-700">
                  Important Help Text
                </label>
                <textarea
                  className=" bg-slate-100 border border-gray-300 outline-none focus:outline-blue-500 rounded-md p-2 w-full"
                  rows="3"
                ></textarea>
              </div>
            </div>

            <div className="mt-3">
              <Button className="bg-blue-500 text-white hover:bg-blue-600">
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Triggers;
