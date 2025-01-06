import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function ProfileLayout() {
  const { user, loading, refreshUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'creator'

  useEffect(() => {
    refreshUser();
    // Check if current path is in creator routes
    const isCreatorRoute = location.pathname.includes('/creator/');
    setActiveTab(isCreatorRoute ? 'creator' : 'profile');
  }, [location.pathname]);

  const handleTabClick = (tab) => {
    if (tab === activeTab) return;

    if (tab === 'creator') {
      if (user?.role !== "vendor") {
        navigate("/home/profile/creator-profile");
      } else {
        navigate("/home/profile/creator/overview");
      }
    } else {
      navigate("/home/profile/profile-info");
    }
    
    setActiveTab(tab);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-[90px] relative z-20">
        <div className="flex gap-1 px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => handleTabClick('profile')}
            className={`px-8 py-3 font-semibold rounded-t-xl transition-all duration-300 ${
              activeTab === 'profile'
                ? "bg-gradient-to-r from-[#ff9500] to-[#ff7800] text-white shadow-lg transform -translate-y-1"
                : "bg-white hover:bg-gray-50 text-gray-700 shadow"
            }`}
          >
            <p className="text-sm sm:text-base">Profile</p>
          </button>
          <button
            onClick={() => handleTabClick('creator')}
            className={`px-8 py-3 font-semibold rounded-t-xl transition-all duration-300 ${
              activeTab === 'creator'
                ? "bg-gradient-to-r from-[#ff9500] to-[#ff7800] text-white shadow-lg transform -translate-y-1"
                : "bg-white hover:bg-gray-50 text-gray-700 shadow"
            }`}
          >
            <p className="text-sm sm:text-base">Creator Dashboard</p>
          </button>
        </div>
        
        <div className="flex-1 bg-white shadow-xl rounded-b-xl mx-4 sm:mx-6 lg:mx-8 p-4 sm:p-6">
          <Outlet />
        </div>
      </div>
    </>
  );
}
