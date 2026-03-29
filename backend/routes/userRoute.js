import express from "express";
import { register, login, logout, getProfile, getAllUsers, updateUser, deleteUser } from "../controllers/userController.js";
import { protect } from "../middleware/Authmiddleware.js";

const userRoute = express.Router();

userRoute.post("/register", register);
userRoute.post("/login", login);
userRoute.post("/logout", logout);
userRoute.get("/profile", protect, getProfile);
userRoute.get("/", getAllUsers);
userRoute.put("/:id", updateUser);
userRoute.delete("/:id", deleteUser);

export default userRoute;