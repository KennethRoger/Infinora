import { HiOutlineShoppingCart, HiOutlineHeart } from "react-icons/hi";
import { MdOutlinePayment, MdOutlineAccountBalance } from "react-icons/md";
import { BiWallet } from "react-icons/bi";
import { RiExchangeDollarLine } from "react-icons/ri";
import { AiOutlineLogout } from "react-icons/ai";
import { FaListCheck } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";
import { logout } from "@/api/user/userAuth";
import toast from "react-hot-toast";

const iconStyle = "text-xl text-[#ff9500] group-hover:text-[#ff7800] transition-colors duration-300";

export const profileSideMenu = [
  {
    id: 1,
    label: "Cart",
    icon: <HiOutlineShoppingCart className={iconStyle} />,
    path: "/home/profile/cart",
  },
  {
    id: 2,
    label: "Orders",
    icon: <FaListCheck className={iconStyle} />,
    path: "/home/profile/orders",
  },
  {
    id: 3,
    label: "Favorites",
    icon: <HiOutlineHeart className={iconStyle} />,
    path: "/home/profile/favorites",
  },
  {
    id: 4,
    label: "Account Settings",
    icon: <FaRegUser className={iconStyle} />,
    collapse: [
      {
        subId: 11,
        subLabel: "Profile Info",
        subPath: "/home/profile",
      },
      {
        subId: 12,
        subLabel: "Address",
        subPath: "/home/profile/address",
      },
    ],
  },
  {
    id: 5,
    label: "Payments",
    icon: <MdOutlinePayment className={iconStyle} />,
    collapse: [
      {
        subId: 21,
        subLabel: "Wallet",
        subPath: "/home/profile/wallet",
        icon: <BiWallet className="text-lg text-gray-600 group-hover:text-[#ff9500] transition-colors duration-300" />
      },
      {
        subId: 22,
        subLabel: "Transactions",
        subPath: "/home/profile/transactions",
        icon: <RiExchangeDollarLine className="text-lg text-gray-600 group-hover:text-[#ff9500] transition-colors duration-300" />
      },
    ],
  },
  {
    id: 6,
    label: "My Stuff",
    icon: <MdOutlineAccountBalance className={iconStyle} />,
    collapse: [
      {
        subId: 23,
        subLabel: "Notification",
        subPath: "/home/profile/notification",
      },
      {
        subId: 24,
        subLabel: "My Visions",
        subPath: "/home/profile/my-visions",
      },
      {
        subId: 25,
        subLabel: "My Reviews",
        subPath: "/home/profile/my-reviews",
      },
    ],
  },
  {
    id: 7,
    label: "Logout",
    icon: <AiOutlineLogout className={`${iconStyle} text-red-500 hover:text-red-600`} />,
    onClick: async (navigate) => {
      try {
        const response = await logout();
        console.log(response)
        if (response.success) {
          toast.success(response.message);
          navigate("/");
        }
      } catch (error) {
        console.log(error)
        toast.error(error.response.data.message);
      }
    },
  },
];
