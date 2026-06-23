import Notice from "../models/Notice.js";
import cloudinary from "../config/cloudinary.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

// ======================================
// CREATE NOTICE
// ======================================

export const createNotice = async (req, res) => {
  try {
    let pdfUrl = "";
let publicId = "";

if (req.file) {
  const result =
    await uploadToCloudinary(
      req.file.buffer,
      "notices"
    );

  pdfUrl = result.secure_url;
  publicId = result.public_id;
}

   const notice = await Notice.create({
  title: req.body.title,
  description: req.body.description,
  category: req.body.category,
  audience: req.body.audience,
  noticeDate: req.body.noticeDate,
  expiryDate: req.body.expiryDate,
  featured: req.body.featured,
  pdfFile: pdfUrl,
  publicId,
});

    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================
// GET ALL NOTICES
// ======================================

export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({
      noticeDate: -1,
    });

    res.json(notices);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================
// GET SINGLE NOTICE
// ======================================

export const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found",
      });
    }

    res.json(notice);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================
// UPDATE NOTICE
// ======================================

export const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found",
      });
    }

    // ======================================
    // PDF LOGIC
    // ======================================

    let pdfUrl = notice.pdfFile;
let publicId = notice.publicId;

if (
  req.body.removeExistingPdf ===
  "true"
) {
  if (notice.publicId) {
    await cloudinary.uploader.destroy(
      notice.publicId,
      {
        resource_type: "raw",
      }
    );
  }

  pdfUrl = "";
  publicId = "";
}

if (req.file) {
  if (notice.publicId) {
    await cloudinary.uploader.destroy(
      notice.publicId,
      {
        resource_type: "raw",
      }
    );
  }

  const result =
    await uploadToCloudinary(
      req.file.buffer,
      "notices"
    );

  pdfUrl = result.secure_url;
  publicId = result.public_id;
}

    // ======================================
    // UPDATE FIELDS
    // ======================================

    notice.title =
      req.body.title || notice.title;

    notice.description =
      req.body.description ||
      notice.description;

    notice.category =
      req.body.category ||
      notice.category;

    notice.audience =
      req.body.audience ||
      notice.audience;

    notice.noticeDate =
      req.body.noticeDate ||
      notice.noticeDate;

    notice.expiryDate =
      req.body.expiryDate ||
      notice.expiryDate;

    notice.featured =
      req.body.featured !== undefined
        ? req.body.featured
        : notice.featured;

   notice.pdfFile = pdfUrl;
notice.publicId = publicId;

const updatedNotice = await notice.save();

    res.json(updatedNotice);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================
// DELETE NOTICE
// ======================================

export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(
      req.params.id
    );

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found",
      });
    }

    if (notice.publicId) {
  await cloudinary.uploader.destroy(
    notice.publicId,
    {
      resource_type: "raw",
    }
  );
}

    await notice.deleteOne();

    res.json({
      message:
        "Notice deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================
// FEATURED NOTICE
// ======================================

export const getFeaturedNotice = async (
  req,
  res
) => {
  try {
    const notice = await Notice.findOne({
      featured: true,
    }).sort({
      createdAt: -1,
    });

    res.json(notice);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================
// STUDENT NOTICES
// ======================================

export const getStudentNotices = async (
  req,
  res
) => {
  try {
    const notices = await Notice.find({
      audience: "student",
    }).sort({
      noticeDate: -1,
    });

    res.json(notices);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================
// FACULTY / TENDER NOTICES
// ======================================

export const getFacultyNotices = async (
  req,
  res
) => {
  try {
    const notices = await Notice.find({
      audience: "faculty",
    }).sort({
      noticeDate: -1,
    });

    res.json(notices);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};