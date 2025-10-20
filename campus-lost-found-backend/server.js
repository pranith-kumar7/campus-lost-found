import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import claimRoutes from "./routes/claimRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Middleware =====
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/claims", claimRoutes);

// ===== Error Handler =====
app.use(errorHandler);

// ===== Serve React Frontend (after all routes) =====
const frontendPath = path.join(__dirname, "../campus-lost-found-frontend/build");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ===== MongoDB Connection & Server Start =====
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");

    server.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.log("❌ MongoDB connection error:", err));
