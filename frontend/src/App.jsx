import { Route, Routes, Navigate } from "react-router";
import Dasboard from "./pages/dasboard";
import Form from "./pages/form";
import Register from "./pages/register";
import Login from "./pages/login";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import NotFound from "./components/NotFound";
import HeroDashboard from "./pages/hero";
import { useAuthStore } from "./store/store";
import { useEffect, useState } from "react";
import LoadingSpinner from "./components/loadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/form" replace />;
  }
  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    return <Navigate to="/hero" replace />;
  }

  return children;
};

const AuthenticatedUserGuard = ({ children, allowedPath }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    const allowedPaths = ["/hero"];
    const currentPath = window.location.pathname;
    
    if (!allowedPaths.includes(currentPath) && !allowedPath) {
      return <Navigate to="/hero" replace />;
    }
  }

  return children;
};

export default function App() {
  const { isCheckingAuth, checkAuth, error, clearError, isAuthenticated, user } = useAuthStore();
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
        clearError();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Prevent navigation away from dashboard for authenticated users
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isAuthenticated && user) {
        event.preventDefault();
        event.returnValue = "Are you sure you want to leave? You will be logged out.";
        return "Are you sure you want to leave? You will be logged out.";
      }
    };

    const handlePopState = (event) => {
      if (isAuthenticated && user) {
        const allowedPaths = ["/hero"];
        const currentPath = window.location.pathname;
        
        if (!allowedPaths.includes(currentPath)) {
          window.history.pushState(null, null, "/hero");
        }
      }
    };

    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const allowedPaths = ["/hero"];
      const currentPath = window.location.pathname;
      
      if (!allowedPaths.includes(currentPath)) {
        window.history.replaceState(null, null, "/hero");
      }
    }
  }, [isAuthenticated, user]);

  // if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <>
      {showError && (
        <div className="error-message text-base text-center bg-red-100 text-red-800 p-3 rounded">
          {error}
        </div>
      )}

      <Routes>
        <Route 
          path="/" 
          element={
            <AuthenticatedUserGuard>
              <Dasboard />
            </AuthenticatedUserGuard>
          } 
        />
        <Route
        path=""
        />
        <Route
          path="/register"
          element={
            <RedirectAuthenticatedUser>
              <Register />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <Login />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/hero"
          element={
            <ProtectedRoute>
              <HeroDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/form"
          element={
            <>
              <Navbar />
           <Form />
            </>
          
             
          }
        />
        <Route 
          path="*" 
          element={
            <AuthenticatedUserGuard>
              <NotFound />
            </AuthenticatedUserGuard>
          } 
        />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}