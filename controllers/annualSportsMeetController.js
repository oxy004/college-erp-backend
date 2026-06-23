import AnnualSportsMeet from "../models/AnnualSportsMeet.js";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/uploadToCloudinary.js";

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};

export const getAnnualSportsMeet = async (
  req,
  res
) => {
  try {
    let sports =
      await AnnualSportsMeet.findOne();

    if (!sports) {
      sports =
        await AnnualSportsMeet.create({});
    }

    res.status(200).json({
      success: true,
      data: sports,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createOrUpdateAnnualSportsMeet =
  async (req, res) => {
    try {
      let sports =
        await AnnualSportsMeet.findOne();

      const payload = {
        ...req.body,
      };

      if (req.body.stats) {
        payload.stats = safeParse(
          req.body.stats
        );
      }

      if (req.body.highlights) {
        payload.highlights =
          safeParse(
            req.body.highlights
          );
      }

      if (req.body.timeline) {
        payload.timeline =
          safeParse(
            req.body.timeline
          );
      }

      if (req.body.achievements) {
        payload.achievements =
          safeParse(
            req.body.achievements
          );
      }

      if (req.file) {
        if (
          sports?.heroImagePublicId
        ) {
          await deleteFromCloudinary(
            sports.heroImagePublicId
          );
        }

        const uploaded =
          await uploadToCloudinary(
            req.file.buffer,
            "annual-sports"
          );

        payload.heroImage =
          uploaded.secure_url;

        payload.heroImagePublicId =
          uploaded.public_id;
      }

      if (!sports) {
        sports =
          await AnnualSportsMeet.create(
            payload
          );
      } else {
        sports =
          await AnnualSportsMeet.findByIdAndUpdate(
            sports._id,
            payload,
            {
              new: true,
              runValidators: true,
            }
          );
      }

      res.status(200).json({
        success: true,
        data: sports,
      });
    } catch (error) {
      console.error(
        "Sports Update Error:",
        error
      );

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const addSportsEvent =
  async (req, res) => {
    try {
      const sports =
        await AnnualSportsMeet.findOne();

      if (!sports) {
        return res.status(404).json({
          success: false,
          message:
            "Annual Sports Meet not found",
        });
      }

      let image = "";
      let imagePublicId = "";

      if (req.file) {
        const uploaded =
          await uploadToCloudinary(
            req.file.buffer,
            "annual-sports/events"
          );

        image =
          uploaded.secure_url;

        imagePublicId =
          uploaded.public_id;
      }

      sports.sportsEvents.push({
        title: req.body.title,
        description:
          req.body.description || "",
        image,
        imagePublicId,
      });

      await sports.save();

      res.status(201).json({
        success: true,
        data: sports,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const updateSportsEvent =
  async (req, res) => {
    try {
      const sports =
        await AnnualSportsMeet.findOne();

      const item =
        sports.sportsEvents.id(
          req.params.id
        );

      if (!item) {
        return res.status(404).json({
          success: false,
          message:
            "Sports event not found",
        });
      }

      item.title =
        req.body.title ||
        item.title;

      item.description =
        req.body.description ||
        item.description;

      if (req.file) {
        if (
          item.imagePublicId
        ) {
          await deleteFromCloudinary(
            item.imagePublicId
          );
        }

        const uploaded =
          await uploadToCloudinary(
            req.file.buffer,
            "annual-sports/events"
          );

        item.image =
          uploaded.secure_url;

        item.imagePublicId =
          uploaded.public_id;
      }

      await sports.save();

      res.status(200).json({
        success: true,
        data: sports,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const deleteSportsEvent =
  async (req, res) => {
    try {
      const sports =
        await AnnualSportsMeet.findOne();

      const item =
        sports.sportsEvents.id(
          req.params.id
        );

      if (!item) {
        return res.status(404).json({
          success: false,
        });
      }

      if (
        item.imagePublicId
      ) {
        await deleteFromCloudinary(
          item.imagePublicId
        );
      }

      item.deleteOne();

      await sports.save();

      res.status(200).json({
        success: true,
        message:
          "Sports Event Deleted",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const addGalleryImage =
  async (req, res) => {
    try {
      const sports =
        await AnnualSportsMeet.findOne();

      if (!sports) {
        return res.status(404).json({
          success: false,
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Image is required",
        });
      }

      const uploaded =
        await uploadToCloudinary(
          req.file.buffer,
          "annual-sports/gallery"
        );

      sports.gallery.push({
        image:
          uploaded.secure_url,

        publicId:
          uploaded.public_id,

        caption:
          req.body.caption || "",
      });

      await sports.save();

      res.status(201).json({
        success: true,
        data: sports,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const deleteGalleryImage =
  async (req, res) => {
    try {
      const sports =
        await AnnualSportsMeet.findOne();

      const image =
        sports.gallery.id(
          req.params.id
        );

      if (!image) {
        return res.status(404).json({
          success: false,
        });
      }

      if (
        image.publicId
      ) {
        await deleteFromCloudinary(
          image.publicId
        );
      }

      image.deleteOne();

      await sports.save();

      res.status(200).json({
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };