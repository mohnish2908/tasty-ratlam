const { uploadImageToCloudinary } = require("../utils/imageUploader");
const Product = require("../models/SwiperImage");
const dotenv = require("dotenv");
const SwiperImage = require("../models/SwiperImage");
dotenv.config();

exports.addSwiperImage = async (req, res) => {
    try {
      // Validate images are present
      if (!req.files || !req.files.images) {
        return res.status(400).json({ error: "Image is required" });
      }
  
      // Handle single or multiple images
      const images = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];
  
      // Upload images to Cloudinary
      const uploadPromises = images.map((image) =>
        uploadImageToCloudinary(image, process.env.FOLDER_NAME)
      );
      const uploadedImages = await Promise.all(uploadPromises);
  
      // Save uploaded images to the database
      const imageDocuments = uploadedImages.map((img) => ({
        imageUrl: img.secure_url,
      }));
  
      const savedImages = await SwiperImage.insertMany(imageDocuments);
  
      res.status(201).json({
        message: "Images added successfully",
        data: savedImages,
      });
    } catch (err) {
      console.error("Error adding swiper images:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getAllSwiperImages = async (req, res) => { 
    try {
        // Fetch all swiper images from the database
        const swiperImages = await SwiperImage.find();

        // Respond with the retrieved images
        res.status(200).json({
            message: "Swiper images retrieved successfully",
            data: swiperImages,
        });
    } catch (err) {
        console.error("Error fetching swiper images:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
