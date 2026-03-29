import express from "express";
import { createInstitute, createCampus, deleteInstitute, updateInstitute, getAllInstitutes, deleteCampus, updateCampus, getAllCampuses, getInstituteById, getCampusById } from "../controllers/AdminController.js";
import { createDepartment, deleteDepartment, updateDepartment, getAllDepartments, getDepartmentById } from "../controllers/AdminController.js";
import { createProgram, deleteProgram, updateProgram, getAllPrograms, getProgramById, getProgramsByDepartmentId } from "../controllers/AdminController.js";
import { protect, authorize } from "../middleware/Authmiddleware.js";


const adminRoute = express.Router();
//institute
adminRoute.post("/createInstitute", protect, authorize("Admin"), createInstitute);
adminRoute.delete("/deleteInstitute/:id", protect, authorize("Admin"), deleteInstitute);
adminRoute.put("/updateInstitute/:id", protect, authorize("Admin"), updateInstitute);
adminRoute.get("/getAllInstitutes", protect, authorize("Admin", "Officer"), getAllInstitutes);
adminRoute.get("/getInstituteById/:id", protect, authorize("Admin", "Officer"), getInstituteById);


//caumpus
adminRoute.post("/createCampus", protect, authorize("Admin"), createCampus);
adminRoute.delete("/deleteCampus/:id", protect, authorize("Admin"), deleteCampus);
adminRoute.put("/updateCampus/:id", protect, authorize("Admin"), updateCampus);
adminRoute.get("/getAllCampuses", protect, authorize("Admin", "Officer"), getAllCampuses);
adminRoute.get("/getCampusById/:id", protect, authorize("Admin", "Officer"), getCampusById);




//department

adminRoute.post("/createDepartment", protect, authorize("Admin"), createDepartment);
adminRoute.delete("/deleteDepartment/:id", protect, authorize("Admin"), deleteDepartment);
adminRoute.put("/updateDepartment/:id", protect, authorize("Admin"), updateDepartment);
adminRoute.get("/getAllDepartments", protect, authorize("Admin", "Officer"), getAllDepartments);
adminRoute.get("/getDepartmentById/:id", protect, authorize("Admin", "Officer"), getDepartmentById);



//program
adminRoute.post("/createProgram", protect, authorize("Admin"), createProgram);
adminRoute.delete("/deleteProgram/:id", protect, authorize("Admin"), deleteProgram);
adminRoute.put("/updateProgram/:id", protect, authorize("Admin"), updateProgram);
adminRoute.get("/getAllPrograms", protect, authorize("Admin", "Officer"), getAllPrograms);
adminRoute.get("/getProgramById/:id", protect, authorize("Admin", "Officer"), getProgramById);
adminRoute.get("/getProgramsByDepartmentId/:departmentId", protect, authorize("Admin", "Officer"), getProgramsByDepartmentId);


export default adminRoute;      