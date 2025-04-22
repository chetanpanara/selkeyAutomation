import api from "@/utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  triggers: [],
};

// router.get("/getTriggers/:appId", getTriggers);
export const getTriggers = createAsyncThunk(
  "triggers/getTriggers",
  async (id) => {
    const result = await api.get(`/api/triggers/getTriggers/${id}`);

    return result?.data;
  }
);

// router.post("/createTrigger/:appId", createTrigger);
export const createTrigger = createAsyncThunk(
  "triggers/createTrigger",
  async ({ name, id }) => {
    console.log("triggerData", name);
    console.log("id", id);
    const result = await api.post(`/api/triggers/createTrigger/${id}`, {
      name,
    });

    return result?.data;
  }
);
// router.put("/updateTrigger/:triggerId", updateTrigger);
export const updateTrigger = createAsyncThunk(
  "triggers/updateTrigger",
  async ({ triggerData, id }) => {
    const result = await api.put(
      `/api/triggers/updateTrigger/${id}`,
      triggerData
    );

    return result?.data;
  }
);
// router.delete("/deleteTrigger/:triggerId", deleteTrigger);

export const deleteTrigger = createAsyncThunk(
  "triggers/deleteTrigger",
  async ({ id }) => {
    const result = await api.delete(`/api/triggers/deleteTrigger/${id}`);

    return result?.data;
  }
);

const triggerSlice = createSlice({
  name: "triggers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTriggers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTriggers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.triggers = action.payload.triggers; // Update this line to correctly store triggers
      })
      .addCase(getTriggers.rejected, (state) => {
        state.isLoading = false;
        state.triggers = [];
      });
  },
});

export default triggerSlice.reducer;
