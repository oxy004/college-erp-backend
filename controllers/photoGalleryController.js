import PhotoGallery from "../models/PhotoGallery.js";
import cloudinary from "../config/cloudinary.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

/* ==========================================
HELPERS
========================================== */

const ensureGallery = async () => {
  let gallery = await PhotoGallery.findOne();

  if (!gallery) {
    gallery = await PhotoGallery.create({
      heroImages: [],
      featuredPhotos: [],
      yearFolders: [],
    });
  }

  return gallery;
};

const deleteCloudinaryImage = async (
  publicId
) => {
  try {
    if (!publicId) return;

    await cloudinary.uploader.destroy(
      publicId
    );
  } catch (error) {
    console.error(
      "Cloudinary Delete Error:",
      error
    );
  }
};

/* ==========================================
GET GALLERY
========================================== */

export const getPhotoGallery =
  async (req, res) => {
    try {
      const gallery =
        await ensureGallery();

      res.status(200).json({
        success: true,
        data: gallery,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch gallery",
      });
    }
  };

/* ==========================================
HERO IMAGES
========================================== */

export const uploadHeroImage =
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Image is required",
          });
      }

      const gallery =
        await ensureGallery();

      const result =
        await uploadToCloudinary(
          req.file.buffer,
          "photo-gallery/hero"
        );

      gallery.heroImages.push({
        image:
          result.secure_url,
        publicId:
          result.public_id,
      });

      await gallery.save();

      res.status(200).json({
        success: true,
        data: gallery,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to upload hero image",
      });
    }
  };

export const deleteHeroImage =
  async (req, res) => {
    try {
      const { index } =
        req.params;

      const gallery =
        await ensureGallery();

      const heroImage =
        gallery.heroImages[
          index
        ];

      if (!heroImage) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Hero image not found",
          });
      }

      await deleteCloudinaryImage(
        heroImage.publicId
      );

      gallery.heroImages.splice(
        index,
        1
      );

      await gallery.save();

      res.status(200).json({
        success: true,
        data: gallery,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to delete hero image",
      });
    }
  };

/* ==========================================
FEATURED PHOTOS
========================================== */

export const addFeaturedPhoto =
  async (req, res) => {
    try {
      const {
        title,
        description,
      } = req.body;

      if (!req.file) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Image is required",
          });
      }

      const gallery =
        await ensureGallery();

      const result =
        await uploadToCloudinary(
          req.file.buffer,
          "photo-gallery/featured"
        );

      gallery.featuredPhotos.push(
        {
          title,
          description,
          image:
            result.secure_url,
          publicId:
            result.public_id,
        }
      );

      await gallery.save();

      res.status(201).json({
        success: true,
        data: gallery,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to add featured photo",
      });
    }
  };
  /* ==========================================
UPDATE FEATURED PHOTO
========================================== */

export const updateFeaturedPhoto =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const {
        title,
        description,
      } = req.body;

      const gallery =
        await ensureGallery();

      const photo =
        gallery.featuredPhotos.id(
          id
        );

      if (!photo) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Featured photo not found",
          });
      }

      photo.title =
        title || photo.title;

      photo.description =
        description ||
        photo.description;

      if (req.file) {
        if (
          photo.publicId
        ) {
          await deleteCloudinaryImage(
            photo.publicId
          );
        }

        const result =
          await uploadToCloudinary(
            req.file.buffer,
            "photo-gallery/featured"
          );

        photo.image =
          result.secure_url;

        photo.publicId =
          result.public_id;
      }

      await gallery.save();

      res.status(200).json({
        success: true,
        data: gallery,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to update featured photo",
      });
    }
  };

/* ==========================================
DELETE FEATURED PHOTO
========================================== */

export const deleteFeaturedPhoto =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const gallery =
        await ensureGallery();

      const photo =
        gallery.featuredPhotos.id(
          id
        );

      if (!photo) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Featured photo not found",
          });
      }

      if (
        photo.publicId
      ) {
        await deleteCloudinaryImage(
          photo.publicId
        );
      }

      photo.deleteOne();

      await gallery.save();

      res.status(200).json({
        success: true,
        data: gallery,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to delete featured photo",
      });
    }
  };

/* ==========================================
YEARS
========================================== */

export const addYearFolder =
  async (req, res) => {
    try {
      const { year } =
        req.body;

      const gallery =
        await ensureGallery();

      const exists =
        gallery.yearFolders.some(
          (folder) =>
            folder.year ===
            year
        );

      if (exists) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Year already exists",
          });
      }

      gallery.yearFolders.push({
        year,
      });

      await gallery.save();

      res.status(201).json({
        success: true,
        data: gallery,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to add year",
      });
    }
  };

export const updateYearFolder =
  async (req, res) => {
    try {
      const { yearId } =
        req.params;

      const { year } =
        req.body;

      const gallery =
        await ensureGallery();

      const folder =
        gallery.yearFolders.id(
          yearId
        );

      if (!folder) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Year folder not found",
          });
      }

      folder.year = year;

      await gallery.save();

      res.status(200).json({
        success: true,
        data: gallery,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to update year",
      });
    }
  };

export const deleteYearFolder =
  async (req, res) => {
    try {
      const { yearId } =
        req.params;

      const gallery =
        await ensureGallery();

      const folder =
        gallery.yearFolders.id(
          yearId
        );

      if (!folder) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Year folder not found",
          });
      }

      // Delete all album covers
      for (const album of folder.albums) {
        if (
          album.publicId
        ) {
          await deleteCloudinaryImage(
            album.publicId
          );
        }

        // Delete all album photos
        for (const photo of album.photos) {
          if (
            photo.publicId
          ) {
            await deleteCloudinaryImage(
              photo.publicId
            );
          }
        }
      }

      folder.deleteOne();

      await gallery.save();

      res.status(200).json({
        success: true,
        data: gallery,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to delete year folder",
      });
    }
  };
  /* ==========================================
ALBUMS
========================================== */

export const addAlbum =
  async (req, res) => {
    try {
      const { yearId } =
        req.params;

      const {
        title,
        eventDate,
      } = req.body;

      const gallery =
        await ensureGallery();

      const yearFolder =
        gallery.yearFolders.id(
          yearId
        );

      if (!yearFolder) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Year folder not found",
          });
      }

      let coverImage = "";
      let publicId = "";

      if (req.file) {
        const result =
          await uploadToCloudinary(
            req.file.buffer,
            "photo-gallery/albums"
          );

        coverImage =
          result.secure_url;

        publicId =
          result.public_id;
      }

      yearFolder.albums.push({
        title,
        eventDate,
        coverImage,
        publicId,
        photos: [],
      });

      await gallery.save();

      res.status(201).json({
        success: true,
        data: gallery,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to add album",
      });
    }
  };

export const updateAlbum =
  async (req, res) => {
    try {
      const { albumId } =
        req.params;

      const {
        title,
        eventDate,
      } = req.body;

      const gallery =
        await ensureGallery();

      let album = null;

      gallery.yearFolders.forEach(
        (year) => {
          const found =
            year.albums.id(
              albumId
            );

          if (found) {
            album = found;
          }
        }
      );

      if (!album) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Album not found",
          });
      }

      album.title =
        title || album.title;

      album.eventDate =
        eventDate ||
        album.eventDate;

      if (req.file) {
        // Delete old cover image
        if (
          album.publicId
        ) {
          await deleteCloudinaryImage(
            album.publicId
          );
        }

        // Upload new cover image
        const result =
          await uploadToCloudinary(
            req.file.buffer,
            "photo-gallery/albums"
          );

        album.coverImage =
          result.secure_url;

        album.publicId =
          result.public_id;
      }

      await gallery.save();

      res.status(200).json({
        success: true,
        data: gallery,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to update album",
      });
    }
  };

export const deleteAlbum =
  async (req, res) => {
    try {
      const { albumId } =
        req.params;

      const gallery =
        await ensureGallery();

      let album = null;
      let parentYear = null;

      gallery.yearFolders.forEach(
        (year) => {
          const found =
            year.albums.id(
              albumId
            );

          if (found) {
            album = found;
            parentYear =
              year;
          }
        }
      );

      if (!album) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Album not found",
          });
      }

      // Delete album cover
      if (
        album.publicId
      ) {
        await deleteCloudinaryImage(
          album.publicId
        );
      }

      // Delete all photos inside album
      for (const photo of album.photos) {
        if (
          photo.publicId
        ) {
          await deleteCloudinaryImage(
            photo.publicId
          );
        }
      }

      album.deleteOne();

      await gallery.save();

      res.status(200).json({
        success: true,
        data: gallery,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to delete album",
      });
    }
  };
  /* ==========================================
PHOTOS
========================================== */

export const addPhotosToAlbum =
  async (req, res) => {
    try {
      const { albumId } =
        req.params;

      if (
        !req.files ||
        req.files.length === 0
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Please upload at least one photo",
          });
      }

      const gallery =
        await ensureGallery();

      let album = null;

      gallery.yearFolders.forEach(
        (year) => {
          const found =
            year.albums.id(
              albumId
            );

          if (found) {
            album = found;
          }
        }
      );

      if (!album) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Album not found",
          });
      }

      for (const file of req.files) {
        const result =
          await uploadToCloudinary(
            file.buffer,
            "photo-gallery/photos"
          );

        album.photos.push({
          image:
            result.secure_url,
          publicId:
            result.public_id,
        });
      }

      await gallery.save();

      res.status(200).json({
        success: true,
        data: gallery,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to upload photos",
      });
    }
  };

export const deletePhotoFromAlbum =
  async (req, res) => {
    try {
      const {
        albumId,
        photoId,
      } = req.params;

      const gallery =
        await ensureGallery();

      let album = null;

      gallery.yearFolders.forEach(
        (year) => {
          const found =
            year.albums.id(
              albumId
            );

          if (found) {
            album = found;
          }
        }
      );

      if (!album) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Album not found",
          });
      }

      const photo =
        album.photos.id(
          photoId
        );

      if (!photo) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Photo not found",
          });
      }

      if (
        photo.publicId
      ) {
        await deleteCloudinaryImage(
          photo.publicId
        );
      }

      photo.deleteOne();

      await gallery.save();

      res.status(200).json({
        success: true,
        data: gallery,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to delete photo",
      });
    }
  };