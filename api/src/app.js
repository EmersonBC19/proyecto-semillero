import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import transactionRoutes from "./routes/transactions.routes.js";
import setupAssociations from "./models/associations.js";
import auditRoutes from "./routes/audit.routes.js";
import cors from "cors";

const app = express();

setupAssociations();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api", authRoutes);
app.use("/api", transactionRoutes);
app.use("/audit", auditRoutes);

export default app;
