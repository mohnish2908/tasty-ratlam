const { instance } = require("../config/razorpay");
const Order = require("../models/Order");
const crypto = require("crypto");
const User = require("../models/User");
const Product = require("../models/Product");
const ComboProduct = require("../models/ComboProduct");
const request = require('request');
const mongoose = require('mongoose');
const mailSender=require('../utils/mailSender');
const {
  paymentSuccessEmail,
}=require('../mail/templates/paymentSucessEmail')
const{
  orderPlacedEmail,
}=require('../mail/templates/orderPlacedEmail')
const{
  contactUsEmail,
}=require('../mail/templates/contactFormRes')


exports.getShippingPrice = async (req, res) => {
  try {
    const { sourcePin, destinationPin } = req.body;
    console.log('Request body:', req.body);

    // Validate input
    if (!sourcePin || !destinationPin) {
      return res
        .status(400)
        .json({ error: "Both 'sourcePin' and 'destinationPin' are required" });
    }

    // Define API details
    const apiKey = '948e9cf0-dccc-11ef-bf14-e91bb9d0aabb';
    const url = 'https://app.zipcodebase.com/api/v1/distance';
    const options = {
      url,
      qs: {
        apikey: apiKey,
        code: sourcePin,
        compare: destinationPin,
        country: 'IN',
      },
      json: true, // Automatically parses the JSON response
    };

    // Call the API
    request.get(options, (error, response, body) => {
      if (error) {
        console.error('Error calling distance API:', error);
        return res
          .status(500)
          .json({ error: 'Failed to fetch distance, please try again later' });
      }

      if (response.statusCode !== 200) {
        console.error('API response error:', response.statusCode, body);
        return res
          .status(response.statusCode)
          .json({ error: body?.message || 'Error fetching distance' });
      }

      // Extract distance from API response
      const distance = body?.results?.[destinationPin];
      if (!distance) {
        console.error('Distance not found in API response:', body);
        return res
          .status(400)
          .json({ error: 'Enter valid Pin Code' });
      }

      console.log('Distance retrieved:', distance);
      return res.status(200).json({ distance });
    });
  } catch (error) {
    console.error('Error in getShippingPrice:', error);
    return res
      .status(500)
      .json({ error: 'An unexpected error occurred, please try again later' });
  }
};

const OrderGenerator = async (formData) => {
  try {
    const {
      firstName,
      lastName,
      contactNumber,
      email,
      address,
      landmark,
      pincode,
      city,
      state,
      product,
      coupon,
      totalPrice,
      price,
      shippingCost,
      totalWeight,
    } = formData;

    // Map products to the format expected by the Order schema
    const formattedProducts = product.map((p) => ({
      product: p._id, // Product ID
      weightInGrams: p.weightInGrams,
      quantity: p.quantity,
      price: p.price,
      productModel: p.pricePerWeight ? "Product" : "ComboProduct",
    }));

    const couponId = coupon?._id || null;

    const newOrder = new Order({
      products: formattedProducts,
      coupon: couponId,
      totalPrice,
      price,
      shippingCost,
      totalWeight,
      firstName,
      lastName,
      address,
      landmark,
      pincode,
      city,
      state,
      contactNumber,
      email,
    });

    const savedOrder = await newOrder.save();
    return savedOrder; // Return the saved order

  } catch (error) {
    console.log("Error in OrderGenerator:", error);
    throw error; // Throw the error to be handled by the caller
  }
};

// Capture payment controller
exports.capturePayment = async (req, res) => {
  // Implementation here
  console.log("form data:",req.body)
  const formData=req.body;
  console.log("f:",formData);
  if(formData.price==0) {
    return res.status(200).json({success:false,message:"Add product to the cart"})
  }
  const total_amount=formData.totalPrice;
  const option={
    amount:total_amount*100,
    currency:'INR',
    receipt:Math.random(Date.now()).toString(),
  };
  try {
    const order=await OrderGenerator(formData);
    // const user=await User.findByIdAndUpdate(
    //   formData.user,
    //   {
    //     $push:{
    //       orders:order._id,
    //     },
    //   },
    //   {new:true}  
    // )
    // Initiate the payment using Razorpay
    const paymentResponse = await instance.orders.create(option);
    // console.log("user",user)
    console.log("saved order",order)
    console.log("payment response:", paymentResponse);
    return res.json({
      success: true,
      data: paymentResponse,
      orderId:order._id,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Could not initiate order." });
  }
};

// Verify payment controller
exports.verifyPayment = async (req, res) => {
  const orderId=req.body?.orderID;
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  // const courses = req.body?.courses;

  // const userId = req.user.id;
  console.log("verifyPayment body", req.body);
  // console.log("verifyPayment user", req.user);

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature 
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;
  console.log("v1");
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");
  console.log("v2");

  if (expectedSignature === razorpay_signature) {
    console.log("v3");
    const order=await Order.findById(orderId)
    order.paymentStatus="Paid";
    order.status="Processing";
    await order.save();
    console.log("v4");
    return res.status(200).json({ success: true, message: "Payment Verified" });
  }

  return res.status(200).json({ success: false, message: "Payment Failed" });
};


// Send payment success email controller
exports.sendPaymentSuccessEmail = async (req, res) => {
  console.log("sendPaymentSuccessEmail", req.body);

  const orderId = req.body?.orderId;
  const paymentId = req.body?.paymentId;
  const amount = req.body?.amount;
  console.log("1");
  // const userId = req.body.user;
  const email=req.body.formData.email
  const firstName=req.body.formData.firstName;
  const lastName=req.body.formData.lastName;
  // console.log("userId", req.user.id);
  // console.log("re ",req.body);
  if (!orderId || !paymentId || !amount ) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" });
  }
  console.log("2");
  try {
    // const enrolledStudent = await User.findById(userId);
    console.log("3");
    // console.log("enrolledStudent", enrolledStudent);
    await mailSender(
      email,
      `Payment Received`,
      paymentSuccessEmail(
        `${firstName} ${lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
    await mailSender(
      'tastyratlam@gmail.com',
      `Order Placed`,
      orderPlacedEmail(
        orderId,
        firstName,
        lastName,
        email,
        req.body.formData.contactNumber,
        req.body.formData.address,
        req.body.formData.landmark,
        req.body.formData.pincode,
        req.body.formData.city,
        req.body.formData.state,
        req.body.formData.products
      )
    )
    
    console.log("4");
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.log("error in sending mail", error);
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" });
  }
};

// Place order controller
exports.placeOrder = async (req, res) => {
  try {
    // const userId = req.user.id; // Assuming the user ID is available from the middleware
    const { products, shippingAddress } = req.body; // Extract products and shipping address from the request

    console.log("body", req.body);

    // Validate required fields
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Products are required" });
    }
    if (!shippingAddress) {
      return res.status(400).json({ error: "Shipping address is required" });
    }

    // Prepare an array to hold order product details
    const orderProducts = [];
    let totalAmount = 0;

    // Iterate over the products in the order
    for (let i = 0; i < products.length; i++) {
      const { productId, weightInGrams, quantity } = products[i];

      // Check if it's a combo product
      const comboProduct = await ComboProduct.findById(productId);
      if (comboProduct) {
        let comboTotal = 0;
        let comboProductDetails = [];

        // Iterate over each product in the combo
        for (let j = 0; j < comboProduct.products.length; j++) {
          const comboItem = comboProduct.products[j];
          const product = await Product.findById(comboItem.productId);
          if (!product) {
            return res.status(400).json({ error: `Product with ID ${comboItem.productId} not found` });
          }

          const productWeight = product.pricePerWeight.find(p => p.weightInGrams === comboItem.weightInGrams);
          if (!productWeight) {
            return res.status(400).json({ error: `Price for the weight ${comboItem.weightInGrams} grams not found` });
          }

          const itemTotal = productWeight.price * quantity;
          comboTotal += itemTotal;

          comboProductDetails.push({
            productId: product._id,
            name: product.name,
            weightInGrams: comboItem.weightInGrams,
            price: itemTotal,
          });
        }

        // Add combo product to order
        orderProducts.push({
          productId: comboProduct._id,
          name: comboProduct.name,
          price: comboTotal,
          quantity,
          productsInCombo: comboProductDetails,
        });
        totalAmount += comboTotal;
      } else {
        // Handle normal product
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(400).json({ error: `Product with ID ${productId} not found` });
        }

        const productWeight = product.pricePerWeight.find(p => p.weightInGrams === weightInGrams);
        if (!productWeight) {
          return res.status(400).json({ error: `Price for the weight ${weightInGrams} grams not found` });
        }

        const totalProductPrice = productWeight.price * quantity;

        orderProducts.push({
          productId: product._id,
          name: product.name,
          price: totalProductPrice,
          quantity,
          weightInGrams,
        });
        totalAmount += totalProductPrice;
      }
    }

    // Create the order
    const newOrder = new Order({
      // user: userId,
      products: orderProducts,
      totalAmount,
      shippingAddress,
    });

    // Save the order to the database
    await newOrder.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Error placing order, please try again later" });
  }
};

exports.bulkOrder = async (req, res) => {
  try{  
    const {email,firstName,lastName,contactNumber,message}=req.body;
    console.log(email,email, firstName, lastName, message, contactNumber);
    await mailSender(
      email,
      `Thanks For Contacting Us`,
      contactUsEmail(
        email,
        firstName,
        lastName,
        message,
        contactNumber
      )
    )
    await mailSender(
      'tastyratlam@gmail.com',
      `Bulk Order`,
      contactUsEmail(
        email,
        firstName,
        lastName,
        message,
        contactNumber
      )
    )
      

    res.status(200).json({success:true,message:"Email sent successfully"})
  }catch(error){
    console.log("Error in bulkOrder:",error);
    res.status(500).json({error:"Error in bulkOrder"});
  }
}
