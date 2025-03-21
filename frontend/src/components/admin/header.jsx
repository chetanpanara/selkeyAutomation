import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AlignJustify, ChevronsUpDown, LogOut } from "lucide-react";
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
import { Input } from "../ui/input";
import { GrDown } from "react-icons/gr";
import { getAllApps, setActiveAppId } from "@/store/slices/app-slice";

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
  const { apps } = useSelector((state) => state.app);
  const activeAppId = useSelector((state) => state.app.activeAppId);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [opendropdown, setOpendropdown] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    dispatch(getAllApps()).then((res) => {
      if (res?.payload?.success) {
        dispatch(setActiveAppId(res.payload.data[0]._id));
        setValue(res.payload.data[0].appName);
      }
    });
    if (user?.id) {
      dispatch(getUserData(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (activeAppId !== null) {
      console.log(activeAppId);
      const activeApp = apps.find((app) => app._id === activeAppId);
      if (activeApp) {
        setValue(activeApp.appName);
      }
    }
  }, [activeAppId, apps]);

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
      <div className="flex items-center justify-center flex-1 md:justify-start lg:justify-start md:ml-6 lg:ml-6">
        <Popover open={opendropdown} onOpenChange={setOpendropdown}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={opendropdown}
              className="w-[250px] md:w-[300px] lg:w-[300px] justify-between"
            >
              {value || "Search App..."}
              <GrDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] md:w-[300px] lg:w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search App..." className="h-9" />
              <CommandList>
                <CommandEmpty>No App found.</CommandEmpty>
                <CommandGroup>
                  {apps
                    .slice()
                    .sort((a, b) => {
                      if (a._id === activeAppId) return -1;
                      if (b._id === activeAppId) return 1;
                      return a.appName.localeCompare(b.appName);
                    })
                    .map((app) => (
                      <CommandItem
                        key={app._id}
                        onSelect={() => {
                          dispatch(setActiveAppId(app._id));
                          setValue(app.appName);
                          setOpendropdown(false);
                        }}
                      >
                        {app.appName}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="hover:cursor-pointer h-10 w-10">
              <AvatarFallback className="bg-emerald-200 border border-black text-black font-bold text-lg">
                {userData?.userFirstName?.charAt(0).toUpperCase() || ""}
                {userData?.userLastName?.charAt(0).toUpperCase() || ""}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            className="w-60 mt-2 mr-4 bg-white"
            style={{
              backgroundColor: "white",
            }}
          >
            <DropdownMenuLabel className="flex flex-col gap-1">
              <span className="text-lg font-semibold">
                {userData?.userFirstName || ""} {userData?.userLastName || ""}
              </span>
              <span className="text-sm text-gray-500">{user?.email || ""}</span>
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
