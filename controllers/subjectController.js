import Subject from "../models/Subject.js";

export const createSubject = async (req, res) => {
  try {
    const existing = await Subject.findOne({
  subjectCode: req.body.subjectCode,
  session: req.body.session,
});

if (existing) {
  return res.status(400).json({
    message: "Subject already exists",
  });
}
    const subject = await Subject.create(req.body);

    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({
      createdAt: -1,
    });

    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSubject = async (
  req,
  res
) => {
  try {
    await Subject.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
      }
    );

    res.json({
      message: "Subject deactivated",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};