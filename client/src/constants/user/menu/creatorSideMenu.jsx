import { GrOverview } from "react-icons/gr";
import { AiFillProduct } from "react-icons/ai";
import { FcIdea } from "react-icons/fc";
import { FaBoxesStacked } from "react-icons/fa6";
import { RiCoupon2Line } from "react-icons/ri";

export const creatorSideMenu = [
  
  {
    id: 1,
    label: "Overview",
    icon: <GrOverview className="text-[#ff9500]" />,
    path: "/home/profile/creator/overview",
  },
  {
    id: 2,
    label: "My Products",
    icon: <AiFillProduct className="text-[#ff9500]" />,
    path: "/home/profile/creator/products",
  },
  {
    id: 3,
    label: "Crafts",
    icon: <FcIdea className="text-[#ff9500]" />,
    path: "/home/profile/creator/crafts",
  },
  {
    id: 4,
    label: "Customer Orders",
    icon: <FaBoxesStacked className="text-[#ff9500]" />,
    path: "/home/profile/creator/customer-orders",
  },
  {
    id: 5,
    label: "Coupons",
    icon: <RiCoupon2Line className="text-[#ff9500]" />,
    path: "/home/profile/creator/coupons",
  },
];
