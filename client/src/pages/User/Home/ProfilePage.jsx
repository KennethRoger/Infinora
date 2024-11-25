import { HiOutlineShoppingCart } from "react-icons/hi";
import { FaAngleRight } from "react-icons/fa6";

export default function ProfilePage() {
  const itemColumn = [
    {}
  ]

  return (
    <>
      <div className="flex bg-[#f1f3f6]">
        <div className="px-5 py-2 border-l-2 border-r-2 bg-white">
          <p>Profile</p>
        </div>
        <div className="px-5 py-2 border-l-2 border-r-2 bg-white">
          <p>Creator Studio</p>
        </div>
      </div>
      <aside className="w-[200px]">
        <p>Hello</p>
        <p>Username</p>
        <div>
          <ul className="text-black ">
            <li className="flex pl-5 border-b-2 flex-between items-center ">
              <div className="flex items-center">
                <HiOutlineShoppingCart className="text-[#ff9500]" />
                <p>Cart</p>
              </div>
              <FaAngleRight />
            </li>
            <li>

            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
