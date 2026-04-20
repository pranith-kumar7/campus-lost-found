import React from "react";
import { Navigate } from "react-router-dom";
import AdminPage from "./AdminPage";
import ClaimConversation from "../components/ClaimConversation";
import API from "../api/axios";
import { useEffect, useState } from "react";

function StudentInbox() {
  const [claims, setClaims] = useState([]);
  const [activeClaimId, setActiveClaimId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchClaims = async () => {
    const res = await API.get("/claims/my-claims");
    setClaims(res.data);
    if (!activeClaimId && res.data.length > 0) {
      setActiveClaimId(res.data[0]._id);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleConversationUpdate = (updatedClaim) => {
    setClaims((prev) => prev.map((claim) => (claim._id === updatedClaim._id ? { ...claim, ...updatedClaim } : claim)));
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-8 rounded-[2rem] bg-[linear-gradient(135deg,#172554_0%,#1d4ed8_55%,#38bdf8_100%)] p-8 text-white shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-100">Conversations</p>
        <h1 className="mt-3 text-3xl font-bold">Inbox</h1>
        <p className="mt-2 max-w-2xl text-sm text-sky-50/90">
          Open your claim conversations, reply to updates, and coordinate recovery from one inbox.
        </p>
      </div>

      {claims.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          No conversations yet.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div className="space-y-4">
            {claims.map((claim) => (
              <button
                key={claim._id}
                type="button"
                onClick={() => setActiveClaimId(claim._id)}
                className={`w-full rounded-[1.75rem] border p-5 text-left transition ${
                  activeClaimId === claim._id
                    ? "border-sky-500 bg-sky-50 shadow-md"
                    : "border-gray-100 bg-white shadow-sm hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{claim.item?.name}</h2>
                    <p className="mt-1 text-sm text-gray-600">{claim.item?.description}</p>
                  </div>
                  {claim.unreadCount > 0 && (
                    <span className="rounded-full bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white">
                      {claim.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <ClaimConversation
            claimId={activeClaimId}
            active={Boolean(activeClaimId)}
            viewer={user}
            onUpdated={handleConversationUpdate}
          />
        </div>
      )}
    </div>
  );
}

export default function Inbox() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "admin") {
    return <AdminPage />;
  }

  return <StudentInbox />;
}
