import FacultySubjectAssignment from "../models/FacultySubjectAssignment.js";
import Subject from "../models/Subject.js";
import Faculty from "../models/Faculty.js";

// Assign Faculty to Subject
export const assignFaculty = async (req, res) => {
  try {
    const { facultyId, subjectId } = req.body;

    if (!facultyId || !subjectId) {
      return res.status(400).json({
        message: "Faculty and Subject are required",
      });
    }

    const faculty = await Faculty.findById(facultyId);

    if (!faculty) {
      return res.status(404).json({
        message: "Faculty not found",
      });
    }

    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    const existingAssignment =
      await FacultySubjectAssignment.findOne({
        facultyId,
        subjectId,
        isActive: true,
      });

    if (existingAssignment) {
      return res.status(400).json({
        message:
          "Faculty is already assigned to this subject",
      });
    }

    // Only one active faculty per subject
    await FacultySubjectAssignment.updateMany(
      {
        subjectId,
        isActive: true,
      },
      {
        isActive: false,
      }
    );

    const assignment =
      await FacultySubjectAssignment.create({
        facultyId,
        subjectId,
        assignedBy: "Admin",
      });

    const populatedAssignment =
      await FacultySubjectAssignment.findById(
        assignment._id
      )
        .populate("facultyId")
        .populate("subjectId");

    res.status(201).json(populatedAssignment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Active Assignments
export const getAssignments = async (
  req,
  res
) => {
  try {
    const assignments =
      await FacultySubjectAssignment.find({
        isActive: true,
      })
        .populate("facultyId")
        .populate("subjectId")
        .sort({
          createdAt: -1,
        });

    res.json(assignments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Assignments Of Particular Faculty
export const getFacultyAssignments =
  async (req, res) => {
    try {
      const assignments =
        await FacultySubjectAssignment.find({
          facultyId: req.params.facultyId,
          isActive: true,
        })
          .populate("facultyId")
          .populate("subjectId");

      res.json(assignments);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

// Reassign Faculty
export const reassignFaculty = async (
  req,
  res
) => {
  try {
    const { facultyId } = req.body;

    const { subjectId } = req.params;

    if (!facultyId) {
      return res.status(400).json({
        message: "Faculty is required",
      });
    }

    const faculty = await Faculty.findById(
      facultyId
    );

    if (!faculty) {
      return res.status(404).json({
        message: "Faculty not found",
      });
    }

    const subject = await Subject.findById(
      subjectId
    );

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    await FacultySubjectAssignment.updateMany(
      {
        subjectId,
        isActive: true,
      },
      {
        isActive: false,
      }
    );

    const assignment =
      await FacultySubjectAssignment.create({
        facultyId,
        subjectId,
        assignedBy: "Admin",
      });

    const populatedAssignment =
      await FacultySubjectAssignment.findById(
        assignment._id
      )
        .populate("facultyId")
        .populate("subjectId");

    res.json(populatedAssignment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Deactivate Assignment
export const deactivateAssignment =
  async (req, res) => {
    try {
      const assignment =
        await FacultySubjectAssignment.findByIdAndUpdate(
          req.params.id,
          {
            isActive: false,
          },
          {
            new: true,
          }
        );

      if (!assignment) {
        return res.status(404).json({
          message: "Assignment not found",
        });
      }

      res.json({
        message:
          "Assignment deactivated successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };