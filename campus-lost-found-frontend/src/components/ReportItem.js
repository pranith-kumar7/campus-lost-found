import React, { useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

export default function ReportItem({ onItemReported }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Lost");
  const [category, setCategory] = useState("");
  const [proofImage, setProofImage] = useState(null);
  const [contact, setContact] = useState("");

  const inputClass =
    "mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !type || !category) {
      return toast.error("Name, type, and category are required!");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("category", category);
    formData.append("contact", contact);
    if (proofImage) formData.append("itemImage", proofImage);

    try {
      await API.post("/items", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      toast.success("Item reported successfully!");
      setName("");
      setDescription("");
      setType("Lost");
      setCategory("");
      setProofImage(null);
      setContact("");
      onItemReported();
    } catch (err) {
      console.error("Report item error:", err);
      toast.error(err.response?.data?.message || "Failed to report item.");
    }
  };

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="bg-[linear-gradient(135deg,#082f49_0%,#0369a1_100%)] px-6 py-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-100">Dashboard</p>
        <h3 className="mt-2 text-2xl font-bold">Report Lost or Found Item</h3>
        <p className="mt-2 max-w-2xl text-sm text-sky-50/90">
          Add the key details clearly so the right person can identify and recover the item quickly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5 px-6 py-6 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Item Name</label>
          <input
            type="text"
            placeholder="Wallet, ID card, headphones..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Category</label>
          <input
            type="text"
            placeholder="Electronics, Books, Accessories"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Contact Details</label>
          <input
            type="text"
            placeholder="Phone number or email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea
            placeholder="Where was it seen, what does it look like, and anything distinctive..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClass} min-h-28`}
            rows="4"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Proof Image</label>
          <input
            type="file"
            onChange={(e) => setProofImage(e.target.files[0])}
            accept="image/*"
            className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-3 file:text-sm file:font-medium file:text-white hover:file:bg-sky-700"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full rounded-full bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-700"
          >
            Report Item
          </button>
        </div>
      </form>
    </div>
  );
}
