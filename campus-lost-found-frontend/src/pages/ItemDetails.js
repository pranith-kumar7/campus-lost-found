import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";

export default function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claimFile, setClaimFile] = useState(null);
  const [claimContact, setClaimContact] = useState("");
  const [claimReason, setClaimReason] = useState("");
  const [reporting, setReporting] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const fetchItem = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/items/${id}`, {
        headers: user.token ? { Authorization: `Bearer ${user.token}` } : {},
      });
      setItem(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch item details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [id]);

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!claimContact.trim()) return toast.error("Please enter your contact details.");
    if (!claimReason.trim()) return toast.error("Please provide a reason for claiming this item.");
    if (!claimFile) return toast.error("Please upload proof image.");

    const formData = new FormData();
    formData.append("proof", claimFile);
    formData.append("contact", claimContact.trim());
    formData.append("reason", claimReason.trim());

    try {
      await API.post(`/items/${id}/claim`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      toast.success("Claim submitted! Awaiting admin approval.");
      setClaimFile(null);
      setClaimContact("");
      setClaimReason("");
      fetchItem();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit claim");
    }
  };

  const handleReport = async () => {
    if (!window.confirm("Do you want to report this item as suspicious?")) return;

    try {
      await API.post(
        `/items/${id}/report`,
        { message: "Reported by user" },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      toast.success("Item reported successfully");
      setReporting(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to report item");
    }
  };

  const handleApproveClaim = async (claimId, status) => {
    try {
      await API.put(
        `/items/${id}/claim/verify`,
        { claimId, status },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      toast.success(`Claim ${status.toLowerCase()} successfully`);
      fetchItem();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update claim");
    }
  };

  if (loading) return <div className="px-4 py-16 text-center text-slate-600">Loading item details...</div>;
  if (!item) return <div className="px-4 py-16 text-center text-slate-600">Item not found.</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          {item.proofImage ? (
            <img
              src={`${API_BASE_URL}/${item.proofImage}`}
              alt={item.name}
              className="h-[360px] w-full object-cover"
            />
          ) : (
            <div className="flex h-[360px] items-center justify-center bg-slate-100 text-slate-400">
              No image available
            </div>
          )}
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-4 flex flex-wrap gap-3">
            <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-medium text-sky-700">{item.type}</span>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">{item.category}</span>
            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">{item.status}</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900">{item.name}</h1>
          <p className="mt-4 text-slate-600">{item.description || "No description provided."}</p>

          <div className="mt-6 space-y-3 rounded-3xl bg-slate-50 p-5 text-sm text-slate-700">
            <p><strong>Contact:</strong> {item.contact || "N/A"}</p>
            <p><strong>Reported By:</strong> {item.reportedBy?.name || item.reportedBy?.email || "Unknown"}</p>
            <p><strong>Verification:</strong> {item.reportedBy?.isVerified ? "Verified user" : "Not verified"}</p>
          </div>

          {user && user.role !== "admin" ? (
            <form onSubmit={handleClaimSubmit} className="mt-6 rounded-3xl border border-slate-200 p-5">
              <h3 className="text-lg font-semibold text-slate-900">Claim this item</h3>
              <p className="mt-2 text-sm text-slate-600">Provide your contact details and proof so an admin can verify your claim.</p>
              <label className="mt-4 block text-sm font-medium text-slate-700">Contact details</label>
              <input
                type="text"
                value={claimContact}
                onChange={(e) => setClaimContact(e.target.value)}
                placeholder="Phone number or email"
                className="mt-2 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm focus:border-sky-500 focus:outline-none"
              />
              <label className="mt-4 block text-sm font-medium text-slate-700">Why are you claiming this item?</label>
              <textarea
                value={claimReason}
                onChange={(e) => setClaimReason(e.target.value)}
                placeholder="Describe why this item belongs to you"
                className="mt-2 block w-full min-h-[120px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm focus:border-sky-500 focus:outline-none"
              />
              <label className="mt-4 block text-sm font-medium text-slate-700">Proof Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setClaimFile(e.target.files[0])}
                className="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-3 file:text-sm file:font-medium file:text-white hover:file:bg-sky-700"
              />
              <button
                type="submit"
                className="mt-4 rounded-full bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-700"
              >
                Submit Claim
              </button>
            </form>
          ) : !user ? (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
              Please login as a student to submit a claim for this item.
            </div>
          ) : null}

          {user && user.role !== "admin" && !reporting && (
            <button
              className="mt-4 rounded-full bg-rose-600 px-6 py-3 font-semibold text-white transition hover:bg-rose-700"
              onClick={handleReport}
            >
              Report Item
            </button>
          )}
        </div>
      </div>

      {user.role === "admin" && (
        <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-slate-900">Claims</h3>
          {item.claims.length === 0 ? (
            <p className="mt-4 text-slate-600">No claims yet.</p>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {item.claims.map((claim) => (
                <div key={claim._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-700"><strong>User:</strong> {claim.claimedBy?.name || "Unknown"}</p>
                  <p className="mt-2 text-sm text-slate-700"><strong>Status:</strong> {claim.claimStatus}</p>
                  {claim.proof && (
                    <img
                      src={`${API_BASE_URL}/${claim.proof}`}
                      alt="Claim proof"
                      className="mt-4 h-48 w-full rounded-2xl object-cover"
                    />
                  )}
                  {claim.claimStatus === "Pending" && (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => handleApproveClaim(claim._id, "Approved")}
                        className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproveClaim(claim._id, "Rejected")}
                        className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
