import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./components/Toast";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load pages for better performance
const Home = React.lazy(() => import("./pages/Home"));
const PhoneCatalog = React.lazy(() => import("./pages/PhoneCatalog"));
const PhoneDetail = React.lazy(() => import("./pages/PhoneDetail"));
const Accessories = React.lazy(() => import("./pages/Accessories"));
const AccessoryDetail = React.lazy(() => import("./pages/AccessoryDetail"));
const Cart = React.lazy(() => import("./pages/Cart"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const Orders = React.lazy(() => import("./pages/Orders"));
const OrderDetail = React.lazy(() => import("./pages/OrderDetail"));

const LoadingFallback: React.FC = () => (
  <div className="flex-center" style={{ minHeight: "60vh" }}>
    <div
      className="skeleton"
      style={{ width: "300px", height: "60px", borderRadius: "1rem" }}
    />
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <div className="App">
                <Navbar />
                <main className="main-content">
                  <React.Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/phones" element={<PhoneCatalog />} />
                      <Route path="/phones/:id" element={<PhoneDetail />} />
                      <Route path="/accessories" element={<Accessories />} />
                      <Route
                        path="/accessories/:id"
                        element={<AccessoryDetail />}
                      />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route
                        path="/cart"
                        element={
                          <ProtectedRoute>
                            <Cart />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/checkout"
                        element={
                          <ProtectedRoute>
                            <Checkout />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/orders"
                        element={
                          <ProtectedRoute>
                            <Orders />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/orders/:id"
                        element={
                          <ProtectedRoute>
                            <OrderDetail />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </React.Suspense>
                </main>
              </div>
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
