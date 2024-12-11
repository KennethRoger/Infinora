import RegisterPage from "./pages/User/Auth/RegisterPage";
import LoginPage from "./pages/User/Auth/LoginPage";
import LoginPageAdmin from "./pages/Admin/Auth/LoginPageAdmin";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import OTPVerificationPage from "./pages/User/Auth/OTPVerificationPage";
import ProductListPage from "./pages/Admin/Home/ProductListPage";
import ProfilePage from "./Layouts/User/ProfilePage";
import LandingPage from "./pages/User/Home/LandingPage";
import MainPage from "./pages/User/Home/MainPage";
import CreatorSection from "./pages/Creator/CreatorSection";
import UserListPage from "./pages/Admin/Home/UserListPage";
import CreatorListPage from "./pages/Admin/Home/CreatorListPage";
import AdminLayout from "./Layouts/Admin/AdminLayout";
import DashboardPage from "./pages/Admin/Home/DashboardPage";
import AuthLayout from "./Layouts/User/AuthLayout";
import HomeLayout from "./Layouts/User/HomeLayout";
import ProfileLayout from "./Layouts/User/ProfileLayout";
import ProfileInfo from "./pages/User/Home/ProfileInfo";
import CreatorProfile from "./pages/Creator/CreatorProfile";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import RedirectIfAuthenticated from "./components/Auth/RedirectIfAuthenticated";
import CategoryListPage from "./pages/Admin/Home/CategoryListPage";
import CreatorMenu from "./Layouts/Creator/CreatorMenu";
import CreatorOverview from "./pages/Creator/CreatorOverview";
import CreatorProductDashboard from "./pages/Creator/CreatorProduct/CreatorProductDashboard";
import CreatorAddProduct from "./pages/Creator/CreatorProduct/CreatorAddProduct";
import ProductViewPage from "./components/Product/ProductViewPage";
import CreatorEditProduct from "./pages/Creator/CreatorProduct/CreatorEditProduct";
import AddressInfo from "./pages/User/Home/Address/AddressInfo";
import AddAddress from "./pages/User/Home/Address/AddAddress";

export function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
          },
          success: {
            style: {
              background: "green",
            },
          },
          error: {
            style: {
              background: "red",
            },
          },
        }}
      />
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<LandingPage />} />

        <Route element={<AuthLayout />}>
          <Route
            path="login"
            element={
              <RedirectIfAuthenticated>
                <LoginPage />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="register"
            element={
              <RedirectIfAuthenticated>
                <RegisterPage />
              </RedirectIfAuthenticated>
            }
          />
          <Route path="verify-otp" element={<OTPVerificationPage />} />
        </Route>

        <Route path="/home" element={<HomeLayout />}>
          <Route index element={<MainPage />} />
          <Route path="product/:productId" element={<ProductViewPage />} />
          <Route path="creator" element={<CreatorSection />} />
          <Route path="profile" element={<ProfileLayout />}>
            <Route index element={<Navigate to="profile-info" replace />} />
            <Route path="profile-info" element={<ProfilePage />}>
              <Route
                index
                element={
                  <ProtectedRoute allowedRoles={["user", "vendor"]}>
                    <ProfileInfo />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="address" element={<ProfilePage />}>
              <Route
                index
                element={
                  <ProtectedRoute allowedRoles={["user", "vendor"]}>
                    <AddressInfo />
                  </ProtectedRoute>
                }
              />
              <Route
                path="add-address"
                element={
                  <ProtectedRoute allowedRoles={["user", "vendor"]}>
                    <AddAddress />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Creator Routes */}
            <Route
              path="creator-profile"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <CreatorProfile />
                </ProtectedRoute>
              }
            />
            <Route path="creator" element={<CreatorMenu />}>
              <Route
                path="overview"
                element={
                  <ProtectedRoute allowedRoles={["vendor"]}>
                    <CreatorOverview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="products"
                element={
                  <ProtectedRoute allowedRoles={["vendor"]}>
                    <CreatorProductDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="products/add"
                element={
                  <ProtectedRoute allowedRoles={["vendor"]}>
                    <CreatorAddProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="edit-product/:productId"
                element={
                  <ProtectedRoute allowedRoles={["vendor"]}>
                    <CreatorEditProduct />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin/login"
          element={
            <RedirectIfAuthenticated>
              <LoginPageAdmin />
            </RedirectIfAuthenticated>
          }
        />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/login" replace />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="product-list"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ProductListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="user-list"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UserListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="creator-list"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CreatorListPage />
              </ProtectedRoute>
            }
          />
          <Route path="category-list" element={<CategoryListPage />} />
        </Route>
      </Routes>
    </>
  );
}
