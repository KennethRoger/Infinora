import { Outlet } from "react-router-dom";
import SidebarMenu from "@/components/Section/SidebarMenu";
import { profileSideMenu } from "@/constants/user/menu/profileSideMenu";

export default function ProfilePage() {
  return (
    <>
      <div className="flex">
        <aside className="min-w-[250px]">
          <div className="p-5">
            <p>Hello,</p>
            <p className="text-2xl">Username</p>
          </div>
          <SidebarMenu menuItems={profileSideMenu} />
        </aside>
        <div className="w-full border-black/50">
          <Outlet />
        </div>
      </div>
    </>
  );
}
