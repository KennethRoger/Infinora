import { Outlet } from "react-router-dom";
import SidebarMenu from "@/components/Section/SidebarMenu";
import { creatorSideMenu } from "@/constants/user/menu/creatorSideMenu";

export default function CreatorMenu() {
    return (
        <>
            <div className="flex relative">
                <aside className="min-w-[250px] sticky top-0">
                    <SidebarMenu menuItems={creatorSideMenu} />
                </aside>
                <div className="w-full border-black/50 p-5">
                    <Outlet />
                </div>
            </div>
        </>
    );
}