import { Fragment, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import logo from "@/assets/logo.png";
import { IoMdHome } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import { GrAction, GrTrigger } from "react-icons/gr";
import { HiMenuAlt1 } from "react-icons/hi";

const dashboardSidebarMenuItems = [
  {
    id: "Apps",
    name: "Apps",
    to: "/apps",
    icons: <IoMdHome />,
  },
  {
    id: "Triggers",
    name: "Triggers",
    to: "/apps/triggers",
    icons: <GrTrigger />,
  },
  {
    id: "Actions",
    name: "Actions",
    to: "/apps/actions",
    icons: <GrAction />,
  },
  {
    id: "InBuiltAction",
    name: "Inbuilt Actions",
    to: "/apps/in-built-actions",
    icons: <HiMenuAlt1 />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mt-8 flex-col flex gap-2">
      {dashboardSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.to);
            setOpen ? setOpen(false) : null;
          }}
          className={`flex cursor-pointer text-lg tracking-wide items-center gap-2 rounded-md px-3 py-2 ${
            location.pathname === menuItem.to
              ? "bg-blue-200 text-grey-900"
              : "text-muted-foreground hover:bg-blue-100 hover:text-gray-900"
          }`}
        >
          
          <span className="text-gray-900">{menuItem.icons}</span>
          <span className="text-gray-900">{menuItem.name}</span>
        </div>
      ))}
    </nav>
  );
}

function AdminSidebar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* mobile view */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 bg-white">
          <div className="flex w-full flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-3">
                <div className="flex items-center gap-2">
                  <img src={logo} alt="logo" className="w-10 h-8" />
                  <span className="text-lg font-semibold">
                    SelKey Automation
                  </span>
                </div>
              </SheetTitle>
             
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>

      {/* desktop view */}
      <aside className="hidden w-64 flex-col border-r bg-background p-2 mt-2 lg:flex">
        <div
          onClick={() => navigate("/apps")}
          className="flex cursor-pointer items-center gap-2"
        >
          <img src={logo} alt="logo" className="w-13 h-9" />
          <h1 className="text-lg font-medium ">SelKey Automation</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSidebar;
