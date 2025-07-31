import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/utils/axios";

const initialState = {
  folders: null,
  isLoading: false,
};

// fetch all folders
export const fetchAllFolders = createAsyncThunk("folders/fetchAllFolders",
  async (userId) => {
    const response = await api.get(`/api/folders/getallfolders/${userId}`);

    return response.data;
  }
);

// create folder
export const createFolder = createAsyncThunk(
  "folders/createFolder",
  async ({ userId, folderName }) => {
    const response = await api.post(`/api/folders/createfolder/${userId}`, {
      folderName,
    });

    return response.data;
  }
);

// update folder
export const updateFolder = createAsyncThunk(
  "folders/updateFolder",
  async ({ userId, folderId, folderName }) => {
    console.log("userId", userId);
    console.log("folderId", folderId);
    console.log("folderName", folderName);
    const response = await api.put(
      `/api/folders/updatefolder/${userId}/${folderId}`,
      {
        folderName,
      }
    );
    return response.data;
  }
);

// delete folder
export const deleteFolder = createAsyncThunk(
  "folders/deleteFolder",
  async ({ userId, folderId }) => {
    const response = await api.delete(
      `/api/folders/deletefolder/${userId}/${folderId}`
    );

    return response.data;
  }
);

export const folderSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {
    setFolders: (state, action) => {
      state.folders = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFolders.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFolders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.folders = action.payload.data;
      })
      .addCase(fetchAllFolders.rejected, (state, action) => {
        state.isLoading = false;
        state.folders = null;
      })
      .addCase(createFolder.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(createFolder.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(createFolder.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const { setFolders } = folderSlice.actions;
export default folderSlice.reducer;
