import CommonRoom from "../models/CommonRoom.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/uploadToCloudinary.js";

/* =========================================================
   GET COMMON ROOM
========================================================= */
export const getCommonRoom = async (req, res) => {
  try {
    let commonRoom = await CommonRoom.findOne();

    if (!commonRoom) {
      commonRoom = await CommonRoom.create({
        heroSubtitle: "Relax • Refresh • Reconnect",
        heroImage: "",
        heroImagePublicId: "",
        aboutText: "",
        games: [],
      });
    }

    res.status(200).json(commonRoom);
  } catch (error) {
    console.error("Get Common Room Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch Common Room data",
    });
  }
};

/* =========================================================
   CREATE / UPDATE COMMON ROOM
========================================================= */
export const createOrUpdateCommonRoom = async (
  req,
  res
) => {
  try {
    const {
      heroSubtitle,
      aboutText,
    } = req.body;

    let commonRoom =
      await CommonRoom.findOne();

    let heroImageData = null;

    if (req.file) {
      heroImageData =
        await uploadToCloudinary(
          req.file.buffer,
          "common-room"
        );
    }

    /* ================= CREATE ================= */

    if (!commonRoom) {
      commonRoom =
        await CommonRoom.create({
          heroSubtitle:
            heroSubtitle ||
            "Relax • Refresh • Reconnect",

          heroImage:
            heroImageData?.secure_url || "",

          heroImagePublicId:
            heroImageData?.public_id || "",

          aboutText: aboutText || "",

          games: [],
        });

      return res.status(201).json({
        success: true,
        message:
          "Common Room created successfully",
        data: commonRoom,
      });
    }

    /* ================= UPDATE ================= */

    commonRoom.heroSubtitle =
      heroSubtitle ??
      commonRoom.heroSubtitle;

    commonRoom.aboutText =
      aboutText ??
      commonRoom.aboutText;

    if (heroImageData) {
      if (commonRoom.heroImagePublicId) {
        await deleteFromCloudinary(
          commonRoom.heroImagePublicId
        );
      }

      commonRoom.heroImage =
        heroImageData.secure_url;

      commonRoom.heroImagePublicId =
        heroImageData.public_id;
    }

    await commonRoom.save();

    res.status(200).json({
      success: true,
      message:
        "Common Room updated successfully",
      data: commonRoom,
    });
  } catch (error) {
    console.error(
      "Update Common Room Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update Common Room",
    });
  }
};

/* =========================================================
   ADD GAME
========================================================= */
export const addGame = async (req, res) => {
  try {
    const {
      title,
      description,
      featured,
    } = req.body;

    const commonRoom =
      await CommonRoom.findOne();

    if (!commonRoom) {
      return res.status(404).json({
        success: false,
        message:
          "Common Room data not found",
      });
    }

    let imageData = null;

    if (req.file) {
      imageData =
        await uploadToCloudinary(
          req.file.buffer,
          "common-room/games"
        );
    }

    const game = {
      title,
      description,

      image:
        imageData?.secure_url || "",

      imagePublicId:
        imageData?.public_id || "",

      featured:
        featured === true ||
        featured === "true",
    };

    commonRoom.games.push(game);

    await commonRoom.save();

    res.status(201).json({
      success: true,
      message: "Game added successfully",
      data: commonRoom,
    });
  } catch (error) {
    console.error(
      "Add Game Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to add game",
    });
  }
};

/* =========================================================
   UPDATE GAME
========================================================= */
export const updateGame = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const commonRoom =
      await CommonRoom.findOne();

    if (!commonRoom) {
      return res.status(404).json({
        success: false,
        message:
          "Common Room data not found",
      });
    }

    const game =
      commonRoom.games.id(id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    game.title =
      req.body.title ??
      game.title;

    game.description =
      req.body.description ??
      game.description;

    if (
      req.body.featured !== undefined
    ) {
      game.featured =
        req.body.featured === true ||
        req.body.featured === "true";
    }

    if (req.file) {
      if (game.imagePublicId) {
        await deleteFromCloudinary(
          game.imagePublicId
        );
      }

      const imageData =
        await uploadToCloudinary(
          req.file.buffer,
          "common-room/games"
        );

      game.image =
        imageData.secure_url;

      game.imagePublicId =
        imageData.public_id;
    }

    await commonRoom.save();

    res.status(200).json({
      success: true,
      message:
        "Game updated successfully",
      data: commonRoom,
    });
  } catch (error) {
    console.error(
      "Update Game Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update game",
    });
  }
};

/* =========================================================
   DELETE GAME
========================================================= */
export const deleteGame = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const commonRoom =
      await CommonRoom.findOne();

    if (!commonRoom) {
      return res.status(404).json({
        success: false,
        message:
          "Common Room data not found",
      });
    }

    const game =
      commonRoom.games.id(id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    if (game.imagePublicId) {
      await deleteFromCloudinary(
        game.imagePublicId
      );
    }

    game.deleteOne();

    await commonRoom.save();

    res.status(200).json({
      success: true,
      message:
        "Game deleted successfully",
      data: commonRoom,
    });
  } catch (error) {
    console.error(
      "Delete Game Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete game",
    });
  }
};

/* =========================================================
   DELETE HERO IMAGE
========================================================= */
export const deleteHeroImage = async (
  req,
  res
) => {
  try {
    const commonRoom =
      await CommonRoom.findOne();

    if (!commonRoom) {
      return res.status(404).json({
        success: false,
        message:
          "Common Room not found",
      });
    }

    if (
      commonRoom.heroImagePublicId
    ) {
      await deleteFromCloudinary(
        commonRoom.heroImagePublicId
      );
    }

    commonRoom.heroImage = "";
    commonRoom.heroImagePublicId =
      "";

    await commonRoom.save();

    res.status(200).json({
      success: true,
      message:
        "Hero image deleted successfully",
      data: commonRoom,
    });
  } catch (error) {
    console.error(
      "Delete Hero Image Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete hero image",
    });
  }
};