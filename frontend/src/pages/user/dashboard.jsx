import { useEffect, useRef, useState } from "react";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  ChevronDown,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  createFolder,
  fetchAllFolders,
  updateFolder,
  deleteFolder,
} from "@/store/slices/folder-slice";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { createWorkflow, getWorkflowCounts } from "@/store/slices/workflow-slice"; // Corrected named export

let userdId = null;

function UserDashboard() {
  // fetch user from auth
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [isWorkflowDialogOpen, setIsWorkflowDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [renameFolderId, setRenameFolderId] = useState(null);
  const [folderName, setFolderName] = useState("");
  const [workflowName, setWorkflowName] = useState("");
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [folderSearchQuery, setFolderSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  userdId = user?.id; // Get user ID from the user object

  useEffect(() => {
    if (user) {
      dispatch(fetchAllFolders(user?.id))
        .then((res) => {
          if (res.payload && Array.isArray(res.payload.folders)) {
            const foldersData = res.payload.folders;
            setFolders(foldersData); // Assuming the payload contains the folders

            // Fetch workflow counts for each folder
            const folderIds = foldersData.map(folder => folder._id);
            dispatch(getWorkflowCounts({ userId: user.id, folderIds })) // Updated function name
              .then((workflowRes) => {
                if (workflowRes.payload && workflowRes.payload.counts) {
                  console.log("Workflow counts:", workflowRes.payload.counts); // Log the counts for debugging
                  const updatedFolders = foldersData.map(folder => ({
                    ...folder,
                    count: workflowRes.payload.counts[folder._id] || 0, // Ensure count is fetched correctly
                  }));
                  setFolders(updatedFolders);
                } else {
                  console.error("Invalid workflow counts response:", workflowRes.payload);
                }
              })
              .catch((err) => {
                console.error("Error fetching workflow counts:", err);
              });

            // Find and set "Home" folder as default
            const homeFolder = foldersData.find(folder => folder.folderName === "Home");
            if (homeFolder) {
              setSelectedFolder(homeFolder);
            }
          } else {
            console.error("Invalid API response format:", res);
          }
        })
        .catch((error) => {
          console.error("Error fetching folders:", error); // Log any errors
        });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCreateFolder = () => {
    dispatch(createFolder({ userId: user.id, folderName })).then((res) => {
      console.log("Folder created successfully:", res);
      window.location.reload(); // Reload the page after folder creation
    });
    setIsFolderDialogOpen(false);
  };

  const handleCreateWorkflow = () => {
    console.log("Workflow created:", workflowName, "Folder:", selectedFolder?.folderName, "Folder ID:", selectedFolder?._id);
    dispatch(createWorkflow({ userId: userdId, folderId: selectedFolder._id, workflowName }))
      .then((res) => {
        console.log("Workflow created successfully:", res);
        setWorkflowName("");
        setSelectedFolder(null);
        window.location.reload(); // Reload the page after workflow creation

      })
      .catch((err) => {
        console.error("Error creating workflow:", err);
      });
    // Reset the selected folder and workflow name after creation

    setIsWorkflowDialogOpen(false);

  };

  const handleRenameDialogOpen = (folderId, folderName) => {
    setRenameFolderId(folderId);
    setFolderName(folderName); // Set the existing folder name
    setIsRenameDialogOpen(true);
  };

  const handleDeleteFolder = (folderId) => {
    console.log("Deleting folder with ID:", folderId);
    // Call the deleteFolder action with the folder ID
    dispatch(deleteFolder({ userId: userdId, folderId }))
      .then((res) => {
        console.log("Folder deleted successfully:", res);
        window.location.reload(); // Reload the page after deletion
      })
      .catch((err) => {
        console.error("Error deleting folder:", err);
      });
  };

  const handleRenameFolder = () => {
    dispatch(
      updateFolder({
        userId: userdId,
        folderId: renameFolderId,
        folderName: folderName,
      })
    )
      .then((res) => {
        console.log("Folder renamed successfully:", res);
        window.location.reload(); // Reload the page after renaming
      })
      .catch((err) => {
        console.error("Error renaming folder:", err);
      });
    setIsRenameDialogOpen(false);
  };

  // Filter folders for the dropdown - exclude "Trash" folder
  const dropdownFolders = folders.filter(folder =>
    folder.folderName !== "Trash" &&
    folder.folderName.toLowerCase().includes(folderSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 rounded-lg p-2 md:p-3">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">
              Create & manage all of your automation workflows in one place with
              Pabbly Connect Dashboard.
              <a href="#" className="text-blue-500 ml-1">
                Learn more
              </a>
            </p>
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-md px-4 py-2 flex items-center gap-2"
            onClick={() => setIsWorkflowDialogOpen(true)}
          >
            <Plus size={20} />
            <span>Create Workflow</span>
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
          <div className="md:col-span-3 lg:col-span-3 bg-white rounded-lg p-4 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-medium text-gray-700">Folders</h2>
              <button
                className="bg-blue-600 hover:bg-blue-500 text-white p-1 rounded-md"
                onClick={() => setIsFolderDialogOpen(true)}
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Safely render folder list */}
            {Array.isArray(folders) &&
              folders
                .sort((a, b) => {
                  if (a.folderName === "Home") return -1;
                  if (b.folderName === "Home") return 1;
                  if (a.folderName === "Trash") return 1;
                  if (b.folderName === "Trash") return -1;
                  return a.folderName.localeCompare(b.folderName);
                })
                .map((folder, index, sortedFolders) => (
                  <div key={folder._id || `folder-${index}`}>
                    {index > 0 &&
                      folder.folderName === "Trash" &&
                      sortedFolders[index - 1].folderName !== "Trash" && (
                        <hr className="my-2 border-gray-300" />
                      )}
                    <FolderItem
                      name={folder.folderName}
                      count={folder.count || 0} // Display workflow count, default to 0 if undefined
                      active={folder.active}
                      id={folder._id} // Pass the id prop
                      handleRenameDialogOpen={(id) =>
                        handleRenameDialogOpen(id, folder.folderName)
                      } // Pass folder name
                      handleDeleteFolder={handleDeleteFolder} // Pass the delete handler to FolderItem
                    />
                  </div>
                ))}
          </div>

          {/* Content */}
          <div className="md:col-span-9 lg:col-span-9 bg-white rounded-lg p-4 shadow-md">
            <h2 className="font-medium text-gray-700 mb-4">Home</h2>
            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row gap-1 mb-4">
              <div className="relative flex-grow">
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
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
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm"
                      />
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
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="bg-green-100 text-green-600 text-xs font-medium px-2 py-0.5 rounded">
                          Active
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Apr 23, 2025 09:14:46
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-green-500 text-white rounded-full p-2">
                          P
                        </div>
                        <div className="bg-gray-200 rounded-full p-2">+</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-blue-500">Untitled Workflow</div>
                      <div className="text-sm text-gray-500">Home</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>0 Tasks Consumed</div>
                      <div className="text-sm text-gray-500">
                        0 Free Tasks Consumed
                      </div>
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

      {/* Folder Dialog */}
      <Dialog open={isFolderDialogOpen} onOpenChange={setIsFolderDialogOpen}>
        <DialogContent className="p-4 sm:p-6 w-[95vw] max-w-md mx-auto">
          <h2 className="font-semibold text-xl mb-2">Create Folder</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Folder Name
              </label>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Enter folder name here"
                className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              className="w-full p-2 rounded-md bg-blue-600 text-white hover:bg-blue-400"
              onClick={handleCreateFolder}
            >
              Create Folder
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Workflow Dialog */}
      <Dialog
        open={isWorkflowDialogOpen}
        onOpenChange={setIsWorkflowDialogOpen}
      >
        <DialogContent className="p-4 sm:p-6 w-[95vw] max-w-md mx-auto">
          <h2 className="font-semibold text-xl mb-2">Create Workflow</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workflow Name
              </label>
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="Enter workflow name here"
                className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Folder Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Folder
              </label>
              <div className="relative mt-2" ref={dropdownRef}>
                <div
                  className="w-full p-2 border border-gray-300 rounded-md flex justify-between items-center cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className={selectedFolder ? "text-gray-900" : "text-gray-400"}>
                    {selectedFolder ? selectedFolder.folderName : "Select a folder"}
                  </span>
                  <ChevronDown size={18} className="text-gray-500" />
                </div>

                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    <div className="sticky top-0 bg-white p-2 border-b border-gray-300">
                      <input
                        type="text"
                        value={folderSearchQuery}
                        onChange={(e) => setFolderSearchQuery(e.target.value)}
                        placeholder="Search folders..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {dropdownFolders.length > 0 ? (
                      dropdownFolders.map((folder) => (
                        <div
                          key={folder._id}
                          className="p-3 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSelectedFolder(folder);
                            setIsDropdownOpen(false);
                          }}
                        >
                          {folder.folderName}
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-gray-500">No folders found</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              className="w-full p-2 rounded-md bg-blue-600 text-white hover:bg-blue-400"
              onClick={handleCreateWorkflow}
              disabled={!workflowName || !selectedFolder}
            >
              Create Workflow
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rename Folder Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="p-4 sm:p-6 w-[95vw] max-w-md mx-auto">
          <h2 className="font-semibold text-xl mb-2">Rename Folder</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Folder Name
              </label>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Enter new folder name here"
                className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              className="w-full p-2 rounded-md bg-blue-600 text-white hover:bg-blue-400"
              onClick={handleRenameFolder}
            >
              Rename Folder
            </button>
          </div>
        </DialogContent>
      </Dialog>
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
        <div
          className={`${iconColor} w-10 h-10 rounded-full flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function FolderItem({
  name,
  count,
  active = false,
  id,
  handleRenameDialogOpen,
  handleDeleteFolder,
}) {
  // Add `id` prop
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch(); // Use dispatch for actions

  const handleRename = () => {
    handleRenameDialogOpen(id); // Open the rename dialog with the folder ID
    setIsDropdownOpen(false);
  };

  const handleDelete = () => {
    // Call the deleteFolder action with the folder ID
    handleDeleteFolder(id);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`relative flex justify-between items-center px-3 py-2 rounded-md ${active ? "bg-blue-50" : "hover:bg-gray-100"
        }`}
    >
      <span className={active ? "text-blue-500" : "text-gray-700"}>{name}</span>
      <div className="flex items-center gap-2">
        <span className="text-gray-400">({count})</span>
        {name !== "Home" && name !== "Trash" && (
          <div className="relative" ref={dropdownRef}>
            <MoreVertical
              size={16}
              className="text-gray-400 cursor-pointer"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                <div>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleRename}
                  >
                    Rename
                  </button>
                </div>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;