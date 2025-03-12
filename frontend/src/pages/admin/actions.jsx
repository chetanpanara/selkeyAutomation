import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FaQuestionCircle } from "react-icons/fa";

function Actions() {
  const [isAddActionDialogOpen, setIsAddActionDialogOpen] = useState(false);
  const [ActionType, setActionType] = useState("");
  const [responseType, setResponseType] = useState("");

  const handleAddActionDialogClose = () => {
    setIsAddActionDialogOpen(false);
  };

  return (
    <div className="bg-slate-100 p-4 rounded-lg">
      <div className="block">
        <p className="font-semibold text-2xl mb-4">Actions</p>
      </div>
      <div className="block">
        <span className="text-gray-500 text-sm ">
          Configure your app Action details like name, description, and API
          details.
        </span>
        <Button
          className="bg-blue-500 text-white hover:bg-blue-600 lg:float-right mt-4 lg:mt-0 block"
          onClick={() => setIsAddActionDialogOpen(true)}
        >
          Create New Action
        </Button>
      </div>

      <Dialog
        open={isAddActionDialogOpen}
        onOpenChange={handleAddActionDialogClose}
      >
        <DialogContent className="p-6 max-w-md bg-white shadow-lg rounded-lg">
          <h2 className="font-semibold text-xl mb-4">Create New Action</h2>
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Action Event Name
          </Label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 mb-3 outline-none focus:outline-blue-300"
            placeholder="Enter Action event name"
          />
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Action Event Description
          </Label>
          <textarea
            className="w-full rounded-md border border-gray-300 px-3 py-2 mb-3 outline-none focus:outline-blue-300"
            rows={3}
            placeholder="Enter Action event description"
          ></textarea>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleAddActionDialogClose}
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
                <h1 className="text-md font-semibold mt-4 mb-4">Actions</h1>
              </div>
              <hr className="border-gray-300" />
            </div>
            <div className="block mt-2">Hello</div>
          </div>
          <div className="bg-white p-4 mr-2 lg:mr-0 col-span-3">
            <div className="block">
              <div className="border-b border-gray-300 mt-2">
                <h1 className="text-md font-semibold mt-4 mb-4">
                  Action Details{" "}
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
                  Action Event Name
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
                  Action Event Description
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
                  Action Type
                </label>
                <p className="text-red-500 ml-2">(Required)</p>
              </div>
              <select
                value={ActionType}
                onChange={(e) => setActionType(e.target.value)}
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
                  Action Response Type
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
                  Action Setup Instructions (Shown In Front)
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

export default Actions;
