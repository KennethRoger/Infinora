import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchBarAdmin from "@/components/Form/SearchBarAdmin";
import TableCreator from "@/components/Table/TableCreator";
import { fetchUsers } from "@/redux/features/userSlice";
import axios from "axios";
import { customerTableHead } from "@/constants/admin/customers/customers";
import Pagination from "@/components/Pagination";
import { formatDate } from "@/utils/dateFormatter";

export default function UserListPage() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const userStatus = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);
  const pagination = useSelector((state) => state.users.pagination);
  const [localUsers, setLocalUsers] = useState([]);

  useEffect(() => {
    if (userStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [userStatus, dispatch]);

  useEffect(() => {
    if (userStatus === "succeeded") {
      const formattedUsers = users.map((user) => ({
        ...user,
        createdAt: formatDate(user.createdAt),
      }));
      setLocalUsers(formattedUsers);
    }
  }, [users, userStatus]);

  const handlePageChange = (page) => {
    dispatch(fetchUsers({ page }));
  };

  const tableActions = (user) => {
    const handleBlock = async () => {
      try {
        await axios.post(
          `${import.meta.env.VITE_USERS_API_BASE_URL}/api/auth/block`,
          { id: user._id, role: user.role }
        );
        setLocalUsers((prevUsers) =>
          prevUsers.map((u) =>
            u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u
          )
        );
      } catch (error) {
        console.error("Error updating user block status:", error);
      }
    };

    return (
      <>
        <button
          onClick={handleBlock}
          className={`text-white ${
            user.isBlocked ? "bg-gray-500" : "bg-red-500 hover:bg-red-600"
          } gap-2 w-full border px-5 min-w-[50px] rounded h-12 shadow-md text-lg`}
        >
          {user.isBlocked ? "Unblock" : "Block"}
        </button>
      </>
    );
  };

  const filteredUsers = localUsers.filter((user) => user.role === "user");

  return (
    <>
      <SearchBarAdmin />
      {userStatus === "loading" && <p>Loading users...</p>}
      {userStatus === "failed" && <p>Error: {error}</p>}
      {userStatus === "succeeded" && (
        <>
          <TableCreator
            tableHead={customerTableHead}
            tableBody={filteredUsers}
            actionsRenderer={tableActions}
          />
          {pagination?.totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
