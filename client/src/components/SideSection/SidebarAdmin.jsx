import { Link } from "react-router-dom";
import infinoraLogoWhite from "../../assets/images/logo/Infinora-white-transparent.png";
import { AiOutlineDashboard } from "react-icons/ai";
import { AiOutlineProduct } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { FaListCheck } from "react-icons/fa6";
import { RiUserLine } from "react-icons/ri";
import { RiUserStarLine } from "react-icons/ri";
import { RiCoupon2Line } from "react-icons/ri";
import { AiOutlineLogout } from "react-icons/ai";

export default function SideSection() {
  return (
    <>
      <header className="fixed w-full z-50">
        <nav className="text-white text-xl"></nav>
      </header>
      <aside>
        <nav>
          <ul className="flex flex-col items-center gap-5">
            <li>
              <Link>
                <img src={infinoraLogoWhite} alt="Infnora logo white" />
              </Link>
            </li>
            <li>
              <Link className="flex items-center gap-1">
                <AiOutlineDashboard />
                <p>Dashboard</p>
              </Link>
            </li>
            <li>
              <Link className="flex items-center gap-1">
                <AiOutlineProduct />
                <p>Products</p>
              </Link>
            </li>
            <li>
              <Link className="flex items-center gap-1">
                <BiCategory />
                <p>Categories</p>
              </Link>
            </li>
            <li>
              <Link className="flex items-center gap-1">
                <FaListCheck />
                <p>Order List</p>
              </Link>
            </li>
            <li>
              <Link className="flex items-center gap-1">
                <RiUserLine />
                <p>Customers</p>
              </Link>
            </li>
            <li>
              <Link className="flex items-center gap-1">
                <RiUserStarLine />
                <p>Creators</p>
              </Link>
            </li>
            <li>
              <Link className="flex items-center gap-1">
                <RiCoupon2Line />
                <p>Coupons</p>
              </Link>
            </li>
            <li>
              <Link className="flex items-center gap-1">
                <AiOutlineLogout />
                <p>Logout</p>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
