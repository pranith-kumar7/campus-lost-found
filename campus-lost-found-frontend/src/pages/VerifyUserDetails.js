import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";

const VerifyUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/auth/user/${id}`);
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user:", err);
      toast.error("Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      await API.put(`/auth/verify/${id}`);
      toast.success("User verified successfully!");
      navigate("/verify-users");
    } catch (err) {
      console.error("Error verifying user:", err);
      toast.error("Failed to verify user");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading user details...</p>;
  if (!user)
    return <p style={{ textAlign: "center", marginTop: "50px" }}>User not found</p>;

  return (
    <div className="details-container">
      <h2 className="details-title">{user.name}</h2>
      <div className="details-card">
        <img
          src={`${API_BASE_URL}/${user.idCard}`}
          alt="College ID"
          className="details-image"
          onClick={() => setPreview(`${API_BASE_URL}/${user.idCard}`)}
        />
        <div className="details-info">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Status:</strong> {user.isVerified ? "✅ Verified" : "⚠️ Pending"}</p>
          {!user.isVerified && (
            <button className="verify-btn" onClick={handleVerify}>
              ✅ Verify User
            </button>
          )}
        </div>
      </div>

      {preview && (
        <div className="preview-overlay" onClick={() => setPreview(null)}>
          <div className="preview-box" onClick={(e) => e.stopPropagation()}>
            <img src={preview} alt="Preview" className="preview-img" />
            <button className="close-btn" onClick={() => setPreview(null)}>✖</button>
          </div>
        </div>
      )}

      <style>{`
        .details-container { padding: 30px 20px; max-width: 800px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .details-title { text-align: center; font-size: 2rem; color: #2c3e50; margin-bottom: 25px; }
        .details-card { display: flex; flex-direction: column; align-items: center; background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 6px 15px rgba(0,0,0,0.1); }
        .details-image { width: 250px; height: 250px; object-fit: cover; border-radius: 12px; border: 2px solid #ddd; margin-bottom: 20px; cursor: pointer; }
        .details-info p { font-size: 1rem; color: #333; margin: 5px 0; }
        .verify-btn { margin-top: 15px; padding: 10px 20px; background: linear-gradient(90deg, #2ecc71, #27ae60); color: #fff; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; transition: all 0.3s ease; }
        .verify-btn:hover { background: linear-gradient(90deg, #27ae60, #219150); transform: scale(1.05); }
        .preview-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; }
        .preview-box { background: #fff; padding: 15px; border-radius: 12px; max-width: 90%; max-height: 90%; position: relative; display: flex; flex-direction: column; align-items: center; }
        .preview-img { max-width: 100%; max-height: 80vh; border-radius: 10px; border: 2px solid #ddd; }
        .close-btn { position: absolute; top: 10px; right: 10px; background: #ff4d4f; border: none; color: white; font-size: 1.2rem; padding: 5px 10px; border-radius: 50%; cursor: pointer; transition: background 0.3s ease; }
        .close-btn:hover { background: #e63946; }
      `}</style>
    </div>
  );
};

export default VerifyUserDetails;
