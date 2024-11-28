import { FaSearch } from "react-icons/fa";
import HeadAndSideAdmin from "../../../components/Section/HeadAndSideAdmin";
import TableCreator from "@/components/Table/TableCreator";
import {
  productTableHead,
  products,
} from "@/constants/admin/product/productList";
import { CloudCog } from "lucide-react";

export default function ProductListPage() {
  const tableActions = (product) => (
    <div className="flex justify-center gap-2">
      <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => console.log("clicked: ", product)}>
        Approve
      </button>
      <button className="bg-yellow-500 text-white px-3 py-1 rounded">
        Reject
      </button>
    </div>
  );
  return (
    <>
      <HeadAndSideAdmin>
        <div className="flex w-[500px] mt-5 items-center">
          <input
            type="text"
            placeholder="Search product"
            className="rounded-s-full p-2 border border-gray-300 flex w-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="border border-black outline-1 bg-black text-white rounded-r-full p-3">
            <FaSearch />
          </div>
        </div>
        <div className="container mx-auto pt-4">
          <TableCreator
            tableHead={productTableHead}
            tableBody={products}
            actionsRenderer={tableActions}
          />
        </div>
      </HeadAndSideAdmin>
    </>
  );
}
