import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AlignJustify, Check, LogOut } from "lucide-react";
import { UserCog } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useEffect, useState } from "react";
import { logoutUser } from "@/store/slices/auth-slice";
import { getUserData } from "@/store/slices/user-slice";

const profileMenus = [
  {
    id: "profile",
    name: "My Account",
    to: "/apps/profile",
    icons: <UserCog className="mr-2 h-5 w-5" />,
  },
  {
    id: "logout",
    name: "Logout",
    to: "/",
    icons: <LogOut className="mr-2 h-5 w-5" />,
  },
];
function AdminHeader({ setOpen }) {
  const { user } = useSelector((state) => state.auth);
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        className="lg:hidden sm:block hover:cursor-pointer bg-background hover:bg-slate-200 text-black  text-lg"
      >
        <AlignJustify className="h-6 w-6" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="hover:cursor-pointer h-10 w-10">
              <AvatarFallback className="bg-emerald-200 border border-black text-black font-bold text-lg">
                {userData?.userFirstName?.charAt(0).toUpperCase() || ''}
                {userData?.userLastName?.charAt(0).toUpperCase() || ''}
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
            <DropdownMenuLabel className="flex flex-col gap-1">
              <span className="text-lg font-semibold">
                {userData?.userFirstName || ''} {userData?.userLastName || ''}
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

export default AdminHeader;
