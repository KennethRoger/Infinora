import SearchBarAdmin from "@/components/Form/SearchBarAdmin";
import HeadAndSideAdmin from "../../../components/Section/HeadAndSideAdmin";
import TableCreator from "@/components/Table/TableCreator";
import {
  productTableHead,
  products,
} from "@/constants/admin/products/productList";

export default function ProductListPage() {
  const tableActions = (product) => (
    <div className="flex justify-center gap-2">
      <button
        className="bg-green-500 text-white px-3 py-1 rounded"
        onClick={() => console.log("clicked: ", product)}
      >
        Approve
      </button>
      <button className="bg-yellow-500 text-white px-3 py-1 rounded">
        Reject
      </button>
    </div>
  );
  return (
    <>
      <SearchBarAdmin />
      <TableCreator
        tableHead={productTableHead}
        tableBody={products}
        actionsRenderer={tableActions}
      />
    </>
  );
}
