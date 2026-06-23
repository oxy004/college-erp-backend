import Award from "../models/Award.js";
import cloudinary from "../config/cloudinary.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

export const createAward = async (req, res) => {
  try {
    const {
      title,
      recipient,
      awardee,
      awardDate,
      description,
      featured,
    } = req.body;

    let image = "";
    let publicId = "";

    if (req.file) {
      const result =
        await uploadToCloudinary(
          req.file.buffer,
          "awards"
        );

      image = result.secure_url;
      publicId = result.public_id;
    }

    const award = await Award.create({
      title,
      recipient,
      awardee,
      awardDate,
      description,
      image,
      publicId,
      featured:
        featured === "true" ||
        featured === true,
    });

    res.status(201).json({
      success: true,
      message: "Award created successfully",
      award,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAwards = async (req, res) => {
  try {
    const awards = await Award.find({
      isActive: true,
    }).sort({
      awardDate: -1,
    });

    res.status(200).json(awards);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAwardById = async (req, res) => {
  try {
    const award = await Award.findById(
      req.params.id
    );

    if (!award) {
      return res.status(404).json({
        success: false,
        message: "Award not found",
      });
    }

    res.status(200).json(award);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateAward = async (req, res) => {
  try {
    const award = await Award.findById(
      req.params.id
    );

    if (!award) {
      return res.status(404).json({
        success: false,
        message: "Award not found",
      });
    }

    const {
      title,
      recipient,
      awardee,
      awardDate,
      description,
      featured,
    } = req.body;

    award.title = title ?? award.title;
    award.recipient =
      recipient ?? award.recipient;
    award.awardee =
      awardee ?? award.awardee;
    if (awardDate) {
  award.awardDate = awardDate;
}
    award.description =
      description ?? award.description;

    if (featured !== undefined) {
      award.featured =
        featured === "true" ||
        featured === true;
    }

    if (req.file) {
      if (award.publicId) {
        await cloudinary.uploader.destroy(
          award.publicId
        );
      }

      const result =
        await uploadToCloudinary(
          req.file.buffer,
          "awards"
        );

      award.image =
        result.secure_url;

      award.publicId =
        result.public_id;
    }

    await award.save();

    res.status(200).json({
      success: true,
      message:
        "Award updated successfully",
      award,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteAward = async (req, res) => {
  try {
    const award = await Award.findById(
      req.params.id
    );

    if (!award) {
      return res.status(404).json({
        success: false,
        message: "Award not found",
      });
    }

    if (award.publicId) {
      await cloudinary.uploader.destroy(
        award.publicId
      );
    }

    await award.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Award deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteAllAwards =
  async (req, res) => {
    try {
      const awards =
        await Award.find({});

      for (const award of awards) {
        if (award.publicId) {
          await cloudinary.uploader.destroy(
            award.publicId
          );
        }
      }

      await Award.deleteMany({});

      res.status(200).json({
        success: true,
        message:
          "All awards deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };