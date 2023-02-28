import express from "express";
import {
  addTask,
  dragTask,
  getMyProfile,
  login,
  logout,
  register,
  removeTask,
  updatePassword,
  updateProfile,
  updateTask,
} from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);

router.route("/newtask").post(isAuthenticated, addTask);
router.route("/updateTask").put(isAuthenticated, updateTask);
router.route("/dragtask").put(isAuthenticated, dragTask);
router.route("/removetask").post(isAuthenticated, removeTask);

router.route("/me").get(isAuthenticated, getMyProfile);
router.route("/updateprofile").put(isAuthenticated, updateProfile);
router.route("/updatepassword").put(isAuthenticated, updatePassword);

export default router;
