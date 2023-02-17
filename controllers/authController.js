import { User } from "../models/Users.js";
import { sendMail } from "../utils/sendMail.js";
import { error, success } from "../utils/responseWrapper.js";
import { sendToken } from "../utils/sendToken.js";
import fs from "fs";
import cloudinary from "cloudinary";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const avatar = req.files.avatar.tempFilePath;

    let user = await User.findOne({ email });
    if (user) {
      return res.send(error(404, "User is Already Registered"));
    }

    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "todoApp",
    });

    fs.rmSync("./tmp", { recursive: true });
    const otp = Math.floor(Math.random() * 1000000);
    await sendMail(email, "Verify Your Account", `Your OTP is ${otp}`);

    user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      otp,
      otp_expiry: new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000),
    });

    sendToken(
      res,
      user,
      200,
      "OTP send to your email, Please Verify you account"
    );
  } catch (e) {
    return res.send(e.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !password) {
      return res.send(error(404, "Please Enter all Fields"));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.send(error(404, "Invalid Email and Password"));
    }

    sendToken(res, user, 200, "User Is Succesfully Login");
  } catch (e) {
    return res.send(e.message);
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });
    return res.send(success(200, "user logged out"));
  } catch (e) {
    return res.send(e.message);
  }
};

export const verify = async (req, res) => {
  try {
    const otp = Number(req.body.otp);
    const user = await User.findById(req.user._id);
    if (user.otp != otp || user.otp_expiry < Date.now()) {
      return res.send(error(404, "Invalid OTP or has been Expired"));
    }
    user.verified = true;
    user.otp = null;
    user.otp_expiry = null;

    await user.save();
    sendToken(res, user, "Account Verified");
  } catch (e) {}
};

export const addTask = async (req, res) => {
  const { title, description } = req.body;

  const user = await User.findById(req.user._id);

  user.tasks.push({
    title,
    description,
    isCompleted: false,
    createdAt: new Date(Date.now()),
  });

  await user.save();
  res.send(success(201, "Task Added Successfully"));
};

export const removeTask = async (req, res) => {
  const { taskId } = req.params;

  const user = await User.findById(req.user.id);

  user.tasks = user.tasks.filter(
    (task) => task._id.toString() !== task._id.toString()
  );

  await user.save();
  res.send(success(201, "Task remove Successfully"));
};

export const updateTask = async (req, res) => {
  const { taskId } = req.params;

  const user = await User.findById(req.user.id);

  user.task = user.tasks.find(
    (task) => task._id.toString() === task._id.toString()
  );

  user.task.isCompleted = !user.task.isCompleted;
  await user.save();

  res.send(success(201, "Task Updated Successfully"));
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    sendToken(res, user, 201, `Welcome back ${user.name}`);
  } catch (e) {
    res.send(error(500, e.message));
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const { name } = req.body;
    const avatar = req.files.avatar.tempFilePath;

    if (name) {
      user.name = name;
    }
    if (avatar) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "todoApp",
      });

      fs.rmSync("../tmp", { recursive: true });

      user.avatar = {
        url: myCloud.secure_url,
        public_id: myCloud.public_id,
      };
    }

    await user.save();
    return res.send(success(200, "Profile Updated Succesfully"));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.send(error(400, "Please Enter All fields"));
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.send(error(404, "Invalid Old Password"));
    }

    user.password = newPassword;

    await user.save();

    return res.send(success(200, "Password Updated Succesfully"));
  } catch (e) {
    res.send(error(500, e.message));
  }
};
