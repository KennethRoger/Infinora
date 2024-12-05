import { Outlet } from "react-router-dom";
import SidebarMenu from "@/components/Section/SidebarMenu";
import { profileSideMenu } from "@/constants/user/menu/profileSideMenu";
import { useEffect, useState } from "react";
import { fetchUser } from "@/api/user/userData";

export default function ProfilePage() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchUser();
        const resUser = response.user;
        setUser(resUser);
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) return <div>Loading...</div>

  return (
    <>
      <div className="flex relative">
        <aside className="min-w-[250px] border-2 sticky top-0">
          <div className="p-5">
            <p className="text-xl">Hello,</p>
            <p className="text-2xl font-bold">User</p>
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
