import logo from "../../assets/logo.png";
import { Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { IoMdHome } from "react-icons/io";
import { GrSettingsOption } from "react-icons/gr";
import { FaTasks } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { IoIosHelpCircleOutline } from "react-icons/io";

const dashboardSidebarMenuItems = [
  {
    id: "dashboard",
    name: "Dashboard",
    to: "/dashboard",
    icons: <IoMdHome />,
  },
  {
    id: "workflow",
    name: "Workflows",
    to: "/dashboard/workflows",
    icons: <GrSettingsOption />,
  },
  {
    id: "history",
    name: "History",
    to: "/dashboard/history",
    icons: <FaTasks />,
  },
  {
    id: "setting",
    name: "Setting",
    to: "/dashboard/setting",
    icons: <IoIosSettings />,
  },
  {
    id: "help",
    name: "Help",
    to: "/dashboard/help",
    icons: <IoIosHelpCircleOutline />,
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
          className={`flex cursor-pointer text-lg tracking-wide items-center gap-2 rounded-md px-3 py-2 ${location.pathname === menuItem.to
              ? "bg-blue-200 text-grey-900"
              : "text-muted-foreground hover:bg-blue-100 hover:text-gray-900"
            }`}
        >
          {menuItem.icons}
          <span>{menuItem.name}</span>
        </div>
      ))}
    </nav>
  );
}

function UserSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 bg-white">
          <div className="flex w-full flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-3">
                  <img src={logo} alt="logo" className="w-10 h-8" />
                <span className="text-lg font-semibold">
                  SelKey Automation
                </span>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-54 flex-col border-r bg-background p-2 mt-2 lg:flex">
        <div
          onClick={() => navigate("/dashboard")}
          className="flex cursor-pointer items-center gap-2"
        >
          <img src={logo} alt="logo" className="w-10 h-10" />
          <h1 className="text-lg font-semibold">SelKey Automation</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default UserSideBar;
