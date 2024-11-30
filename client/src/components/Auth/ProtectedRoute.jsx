const { useSelector } = require("react-redux");
const { Navigate } = require("react-router-dom");

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={"/unauthorized"} />;
  }

  return children;
};

export default ProtectedRoute;
