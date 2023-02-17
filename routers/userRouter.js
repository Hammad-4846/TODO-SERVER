import express from "express";
import {
  addTask,
  getMyProfile,
  login,
  logout,
  register,
  removeTask,
  updatePassword,
  updateProfile,
  updateTask,
  verify,
} from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/verify").post(isAuthenticated, verify);

router.route("/newtask").post(isAuthenticated, addTask);
router
  .route("/task/:taskId")
  .get(isAuthenticated, updateTask)
  .delete(isAuthenticated, removeTask);

router.route("/me").get(isAuthenticated, getMyProfile);
router.route("/updateprofile").put(isAuthenticated, updateProfile);
router.route("/updatepassword").put(isAuthenticated, updatePassword);

export default router;
