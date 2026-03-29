import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js";
import userRoute from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import adminRoute from "./routes/adminRoute.js";
import OfficerRoutes from "./routes/officersRoutes.js";
import managementRouter from "./routes/mangementRouter.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:3000"
];

if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ""));
}

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Basic Route
app.get("/", (req, res) => {
    res.send("Backend server is running!");
});
db();

app.use("/api/v1", userRoute);
app.use("/api/v1", adminRoute);
app.use("/api/v1/officer", OfficerRoutes);
app.use("/api/v1/management", managementRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});