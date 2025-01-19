import { Link, useNavigate } from "react-router-dom";
import infinoraLogoWhite from "../../assets/images/logo/Infinora-black-transparent.png";
import { IoIosArrowDropdown } from "react-icons/io";
import { useState } from "react";
import { sideMenuItems } from "@/constants/admin/menu/sideMenuItems";
import { logout } from "@/api/user/userAuth";
import { toast } from "react-hot-toast";

export default function HeadAndSideAdmin({ children }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();

  const handleItemClick = async (item, index) => {
    setActiveIndex(index);
    
    if (item.path === "logout") {
      try {
        const response = await logout();
        if (response.success) {
          toast.success("Logged out successfully");
          navigate("/admin/login");
        } else {
          toast.error("Logout failed");
        }
      } catch (error) {
        console.error("Logout error:", error);
        toast.error("Logout failed");
      }
    } else {
      navigate(item.path);
    }
  };

  return (
    <>
      <header className="fixed w-full z-50 bg-white">
        <nav className="text-xl">
          <ul className="flex justify-between h-[75px] items-center px-5 text-black">
            <li>
              <Link>
                <img
                  className="w-44"
                  src={infinoraLogoWhite}
                  alt="Infnora logo white"
                />
              </Link>
            </li>
            <li className="flex items-center gap-3">
              <div>
                <p>Admin Name</p>
                <small>Admin</small>
              </div>
              <IoIosArrowDropdown />
            </li>
          </ul>
        </nav>
      </header>
      <main className="pt-[75px] flex">
        <aside className="w-[250px] pt-[20px] fixed bg-white">
          <nav>
            <ul className="flex flex-col items-center text-xl">
              {sideMenuItems.map((item, index) => (
                <li
                  key={item.id}
                  className={`flex p-3 pl-14 w-full cursor-pointer ${
                    activeIndex === index
                      ? "bg-[#4880FF] text-white"
                      : "hover:bg-[#4880FF] hover:text-white"
                  }`}
                  onClick={() => handleItemClick(item, index)}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <p>{item.label}</p>
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <section className="bg-[#F5F6FA] ml-[250px] w-full p-10">
          {children}
        </section>
      </main>
    </>
  );
}
