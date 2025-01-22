import RegisterPage from "./pages/User/Auth/RegisterPage";
import LoginPage from "./pages/User/Auth/LoginPage";
import LoginPageAdmin from "./pages/Admin/Auth/LoginPageAdmin";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import ForgotPasswordPage from "./pages/User/Auth/ForgotPasswordPage";
import NewPasswordPage from "./pages/User/Auth/NewPasswordPage";
import CartPage from "./pages/User/Home/Cart/CartPage";
import OrderPage from "./pages/User/Home/Order/OrderPage";
import CheckoutLayout from "./pages/User/Home/Checkout/CheckoutLayout";
import DeliveryPage from "./pages/User/Home/Checkout/DeliveryPage";
import PaymentPage from "./pages/User/Home/Checkout/PaymentPage";
import ReviewPage from "./pages/User/Home/Checkout/ReviewPage";
import UserOrderDashboard from "./pages/Creator/UserOrder/UserOrderDashboard";
import { useEffect } from "react";
import TransactionPage from "./pages/User/Home/Transaction/TransactionPage";
import WalletPage from "./pages/User/Home/Wallet/WalletPage";
import NotFound from "./pages/NotFound";
import CouponPage from "./pages/Creator/CreatorCoupon/CouponPage";
import FavoritesPage from "./pages/User/Home/Favorites/FavoritesPage";
import ProductListingPage from "./components/Product/ProductListingPage";
import OrderListPage from "./pages/Admin/Home/OrderListPage";

export function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
          <Route
            path="verify-otp"
            element={
              <RedirectIfAuthenticated>
                <OTPVerificationPage />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="forgot-password"
            element={
              <RedirectIfAuthenticated>
                <ForgotPasswordPage />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="new-password"
            element={
              <RedirectIfAuthenticated>
                <NewPasswordPage />
              </RedirectIfAuthenticated>
            }
          />
        </Route>

        <Route path="/home" element={<HomeLayout />}>
          <Route index element={<MainPage />} />
          <Route path="product/:productId" element={<ProductViewPage />} />
          <Route path="creator" element={<CreatorSection />} />
          <Route path="products" element={<ProductListingPage />} />
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
            <Route path="wallet" element={<ProfilePage />}>
              <Route
                index
                element={
                  <ProtectedRoute allowedRoles={["user", "vendor"]}>
                    <WalletPage />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="transactions" element={<ProfilePage />}>
              <Route
                index
                element={
                  <ProtectedRoute allowedRoles={["user", "vendor"]}>
                    <TransactionPage />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="cart" element={<ProfilePage />}>
              <Route
                index
                element={
                  <ProtectedRoute allowedRoles={["user", "vendor"]}>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="orders" element={<ProfilePage />}>
              <Route
                index
                element={
                  <ProtectedRoute allowedRoles={["user", "vendor"]}>
                    <OrderPage />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="favorites" element={<ProfilePage />}>
              <Route
                index
                element={
                  <ProtectedRoute allowedRoles={["user", "vendor"]}>
                    <FavoritesPage />
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
              <Route
                path="customer-orders"
                element={
                  <ProtectedRoute allowedRoles={["vendor"]}>
                    <UserOrderDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="coupons"
                element={
                  <ProtectedRoute allowedRoles={["vendor"]}>
                    <CouponPage />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>
          {/* Checkout Routes */}
          <Route
            path="checkout"
            element={
              <ProtectedRoute allowedRoles={["user", "vendor"]}>
                <CheckoutLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="delivery" replace />} />
            <Route path="delivery" element={<DeliveryPage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="review" element={<ReviewPage />} />
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
          <Route
            path="category-list"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CategoryListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="order-list"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <OrderListPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
