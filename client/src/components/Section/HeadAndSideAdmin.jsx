import { Link } from "react-router-dom";
import infinoraLogoWhite from "../../assets/images/logo/Infinora-black-transparent.png";
import { IoIosArrowDropdown } from "react-icons/io";
import { useState } from "react";
import { sideMenuItems } from "@/constants/admin/menu/sideMenuItems";

export default function HeadAndSideAdmin({ children }) {
  const [activeIndex, setActiveIndex] = useState(null);

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
