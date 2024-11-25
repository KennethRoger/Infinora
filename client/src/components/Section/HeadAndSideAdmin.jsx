import { Link } from "react-router-dom";
import infinoraLogoWhite from "../../assets/images/logo/Infinora-black-transparent.png";
import {
  AiOutlineDashboard,
  AiOutlineProduct,
  AiOutlineLogout,
} from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { FaListCheck } from "react-icons/fa6";
import { RiUserLine, RiUserStarLine, RiCoupon2Line } from "react-icons/ri";
import { IoIosArrowDropdown } from "react-icons/io";
import { useState } from "react";

export default function HeadAndSideAdmin({ children }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const menuItems = [
    {
      id: 1,
      label: "Dashboard",
      icon: <AiOutlineDashboard />,
      path: "/dashboard",
    },
    {
      id: 2,
      label: "Products",
      icon: <AiOutlineProduct />,
      path: "admin/product-list",
    },
    {
      id: 3,
      label: "Categories",
      icon: <BiCategory />,
      path: "admin/category-list",
    },
    {
      id: 4,
      label: "Order List",
      icon: <FaListCheck />,
      path: "admin/order-list",
    },
    {
      id: 5,
      label: "Customers",
      icon: <RiUserLine />,
      path: "admin/customer-list",
    },
    {
      id: 6,
      label: "Creators",
      icon: <RiUserStarLine />,
      path: "admin/creator-list",
    },
    { id: 7, label: "Coupons", icon: <RiCoupon2Line />, path: "admin/coupons" },
    { id: 8, label: "Logout", icon: <AiOutlineLogout />, path: "admin/logout" },
  ];

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
              {menuItems.map((item, index) => (
                <li
                  key={item.id}
                  className={`flex p-3 pl-14 w-full cursor-pointer ${
                    activeIndex === index
                      ? "bg-[#4880FF] text-white"
                      : "hover:bg-[#4880FF] hover:text-white"
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  <Link to={item.path} className="flex items-center gap-3">
                    {item.icon}
                    <p>{item.label}</p>
                  </Link>
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
