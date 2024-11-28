import SearchBarAdmin from "@/components/Form/SearchBarAdmin";
import HeadAndSideAdmin from "@/components/Section/HeadAndSideAdmin";
import TableCreator from "@/components/Table/TableCreator";
import React from "react";
import {
  customerTableHead,
  customers,
} from "@/constants/admin/customers/customers";

export default function UserListPage() {
  return (
    <>
      <SearchBarAdmin />
      <TableCreator tableHead={customerTableHead} tableBody={customers} />
    </>
  );
}
