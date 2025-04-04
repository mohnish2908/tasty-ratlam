const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
  sendOTP,
  login,
  adminLogin,
  createAdmin,
} = require("../controllers/Auth")

const{
  createCoupon,
  deactivateCoupon
}=require("../controllers/Coupon")

// const { auth } = require("../middlewares/auth")

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/sendOTP", sendOTP)

// Route for user signup
router.post("/login", login)

router.post("/createAdmin", createAdmin)
router.post("/adminlogin", adminLogin)



//****************** coupon *************************/
//************************************************* */

router.post("/createCoupon", createCoupon)
router.post("/deactivateCoupon", deactivateCoupon)

//************************************************* */




// Route for sending OTP to the user's email
// router.post("/sendOTP", sendOTP)

// Route for Changing the password
// router.post("/changepassword", auth, changePassword)

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
// router.post("/resetPasswordToken", resetPasswordToken)

// Route for resetting user's password after verification
// router.post("/resetPassword", resetPassword)

// Export the router for use in the main application
module.exports = router
