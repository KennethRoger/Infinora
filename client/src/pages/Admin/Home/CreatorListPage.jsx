import Button from "@/components/Form/Button";
import SearchBarAdmin from "@/components/Form/SearchBarAdmin";
import TableCreator from "@/components/Table/TableCreator";
import {
  nonVerifiedCreatorTableHead,
  nonVerifiedCreators,
} from "@/constants/admin/creators/creatorApproval";
import {
  creatorTableHead,
  creators,
} from "@/constants/admin/creators/creators";

export default function () {
  const creatorVerficaitonButton = (creator) => (
    <Button
      styles={`bg-green-[#00B69B]`}
      onClick={() => console.log("Downloading...\nDone!\nData: ", creator)}
    >
      Download
    </Button>
  );

  const tableActions = (creator) => (
    <div className="flex justify-center gap-2">
      <button
        className="bg-green-500 text-white px-3 py-1 rounded"
        onClick={() => console.log("clicked: ", creator)}
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
      <h1 className="text-4xl font-bold">Creator Requests</h1>
      <SearchBarAdmin />
      <TableCreator
        tableHead={nonVerifiedCreatorTableHead}
        tableBody={nonVerifiedCreators}
        actionsRenderer={tableActions}
        extraActionRenderer={creatorVerficaitonButton}
      />
      <h1 className="text-4xl mt-10 font-bold">Creator Requests</h1>
      <SearchBarAdmin />
      <TableCreator
        tableHead={creatorTableHead}
        tableBody={creators}
        actionsRenderer={tableActions}
      />
    </>
  );
}
