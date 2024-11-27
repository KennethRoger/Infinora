import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  return (
    <>
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Search for your desired product"
          className="rounded-full p-2 flex flex-1"
        />
        <div className="absolute right-1 text-white bg-black rounded-full p-2">
          <FaSearch />
        </div>
      </div>
    </>
  );
}
