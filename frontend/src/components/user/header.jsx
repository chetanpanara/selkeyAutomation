import { Button } from "@/components/ui/button";
import { AlignJustify, UserCog } from "lucide-react";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/store/slices/auth-slice";
import { getUserData } from "@/store/slices/user-slice";
import { useEffect } from "react";

const profileMenus = [
  {
    id: "profile",
    name: "My Account",
    to: "/dashboard/profile",
    icons: <UserCog className="mr-2 h-5 w-5" />,
  },
  {
    id: "subscription",
    name: "My Subscription",
    to: "/dashboard/subscription",
    icons: <UserCog className="mr-2 h-5 w-5" />,
  },
  {
    id: "logout",
    name: "Logout",
    to: "/",
    icons: <LogOut className="mr-2 h-5 w-5" />,
  },
];

function UserHeader({ setOpen }) {
  const { user } = useSelector((state) => state.auth);
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(userData, "userData");
  useEffect(() => {
    if (user?.id) {
      dispatch(getUserData(user.id));
    }
  }, []);

  const handleLogout = async () => {
    try {
      const result = await dispatch(logoutUser()).unwrap();
      if (result.success) {
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b">
      <Button
        onClick={() => setOpen(true)}
        className="lg:hidden sm:block hover:cursor-pointer bg-background hover:bg-slate-200 text-black text-lg"
      >
        <AlignJustify className="h-6 w-6" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="hover:cursor-pointer h-11 w-11">
              <AvatarFallback className="bg-sky-500 border rounded-full  text-white font-bold text-lg">
                {userData?.firstName?.charAt(0).toUpperCase() || ""}
                {userData?.lastName?.charAt(0).toUpperCase() || ""}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            className="w-60 mt-2 bg-white"
            style={{
              backgroundColor: "white",
            }}
          >
            <DropdownMenuLabel className="flex flex-col">
              <span className="text-lg font-semibold">
                {userData?.firstName || ''} {userData?.lastName || ''}
              </span>
              <span className="text-sm text-gray-500">
                {user?.email || ''}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {profileMenus.map((menu) => (
              <DropdownMenuItem
                key={menu.id}
                onClick={() => {
                  if (menu.id === "logout") {
                    handleLogout();
                  } else {
                    navigate(menu.to);
                  }
                }}
                className="hover:cursor-pointer text-base"
              >
                {menu.icons}
                <span>{menu.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default UserHeader;
