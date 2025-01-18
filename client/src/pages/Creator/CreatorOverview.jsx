import { useUser } from "@/context/UserContext";
import imagePlaceholder from "../../assets/images/banner-img.jpg";
import profilePlaceHolder from "../../assets/images/holding-shoes.jpg";
import { useEffect } from "react";
import SalesReport from "./SalesReport/SalesReport";
import ProductPerformance from "./SalesReport/ProductPerformance";
import SalesAndOrdersChart from "./SalesReport/SalesAndOrdersChart";

export default function CreatorOverview() {
  const { user, refreshUser } = useUser();

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative mb-8">
        <div className="h-48 bg-gray-200">
          <img
            src={imagePlaceholder || "/path-to-default-banner.jpg"}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <img
          src={user?.profileImagePath || profilePlaceHolder}
          alt="Profile pic"
          width={120}
          height={120}
          className="absolute top-20 left-8 transform translate-y-1/2 rounded-full border-4 border-white object-cover"
        />
        <div className="flex">
          <div className="h-[100px] w-[100px]"></div>
          <div className="pl-[70px] pt-3 w-full p-10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {user?.name || "Creator Name"}
                </h2>
                <p className="text-gray-600">{user?.bio || "Creator Bio"}</p>
              </div>
              <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 transition">
                Edit profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="space-y-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <ProductPerformance />
            <SalesAndOrdersChart />
            <SalesReport />
          </div>
        </div>
      </div>
    </div>
  );
}
