import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function ProfileLayout() {
  const { user, loading, refreshUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    refreshUser();
    setIsPressed(!location.pathname.includes("profile-info"));
  }, [navigate]);

  const handleClick = (path) => {
    if (
      (path.includes("profile-info") && !isPressed) ||
      (!path.includes("profile-info") && isPressed)
    ) {
      return;
    }

    if (path === "/home/profile/creator/overview" && user?.role !== "vendor") {
      navigate("/home/profile/creator-profile");
    } else {
      navigate(path);
    }

    setIsPressed(!isPressed);
  };

  return (
    <>
      <div className="flex bg-[#f1f3f6] pt-[80px] relative z-20">
        <button
          onClick={() => handleClick("/home/profile/profile-info")}
          className={`px-8 border-black/50 border-l-2 font-semibold border-t-[1px] border-r-2 rounded-tl-xl ${
            !isPressed
              ? "bg-[#ff9500] text-white shadow-[inset_0_0_1px_#000]"
              : "bg-white shadow-none"
          }`}
        >
          <p>Profile</p>
        </button>
        <button
          onClick={() => handleClick("/home/profile/creator/overview")}
          className={`px-5 py-2 font-semibold border-black/50 border-t-[1px] border-r-2 rounded-tr-xl ${
            isPressed
              ? "bg-[#ff9500] text-white shadow-[inset_0_0_1px_#000]"
              : "bg-white shadow-none"
          }`}
        >
          <p>Creator Studio</p>
        </button>
      </div>
      <div className="min-h-[150vh]">
        <Outlet />
      </div>
    </>
  );
}
