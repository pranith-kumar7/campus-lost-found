import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";

const getBadgeClasses = (status) =>
  status === "Resolved"
    ? "bg-emerald-100 text-emerald-800"
    : "bg-amber-100 text-amber-800";

const getItemStatusClasses = (status) => {
  switch (status) {
    case "Verified":
      return "bg-emerald-100 text-emerald-800";
    case "Resolved":
      return "bg-slate-200 text-slate-800";
    default:
      return "bg-sky-100 text-sky-800";
  }
};

export default function MyReports() {
  const [myItems, setMyItems] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [itemsRes, reportsRes] = await Promise.all([API.get("/items/mine"), API.get("/items/reports/my")]);
      setMyItems(itemsRes.data);
      setReports(reportsRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch your reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 rounded-[2rem] bg-[linear-gradient(135deg,#172554_0%,#1d4ed8_55%,#38bdf8_100%)] p-8 text-white shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-100">My Reports</p>
        <h1 className="mt-3 text-3xl font-bold">Watch everything you submitted</h1>
        <p className="mt-2 max-w-2xl text-sm text-sky-50/90">
          This page shows both the lost or found items you reported and the suspicious-item reports you submitted.
        </p>
      </div>

      {loading ? (
        <p className="text-slate-600">Loading reports...</p>
      ) : (
        <div className="space-y-10">
          <section>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Items You Reported</h2>
                <p className="mt-1 text-sm text-slate-600">These are the lost or found items you created from the dashboard.</p>
              </div>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white">{myItems.length}</span>
            </div>

            {myItems.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                You haven't reported any lost or found items yet.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {myItems.map((item) => (
                  <div key={item._id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                    {item.proofImage ? (
                      <img
                        src={`${API_BASE_URL}/${item.proofImage}`}
                        alt={item.name}
                        className="h-52 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-52 items-center justify-center bg-slate-100 text-slate-400">No image available</div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-xl font-semibold text-slate-900">{item.name}</h3>
                        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${getItemStatusClasses(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{item.description || "No description provided."}</p>
                      <div className="mt-4 space-y-2 text-sm text-slate-700">
                        <p><strong>Type:</strong> {item.type}</p>
                        <p><strong>Category:</strong> {item.category}</p>
                        <p><strong>Claims:</strong> {item.claims?.length || 0}</p>
                        <p><strong>Created:</strong> {new Date(item.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Suspicious Item Reports</h2>
                <p className="mt-1 text-sm text-slate-600">These are the moderation reports you filed against items.</p>
              </div>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white">{reports.length}</span>
            </div>

            {reports.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                You haven't submitted any suspicious-item reports yet.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {reports.map((report) => (
                  <div key={report._id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                    {report.item?.proofImage ? (
                      <img
                        src={`${API_BASE_URL}/${report.item.proofImage}`}
                        alt={report.item.name}
                        className="h-52 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-52 items-center justify-center bg-slate-100 text-slate-400">No image available</div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-xl font-semibold text-slate-900">{report.item?.name || "Unnamed Item"}</h3>
                        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${getBadgeClasses(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{report.item?.description || "No description provided."}</p>
                      <div className="mt-4 space-y-2 text-sm text-slate-700">
                        <p><strong>Reason:</strong> {report.reason}</p>
                        <p><strong>Category:</strong> {report.item?.category || "N/A"}</p>
                        <p><strong>Item Status:</strong> {report.item?.status || "N/A"}</p>
                        <p><strong>Reported At:</strong> {new Date(report.reportedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
