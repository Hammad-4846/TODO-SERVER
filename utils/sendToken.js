import { success } from "./responseWrapper.js";
export const sendToken = async (res, user, statusCode, message) => {
  const token = user.getJWTToken();
  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    tasks: user.tasks,
    isVerified: user.verified,
  };

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_PARSER * 24 * 60 * 60 * 1000
    ),
  });

  res.send(success(statusCode, { user: userData, message }));
};
