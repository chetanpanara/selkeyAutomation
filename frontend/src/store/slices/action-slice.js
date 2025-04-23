import api from "@/utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  actions: [],
  error: null,
};

export const getActions = createAsyncThunk(
  "actions/getActions",
  async (appId) => {
    const result = await api.get(`/api/actions/getActions/${appId}`);
    return result?.data;
  }
);

// create action
export const createAction = createAsyncThunk(
  "actions/createAction",
  async ({ name, id }) => {
    const result = await api.post(`/api/actions/createAction/${id}`, {
      name,
    });

    return result?.data;
  }
);

// update action
export const updateAction = createAsyncThunk(
  "actions/updateAction",
  async ({ actionData, id }) => {
    const result = await api.put(`/api/actions/updateAction/${id}`, actionData);

    return result?.data;
  }
);

// delete action
export const deleteAction = createAsyncThunk(
  "actions/deleteAction",
  async ({ id }) => {
    const result = await api.delete(`/api/actions/deleteAction/${id}`);

    return result?.data;
  }
);

// export action slice
const actionSlice = createSlice({
  name: "actions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET ACTIONS
      .addCase(getActions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getActions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.actions = action.payload.actions || [];
        state.error = null;
      })
      .addCase(getActions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      
      // CREATE ACTION
      .addCase(createAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAction.fulfilled, (state, action) => {
        state.isLoading = false;
        // We'll fetch the updated list instead of updating state directly
        state.error = null;
      })
      .addCase(createAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      
      // UPDATE ACTION
      .addCase(updateAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAction.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the action in the state
        const updatedAction = action.payload.data;
        state.actions = state.actions.map(action => 
          action._id === updatedAction._id ? updatedAction : action
        );
        state.error = null;
      })
      .addCase(updateAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      
      // DELETE ACTION
      .addCase(deleteAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAction.fulfilled, (state, action) => {
        state.isLoading = false;
        // We'll fetch the updated list instead of updating state directly
        state.error = null;
      })
      .addCase(deleteAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default actionSlice.reducer;