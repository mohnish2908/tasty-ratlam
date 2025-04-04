const { uploadImageToCloudinary } = require("../utils/imageUploader");
const Product = require("../models/Product");
const dotenv = require("dotenv");
const Order = require("../models/Order");
const User = require("../models/User"); // Import User model to reference user details
const ComboProduct = require("../models/ComboProduct");
dotenv.config();

exports.addComboProduct = async (req, res) => {
    try {
      // Extract combo product details from request body
      // const { name, description, price, heading, subHeading,products } = req.body;
      
      console.log("req body of the combo product...",req.body);
      console.log("req files of the combo product...",req.files);
      const {name,description,price,heading,weightInGrams}=req.body;
      const products=[];
      const subHeading=[];
      for (let key in req.body) {
        // Handle products
        if (key.startsWith('products[')) {
          const index = key.match(/\d+/)[0]; // Extract index from products[0], products[1], etc.
          products[index] = req.body[key];
        }
        // Handle subHeadings
        if (key.startsWith('subHeadings[')) {
          const index = key.match(/\d+/)[0]; // Extract index from subHeadings[0], subHeadings[1], etc.
          subHeading[index] = req.body[key];
      }
    }

    console.log("subheading and products", subHeading, products);
      // Validate required fields
      if (!name || !description || !price || !products || products.length === 0) {
        return res.status(400).json({ error: "Name, description, price, and products are required" });
      }
  
      // products=Array.isArray(products) ? products : [products];
      
      // subHeading=Array.isArray(subHeading) ? subHeading : [subHeading];
      
  
       // Validate images are present
    const images = req.files.images ? (Array.isArray(req.files.images) ? req.files.images : [req.files.images]) : [];
    if (images.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    // Upload images to Cloudinary
    const imageUploadPromises = images.map(image =>
      uploadImageToCloudinary(image, process.env.FOLDER_NAME)
    );
    const uploadedImages = await Promise.all(imageUploadPromises);
  
      // Create the new Combo Product
      const newComboProduct = new ComboProduct({
        name,
        description,
        price,
        heading,
        subHeading,
        weightInGrams,
        images: uploadedImages.map(image => image.secure_url), // Get the URLs of uploaded images
        products,
      });
  
      // Save the new combo product to the database
      await newComboProduct.save();
  
      // Respond with success
      res.status(201).json({
        success: true,
        comboProduct: newComboProduct,
      });
    } catch (err) {
      console.error("Error adding combo product:", err);
      res.status(500).json({ error: "Unable to add combo product" });
    }
};

exports.getAllComboProducts = async (req, res) => {
    try {
        // Fetch all combo products from the database
        const comboProducts = await ComboProduct.find().populate("ratings");

        // Respond with the retrieved combo products
        res.status(200).json({
            message: "Combo products retrieved successfully",
            data: comboProducts,
        });
    } catch (err) {
        console.error("Error fetching combo products:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.deleteComboProduct = async (req, res) => {
  try{
    const {id}=req.body;
    // Validate the product ID
    if (!id) {
      return res.status(400).json({ error: "Product ID is required" });
    }
    // Find the combo product by ID
    const comboProduct = await ComboProduct.findById(id);
    // Check if the combo product exists
    if (!comboProduct) {
      return res.status(404).json({ error: "Combo Product not found" });
    }
    
    comboProduct.status = comboProduct.status === "available" ? "unavailable" : "available";
    // Save the updated combo product
    await comboProduct.save();

    // Respond with success
    return res.status(200).json({ success: true });
  }
  catch(err){
    console.error("Error deleting combo product:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

exports.getComboProductById = async (req, res) => {
  try{
    const {id}=req.params;

    // Fetch combo product by ID from the database
    const comboProduct = await ComboProduct.findById(id).populate("ratings");
    if (comboProduct === null) {
      return res.status(404).json({ error: "Combo Product not found" });
    }
    // Respond with the retrieved combo product
    return res.status(200).json({
      message: "Combo Product retrieved successfully",
      data: comboProduct,
    });
  }
  catch(err){
    console.error("Error fetching combo product:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  } 
} 