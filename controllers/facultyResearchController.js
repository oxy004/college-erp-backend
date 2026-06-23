import FacultyResearch from "../models/FacultyResearch.js";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/uploadToCloudinary.js";

export const getFacultyMembers = async (
  req,
  res
) => {
  try {
    const faculty =
      await FacultyResearch.find().sort({
        displayOrder: 1,
        createdAt: -1,
      });

    res.status(200).json(faculty);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getFacultyMemberById =
  async (req, res) => {
    try {
      const faculty =
        await FacultyResearch.findById(
          req.params.id
        );

      if (!faculty) {
        return res.status(404).json({
          message: "Faculty member not found",
        });
      }

      res.status(200).json(faculty);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const createFacultyMember =
  async (req, res) => {
    try {
      let photo = "";
      let publicId = "";

      if (req.file) {
        const uploaded =
          await uploadToCloudinary(
            req.file.buffer,
            "faculty-research"
          );

        photo = uploaded.secure_url;
        publicId =
          uploaded.public_id;
      }

      const faculty =
        await FacultyResearch.create({
          ...req.body,

          photo,
          publicId,

          researchInterests:
            req.body.researchInterests
              ? JSON.parse(
                  req.body
                    .researchInterests
                )
              : [],

          publications:
            req.body.publications
              ? JSON.parse(
                  req.body.publications
                )
              : [],
        });

      res.status(201).json(faculty);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const updateFacultyMember =
  async (req, res) => {
    try {
      const faculty =
        await FacultyResearch.findById(
          req.params.id
        );

      if (!faculty) {
        return res.status(404).json({
          message: "Faculty member not found",
        });
      }

      if (
        req.body.removePhoto ===
        "true"
      ) {
        if (faculty.publicId) {
          await deleteFromCloudinary(
            faculty.publicId
          );
        }

        faculty.photo = "";
        faculty.publicId = "";
      }

      if (req.file) {
        if (faculty.publicId) {
          await deleteFromCloudinary(
            faculty.publicId
          );
        }

        const uploaded =
          await uploadToCloudinary(
            req.file.buffer,
            "faculty-research"
          );

        faculty.photo =
          uploaded.secure_url;

        faculty.publicId =
          uploaded.public_id;
      }

      faculty.category =
        req.body.category ??
        faculty.category;

      faculty.name =
        req.body.name ??
        faculty.name;

      faculty.designation =
        req.body.designation ??
        faculty.designation;

      faculty.qualification =
        req.body.qualification ??
        faculty.qualification;

      faculty.department =
        req.body.department ??
        faculty.department;

      faculty.email =
        req.body.email ??
        faculty.email;

      faculty.phone =
        req.body.phone ??
        faculty.phone;

      faculty.experience =
        req.body.experience ??
        faculty.experience;

      faculty.scholarLink =
        req.body.scholarLink ??
        faculty.scholarLink;

      faculty.orcidLink =
        req.body.orcidLink ??
        faculty.orcidLink;

      faculty.linkedinLink =
        req.body.linkedinLink ??
        faculty.linkedinLink;

      faculty.featured =
        req.body.featured ??
        faculty.featured;

      faculty.displayOrder =
        req.body.displayOrder ??
        faculty.displayOrder;

      faculty.isActive =
        req.body.isActive ??
        faculty.isActive;

      if (
        req.body.researchInterests
      ) {
        faculty.researchInterests =
          JSON.parse(
            req.body
              .researchInterests
          );
      }

      if (
        req.body.publications
      ) {
        faculty.publications =
          JSON.parse(
            req.body.publications
          );
      }

      const updated =
        await faculty.save();

      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const deleteFacultyMember =
  async (req, res) => {
    try {
      const faculty =
        await FacultyResearch.findById(
          req.params.id
        );

      if (!faculty) {
        return res.status(404).json({
          message: "Faculty member not found",
        });
      }

      if (faculty.publicId) {
        await deleteFromCloudinary(
          faculty.publicId
        );
      }

      await faculty.deleteOne();

      res.status(200).json({
        message:
          "Faculty member deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const getFeaturedFaculty =
  async (req, res) => {
    try {
      const featured =
        await FacultyResearch.find({
          featured: true,
          category: "faculty",
          isActive: true,
        }).sort({
          displayOrder: 1,
        });

      res.status(200).json(
        featured
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };