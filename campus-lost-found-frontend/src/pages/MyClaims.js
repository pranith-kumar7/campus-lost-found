import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

export default function MyClaims() {
  const [claims, setClaims] = useState([]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">Approved</span>;
      case "Rejected":
        return <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800">Rejected</span>;
      default:
        return <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">Pending</span>;
    }
  };

  const fetchMyClaims = async () => {
    try {
      const res = await API.get("/claims/my-claims");
      const onlyMyClaims = res.data.filter(
        (claim) => String(claim.claimedBy?._id || claim.claimedBy) === String(JSON.parse(localStorage.getItem("user"))?._id)
      );
      setClaims(onlyMyClaims);
    } catch (err) {
      console.error("Error fetching claims:", err);
      toast.error("Failed to fetch your claims.");
    }
  };

  useEffect(() => {
    fetchMyClaims();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-8 rounded-[2rem] bg-[linear-gradient(135deg,#172554_0%,#1d4ed8_55%,#38bdf8_100%)] p-8 text-white shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-100">My Claims</p>
        <h1 className="mt-3 text-3xl font-bold">Track your claimed items</h1>
        <p className="mt-2 max-w-2xl text-sm text-sky-50/90">
          Review item details and claim status here. Use the inbox when you want to read or send messages.
        </p>
      </div>

      {claims.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          You haven't made any claims yet.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {claims.map((claim) => (
            <div key={claim._id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{claim.item?.name}</h2>
                  <p className="mt-2 text-sm text-slate-600">{claim.item?.description || "No description provided."}</p>
                </div>
                {getStatusBadge(claim.claimStatus)}
              </div>

              <div className="mt-5 space-y-2 text-sm text-slate-700">
                <p><strong>Category:</strong> {claim.item?.category || "N/A"}</p>
                <p><strong>Claim Date:</strong> {new Date(claim.claimedAt || claim.createdAt).toLocaleDateString()}</p>
                <p><strong>Finder:</strong> {claim.item?.reportedBy?.name || "Unknown"}</p>
                <p><strong>Contact:</strong> {claim.contact || "N/A"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
