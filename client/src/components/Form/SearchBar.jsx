import { FaSearch } from "react-icons/fa";

export default function SearchBar({ placeholder }) {
  return (
    <>
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder={placeholder}
          className="rounded-full pl-5 p-2 flex flex-1 border border-black"
        />
        <div className="absolute right-1 text-white bg-black rounded-full p-2 cursor-pointer">
          <FaSearch />
        </div>
      </div>
    </>
  );
}
