import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/utils/axios";

const initialState = {
  workflowData: null,
  isLoading: false,
};

// fetch all workflows
export const fetchAllWorkflows = createAsyncThunk(
  "workflows/fetchAllWorkflows",
  async ({ userId }) => {
    const response = await api.get(
      `/api/workflows/getallworkflows/${userId}`
    );
    return response.data;
  }
);

// create workflow
export const createWorkflow = createAsyncThunk(
  "workflows/createWorkflow",
  async ({ userId, folderId, workflowName }) => {
    console.log("userId", userId);
    console.log("folderId", folderId);
    console.log("workflowName", workflowName);
    const response = await api.post(`/api/workflows/createworkflow/${userId}`, {
      folderId,
      workflowName,
    });
    return response.data;
  }
);

// get workflow counts
export const getWorkflowCounts = createAsyncThunk(
  "workflows/getWorkflowCounts",
  async ({ userId }) => {
    const response = await api.get(
      `/api/workflows/getworkflowcounts/${userId}`
    );
    return response.data;
  }
);

// delete workflow
export const deleteWorkflow = createAsyncThunk(
  "workflows/deleteWorkflow",
  async ({ userId, workflowId }) => {
    console.log("userId", userId);
    console.log("workflowId", workflowId);

    const response = await api.delete(
      `/api/workflows/deleteworkflow/${userId}/${workflowId}`
    );
    return response.data;
  }
);
export const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllWorkflows.pending, (state) => {
      state.isLoading = true;
    });
  },
});

export default workflowSlice.reducer;
