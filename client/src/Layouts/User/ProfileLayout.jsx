import { useState } from "react";
import { Outlet } from "react-router-dom";

export default function ProfileLayout() {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(!isPressed);
  };
  return (
    <>
      <div className="flex bg-[#f1f3f6] pt-[80px]">
        <button
          onClick={handleClick}
          className={`px-9 border-black/50 border-l-2 border-t-[1px] border-r-2 rounded-tl-xl hover:bg-gray-200 ${
            isPressed
              ? "bg-white shadow-none"
              : "bg-gray-200 shadow-[inset_0_0_4px_#000]"
          }`}
        >
          <p>Profile</p>
        </button>
        <button
          onClick={handleClick}
          className={`px-5 py-2 border-black/50 border-t-[1px] border-r-2 rounded-tr-xl hover:bg-gray-200 ${
            isPressed
              ? "bg-gray-200 shadow-[inset_0_0_3px_#000]"
              : "bg-white shadow-none"
          }`}
        >
          <p>Creator Studio</p>
        </button>
      </div>
      <Outlet />
    </>
  );
}
