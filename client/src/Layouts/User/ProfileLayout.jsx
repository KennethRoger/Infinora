import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function ProfileLayout() {
  const navigate = useNavigate()
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = (location) => {
    
    setIsPressed(!isPressed);
    navigate(location);
  };
  return (
    <>
      <div className="flex bg-[#f1f3f6] pt-[80px]">
      {/* Style and functionality change based on state isPressed to show a click and active effect */}
        <button
          onClick={isPressed ? () => handleClick("/home/profile/profile-info") : ""}
          className={`px-8 border-black/50 border-l-2 font-semibold border-t-[1px] border-r-2 rounded-tl-xl ${
            isPressed
              ? "bg-white shadow-none"
              : "bg-[#ff9500] text-white shadow-[inset_0_0_1px_#000]"
          }`}
        >
          <p>Profile</p>
        </button>
        <button
          onClick={!isPressed ? () => handleClick("/home/profile/creator-profile") : ""}
          className={`px-5 py-2 font-semibold border-black/50 border-t-[1px] border-r-2 rounded-tr-xl ${
            !isPressed
            ? "bg-white shadow-none"
              : "bg-[#ff9500] text-white shadow-[inset_0_0_1px_#000]"
              
          }`}
        >
          <p>Creator Studio</p>
        </button>
      </div>
      <Outlet />
    </>
  );
}
