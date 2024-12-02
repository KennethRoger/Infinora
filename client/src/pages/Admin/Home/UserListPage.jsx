import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchBarAdmin from "@/components/Form/SearchBarAdmin";
import TableCreator from "@/components/Table/TableCreator";
import { fetchUsers } from "@/redux/features/userSlice";
import {
  customerTableHead,
} from "@/constants/admin/customers/customers";

export default function UserListPage() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const userStatus = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);

  useEffect(() => {
    if (userStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [userStatus, dispatch]);

  return (
    <>
      <SearchBarAdmin />
      {userStatus === "loading" && <p>Loading users...</p>}
      {userStatus === "failed" && <p>Error: {error}</p>}
      {userStatus === "succeeded" && (
        <TableCreator tableHead={customerTableHead} tableBody={users} />
      )}
    </>
  );
}
