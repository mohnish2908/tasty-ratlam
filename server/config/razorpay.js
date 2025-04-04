const Razorpay = require("razorpay");
const dotenv = require("dotenv");
dotenv.config();

// const RAZORPAY_KEY = ''

// const RAZORPAY_SECRET ='' 

process.env.RAZORPAY_KEY
process.env.RAZORPAY_SECRET

exports.instance = new Razorpay({
	key_id: process.env.RAZORPAY_KEY,
	key_secret: process.env.RAZORPAY_SECRET,
});






// exports.instance = new Razorpay({
// 	key_id: RAZORPAY_KEY,
// 	key_secret: RAZORPAY_SECRET,
// });