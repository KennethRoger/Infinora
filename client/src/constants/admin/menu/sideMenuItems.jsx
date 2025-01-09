import {
  AiOutlineDashboard,
  AiOutlineProduct,
  AiOutlineLogout,
} from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { FaListCheck } from "react-icons/fa6";
import { RiUserLine, RiUserStarLine, RiCoupon2Line } from "react-icons/ri";

export const sideMenuItems = [
  {
    id: 1,
    label: "Dashboard",
    icon: <AiOutlineDashboard />,
    path: "dashboard",
  },
  {
    id: 2,
    label: "Products",
    icon: <AiOutlineProduct />,
    path: "product-list",
  },
  {
    id: 3,
    label: "Categories",
    icon: <BiCategory />,
    path: "category-list",
  },
  {
    id: 4,
    label: "Order List",
    icon: <FaListCheck />,
    path: "order-list",
  },
  {
    id: 5,
    label: "Customers",
    icon: <RiUserLine />,
    path: "user-list",
  },
  {
    id: 6,
    label: "Creators",
    icon: <RiUserStarLine />,
    path: "creator-list",
  },
  { id: 8, label: "Logout", icon: <AiOutlineLogout />, path: "admin/logout" },
];
