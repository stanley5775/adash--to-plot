import { v2 as cloudinary } from "cloudinary";

export const deleteImage = async (publicId: string | null | undefined) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`FAILED TO DELETE CLOUDINARY IMAGE: ${publicId}`, error);
  }
};
