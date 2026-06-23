import PlacedStudent from "../models/PlacedStudent.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/uploadToCloudinary.js";

export const createStudent = async (req, res) => {
  try {
    let image = "";
    let imagePublicId = "";

    if (req.file) {
const result = await uploadToCloudinary(
  req.file.buffer,
  "placed-students"
);

      image = result.secure_url;
      imagePublicId = result.public_id;
    }

    const student = await PlacedStudent.create({
      studentName: req.body.studentName,
      department: req.body.department,
      company: req.body.company,
      designation: req.body.designation,
      package: req.body.package,
      placementYear: req.body.placementYear,
      image,
      imagePublicId,
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await PlacedStudent.find().sort({
      placementYear: -1,
    });

    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student =
      await PlacedStudent.findById(
        req.params.id
      );

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const student =
      await PlacedStudent.findById(
        req.params.id
      );

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    student.studentName =
      req.body.studentName ||
      student.studentName;

    student.department =
      req.body.department ||
      student.department;

    student.company =
      req.body.company ||
      student.company;

    student.designation =
      req.body.designation ||
      student.designation;

    student.package =
      req.body.package ||
      student.package;

    student.placementYear =
      req.body.placementYear ||
      student.placementYear;

    if (req.file) {
      if (student.imagePublicId) {
        await deleteFromCloudinary(
          student.imagePublicId
        );
      }

      const result =
  await uploadToCloudinary(
    req.file.buffer,
    "placed-students"
  );

      student.image =
        result.secure_url;

      student.imagePublicId =
        result.public_id;
    }

    await student.save();

    res.json(student);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student =
      await PlacedStudent.findById(
        req.params.id
      );

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    if (student.imagePublicId) {
      await deleteFromCloudinary(
        student.imagePublicId
      );
    }

    await PlacedStudent.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};