import express from "express";
import { createapplicant, updateapplicant, deleteapplicant, getapplicant, getallapplicants } from "../controllers/officerController.js";
import { createallotment, updateDocumentStatus, updateFeeStatus, confirmAdmission, getAllAdmissions } from "../controllers/officerController.js";
import { protect, authorize } from "../middleware/Authmiddleware.js";
const OfficerRoutes = express.Router();

OfficerRoutes.post("/createapplicant", protect, authorize("Officer"), createapplicant);
OfficerRoutes.put("/updateapplicant/:id", protect, authorize("Officer"), updateapplicant);
OfficerRoutes.delete("/deleteapplicant/:id", protect, authorize("Officer"), deleteapplicant);
OfficerRoutes.get("/getapplicant/:id", protect, authorize("Officer"), getapplicant);
OfficerRoutes.get("/getallapplicants", protect, authorize("Officer"), getallapplicants);

OfficerRoutes.post("/createallotment", protect, authorize("Officer"), createallotment);
OfficerRoutes.put("/updatedocumentstatus/:id", protect, authorize("Officer"), updateDocumentStatus);
OfficerRoutes.put("/updatefeestatus/:id", protect, authorize("Officer"), updateFeeStatus);
OfficerRoutes.put("/confirmadmission/:id", protect, authorize("Officer"), confirmAdmission);
OfficerRoutes.get("/getalladmissions", protect, authorize("Officer"), getAllAdmissions);



export default OfficerRoutes;