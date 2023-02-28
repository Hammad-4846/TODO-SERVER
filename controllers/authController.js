import { User } from "../models/Users.js";
import { error, success } from "../utils/responseWrapper.js";
import { sendToken } from "../utils/sendToken.js";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.send(error(404, "User is Already Registered"));
    }

    user = await User.create({
      email,
      password,
    });

    sendToken(res, user, 200, "User is Created Succesfully ");
  } catch (e) {
    return res.send(e.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.send(error(404, "Please Enter all Fields"));
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.send(error(404, "User Is Not Found"));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.send(error(404, "Invalid Email and Password"));
    }
    const localToken = user.getJWTToken();
    sendToken(res, user, 200, "User Is Succesfully Login", localToken);
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

export const addTask = async (req, res) => {
  const { title, note, link, iconUrl } = req.body;

  const user = await User.findById(req.user._id);

  user.tasks.push({
    title,
    note,
    link,
    iconUrl,
    isCompleted: false,
    createdAt: new Date(Date.now()),
  });

  await user.save();
  res.send(success(201, user));
};

export const removeTask = async (req, res) => {
  const { taskId } = req.body;
  console.log("This is Task Id", taskId);

  const user = await User.findById(req.user.id);

  user.tasks = user.tasks.filter(
    (task) => task._id.toString() !== taskId.toString()
  );

  await user.save();
  res.send(success(201, user));
};

export const updateTask = async (req, res) => {
  const { taskId } = req.body;

  const user = await User.findById(req.user.id);

  user.task = user.tasks.find((task) => task._id.toString() === taskId);

  user.task.isCompleted = !user.task.isCompleted;
  await user.save();

  res.send(success(201, "Task Updated Successfully"));
};

export const dragTask = async (req, res) => {
  const { newTodo } = req.body;
  const user = await User.findById(req.user.id);
  user.tasks = newTodo;

  await user.save();

  return res.send(success(201, user));
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
