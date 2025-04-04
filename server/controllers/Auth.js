const bcrypt = require("bcrypt");
const User = require("../models/User");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const Admin = require("../models/Admin");
var unirest = require("unirest");
require("dotenv").config();

// Function to generate OTP
exports.sendOTP = async (req, res) => {
  try {
    // console.log("req.body in sendotp:", req.body);
    const { contactNumber } = req.body;

    if (!contactNumber) {
      return res.status(400).json({ error: "Please provide a contact number" });
    }

    // Generate OTP
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Ensure unique OTP
    let result = await OTP.findOne({ otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp });
    }
    console.log("Generated OTP:", otp);

    // Store OTP in DB
    await OTP.create({ contactNumber, otp });

    // Send OTP via SMS

    // var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

    // req.headers({
    //   "authorization": "aeQqRdsAZwgKxFL4Jk5Ivbf9nUHS301GjrVYMtT2iuE7N6h8Do9L4tr0ZagwnGqyhQ3xCd8AJVjWYuTI",
    // });

    // req.form({
    //   "variables_values": otp,
    //   "route": "otp",
    //   "numbers": contactNumber,
    // });

    // req.end(function (response) {
    //   if (response.error) {
    //     console.error(response.error);
    //     return res.status(500).json({ error: "Unable to send OTP via SMS." });
    //   }

    //   console.log(response.body);
      res.status(200).json({
        success: true,
        message: "OTP Sent Successfully",
        otp,
      });
      
    // });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Unable to send OTP." });
  }
};

exports.login = async (req, res) => {
  try {
    const { contactNumber, otp } = req.body;
    console.log("login body", req.body);
    if (!contactNumber || !otp) {
      return res
        .status(400)
        .json({ error: "Contact number and OTP are required." });
    }

    // Validate OTP
    //   const validOTP = await OTP.findOne({ contactNumber, otp });
    const validOTP = await OTP.find({ contactNumber })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!validOTP) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    // Check if user exists
    let user = await User.findOne({ contactNumber })
    console.log("user", user);
    if (!user) {
      user = await User.create({ contactNumber });
    }

    if(validOTP[0].otp !== otp){
      return res.status(400).json({ error: "Invalid OTP." });
    }
    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Update user's token
    user.token = token;
    await user.save();

    const options = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true, // Cookie accessible only by the web server
    };

    res.cookie("token", token, options).status(200).json({
      success: true,
      user,
      message: "User Login Success",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to verify OTP." });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check if admin already exists
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ error: "Admin already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });


    res.status(201).json({
      success: true,
      admin,
      message: "Admin created successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to create Admin." });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: "Invalid email" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Update admin's token
    admin.token = token;
    await admin.save();

    const options = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true, // Cookie accessible only by the web server
    };

    res.cookie("token", token, options).status(200).json({
      success: true,
      admin,
      message: "Admin Login Success",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to login admin." });
  }
};