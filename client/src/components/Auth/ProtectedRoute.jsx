import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { verifyUser } from "../../api/auth/verifyUser";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [status, setStatus] = useState({
    loading: true,
    authenticated: false,
    role: null,
  });

  useEffect(() => {
    const checkUser = async () => {
      const result = await verifyUser();
      setStatus({
        loading: false,
        authenticated: result.authenticated,
        role: result.role,
      });
    };

    checkUser();
  }, []);

  if (status.loading) {
    return <div className="h-full text-center">Loading...</div>;
  }

  if (!status.authenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(status.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
