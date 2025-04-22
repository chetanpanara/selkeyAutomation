import api from "@/utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  actions: [],
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

// export caction slice
const actionSlice = createSlice({
  name: "actions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getActions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getActions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.actions = action.payload.actions;
      })
      .addCase(getActions.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default actionSlice.reducer;
