import React, { useEffect, useState } from "react";
import API from "../api/axios";
import ItemCard from "../components/ItemCard";
import ReportItem from "../components/ReportItem";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await API.get("/items", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItems(res.data);
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <ReportItem onItemReported={fetchItems} />

      <div className="mb-6 mt-10">
        <h2 className="text-3xl font-bold text-slate-900">Reported Items</h2>
        <p className="mt-2 text-slate-600">
          Track what has been submitted and manage claims from one place.
        </p>
      </div>

      {loading ? (
        <p className="text-slate-600">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.length === 0 ? (
            <p className="text-slate-600">No items found.</p>
          ) : (
            items.map((item) => (
              <ItemCard key={item._id} item={item} user={user} onItemUpdated={fetchItems} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
