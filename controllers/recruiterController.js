import Recruiter from "../models/Recruiter.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/uploadToCloudinary.js";

export const createRecruiter = async (req, res) => {
  try {
    let logo = "";
    let logoPublicId = "";

    if (req.file) {
     const result = await uploadToCloudinary(
  req.file.buffer,
  "recruiters"
);

      logo = result.secure_url;
      logoPublicId = result.public_id;
    }

    const recruiter = await Recruiter.create({
      companyName: req.body.companyName,
      website: req.body.website,
      logo,
      logoPublicId,
      active: req.body.active,
    });

    res.status(201).json(recruiter);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getRecruiters = async (req, res) => {
  try {
    const recruiters = await Recruiter.find().sort({
      createdAt: -1,
    });

    res.json(recruiters);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getRecruiterById = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(
      req.params.id
    );

    if (!recruiter) {
      return res.status(404).json({
        message: "Recruiter not found",
      });
    }

    res.json(recruiter);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateRecruiter = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(
      req.params.id
    );

    if (!recruiter) {
      return res.status(404).json({
        message: "Recruiter not found",
      });
    }

    recruiter.companyName =
      req.body.companyName ||
      recruiter.companyName;

    recruiter.website =
      req.body.website ||
      recruiter.website;

    recruiter.active =
      req.body.active ?? recruiter.active;

    if (req.file) {
      if (recruiter.logoPublicId) {
        await deleteFromCloudinary(
          recruiter.logoPublicId
        );
      }

      const result =
  await uploadToCloudinary(
    req.file.buffer,
    "recruiters"
  );

      recruiter.logo = result.secure_url;
      recruiter.logoPublicId =
        result.public_id;
    }

    await recruiter.save();

    res.json(recruiter);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteRecruiter = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(
      req.params.id
    );

    if (!recruiter) {
      return res.status(404).json({
        message: "Recruiter not found",
      });
    }

    if (recruiter.logoPublicId) {
      await deleteFromCloudinary(
        recruiter.logoPublicId
      );
    }

    await Recruiter.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Recruiter deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};