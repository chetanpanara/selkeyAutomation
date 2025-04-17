import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFolders,
  createFolder,
  deleteFolder,
} from "@/store/slices/folder-slice";
import {
  createWorkflow,
  getWorkflowCounts,
} from "@/store/slices/workflow-slice";
import { useNavigate } from "react-router-dom";
import WorkflowTable from "./WorkflowTable";
import Chart from "./Chart";

function UserDashboard() {
  // State variables
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [isCreateWorkflowDialogOpen, setIsCreateWorkflowDialogOpen] =
    useState(false);
  const [isAddFolderDialogOpen, setIsAddFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [workflowFormData, setWorkflowFormData] = useState({
    workflowName: "",
    folderId: "",
  });
  const [folders, setFolders] = useState([]);

  const [showDropdown, setShowDropdown] = useState({});
  const [activeFolder, setActiveFolder] = useState("");
  const [workflowCounts, setWorkflowCounts] = useState({});

  // Static folder names
  const STATIC_FOLDERS = ["Home", "Trash"];

  const dropdownMenu = (folderId) => [
    {
      name: "Rename",
      onClick: () => handleEditFolder(folderId),
    },
    {
      name: "Delete",
      onClick: () => handleDeleteFolder(folderId),
    },
  ];
  // Add useEffect for click outside handler
  useEffect(() => {
    const handleClickOutside = () => {
      if (showDropdown) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);
  // Create folder handler
  function handleCreateFolder(e) {
    e.preventDefault();
    dispatch(
      createFolder({ userId: user?.id, folderName: newFolderName })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllFolders(user?.id));
        setNewFolderName("");
        alert("Folder created successfully");
        setIsAddFolderDialogOpen(false);
        // reload the page
        window.location.reload();
      } else {
        alert(data?.payload?.message);
      }
    });
  }
  // edit folder handler
  function handleEditFolder(folderId) {
    const folderToEdit = folders.find((folder) => folder._id === folderId);
    if (STATIC_FOLDERS.includes(folderToEdit.folderName)) {
      alert("You cannot rename static folders.");
      return;
    }
    const newName = prompt("Enter new folder name:", folderToEdit.folderName);
    if (newName && newName.trim() !== "") {
      setFolders(
        folders.map((folder) =>
          folder._id === folderId ? { ...folder, folderName: newName } : folder
        )
      );
      // Dispatch update folder action here if needed
    }
  }

  // delete folder handler
  function handleDeleteFolder(folderId) {
    const folderToDelete = folders.find((folder) => folder._id === folderId);
    if (STATIC_FOLDERS.includes(folderToDelete.folderName)) {
      alert("You cannot delete static folders.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this folder?")) {
      dispatch(deleteFolder({ userId: user?.id, folderId: folderId })).then(
        (data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllFolders(user?.id));
            alert("Folder deleted successfully");
            // reload the page
            window.location.reload();
          } else {
            alert(data?.payload?.message);
          }
        }
      );
    }
  }
  // Create workflow handler
  function handleCreateWorkflow() {
    // Ensure the form data is valid before dispatching
    console.log("workflowFormData", workflowFormData);
    try {
      dispatch(
        createWorkflow({
          userId: user?.id,
          folderId: workflowFormData.folderId,
          workflowName: workflowFormData.workflowName,
        })
      ).then((data) => {
        if (data.payload.success) {
          alert("Workflow created successfully");
          setIsCreateWorkflowDialogOpen(false);
          setWorkflowFormData({
            userId: "",
            workflowName: "",
            folderId: "",
          }); // Clear the form
          navigate("/dashboard/workflows");
        } else {
          console.log("data", data);
          alert(data.payload.message);
        }
      });
    } catch (error) {
      console.log("error", error);
    }
  }
  // fetch all folders
  useEffect(() => {
    dispatch(fetchAllFolders(user?.id)).then((res) => {
      if (res.payload.success) {
        setFolders(res.payload.folders);
      } else {
        alert(res.payload.message);
      }
    });
  }, [dispatch, user]);

  useEffect(() => {
    dispatch(
      getWorkflowCounts({ userId: user?.id, folderId: activeFolder })
    ).then((res) => {
      console.log("res", res);
      setWorkflowCounts(res?.payload?.counts);
    });
  }, [dispatch, user, activeFolder]);

  return (
    <div className="bg-slate-100 p-1 sm:p-4 rounded-lg">

      <div className="container  max-w-full p-4">
        <div className="grid grid-cols-1">
          <div className="block">
            <p className="font-semibold text-3xl mb-4">Dashboard</p>
            <span className="text-gray-500 text-sm ">
              Create & manage all of your automation workflows in one place
              with Pabbly Connect Dashboard.
            </span>

            <button
              onClick={() => setIsCreateWorkflowDialogOpen(true)}
              className="text-white float-end bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-fit"
            >
              Create Workflow
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Folders Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm ">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-gray-800">Folders</h2>
            <button
              onClick={() => setIsAddFolderDialogOpen(true)}
              className="text-blue-500 hover:bg-blue-50 p-1 rounded"
            >
              <Plus size={18} />
            </button>
          </div>
          <hr className="border-gray-200 mb-4" />
          <div className="p-2 overflow-y-auto h-[calc(100%-49px)]">
            {/* Render Home folder */}
            <div
              className={`flex justify-between items-center p-2 rounded cursor-pointer ${activeFolder === "Home" ? "bg-blue-50" : ""
                }`}
              onClick={() => setActiveFolder("Home")}
            >
              <span className="font-bold">
                Home ({workflowCounts["Home"] || 0})
              </span>
            </div>
            {/* Render other folders */}
            {folders
              .filter((folder) => !STATIC_FOLDERS.includes(folder.folderName))
              .map((folder) => (
                <div
                  key={folder._id}
                  className={`flex justify-between items-center p-2 rounded cursor-pointer ${activeFolder === folder._id ? "bg-blue-50" : ""
                    }`}
                  onClick={() => {
                    setActiveFolder(folder._id);
                    setWorkflowFormData((prev) => ({
                      ...prev,
                      folderId: folder._id,
                    }));
                  }}
                >
                  <span>
                    {folder.folderName} ({workflowCounts[folder._id] || 0})
                  </span>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDropdown((prev) => ({
                          ...prev,
                          [folder._id]: !prev[folder._id],
                        }));
                      }}
                      className="p-1 rounded hover:bg-gray-100 text-gray-500"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {showDropdown[folder._id] && (
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 py-1 border">
                        {dropdownMenu(folder._id).map((item) => (
                          <button
                            key={item.name}
                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              item.onClick();
                              setShowDropdown((prev) => ({
                                ...prev,
                                [folder._id]: false,
                              }));
                            }}
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            {/* Render Trash folder */}
            <div
              className={`flex justify-between items-center p-2 rounded cursor-pointer ${activeFolder === "Trash" ? "bg-blue-50" : ""
                }`}
              onClick={() => setActiveFolder("Trash")}
            >
              <span className="font-bold">
                Trash ({workflowCounts["Trash"] || 0})
              </span>
            </div>
          </div>
        </div>

        {/* Tasks Summary Section */}
        <div className="bg-white rounded-lg shadow-sm lg:col-span-2">
          <Chart />
        </div>

      </div>

      {/*create workflow Dialogs */}
      <Dialog
        open={isCreateWorkflowDialogOpen}
        onOpenChange={() => setIsCreateWorkflowDialogOpen(false)}
      >
        <DialogContent className="p-4 sm:p-6 w-[95vw] max-w-md mx-auto">
          <h2 className="font-semibold text-xl mb-4">Create Workflow</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workflow Name
              </label>
              <input
                value={workflowFormData.workflowName}
                onChange={(e) =>
                  setWorkflowFormData({
                    ...workflowFormData,
                    workflowName: e.target.value,
                  })
                }
                placeholder="Enter workflow name here"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Folder
              </label>
              <select
                value={workflowFormData.folderId || folders[0]?._id} // Default to the first folder if none is selected
                onChange={(e) =>
                  setWorkflowFormData({
                    ...workflowFormData,
                    folderId: e.target.value,
                  })
                }
                className="w-full mb-6 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {folders
                  .filter((folder) => folder.folderName !== "Trash")
                  .map((folder) => (
                    <option key={folder._id} value={folder._id}>
                      {folder.folderName}
                    </option>
                  ))}
              </select>
            </div>
            <Button
              className="w-full p-5 bg-blue-400 text-white hover:bg-blue-600"
              onClick={handleCreateWorkflow}
            >
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/*create Folder Dialogs */}
      <Dialog
        open={isAddFolderDialogOpen}
        onOpenChange={() => setIsAddFolderDialogOpen(false)}
      >
        <DialogContent className="p-4 sm:p-6 w-[95vw] max-w-md mx-auto">
          <h2 className="font-semibold text-xl mb-4">Create Folder</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Folder Name
              </label>
              <input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name here"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

              />
            </div>
            <Button
              className="w-full p-5 bg-blue-400 text-white hover:bg-blue-600"
              onClick={handleCreateFolder}
            >
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserDashboard;
