import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadToCloudinary = (
  fileBuffer,
  folder,
  resourceType = "auto"
) => {
  return new Promise(
    (resolve, reject) => {
      const stream =
        cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type:
              resourceType,
          },
          (error, result) => {
            if (error)
              reject(error);
            else
              resolve(result);
          }
        );

      streamifier
        .createReadStream(fileBuffer)
        .pipe(stream);
    }
  );
};

export const deleteFromCloudinary =
  async (publicId) => {
    if (!publicId) return;

    return await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type:
          "raw",
      }
    );
  };

  

export default uploadToCloudinary;

