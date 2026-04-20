import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";
import ClaimConversation from "../components/ClaimConversation";

export default function AdminPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeClaimId, setActiveClaimId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user")) || { role: "admin", token: "" };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await API.get("/items");
      setItems(res.data);

      if (!activeClaimId) {
        const firstClaim = res.data.flatMap((item) => item.claims || [])[0];
        if (firstClaim?._id) setActiveClaimId(firstClaim._id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleVerifyItem = async (itemId) => {
    try {
      await API.put(`/items/${itemId}/verify`, {});
      toast.success("Item verified successfully!");
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error("Failed to verify item.");
    }
  };

  const handleVerifyClaim = async (itemId, claimId, status) => {
    try {
      await API.put(`/items/${itemId}/claim/verify`, { claimId, status });
      toast.success(`Claim ${status.toLowerCase()} successfully!`);
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update claim.");
    }
  };

  const handleReportAction = async (itemId, reportId, status) => {
    try {
      await API.put(`/items/${itemId}/report/resolve`, { reportId });
      toast.success(`Report marked as ${status}`);
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update report.");
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await API.delete(`/items/${itemId}`);
      toast.success("Item deleted successfully!");
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete item.");
    }
  };

  const allClaims = items.flatMap((item) =>
    (item.claims || []).map((claim) => ({
      ...claim,
      item,
    }))
  );

  const handleConversationUpdate = (updatedClaim) => {
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        claims: (item.claims || []).map((claim) =>
          claim._id === updatedClaim._id ? { ...claim, ...updatedClaim } : claim
        ),
      }))
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 rounded-[2rem] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_60%,#38bdf8_100%)] p-8 text-white shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-100">Admin Panel</p>
        <h2 className="mt-3 text-3xl font-bold">Review items, claims, and reports</h2>
        <p className="mt-2 max-w-2xl text-sm text-sky-50/90">
          This dashboard helps you verify reports quickly and resolve suspicious activity without losing context.
        </p>
      </div>

      {loading ? (
        <p className="text-center text-slate-600">Loading items...</p>
      ) : items.length === 0 ? (
        <p className="text-center text-slate-600">No items found.</p>
      ) : (
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {items.map((item) => (
              <div key={item._id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-semibold text-slate-800">{item?.name || "Unnamed Item"}</h3>
                <p className="mb-3 text-slate-600">{item?.description || "No description"}</p>
                <p className="mb-4 text-sm text-slate-700">
                  <strong>Category:</strong> {item?.category || "N/A"} | <strong>Status:</strong>{" "}
                  {item?.status === "Verified" ? "Verified" : "Pending"}
                </p>

                {item?.status !== "Verified" && (
                  <button
                    onClick={() => handleVerifyItem(item._id)}
                    className="mb-2 w-full rounded-full bg-sky-600 px-4 py-3 text-white hover:bg-sky-700"
                  >
                    Verify Item
                  </button>
                )}

                <button
                  className="mb-4 w-full rounded-full bg-rose-600 px-4 py-3 text-white hover:bg-rose-700"
                  onClick={() => handleDeleteItem(item._id)}
                >
                  Delete Item
                </button>

                {item?.claims?.length > 0 && (
                  <div className="border-t border-slate-200 pt-4">
                    <h4 className="mb-2 font-semibold text-slate-800">Claims</h4>
                    {item.claims.map((claim) => (
                      <div key={claim._id} className="mb-2 rounded-2xl bg-slate-50 p-3">
                        <p className="text-sm text-slate-700">
                          <strong>Claimed by:</strong> {claim?.claimedBy?.name || "Unknown User"} ({claim?.claimStatus})
                        </p>
                        <p className="text-sm text-slate-700"><strong>Email:</strong> {claim?.claimedBy?.email || "N/A"}</p>
                        <p className="text-sm text-slate-700"><strong>Phone:</strong> {claim?.claimedBy?.phone || "N/A"}</p>
                        <p className="text-sm text-slate-700"><strong>Reason:</strong> {claim?.reason || "N/A"}</p>
                        <button
                          type="button"
                          onClick={() => setActiveClaimId(claim._id)}
                          className="mt-2 rounded-full bg-slate-900 px-3 py-2 text-sm text-white hover:bg-sky-700"
                        >
                          Open Conversation
                          {claim.unreadCount > 0 ? ` (${claim.unreadCount})` : ""}
                        </button>
                        {claim?.proof && (
                          <img
                            src={`${API_BASE_URL}/${claim.proof}`}
                            alt="proof"
                            className="mt-2 h-32 w-32 rounded-md object-cover"
                          />
                        )}
                        {claim?.claimStatus === "Pending" && (
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => handleVerifyClaim(item._id, claim._id, "Approved")}
                              className="rounded-full bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleVerifyClaim(item._id, claim._id, "Rejected")}
                              className="rounded-full bg-rose-600 px-3 py-2 text-sm text-white hover:bg-rose-700"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {item?.reports?.length > 0 && (
                  <div className="border-t border-slate-200 pt-4">
                    <h4 className="mb-2 font-semibold text-slate-800">Reports</h4>
                    {item.reports.map((report) => (
                      <div key={report._id} className="mb-2 rounded-2xl bg-slate-50 p-3">
                        <p className="text-sm text-slate-700">
                          <strong>Reported by:</strong> {report?.reportedBy?.name || "Anonymous"}
                        </p>
                        <p className="text-sm text-slate-700"><strong>Email:</strong> {report?.reportedBy?.email || "N/A"}</p>
                        <p className="text-sm text-slate-700"><strong>Phone:</strong> {report?.reportedBy?.phone || "N/A"}</p>
                        <p className="text-sm text-slate-700"><strong>Reason:</strong> {report?.reason || "No reason"}</p>
                        <p className="text-sm text-slate-700"><strong>Status:</strong> {report?.status || "Pending"}</p>
                        {report?.status === "Pending" && (
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => handleReportAction(item._id, report._id, "Valid")}
                              className="rounded-full bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700"
                            >
                              Valid
                            </button>
                            <button
                              onClick={() => handleReportAction(item._id, report._id, "Invalid")}
                              className="rounded-full bg-rose-600 px-3 py-2 text-sm text-white hover:bg-rose-700"
                            >
                              Invalid
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="xl:sticky xl:top-6 xl:self-start">
            <div className="mb-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Claim Inbox</h3>
              <p className="mt-1 text-sm text-slate-600">
                Open any claim thread to coordinate pickup details or request more proof.
              </p>
              <div className="mt-4 max-h-60 space-y-2 overflow-y-auto">
                {allClaims.length === 0 ? (
                  <p className="text-sm text-slate-500">No claims yet.</p>
                ) : (
                  allClaims.map((claim) => (
                    <button
                      key={claim._id}
                      type="button"
                      onClick={() => setActiveClaimId(claim._id)}
                      className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm ${
                        activeClaimId === claim._id ? "bg-sky-50 text-sky-800" : "bg-slate-50 text-slate-700"
                      }`}
                    >
                      <span>
                        {claim.item?.name} • {claim.claimedBy?.name || "Unknown"}
                      </span>
                      {claim.unreadCount > 0 && (
                        <span className="rounded-full bg-rose-600 px-2 py-0.5 text-xs font-semibold text-white">
                          {claim.unreadCount}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>

            <ClaimConversation
              claimId={activeClaimId}
              active={Boolean(activeClaimId)}
              viewer={user}
              onUpdated={handleConversationUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );
}
