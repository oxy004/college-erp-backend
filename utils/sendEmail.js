import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter =
  nodemailer.createTransport({

    service: "gmail",

    auth: {

      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS,

    },

  });






const sendEmail = async (
  to,
  subject,
  html
) => {

  try {

    const info =
      await transporter.sendMail({

        from:
          process.env.EMAIL_USER,

        to,

        subject,

        html,

      });





    console.log(
      "EMAIL SENT SUCCESS ✅"
    );

    console.log(info.response);

  } catch (error) {

    console.log(
      "EMAIL ERROR ❌"
    );

    console.log(error);

    throw error;

  }

};

export default sendEmail;