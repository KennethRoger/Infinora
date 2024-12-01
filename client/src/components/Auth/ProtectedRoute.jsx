import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  // const { isAuthenticated, role, user } = useSelector((state) => state.auth);
  // console.log(isAuthenticated, role, user)
  // if (!isAuthenticated) {
  //   return <Navigate to="/home" />;
  // }
  // if (allowedRoles && !allowedRoles.includes(role)) {
  //   return <Navigate to={"/"} />;
  // }

  return children;
};
export default ProtectedRoute;
