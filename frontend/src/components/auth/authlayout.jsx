import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex w-full min-h-[calc(100vh-128px)]">
      <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
