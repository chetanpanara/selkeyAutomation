import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import UserHeader from './header'
import UserSideBar from './sidebar'

function UserLayout() {
    const [openSidebar, setOpenSidebar] = useState(false);

    return (
        <div className="flex min-h-screen mb-20 w-full">
          {/* dashboard sidebar */}
          <UserSideBar open={openSidebar} setOpen={setOpenSidebar} />
          <div className="flex flex-1 flex-col">
            {/* dashboard header */}
            <UserHeader setOpen={setOpenSidebar} />
            <main className="flex-col flex bg-muted/40 p-2 md:p-2">
              <Outlet />
            </main>
          </div>
        </div>
      );
}

export default UserLayout;