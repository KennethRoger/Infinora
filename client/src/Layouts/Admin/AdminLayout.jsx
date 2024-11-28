import HeadAndSideAdmin from "@/components/Section/HeadAndSideAdmin";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <HeadAndSideAdmin>
      <Outlet />
    </HeadAndSideAdmin>
  );
}
