import { HiOutlineShoppingCart } from "react-icons/hi";
import { MdOutlinePayment } from "react-icons/md";
import { TbActivityHeartbeat } from "react-icons/tb";
import { AiOutlineLogout } from "react-icons/ai";
import { FaListCheck } from "react-icons/fa6";
import { BsCart3 } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";


export const profileSideMenu = [
  {
    id: 1,
    label: "Cart",
    icon: <HiOutlineShoppingCart className="text-[#ff9500]" />,
    path: "/home/cart",
  },
  {
    id: 2,
    label: "Orders",
    icon: <FaListCheck className="text-[#ff9500]" />,
    path: "/home/orders",
  },
  {
    id: 3,
    label: "Favorites",
    icon: <BsCart3 className="text-[#ff9500]" />,
    path: "/home/favorites",
  },
  {
    id: 4,
    label: "Account Settings",
    icon: <FaRegUser className="text-[#ff9500]" />,
    collapse: [
      {
        subId: 11,
        subLabel: "Profile Info",
        subPath: "/home/profile",
      },
      {
        subId: 12,
        subLabel: "Address",
        subPath: "/home/address",
      },
    ],
  },
  {
    id: 5,
    label: "Payments",
    icon: <MdOutlinePayment className="text-[#ff9500]" />,
    collapse: [
      {
        subId: 21,
        subLabel: "Wallet",
        subPath: "#",
      },
      {
        subId: 22,
        subLabel: "Card",
        subPath: "#",
      },
    ],
  },
  {
    id: 6,
    label: "My Stuff",
    icon: <TbActivityHeartbeat className="text-[#ff9500]" />,
    collapse: [
      {
        subId: 31,
        subLabel: "My Vision",
        subPath: "#",
      },
      {
        subId: 32,
        subLabel: "Notifications",
        subPath: "#",
      },
      {
        subId: 33,
        subLabel: "Reviews and Ratings",
        subPath: "#",
      },
      {
        subId: 34,
        subLabel: "Coupons",
        subPath: "#",
      },
    ],
  },
  {
    id: 7,
    label: "Logout",
    icon: <AiOutlineLogout />,
  },
];
