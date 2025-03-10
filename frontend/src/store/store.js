import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth-slice";
import appReducer from "./slices/app-slice";

import userReducer from "./slices/user-slice";
import folderReducer from "./slices/folder-slice";
import workflowReducer from "./slices/workflow-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,

    user: userReducer,
    folder: folderReducer,
    workflow: workflowReducer,
  },
});

export default store;
