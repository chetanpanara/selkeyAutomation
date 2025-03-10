import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  if (location.pathname === "/") {
    // if location is / and user is not authenticated, stay on '/'
    if (!isAuthenticated) {
      // Allow all paths except those that include 'apps' or 'dashboard'
      if (location.pathname.includes("/apps") || location.pathname.includes("/dashboard")) {
        return <Navigate to="/" />;
      }
      return <>{children}</>; // Allow access to other paths
    }
    else {
      // if authenticated and user.role is admin and location is /, redirect to /apps
      if (isAuthenticated && user?.role === "admin") {
        return <Navigate to="/apps" />;
      }
    // if authenticated and user.role is user and location is /apps, redirect to /dashboard
      if (isAuthenticated && user?.role === "user") {
        return <Navigate to="/dashboard" />;
      }
    }
  }

  // if location is /apps and user is not authenticated, redirect to /
  if (location.pathname.includes("/apps") || location.pathname.includes("/dashboard")) {
    if (!isAuthenticated) {
      return <Navigate to="/" />;
    }
  }

  // if location is /apps and user is authenticated and user.role is user, redirect to /dashboard
  if (
    location.pathname.includes("/apps") &&
    isAuthenticated &&
    (user?.role === "user" || user?.role !== "admin")
  ) {
    return <Navigate to="/dashboard" />;
  }

  // if location is /dashboard and user is authenticated and user.role is admin, redirect to /apps
  if (
    location.pathname.includes("/dashboard") &&
    isAuthenticated &&
    (user?.role === "admin" || user?.role !== "user")
  ) {
    return <Navigate to="/apps" />;
  }

  // Check for authentication pages
  if (isAuthenticated) {
    // Redirect authenticated users away from auth pages
    if (location.pathname.includes("/auth")) {
      if (user?.role === "admin") {
        return <Navigate to="/apps" />;
      }
      if (user?.role === "user") {
        return <Navigate to="/dashboard" />;
      }
    }
  }

  return <>{children}</>;
}

export default CheckAuth;
