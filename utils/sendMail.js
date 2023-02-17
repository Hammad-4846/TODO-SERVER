import { createTransport } from "nodemailer";
import { error } from "./responseWrapper.js";
export const sendMail = async (email, subject, text) => {
  try {
    const transport = createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transport.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject,
      text,
    });
  } catch (e) {
    console.log(e);
  }
};
