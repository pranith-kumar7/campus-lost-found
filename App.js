import React from "react";
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

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" replace />} />
            <Route path="/verify-users" element={<VerifyUsers />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
            <Route path="/admin-dashboard" element={user?.role === "admin" ? <AdminPage /> : <Navigate to="/" replace />} />
            
            {/* Item Details Page */}
            <Route path="/items/:id" element={<ItemDetails />} />

            <Route path="/verify-users/:id" element={<VerifyUserDetails />} />

            {/* Claim route expects itemId in state */}
            <Route 
              path="/claim" 
              element={user ? <ClaimItem /> : <Navigate to="/login" replace />} 
            />

            <Route path="/test-claims" element={<ClaimItemTest />} />
            <Route path="/my-claims" element={<MyClaims />} />
            
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
