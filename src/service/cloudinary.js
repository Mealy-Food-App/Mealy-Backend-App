// import cloudinary from "cloudinary"
import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const uploadToCloudinary = (path, folder) => {
  return cloudinary.uploader.upload(path, {folder,}).then((data) => {
      return { image: data.url, public_id: data.public_id };
    })
    .catch((error) => {
      console.log(error);
    });
};

export const removeFromCloudinary = async (public_id) => {
  await cloudinary.uploader.destroy(public_id, function (error, result) {
    console.log(result, error);
  });
};

// module.exports = { uploadToCloudinary, removeFromCloudinary }
