import { useEffect, useState } from "react";
import { verifyUser } from "../../api/auth/verifyUser";
import infinoraWhiteLogo from "../../assets/images/logo/Infinora-white-transparent.png";
import { Link, useNavigate } from "react-router-dom";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";
import { FiPackage } from "react-icons/fi";
import { GrFavorite } from "react-icons/gr";
import SearchBar from "../Form/SearchBar";

export default function Header() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const result = await verifyUser();
        setIsAuthenticated(result.authenticated && (result.role === "user" || result.role === "vendor"));
      } catch (error) {
        console.error("Authentication check failed:", error);
      }
    };

    checkAuthentication();
  }, [navigate]);

  return (
    <>
      <header className="bg-black fixed w-full z-50">
        <nav className="text-white text-xl">
          <ul className="flex h-[75px] items-center pl-4 gap-5">
            <li onClick={() => navigate("/")} className="cursor-pointer">
              <img
                className="w-44"
                src={infinoraWhiteLogo}
                alt="Infinora white colored logo"
              />
            </li>
            <li>
              <Link to={"/categories"} className="flex items-center">
                <p>Categories</p>
                <RiArrowDropDownLine className="text-4xl" />
              </Link>
            </li>
            <li className="flex-1">
              <SearchBar placeholder={"Search for your desired product"} />
            </li>
            <li>
              {isAuthenticated ? (
                <Link to={"/home/profile"} className="flex items-center gap-1">
                  <FaRegUser />
                  <p>Profile</p>
                </Link>
              ) : (
                <Link to={"/login"} className="flex items-center gap-1">
                  <FaRegUser />
                  <p>Sign In</p>
                </Link>
              )}
            </li>
            <li>
              <Link className="flex items-center gap-1">
                <BsCart3 />
                <p>Cart</p>
              </Link>
            </li>
            <li>
              <Link className="flex items-center gap-1">
                <FiPackage />
                <p>Orders</p>
              </Link>
            </li>
            <li>
              <Link className="flex items-center gap-1">
                <GrFavorite />
                <p>Favorites</p>
              </Link>
            </li>
            <li className="h-full bg-[#F7F23B] flex items-center p-5">
              <Link to={"/home/creator"}>
                <p className="text-black font-dancing-script font-dancing-medium">
                  Creator
                </p>
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
