import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth-slice";
import appReducer from "./slices/app-slice";
import triggerReducer from "./slices/trigger-slice";
import actionReducer from "./slices/action-slice";

import userReducer from "./slices/user-slice";
import folderReducer from "./slices/folder-slice";
import workflowReducer from "./slices/workflow-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
    trigger: triggerReducer,
    action: actionReducer,

    user: userReducer,
    folder: folderReducer,
    workflow: workflowReducer,
  },
});

export default store;
