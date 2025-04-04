const { uploadImageToCloudinary } = require("../utils/imageUploader");
const Product = require("../models/Product");
const dotenv = require("dotenv");
dotenv.config();


exports.addProduct = async (req, res) => {
  try {
    // Extracting basic product details
    const { name, description, heading } = req.body;
    const pricePerWeight = [];
    const subHeading = [];

    // Parse arrays from req.body
    for (let key in req.body) {
      // Handle subHeadings
      if (key.startsWith('subHeadings[')) {
        const index = key.match(/\d+/)[0]; // Extract index from subHeadings[0], subHeadings[1], etc.
        subHeading[index] = req.body[key];
      }

      // Handle pricePerWeight
      if (key.startsWith('pricePerWeight[')) {
        const match = key.match(/\d+/);
        if (match) {
          const index = match[0];
          const subKey = key.split('[')[2].split(']')[0]; // 'weightInGrams' or 'price'
      
          if (!pricePerWeight[index]) pricePerWeight[index] = {}; // Initialize empty object for the index
          pricePerWeight[index][subKey] = req.body[key]; // Populate pricePerWeight array
        }
      }
    }
    console.log("name, description, heading", name, description, heading);
    console.log("subheading and price", subHeading, pricePerWeight);
    console.log("add product backend file/.....", req.files);

    // Validate required fields
    if (!name || !description || pricePerWeight.length === 0) {
      return res.status(400).json({ error: "Name, description, and price details are required" });
    }

    // Validate subHeadings (optional but should be an array of strings)
    if (subHeading.length === 0) {
      return res.status(400).json({ error: "SubHeadings are required" });
    }

    // Handle images if they are uploaded
    const images = req.files?.images ? (Array.isArray(req.files.images) ? req.files.images : [req.files.images]) : [];
    if (images.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    // Upload images to Cloudinary or your preferred file storage (use a loop to handle multiple images)
    const imageUploadPromises = images.map(image =>
      uploadImageToCloudinary(image, process.env.FOLDER_NAME) // Assuming you have this function for uploading
    );

    const uploadedImages = await Promise.all(imageUploadPromises);

    // Handle optional ratings
    const ratings = req.body.ratings ? req.body.ratings.split(',') : [];

    // Create the new product
    const newProduct = new Product({
      name,
      description,
      heading,
      subHeading, // Ensure subHeadings is properly passed as an array
      pricePerWeight, // Ensure pricePerWeight is properly passed as an array of objects
      images: uploadedImages.map(image => image.secure_url), // Assuming image contains a URL in the response
      ratings,
    });

    // Save the new product to the database
    await newProduct.save();

    // Respond with success
    res.status(201).json({
      success: true,
      product: newProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to add product" });
  }
};


exports.getAllProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find().populate("ratings");

    // Respond with the retrieved products
    res.status(200).json({
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try{
    const {id}=req.body;
    if(!id){
      return res.status(400).json({ error: "Product ID is required" });
    }
    const product =await Product.findById(id);
    if(!product){
      return res.status(404).json({ error: "Product not found" });
    }
    product.status = product.status === "available" ? "unavailable" : "available";
    await product.save();
    res.status(200).json({ message: "Product deleted successfully" });
  }
  catch(err){
    console.error(err);
    res.status(500).json({ error: "Unable to delete product" });
  }
}

exports.getProductById = async (req, res) => {
  try {
    // console.log("req.body",req.body);
    // console.log("req.params",req.params);
    // console.log("a")
    const {id}  = req.params;

    // Fetch product by ID from the database
    const product = await Product.findById(id).populate("ratings");
    if(product === null){
      return res.status(404).json({ error: "Product not found" });
    }
    // Respond with the retrieved product
    res.status(200).json({
      message: "Product retrieved successfully",
      data: product,
    });
  }
  catch (err) {
    console.error("Error fetching product:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}