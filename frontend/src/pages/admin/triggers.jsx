// Trigger.jsx
import { useState, useEffect } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useSelector, useDispatch } from "react-redux";
import {
  createTrigger,
  getTriggers,
  deleteTrigger,
} from "@/store/slices/trigger-slice";

function Triggers() {
  // Add dialog state
  const [isAddTriggerDialogOpen, setIsAddTriggerDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const [newTrigger, setNewTrigger] = useState("");
  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tutorialLink: "",
    triggerType: "Webhooks Setup by Instructions (Highly Recommended)",
    responseType: "Simple (Default)",
    compatibleWithHeaders: false,
    setupInstructions: "",
    helpText: "",
  });
  const activeAppId = useSelector((state) => state.app.activeAppId);
  const { triggers = [] } = useSelector((state) => state.trigger); // Get triggers from Redux store with default value
  // State for the dropdown menu
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Fetch triggers when component mounts or activeAppId changes
  useEffect(() => {
    if (activeAppId) {
      dispatch(getTriggers(activeAppId));
    }
  }, [activeAppId, dispatch]); // Add dependencies

  // Toggle dropdown function
  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission for creating a new trigger
  const handleCreateTrigger = (e) => {
    e.preventDefault();
    if (!newTrigger.trim() || !activeAppId) return;
    dispatch(createTrigger({ name: newTrigger, id: activeAppId }))
      .unwrap()
      .then((result) => {
        if (result.success) {
          console.log("Trigger created successfully:", result.data);
          alert("created succesful");
          handleAddTriggerDialogClose();
          // Refresh triggers list
          dispatch(getTriggers(activeAppId));
        }
      })
      .catch((error) => {
        console.error("Failed to create trigger:", error);
      });
  };

  // Handle form submission for updating trigger details
  function onSubmit(e) {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
  }

  // Handle delete trigger
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this trigger?")) {
      dispatch(deleteTrigger({ id }))
        .unwrap()
        .then((result) => {
          if (result.success) {
            alert("Trigger deleted successfully");
            // Refresh triggers list
            dispatch(getTriggers(activeAppId));
          }
        })
        .catch((error) => {
          console.error("Failed to delete trigger:", error);
          alert("Failed to delete trigger");
        });
    }
  };

  // Handle dialog close
  const handleAddTriggerDialogClose = () => {
    setIsAddTriggerDialogOpen(false);
    setNewTrigger("");
  };

  return (
    <>
      <div className="bg-white p-2 rounded-lg">
        <div className="block">
          <p className="font-semibold text-2xl mb-4">Triggers</p>
        </div>
        <div className="block">
          <span className="text-gray-500 text-sm ">
            Configure your app trigger details like name, description and API
            details.
          </span>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600 lg:float-right mt-4 lg:mt-0 block"
            onClick={() => setIsAddTriggerDialogOpen(true)}
          >
            Create New Trigger
          </Button>
        </div>
      </div>

      {/* Add Dialog Component */}
      <Dialog
        open={isAddTriggerDialogOpen}
        onOpenChange={handleAddTriggerDialogClose}
      >
        <DialogContent className="p-4 sm:p-6 w-[95vw] max-w-md mx-auto">
          <h2 className="font-semibold text-xl mb-2">Create Trigger</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trigger Name
              </label>
              <input
                name="name"
                value={newTrigger}
                onChange={(e) => setNewTrigger(e.target.value)}
                type="text"
                placeholder="Enter trigger name here"
                className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button
              className="w-full p-5 bg-blue-400 text-white hover:bg-blue-600"
              onClick={handleCreateTrigger}
            >
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex min-h-screen bg-gray-50">
        <div className="flex flex-col md:flex-row w-full p-1 md:p-2 gap-4">
          {/* Trigger List Section - Responsive */}
          <div className="md:block w-full md:w-1/3 lg:w-1/4 mb-4 md:mb-0">
            <div className="bg-white rounded-md shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium">Triggers</h2>
              </div>
              <ul className="divide-y divide-gray-200">
                {triggers.length === 0 ? (
                  <li className="p-4 text-center text-gray-500">
                    No triggers found
                  </li>
                ) : (
                  triggers.map((trigger) => (
                    <li
                      key={trigger._id}
                      className="p-4 hover:bg-gray-50 relative"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-yellow-400 mr-3"></span>
                          <span className="text-sm text-gray-800">
                            {trigger.triggerName}
                          </span>
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => toggleDropdown(trigger._id)}
                            className="p-1 rounded-full hover:bg-gray-200 focus:outline-none"
                          >
                            <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
                          </button>

                          {openDropdownId === trigger._id && (
                            <div className="absolute right-0 mt-1 w-36 bg-white shadow-lg rounded-md border border-gray-200 z-10">
                              <ul className="py-1">
                                <li
                                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => handleDelete(trigger._id)}
                                >
                                  Delete
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          {/* Trigger Detail Section */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="bg-white rounded-md shadow">
              <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center">
                  <h2 className="text-lg font-medium">Trigger Details</h2>
                </div>
              </div>

              <form onSubmit={onSubmit} className="p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trigger Event Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter the trigger event name here."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trigger Event Description{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="border border-gray-300 rounded-md mb-1">
                    <div className="flex flex-wrap border-b border-gray-300 p-2">
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <span className="font-bold">B</span>
                      </button>
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded mx-1"
                      >
                        <span className="italic">I</span>
                      </button>
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <span className="underline">U</span>
                      </button>
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded mx-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h7"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded mx-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-2 focus:outline-none min-h-[100px]"
                      placeholder="Enter the trigger event description here."
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Documentation/YouTube Tutorial Link
                  </label>
                  <input
                    type="text"
                    name="tutorialLink"
                    value={formData.tutorialLink}
                    onChange={handleInputChange}
                    placeholder="Enter the forum documentation link or YouTube video URL here."
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trigger Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="triggerType"
                      value={formData.triggerType}
                      onChange={handleInputChange}
                      className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded leading-tight focus:outline-none"
                    >
                      <option>
                        Webhooks Setup by Instructions (Highly Recommended)
                      </option>
                      <option>Manual Trigger</option>
                      <option>API Trigger</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trigger Response Type
                  </label>
                  <div className="relative">
                    <select
                      name="responseType"
                      value={formData.responseType}
                      onChange={handleInputChange}
                      className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded leading-tight focus:outline-none"
                    >
                      <option>Simple (Default)</option>
                      <option>Advanced</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-start sm:items-center">
                    <input
                      type="checkbox"
                      id="compatibleWithHeaders"
                      name="compatibleWithHeaders"
                      checked={formData.compatibleWithHeaders}
                      onChange={handleInputChange}
                      className="h-4 w-4 mt-1 sm:mt-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="compatibleWithHeaders"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Make the trigger compatible with headers in response.
                      <a
                        href="#"
                        className="text-blue-600 hover:underline ml-1"
                      >
                        Learn more
                      </a>
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trigger Setup Instructions (Shown in Front)
                    <span className="ml-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 inline text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                  </label>
                  <div className="border border-gray-300 rounded-md mb-1">
                    <div className="flex flex-wrap border-b border-gray-300 p-2">
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <span className="font-bold">B</span>
                      </button>
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded mx-1"
                      >
                        <span className="italic">I</span>
                      </button>
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <span className="underline">U</span>
                      </button>
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded mx-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h7"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded mx-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                    <textarea
                      name="setupInstructions"
                      value={formData.setupInstructions}
                      onChange={handleInputChange}
                      className="w-full p-2 focus:outline-none min-h-[100px]"
                      placeholder="Trigger Setup Instructions"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Important Help Text
                    <span className="ml-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 inline text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                  </label>
                  <div className="border border-gray-300 rounded-md mb-1">
                    <div className="flex flex-wrap border-b border-gray-300 p-2">
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <span className="font-bold">B</span>
                      </button>
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded mx-1"
                      >
                        <span className="italic">I</span>
                      </button>
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <span className="underline">U</span>
                      </button>
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded mx-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h7"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded mx-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                    <textarea
                      name="helpText"
                      value={formData.helpText}
                      onChange={handleInputChange}
                      className="w-full p-2 focus:outline-none min-h-[100px]"
                      placeholder="Important Help Text"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Triggers;
