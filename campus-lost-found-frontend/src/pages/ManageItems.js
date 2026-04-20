// src/pages/ManageItems.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function ManageItems() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [items, setItems] = useState([]);

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch all items
  useEffect(() => {
    if (!user) return;
    const fetchItems = async () => {
      try {
        const res = await API.get("/items", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setItems(res.data);
      } catch (err) {
        console.error("Failed to fetch items:", err);
      }
    };
    fetchItems();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await API.delete(`/items/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItems((prevItems) => prevItems.filter((item) => item._id !== id));
      alert("Item deleted successfully!");
    } catch (error) {
      alert("Failed to delete item.");
    }
  };

  return (
    <div className="manage-items-page">
      <header className="page-header">
        <h1>Manage Items</h1>
        <p>View, manage, and delete reported items</p>
      </header>

      {items.length === 0 ? (
        <p className="no-items">No items available.</p>
      ) : (
        <div className="items-grid">
          {items.map((item) => (
            <div key={item._id} className="item-card">
              <h3 className="item-title">{item.title}</h3>
              <p className="item-status">
                Status: <strong>{item.status}</strong>
              </p>
              <p>
                Verified: <strong>{item.isVerified ? "Yes" : "No"}</strong>
              </p>
              <button
                className="delete-btn"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .manage-items-page {
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f7fa;
          min-height: 100vh;
        }

        .page-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .page-header h1 {
          color: #2c3e50;
          margin-bottom: 5px;
        }

        .page-header p {
          color: #34495e;
          font-size: 1rem;
        }

        .no-items {
          text-align: center;
          color: #7f8c8d;
          font-size: 1.2rem;
          margin-top: 50px;
        }

        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .item-card {
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s, box-shadow 0.3s;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .item-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .item-title {
          font-size: 1.2rem;
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .item-status {
          font-weight: 500;
          color: #16a085;
          margin-bottom: 15px;
        }

        .delete-btn {
          padding: 10px 15px;
          background-color: #e74c3c;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          transition: background 0.3s, transform 0.2s;
        }

        .delete-btn:hover {
          background-color: #c0392b;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .items-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }
        }

        @media (max-width: 480px) {
          .manage-items-page {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
}
