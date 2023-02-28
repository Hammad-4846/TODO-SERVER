import express from "express";
import { userRouter } from "./routers/index.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

export const app = express();

const origin = "http://localhost:3000";
// middleware
app.use(express.json());
app.use(morgan("common"));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin,
  })
);
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/api", userRouter);
app.use("/", (req, res) => {
  res.status(200).send("Ok From Server");
});
