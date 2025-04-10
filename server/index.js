const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const fileUpload = require("express-fileupload");
const { cloudinaryConnect } = require("./config/cloudinary");
const database = require("./config/database");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

// const cors = require("cors");
// app.use(cors());

// Connect to the Database
database.connect();

// Middleware
app.use(express.json());
app.use(cookieParser());
// app.use(cors({ origin: "*", credentials: true }));
app.use(cors({
   origin: [
     "http://localhost:3000", // Local frontend (adjust if needed)
     "http://yourfrontenddomain.com", // Replace with your actual frontend domain
     "http://51.20.254.92" // Server IP if frontend is accessing backend via this
   ],
   credentials: true,
 }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
const authRoutes = require("./routes/User");
const productRoutes = require("./routes/Product");
const paymentRoutes = require("./routes/Payment");
const couponRouter=require("./routes/Coupon");
const orderRouter=require("./routes/Order");

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/coupon',couponRouter);
app.use('/api/v1/order',orderRouter);






// Cloudinary Configuration
cloudinaryConnect();

// Start the Server
app.listen(PORT,'0.0.0.0', () => {
   console.log(`Server is running on port ${PORT}`);
});


