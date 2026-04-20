import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";

export default function ItemCard({ item, user, onItemUpdated }) {
  const [claiming, setClaiming] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [claimContact, setClaimContact] = useState("");
  const [claimReason, setClaimReason] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [preview, setPreview] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (item.proofImage) setPreview(true);
  };

  // Claim item
  const handleClaim = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("You must be logged in to claim items.");
      return;
    }
    if (user.role === "admin") {
      toast.error("Admins cannot claim items.");
      return;
    }
    if (!claimContact.trim()) {
      toast.error("Please enter your contact details.");
      return;
    }
    if (!claimReason.trim()) {
      toast.error("Please enter a reason for claiming this item.");
      return;
    }
    if (!proofFile) {
      toast.error("Please upload proof before claiming.");
      return;
    }

    setClaiming(true);
    const formData = new FormData();
    formData.append("proof", proofFile);
    formData.append("contact", claimContact.trim());
    formData.append("reason", claimReason.trim());

    try {
      await API.post(`/items/${item._id}/claim`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      toast.success("Claim submitted. Awaiting admin approval.");
      setProofFile(null);
      setClaimContact("");
      setClaimReason("");
      onItemUpdated?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit claim.");
    } finally {
      setClaiming(false);
    }
  };

  // Delete item (admin)
  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) return;

    setDeleting(true);
    try {
      await API.delete(`/items/${item._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success("Item deleted successfully.");
      onItemUpdated?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete item.");
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Verified": return "bg-green-500";
      case "Pending": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <>
      <div
        className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 border border-gray-100"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCardClick();
          }
        }}
        aria-label={`View details for ${item.name}`}
      >
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

        {/* Image and Badge */}
        <div className="relative overflow-hidden">
          <img
            src={item.proofImage ? `${API_BASE_URL}/${item.proofImage}` : "/placeholder.png"}
            alt={`Image of ${item.name} - ${item.description || 'No description'}`}
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-sm ${
              item.status === 'Verified' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
              item.status === 'Pending' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
              'bg-gradient-to-r from-gray-500 to-slate-500'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                item.status === 'Verified' ? 'bg-green-200' :
                item.status === 'Pending' ? 'bg-yellow-200' :
                'bg-gray-200'
              }`}></div>
              {item.status}
            </span>
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-white bg-black/50 backdrop-blur-sm">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5.586a1 1 0 01.707.293l7 7z" clipRule="evenodd" />
              </svg>
              {item.category}
            </span>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <button className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full font-medium text-sm hover:bg-white transition-colors duration-200">
              View Details
            </button>
          </div>
        </div>

        {/* Item Details */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-tight">
              {item.name}
            </h3>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              item.type?.toLowerCase() === 'lost' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {item.type?.toLowerCase() === 'lost' ? (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {item.type}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {item.description || "No description provided."}
          </p>

          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Contact:</span>
              <span className="text-gray-600">{item.contact}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Reported by:</span>
              <span className="text-gray-600">{item.reportedBy?.name || item.reportedBy?.email || "Unknown"}</span>
            </div>
          </div>

          {/* Claims Section */}
          {item.claims?.length > 0 && (
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-semibold text-blue-800">Claims ({item.claims.length})</p>
              </div>
              <div className="space-y-1">
                {item.claims.slice(0, 2).map((c) => (
                  <div key={c._id} className="flex items-center justify-between text-xs">
                    <span className="text-blue-700 font-medium">{c.claimedBy?.name || "Unknown"}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      c.claimStatus === 'approved' ? 'bg-green-100 text-green-700' :
                      c.claimStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {c.claimStatus}
                    </span>
                  </div>
                ))}
                {item.claims.length > 2 && (
                  <p className="text-xs text-blue-600 font-medium">+{item.claims.length - 2} more claims</p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex gap-2">
            {user && user.role === "admin" && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 disabled:opacity-50"
              >
                {deleting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  "Delete Item"
                )}
              </button>
            )}
            {user && user.role !== "admin" && item.status === "Verified" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPreview(true);
                }}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200"
              >
                Claim Item
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setPreview(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-title"
        >
          <div
            className="bg-white rounded-lg max-w-4xl max-h-full overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition-colors"
              onClick={() => setPreview(false)}
              aria-label="Close preview"
            >
              ✕
            </button>
            <img
              src={`${API_BASE_URL}/${item.proofImage}`}
              alt={`Preview of ${item.name}`}
              className="max-w-full max-h-[80vh] object-contain"
              id="preview-title"
            />
          </div>
        </div>
      )}
    </>
  );
}
