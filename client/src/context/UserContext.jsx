import { createContext, useContext, useState, useEffect } from "react";
import { fetchUser } from "@/api/user/userData";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const response = await fetchUser();
      if (response?.success && response?.user) {
        setUser(response.user);
      } else {
        console.error("Invalid user data format:", response);
        setUser(null);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setError(err?.message || "Failed to fetch user info");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const value = {
    user,
    setUser,
    loading,
    error,
    refreshUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
