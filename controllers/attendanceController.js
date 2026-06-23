import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import FacultySubjectAssignment from "../models/FacultySubjectAssignment.js";


// get faculty subjects
export const getFacultySubjects = async (
  req,
  res
) => {
  try {
    const subjects =
      await FacultySubjectAssignment.find({
        facultyId: req.user.id,
        isActive: true,
      }).populate("subjectId");

    res.json(subjects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// load students
export const loadStudents = async (
  req,
  res
) => {
  try {
    const { stream, semester } =
  req.query;

const semesterNumber =
  Number(
    semester
      ?.toString()
      .replace("Semester ", "")
  );

const students =
  await Student.find({
    stream,
    semester: semesterNumber,
    status: "active",
  })
    .sort({ roll: 1 })
    .select(
      "name roll reg stream semester batch"
    );

    res.json(students);
  }catch (error) {

  console.log(
    "LOAD STUDENTS ERROR:",
    error
  );

  res.status(500).json({
    message: error.message,
  });

}
};
// save attendance
export const saveAttendance = async (
  req,
  res
) => {
  try {
    const {
      date,
      subjectId,
      stream,
      semester,
      session,
      attendance,
    } = req.body;

    const existing =
    await Attendance.findOne({
        date,
        subjectId,
        facultyId: req.user.id,
    });
    if (existing) {
      existing.attendance = attendance;

      await existing.save();

      return res.json(existing);
    }

    const record =
      await Attendance.create({
        date,
        subjectId,
        facultyId: req.user.id,
        stream,
        semester,
        session,
        attendance,
      });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getStudentAttendance =
  async (req, res) => {
    try {
      const { id } = req.params;

      const attendance =
        await Attendance.find({
          "attendance.studentId": id,
        }).populate("subjectId");

      res.json(attendance);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const getAttendancePercentage =
  async (req, res) => {
    try {
      const { id } = req.params;

      const records =
        await Attendance.find({
          "attendance.studentId": id,
        });

      let totalClasses = 0;
      let presentClasses = 0;

      records.forEach((record) => {
        const studentRecord =
          record.attendance.find(
            (item) =>
              item.studentId.toString() === id
          );

        if (studentRecord) {
          totalClasses++;

          if (
            studentRecord.status ===
            "Present"
          ) {
            presentClasses++;
          }
        }
      });

      const percentage =
        totalClasses === 0
          ? 0
          : (
              (presentClasses /
                totalClasses) *
              100
            ).toFixed(2);

      res.json({
        totalClasses,
        presentClasses,
        percentage,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  export const getSubjectAttendance =
  async (req, res) => {
    try {
      const { subjectId } = req.params;

      const attendance =
        await Attendance.find({
          subjectId,
        })
          .populate(
            "attendance.studentId"
          )
          .populate("subjectId");

      res.json(attendance);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  export const getAttendanceByDate =
  async (req, res) => {
    try {
      const { date, subjectId } =
        req.query;

      const attendance =
        await Attendance.findOne({
          date,
          subjectId,
        });

      res.json(attendance);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  export const getAttendanceReport =
  async (req, res) => {
    try {

      const {
        stream,
        semester,
        subjectId,
      } = req.query;

      const query = {};

      if (stream)
        query.stream = stream;

      if (semester)
        query.semester = semester;

      if (subjectId)
        query.subjectId =
          subjectId;

      const records =
        await Attendance.find(
          query
        )
          .populate(
            "subjectId"
          )
          .populate(
            "facultyId"
          )
          .populate(
            "attendance.studentId"
          );

      res.json(records);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };

  export const getReportSummary =
  async (req, res) => {
    try {

      const totalRecords =
        await Attendance.countDocuments();

      const totalSubjects =
        await Attendance.distinct(
          "subjectId"
        );

      const totalFaculty =
        await Attendance.distinct(
          "facultyId"
        );

      res.json({
        totalRecords,
        totalSubjects:
          totalSubjects.length,
        totalFaculty:
          totalFaculty.length,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };
  export const getLowAttendanceStudents =
  async (req, res) => {
    try {

      const threshold =
        Number(
          req.query.threshold || 75
        );

      const records =
        await Attendance.find()
          .populate(
            "attendance.studentId"
          );

      const studentMap =
        {};

      records.forEach(
        (record) => {

          record.attendance.forEach(
            (entry) => {

              const id =
                entry.studentId?._id?.toString();

              if (!id)
                return;

              if (
                !studentMap[id]
              ) {

                studentMap[id] = {
                  student:
                    entry.studentId,
                  total: 0,
                  present: 0,
                };
              }

              studentMap[id]
                .total++;

              if (
                entry.status ===
                "Present"
              ) {

                studentMap[id]
                  .present++;
              }
            }
          );
        }
      );

      const result =
        Object.values(
          studentMap
        ).filter(
          (
            student
          ) => {

            const percentage =
              (
                (student.present /
                  student.total) *
                100
              );

            return (
              percentage <
              threshold
            );
          }
        );

      res.json(result);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };