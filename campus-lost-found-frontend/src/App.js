import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminPage from "./pages/AdminPage";
import ClaimItem from "./pages/ClaimItem";
import VerifyUsers from "./components/VerifyUsers";
import ItemDetails from "./pages/ItemDetails"; // NEW
import VerifyUserDetails from "./pages/VerifyUserDetails";
import ClaimItemTest from "./pages/ClaimItemTest";
import MyClaims from "./pages/MyClaims";
import Inbox from "./pages/Inbox";
import MyReports from "./pages/MyReports";
import { getStoredUser } from "./utils/storage";

function App() {
  const [user, setUser] = useState(getStoredUser);

  const refreshUser = () => {
    setUser(getStoredUser());
  };

  useEffect(() => {
    window.addEventListener("storage", refreshUser);
    return () => window.removeEventListener("storage", refreshUser);
  }, []);

  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
        <Navbar user={user} onLogout={refreshUser} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!user ? <Login onLogin={refreshUser} /> : <Navigate to="/" replace />} />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" replace />} />
            <Route path="/verify-users" element={user?.role === "admin" ? <VerifyUsers /> : <Navigate to="/" replace />} />
            <Route
              path="/dashboard"
              element={
                user?.role === "admin"
                  ? <Navigate to="/admin-dashboard" replace />
                  : user
                    ? <Dashboard />
                    : <Navigate to="/login" replace />
              }
            />
            <Route path="/admin-dashboard" element={user?.role === "admin" ? <AdminPage /> : <Navigate to="/" replace />} />
            
            {/* Item Details Page */}
            <Route path="/items/:id" element={<ItemDetails />} />

            <Route path="/verify-users/:id" element={user?.role === "admin" ? <VerifyUserDetails /> : <Navigate to="/" replace />} />

            <Route 
              path="/claim" 
              element={user?.role === "admin" ? <ClaimItem /> : <Navigate to={user ? "/" : "/login"} replace />} 
            />

            <Route path="/test-claims" element={user?.role === "admin" ? <ClaimItemTest /> : <Navigate to="/" replace />} />
            <Route path="/my-claims" element={user ? <MyClaims /> : <Navigate to="/login" replace />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/my-reports" element={user ? <MyReports /> : <Navigate to="/login" replace />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </Router>
  );
}

export default App;
