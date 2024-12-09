import { FaSearch } from "react-icons/fa";

export default function SearchBarAdmin({placeholder}) {
  return (
    <div className="flex w-[500px] items-center">
      <input
        type="text"
        placeholder={placeholder}
        className="rounded-s-full p-2 border border-gray-300 flex w-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />
      <div className="border border-black outline-1 bg-black text-white rounded-r-full p-3">
        <FaSearch />
      </div>
    </div>
  );
}
