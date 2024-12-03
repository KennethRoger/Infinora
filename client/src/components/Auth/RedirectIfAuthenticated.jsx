import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyUser } from "../../api/auth/verifyUser";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState({
    loading: true,
    authenticated: false,
    role: null,
  });

  useEffect(() => {
    const checkUser = async () => {
      const result = await verifyUser();
      console.log("result from proute: ", result)
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

  if (status.authenticated) {
    navigate(-1);
    return null;
  }

  return children;
};

export default ProtectedRoute;
