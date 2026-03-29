import express from "express";
import { getDashboard } from "../controllers/managementController.js";
import { protect, authorize } from "../middleware/Authmiddleware.js";
const managementRouter = express.Router();

managementRouter.get("/dashboard", protect, authorize("Management", "Officer", "Admin"), getDashboard);

export default managementRouter;