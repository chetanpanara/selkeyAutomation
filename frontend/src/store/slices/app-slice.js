import api from "@/utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  apps: [],
  isLoading: false,
};

// Add a new app
export const addNewApp = createAsyncThunk(
  "app/addNewApp",
  async ({ appName }) => {
    const response = await api.post("/api/apps/addApp", { appName });

    return response.data;
  }
);
// Update a app
export const updateApp = createAsyncThunk(
  "apps/updateApp",
  async ({ id, formData }) => {
    const result = await api.put(`api/apps/updateApp/${id}`, formData);

    return result?.data;
  }
);

// Get all apps
export const getAllApps = createAsyncThunk("apps/getAllApps", async () => {
  const result = await api.get("/api/apps/getAllApps");

  return result?.data;
});

// delete a app
export const deleteApp = createAsyncThunk("apps/deleteApp", async (id) => {
  const result = await api.delete(`api/apps/deleteApp/${id}`);

  return result?.data;
});

// Create a slice for the app
const appSlice = createSlice({
  name: "apps",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllApps.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllApps.fulfilled, (state, action) => {
        state.isLoading = false;
        state.apps = action.payload.data;
      })
      .addCase(getAllApps.rejected, (state, action) => {
        state.isLoading = false;
        state.apps = [];
      });
  },
});

export default appSlice.reducer;
