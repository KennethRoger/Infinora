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
    path: "",
  },
  {
    id: 2,
    label: "My Products",
    icon: <AiFillProduct className="text-[#ff9500]" />,
    path: "",
  },
  {
    id: 3,
    label: "Crafts",
    icon: <FcIdea className="text-[#ff9500]" />,
    path: "",
  },
  {
    id: 4,
    label: "Customer Orders",
    icon: <FaBoxesStacked className="text-[#ff9500]" />,
    path: "",
  },
  {
    id: 5,
    label: "Coupons",
    icon: <RiCoupon2Line className="text-[#ff9500]" />,
    path: "",
  },
];
