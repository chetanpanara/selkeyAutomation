import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "./header";
import AdminSidebar from "./sidebar";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);
  return (
    <div className=" flex min-h-screen w-full">
      {/* admin sidebar */}
      <AdminSidebar open={openSidebar} setOpen={setOpenSidebar} />
      <div className="flex flex-1 flex-col">
        {/* admin header */}
        <AdminHeader setOpen={setOpenSidebar} />
        <main className="flex-col flex bg-muted/40 p-2 md:p-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
