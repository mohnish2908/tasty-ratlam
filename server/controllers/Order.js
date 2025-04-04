// const { default: products } = require("razorpay/dist/types/products")
const Order = require("../models/Order");

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.find({})
    .populate({
        path: "products.product", // Let Mongoose use refPath to determine the model
      })
    .populate("coupon")
      .sort({ createdAt: -1 });
    return res.status(200).json({ order });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    // console.log("get order by id ID",req.body)
    const { orderId } = req.body;
    const order = await Order.findById(orderId)
    .populate({
        path: "products.product", // Let Mongoose use refPath to determine the model
      })
      .populate("coupon");
    return res.status(200).json({ order });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.getOrderByUserId = async (req, res) => {
  try {
    const { userId } = req.body;
    // console.log("userId",userId)
    const order = await Order.find({ user: userId })
    .populate({
        path: "products.product", // Let Mongoose use refPath to determine the model
      })
      .populate("coupon")
      .sort({ createdAt: -1 });

    // console.log("order",order)
    return res.status(200).json({ order });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { orderId, trackingNumber, shippingCarrier } = req.body;
    // console.log(orderId,trackingNumber,shippingCarrier)
    if (!trackingNumber || !shippingCarrier)
      return res.status(400).json({ msg: "Please fill all the fields" });
    const order = await Order.findById(orderId);
    // console.log(order)
    if (!order) return res.status(400).json({ msg: "Order not found" });
    order.trackingNumber = trackingNumber;
    order.shippingCarrier = shippingCarrier;
    order.status = "Shipped";
    await order.save();
    return res.status(200).json({ msg: "Order updated successfully" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.getOrderByContactNumber = async (req, res) => {
  try{
    const {contactNumber} = req.body ;
    if(!contactNumber) return res.status(400).json({ msg: "Please fill all the fields" });
    const order = await Order.find({contactNumber: contactNumber}).populate({
      path: "products.product", // Let Mongoose use refPath to determine the model
    })
    .populate("coupon")
    .sort({ createdAt: -1 });
    if(!order) return res.status(400).json({ msg: "Order not found" });
    return res.status(200).json({ order });
  }
  catch(error){
    return res.status(500).json({ error: "unable to fetch order" });
  }
}