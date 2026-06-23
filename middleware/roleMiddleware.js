//
// ROLE AUTHORIZATION MIDDLEWARE
//



// ============================================
// GENERIC ROLE CHECKER
// ============================================

const authorizeRoles = (

  ...allowedRoles

) => {

  return (

    req,
    res,
    next

  ) => {

    try {

//       console.log(
//   "ALLOWED:",
//   allowedRoles,
//   "USER ROLE:",
//   req.user.role
// );

      // USER CHECK

      if (!req.user) {

        return res.status(401).json({

          success: false,

          message:
            "Unauthorized access",

        });

      }

      // ROLE CHECK

      if (

        !allowedRoles.includes(
          req.user.role
        )

      ) {

        return res.status(403).json({

          success: false,

          message:
            "Access denied",

        });

      }

      next();

    } catch (error) {

      console.log(
        "ROLE MIDDLEWARE ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Role authorization failed",

        error:
          error.message,

      });

    }

  };

};


// ============================================
// FACULTY ONLY
// ============================================

export const facultyOnly =

  authorizeRoles(
    "faculty"
  );


// ============================================
// STUDENT ONLY
// ============================================

export const studentOnly =

  authorizeRoles(
    "student"
  );


// ============================================
// ADMIN ONLY
// ============================================

export const adminOnly =

  authorizeRoles(
    "admin"
  );


// ============================================
// FACULTY + ADMIN
// ============================================

export const facultyAdminOnly =

  authorizeRoles(

    "faculty",
    "admin"

  );


// ============================================
// ALL AUTH USERS
// ============================================

export const allAuthorized =

  authorizeRoles(

    "student",
    "faculty",
    "admin"

  );


// ============================================
// EXPORT GENERIC
// ============================================

export default authorizeRoles;