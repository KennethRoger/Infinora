import { Outlet } from "react-router-dom";
import SidebarMenu from "@/components/Section/SidebarMenu";
import { profileSideMenu } from "@/constants/user/menu/profileSideMenu";
import { useEffect } from "react";
import { useUser } from "@/context/UserContext";

export default function ProfilePage() {
  const { user, loading, refreshUser } = useUser();

  useEffect(() => {
    refreshUser();
  }, []);

  if (loading) return <div>Loading...</div>

  return (
    <>
      <div className="flex relative">
        <aside className="min-w-[250px] border-2 sticky top-0">
          <div className="p-5">
            <p className="text-xl">Hello,</p>
            <p className="text-2xl font-bold">{user && user.name ? user.name : "User"}</p>
          </div>
          <SidebarMenu menuItems={profileSideMenu} />
        </aside>
        <div className="w-full border-black/50 p-5">
          <Outlet context={{user}} />
        </div>
      </div>
    </>
  );
}
