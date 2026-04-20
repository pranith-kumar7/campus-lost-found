import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";

export default function ClaimItem() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    return (
      <p style={{ textAlign: "center", marginTop: "50px", fontSize: "18px", color: "red" }}>
        Unauthorized. Admins only.
      </p>
    );
  }

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const res = await API.get("/claims/pending");
      setClaims(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch pending claims.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleClaimAction = async (claimId, status) => {
    setProcessing((prev) => ({ ...prev, [claimId]: true }));
    try {
      await API.put(`/claims/${claimId}/verify`, { status });

      setClaims((prev) =>
        prev.map((c) =>
          c._id === claimId ? { ...c, claimStatus: status } : c
        )
      );

      toast.success(`Claim ${status} successfully!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update claim on server.");
    } finally {
      setProcessing((prev) => ({ ...prev, [claimId]: false }));
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading claims...</p>;
  if (claims.length === 0) return <p style={{ textAlign: "center" }}>No pending claims.</p>;

  return (
    <div className="claims-page">
      <h2>Pending Claims</h2>
      <div className="claims-grid">
        {claims.map((claim) => (
          <div key={claim._id} className="claim-card">
            {claim.claimStatus !== "Pending" && (
              <div className={`ribbon ${claim.claimStatus.toLowerCase()}`}>
                {claim.claimStatus}
              </div>
            )}
            <h3>{claim.item?.name || "Unnamed Item"}</h3>
            <p><strong>Claimed by:</strong> {claim.claimedBy?.name || "Unknown"}</p>
            <p><strong>Email:</strong> {claim.claimedBy?.email || "N/A"}</p>
            <p><strong>Phone:</strong> {claim.claimedBy?.phone || "N/A"}</p>
            <p><strong>Contact Info:</strong> {claim.contact || "No contact provided"}</p>
            <p><strong>Reason:</strong> {claim.reason || "No reason provided"}</p>

            {claim.proof && (
              <img
                src={`${API_BASE_URL}/${claim.proof}`}
                alt="Proof"
                className="proof-img"
              />
            )}

            <div className="buttons">
              <button
                onClick={() => handleClaimAction(claim._id, "Approved")}
                disabled={processing[claim._id] || claim.claimStatus !== "Pending"}
              >
                {processing[claim._id] ? "Processing..." : "Approve"}
              </button>
              <button
                onClick={() => handleClaimAction(claim._id, "Rejected")}
                disabled={processing[claim._id] || claim.claimStatus !== "Pending"}
              >
                {processing[claim._id] ? "Processing..." : "Reject"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .claims-page { padding: 40px 20px; max-width: 1200px; margin: 0 auto; font-family: Arial, sans-serif; }
        h2 { text-align: center; margin-bottom: 30px; color: #2c3e50; }
        .claims-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .claim-card { background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); position: relative; }
        .claim-card h3 { margin-top: 0; color: #2980b9; font-size: 18px; }
        .claim-card p { margin: 6px 0; color: #555; font-size: 14px; }
        .proof-img { margin-top: 10px; max-width: 100%; border-radius: 8px; }

        /* Ribbon badge */
        .ribbon {
          width: 120px;
          height: 25px;
          background: #2ecc71;
          color: #fff;
          text-align: center;
          line-height: 25px;
          font-weight: bold;
          font-size: 12px;
          position: absolute;
          top: 10px;
          right: -30px;
          transform: rotate(45deg);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .ribbon.rejected { background: #e74c3c; }

        .buttons { margin-top: 15px; display: flex; gap: 10px; }
        .buttons button { flex: 1; padding: 8px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; color: #fff; transition: 0.3s; }
        .buttons button:first-child { background-color: #2ecc71; }
        .buttons button:last-child { background-color: #e74c3c; }
        .buttons button:disabled { background-color: #aaa; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
