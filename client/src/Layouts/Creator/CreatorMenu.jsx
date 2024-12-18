import { Outlet } from "react-router-dom";
import SidebarMenu from "@/components/Section/SidebarMenu";
import { creatorSideMenu } from "@/constants/user/menu/creatorSideMenu";

export default function CreatorMenu() {
  return (
    <>
      <div className="flex relative">
        <aside className="min-w-[250px] border-r-2 bg-white">
          <div className="sticky top-[75px]">
            <SidebarMenu menuItems={creatorSideMenu} />
          </div>
        </aside>
        <div className="w-full p-5">
          <Outlet />
        </div>
      </div>
    </>
  );
}
