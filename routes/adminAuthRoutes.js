import express from "express";

import jwt from "jsonwebtoken";

const router = express.Router();


// ============================================
// ADMIN LOGIN
// ============================================

router.post(

  "/login",

  async (req, res) => {

    try {

      const {

        email,
        password,

      } = req.body;

      // CHECK ENV ADMIN
      if (

        email !==
          process.env.ADMIN_EMAIL ||

        password !==
          process.env.ADMIN_PASSWORD

      ) {

        return res.status(401).json({

          message:
            "Invalid admin credentials",

        });

      }

      // GENERATE TOKEN
      const token =
        jwt.sign(

          {

            role: "admin",

            email,

          },

          process.env.JWT_SECRET,

          {

            expiresIn: "7d",

          }

        );

      // RETURN ADMIN DATA
      res.status(200).json({

        token,

        admin: {

          email,

          role: "admin",

        },

      });

    } catch (error) {

      console.log(
        "ADMIN LOGIN ERROR:",
        error
      );

      res.status(500).json({

        message:
          "Admin Login Failed",

      });

    }

  }

);

export default router;