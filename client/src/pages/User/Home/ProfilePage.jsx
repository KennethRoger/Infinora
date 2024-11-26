import { HiOutlineShoppingCart } from "react-icons/hi";
import { FaAngleRight } from "react-icons/fa6";

export default function ProfilePage() {
  const itemColumn = [{}];

  return (
    <>
      <div className="flex bg-[#f1f3f6]">
        <div className="px-5 py-2 border-l-2 border-r-2 bg-white shadow-inner">
          <p>Profile</p>
        </div>

        <div className="px-5 py-2 border-r-2 bg-white">
          <p>Creator Studio</p>
        </div>
      </div>
      <aside className="w-[200px]">
        <div className="p-5">
          <p>Hello,</p>
          <p className="text-2xl">Username</p>
        </div>
        <div>
          <ul className="text-black mt-2">
            <li className="flex pl-5 pr-3 py-5 border-b-2 border-black border-opacity-50 justify-between items-center ">
              <div className="flex items-center gap-2 text-xl">
                <HiOutlineShoppingCart className="text-[#ff9500]" />
                <p>Cart</p>
              </div>
              <FaAngleRight />
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
