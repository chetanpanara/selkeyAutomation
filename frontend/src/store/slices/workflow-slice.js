import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/utils/axios";

const initialState = {
  workflows: [],
  workflowCounts: {},
  workflowData: null,
  isLoading: false,
};

// fetch all workflows
export const fetchAllWorkflows = createAsyncThunk(
  "workflows/fetchAllWorkflows",
  async ({ userId }) => {
    const response = await api.get(`/api/workflows/getallworkflows/${userId}`);
    return response.data;
  }
);

// fetch all workflows for user
// http://localhost:5000/api/workflows/getAllWorkflowsForUser/:userId
export const fetchAllWorkflowsForUser = createAsyncThunk(
  "workflows/fetchAllWorkflowsForUser",
  async ({ userId }) => {
    console.log("userId", userId);
    const response = await api.get(
      `/api/workflows/getAllWorkflowsForUser/${userId}`
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

// delete multiple workflows
export const deleteWorkflows = createAsyncThunk(
  "workflows/deleteWorkflows",
  async ({ workflowIds }) => {
    const response = await api.post(`/api/workflows/deletemultiple`, {
      workflowIds,
    });
    return response.data;
  }
);

// enable workflows
export const enableWorkflows = createAsyncThunk(
  "workflows/enableWorkflows",
  async ({ workflowIds }) => {
    const response = await api.post(`/api/workflows/enableworkflows`, {
      workflowIds,
    });
    return response.data;
  }
);

// disable workflows
export const disableWorkflows = createAsyncThunk(
  "workflows/disableWorkflows",
  async ({ workflowIds }) => {
    const response = await api.post(`/api/workflows/disableworkflows`, {
      workflowIds,
    });
    return response.data;
  }
);

export const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllWorkflows.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllWorkflows.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workflows = action.payload.workflows;
        state.workflowCounts = action.payload.workflowCounts;
      })
      .addCase(fetchAllWorkflows.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchAllWorkflowsForUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllWorkflowsForUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workflows = action.payload.workflows;
        state.workflowCounts = action.payload.workflowCounts;
      })
      .addCase(fetchAllWorkflowsForUser.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default workflowSlice.reducer;
