import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/utils/axios";

const initialState = {
  userData: null,
  isLoading: false,
};

// update user data
export const updateUserData = createAsyncThunk(
  "user/updateUserData",
  async ({ userId, data }) => {
    const response = await api.put(`/api/user/updateUserData/${userId}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response?.data;
  }
);

// update user password
export const updateUserPassword = createAsyncThunk(
  "user/updateUserPassword",
  async ({ userId, data }) => {
    const response = await api.put(
      `/api/user/updateUserPassword/${userId}`,
      data
    );
    return response?.data;
  }
);

// get user data
export const getUserData = createAsyncThunk(
  "user/getUserData",
  async (userId) => {
    const response = await api.get(`/api/user/getUserData/${userId}`);

    return response?.data;
  }
);

// create user slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload.userData; // Fixed to correctly set userData
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload.data || null;
      })
      .addCase(getUserData.rejected, (state) => {
        state.isLoading = false;
        state.userData = null;
      });
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
