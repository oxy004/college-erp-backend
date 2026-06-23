import jwt from "jsonwebtoken";

const authMiddleware = (

  req,
  res,
  next

) => {

  try {

    // ============================================
    // GET TOKEN
    // ============================================

    const authHeader =
      req.headers.authorization;

    // CHECK HEADER

    if (
      !authHeader ||
      !authHeader.startsWith(
        "Bearer "
      )
    ) {

      return res.status(401).json({

        success: false,

        message:
          "No token provided",

      });

    }

    // EXTRACT TOKEN

    const token =
      authHeader.split(" ")[1];

    // CHECK TOKEN

    if (!token) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid token format",

      });

    }

    // VERIFY TOKEN

    const decoded =
      jwt.verify(

        token,

        process.env.JWT_SECRET

      );


    // ATTACH USER

    req.user = {

      id:
        decoded.id,

      role:
        decoded.role,

    };

    // console.log("REQ.USER:", req.user);

    next();

  } catch (error) {

    console.log(
      "AUTH ERROR:",
      error.message
    );

    // TOKEN EXPIRED

    if (
      error.name ===
      "TokenExpiredError"
    ) {

      return res.status(401).json({

        success: false,

        message:
          "Token expired",

      });

    }

    // INVALID TOKEN

    return res.status(401).json({

      success: false,

      message:
        "Invalid token",

    });

  }

};

export default authMiddleware;