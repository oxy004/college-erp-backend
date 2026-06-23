import AcademicWork from "../models/AcademicWork.js";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/uploadToCloudinary.js";

export const getAcademicWorks = async (
  req,
  res
) => {
  try {
    const works =
      await AcademicWork.find().sort({
        activityDate: -1,
      });

    res.status(200).json(works);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAcademicWork = async (
  req,
  res
) => {
  try {
    const work =
      await AcademicWork.findById(
        req.params.id
      );

    if (!work) {
      return res.status(404).json({
        message:
          "Academic activity not found",
      });
    }

    res.status(200).json(work);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createAcademicWork =
  async (req, res) => {
    try {
      let image = "";
      let imagePublicId = "";

      if (req.files?.image?.[0]) {
        const uploaded =
          await uploadToCloudinary(
            req.files.image[0].buffer,
            "academic-work"
          );

        image = uploaded.secure_url;
        imagePublicId =
          uploaded.public_id;
      }

      const gallery = [];
      const galleryPublicIds = [];

      if (
        req.files?.gallery?.length
      ) {
        for (const file of req.files
          .gallery) {
          const uploaded =
            await uploadToCloudinary(
              file.buffer,
              "academic-work/gallery"
            );

          gallery.push(
            uploaded.secure_url
          );

          galleryPublicIds.push(
            uploaded.public_id
          );
        }
      }

      const academicWork =
        await AcademicWork.create({
          ...req.body,
          image,
          imagePublicId,
          gallery,
          galleryPublicIds,
        });

      res.status(201).json({
        success: true,
        data: academicWork,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const updateAcademicWork =
  async (req, res) => {
    try {
      const work =
        await AcademicWork.findById(
          req.params.id
        );

      if (!work) {
        return res.status(404).json({
          message:
            "Academic activity not found",
        });
      }

      let image = work.image;
      let imagePublicId =
        work.imagePublicId;

      if (req.files?.image?.[0]) {
        if (work.imagePublicId) {
          await deleteFromCloudinary(
            work.imagePublicId
          );
        }

        const uploaded =
          await uploadToCloudinary(
            req.files.image[0].buffer,
            "academic-work"
          );

        image = uploaded.secure_url;
        imagePublicId =
          uploaded.public_id;
      }

      let gallery = work.gallery;
      let galleryPublicIds =
        work.galleryPublicIds || [];

      if (
        req.files?.gallery?.length > 0
      ) {
        if (
          work.galleryPublicIds
            ?.length
        ) {
          for (const publicId of work.galleryPublicIds) {
            await deleteFromCloudinary(
              publicId
            );
          }
        }

        gallery = [];
        galleryPublicIds = [];

        for (const file of req.files
          .gallery) {
          const uploaded =
            await uploadToCloudinary(
              file.buffer,
              "academic-work/gallery"
            );

          gallery.push(
            uploaded.secure_url
          );

          galleryPublicIds.push(
            uploaded.public_id
          );
        }
      }

      const updatedWork =
        await AcademicWork.findByIdAndUpdate(
          req.params.id,
          {
            ...req.body,
            image,
            imagePublicId,
            gallery,
            galleryPublicIds,
          },
          {
            new: true,
          }
        );

      res.status(200).json({
        success: true,
        data: updatedWork,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const deleteAcademicWork =
  async (req, res) => {
    try {
      const work =
        await AcademicWork.findById(
          req.params.id
        );

      if (!work) {
        return res.status(404).json({
          message:
            "Academic activity not found",
        });
      }

      if (work.imagePublicId) {
        await deleteFromCloudinary(
          work.imagePublicId
        );
      }

      if (
        work.galleryPublicIds
          ?.length
      ) {
        for (const publicId of work.galleryPublicIds) {
          await deleteFromCloudinary(
            publicId
          );
        }
      }

      await work.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const deleteAllAcademicWorks =
  async (req, res) => {
    try {
      const works =
        await AcademicWork.find();

      for (const work of works) {
        if (work.imagePublicId) {
          await deleteFromCloudinary(
            work.imagePublicId
          );
        }

        if (
          work.galleryPublicIds
            ?.length
        ) {
          for (const publicId of work.galleryPublicIds) {
            await deleteFromCloudinary(
              publicId
            );
          }
        }
      }

      await AcademicWork.deleteMany(
        {}
      );

      res.status(200).json({
        success: true,
        message:
          "All records deleted",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const toggleFeatured =
  async (req, res) => {
    try {
      const work =
        await AcademicWork.findById(
          req.params.id
        );

      if (!work) {
        return res.status(404).json({
          message:
            "Academic activity not found",
        });
      }

      work.featured =
        !work.featured;

      await work.save();

      res.status(200).json(work);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };