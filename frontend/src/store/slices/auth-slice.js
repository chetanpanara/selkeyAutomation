import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

// register user
export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData) => {
    const response = await api.post("/api/auth/register", formData, {
      withCredentials: true,
    });

    return response.data;
  }
);

// login user
export const loginUser = createAsyncThunk(
  "/auth/login",

  async (formData) => {
    const response = await api.post("/api/auth/login", formData, {
      withCredentials: true,
    });

    return response.data;
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",

  async () => {
    const response = await api.post(
      "/api/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

// checkauth

export const checkAuth = createAsyncThunk("/auth/checkauth", async () => {
  const response = await api.get("/api/auth/check-auth", {
    withCredentials: true,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });

  return response.data;
});

// forgot-password
export const forgotPassword = createAsyncThunk(
  "/auth/forgot-password",
  async (email) => {
    const response = await api.post(
      "/api/auth/forgot-password",
      { email },
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);
// verify-otp
export const verifyOTP = createAsyncThunk(
  "/auth/verify-otp",
  async ({ email, otp }) => {
    const response = await api.post(
      "/api/auth/verify-otp",
      { email, otp },
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

// reset-password
export const resetPassword = createAsyncThunk(
  "/auth/reset-password",

  async ({ resetToken, newPassword }) => {
    const response = await api.post(
      "/api/auth/reset-password",
      {
        resetToken,
        newPassword,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

// auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
