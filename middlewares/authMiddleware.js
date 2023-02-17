import jwt from "jsonwebtoken";
import { User } from "../models/Users.js";
import { error, success } from "../utils/responseWrapper.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.send(success(404, "Login Required"));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded._id);
    next();
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};
