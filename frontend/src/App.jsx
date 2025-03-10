import { Routes, Route } from "react-router-dom";
import Home from "./pages/common/home";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import ForgotPassword from "./pages/auth/forgotPassword";
import UserDashboard from "./pages/user/dashboard";
import Workflows from "./pages/user/workflows";
import History from "./pages/user/history";
import Settings from "./pages/user/setting";
import Help from "./pages/user/help";
import NotFound from "./pages/not-found";
import CommonLayout from "./components/common/commonlayout";
import AuthLayout from "./components/auth/authlayout";
import AdminLayout from "./components/admin/adminlayout";
import UserLayout from "./components/user/userlayout";
import Apps from "./pages/admin/apps";
import Actions from "./pages/admin/actions";
import Triggers from "./pages/admin/triggers";
import InBuiltActions from "./pages/admin/inBuiltActions";
import CheckAuth from "./components/common/check-auth";
import { useSelector, useDispatch } from "react-redux";
import { checkAuth } from "./store/slices/auth-slice";
import { useEffect } from "react";
import Myaccount from "./pages/common/account";
import { Skeleton } from "./components/ui/skeleton";
import { Toaster } from "sonner";
function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-3 h-screen w-full items-center justify-center">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <div className="flex space-x-2">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-4 w-[120px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden">
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <CommonLayout />
            </CheckAuth>
          }
        >
          <Route index element={<Home />} />
          <Route
            path="/auth"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AuthLayout />
              </CheckAuth>
            }
          >
            <Route path="login" element={<AuthLogin />} />
            <Route path="register" element={<AuthRegister />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route
          path="/apps"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route index element={<Apps />} />
          <Route path="actions" element={<Actions />} />
          <Route path="triggers" element={<Triggers />} />
          <Route path="in-built-actions" element={<InBuiltActions />} />
          <Route path="profile" element={<Myaccount />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route
          path="/dashboard"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <UserLayout />
            </CheckAuth>
          }
        >
          <Route index element={<UserDashboard />} />
          <Route path="workflows" element={<Workflows />} />
          <Route path="history" element={<History />} />
          <Route path="setting" element={<Settings />} />
          <Route path="help" element={<Help />} />
          <Route path="profile" element={<Myaccount />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
