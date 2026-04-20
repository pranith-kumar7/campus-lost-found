import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { API_BASE_URL } from "../config";
import { toast } from "react-toastify";

const VerifyUsers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Fetch unverified users
  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/unverified");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching unverified users:", err);
      toast.error("Failed to fetch users");
    }
  };

  // Verify a student
  const handleVerify = async (id) => {
    try {
      await API.put(`/auth/verify/${id}`);
      toast.success("User verified successfully!");
      fetchUsers();
    } catch (err) {
      console.error("Error verifying user:", err);
      toast.error("Failed to verify user");
    }
  };

  // Reject a student verification
  const handleReject = async (id) => {
    try {
      await API.put(`/admin/users/${id}/reject`);
      toast.success("User rejected and deleted successfully");
      fetchUsers();
    } catch (err) {
      console.error("Error rejecting user:", err);
      toast.error("Failed to reject user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Pending User Verifications</h2>

      {users.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No pending verifications 🎉</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/verify-users/${user._id}`)}
            >
              <img
                src={user.idCard}
                alt="College ID"
                className="w-24 h-24 object-cover rounded-md border border-gray-300 mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{user.name}</h3>
              <p className="text-gray-600 mb-1">{user.email}</p>
              <p className="text-gray-500 text-sm mb-4">Role: {user.role}</p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVerify(user._id);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  ✅ Verify
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReject(user._id);
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerifyUsers;

