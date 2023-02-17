import express from "express";
import { userRouter } from "./routers/index.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";

export const app = express();

app.use(express.json());
app.use(morgan("common"));
app.use(cookieParser());
app.use(
  fileUpload({
    limits: { fieldSize: 50 * 1024 * 1024 },
    useTempFiles: true,
  })
);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", userRouter);
