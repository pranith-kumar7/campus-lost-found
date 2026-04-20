import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

export default function AddItem() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("electronics");
  const [type, setType] = useState("lost");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [proofImage, setProofImage] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.isVerified) {
      toast.error("You must be verified to add items.");
      return;
    }
    if (!name || !description || !location || !date || !proofImage) {
      toast.error("Please fill in all required fields and upload a proof image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("type", type);
    formData.append("location", location);
    formData.append("date", date);
    formData.append("proofImage", proofImage);

    try {
      await API.post("/items", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });
      toast.success("Item added successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add item.");
    }
  };

  return (
    <div className="add-item-page">
      <form className="add-item-form" onSubmit={handleSubmit}>
        <h2>Add Lost/Found Item</h2>

        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="electronics">Electronics</option>
          <option value="books">Books</option>
          <option value="clothing">Clothing</option>
          <option value="accessories">Accessories</option>
          <option value="others">Others</option>
        </select>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProofImage(e.target.files[0])}
          required
        />

        <button type="submit">Add Item</button>
      </form>

      <style>{`
        .add-item-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f5f7fa;
          padding: 20px;
        }
        .add-item-form {
          background: #fff;
          padding: 35px 30px;
          border-radius: 15px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .add-item-form h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #2c3e50;
        }
        .add-item-form input,
        .add-item-form select,
        .add-item-form textarea {
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 1rem;
          outline: none;
        }
        .add-item-form textarea {
          resize: vertical;
          min-height: 80px;
        }
        .add-item-form button {
          padding: 12px;
          background-color: #4facfe;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s;
        }
        .add-item-form button:hover {
          background-color: #00f2fe;
        }
      `}</style>
    </div>
  );
}
