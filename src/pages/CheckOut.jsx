import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ShippingDetails from "../common/core/Checkout/ShippingDetail";
import OrderSummary from "../common/core/Checkout/OrderSummary";
import ApplyCoupon from "../common/core/Checkout/ApplyCoupon";
import { buyProduct } from "../services/operations/paymentAPI";
import { toast } from "react-hot-toast";
import { IoClose } from "react-icons/io5";
const CheckOut = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const user=useSelector((state)=>state.auth.user._id);
  // console.log("user",user);
  const location = useLocation();
  let products = location.state?.products || [];
  // console.log(products)
  // if(products!=null){
  //   products=[products];
  // }
  const c = useSelector((state) => state.cart);
  const product = products.length > 0 ? products : c.cart;
  console.log("checkout product", product);
  if (product.length === 0) {
    toast.error("Add products to cart before checkout");
    // If no products in cart, redirect to home page
    navigate("/");
  }

  const [coupon, setCoupon] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
    address: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
    product,
    coupon,
    totalPrice: 0,
    price: 0,
    shippingCost: 0,
    totalWeight: 0,
  });

  // Error State for Shipping Details
  const [shippingError, setShippingError] = useState("");

  // Helper Functions
  const calculatePrice = (products) =>
    products.reduce((total, p) => total + p.quantity * p.price, 0);

  const calculateFinalPrice = (price, coupon) =>
    price - price * ((coupon?.discountPercentage || 0) / 100);

  const calculateTotalWeight = (products) =>
    products.reduce((total, p) => total + p.quantity * p.weightInGrams, 0);

  const calculateShippingCost = (totalWeight) => {
    if (totalWeight < 350) return 79;
    if (totalWeight <= 700) return 99;
    if (totalWeight <= 1500) return 129;
    if (totalWeight <= 2000) return 149;
    return 0;
  };

  // Calculations
  const price = calculatePrice(product);
  const totalWeight = calculateTotalWeight(product);
  const shippingCost = calculateShippingCost(totalWeight);

  const [finalPrice, setFinalPrice] = useState(price);
  const [totalPrice, setTotalPrice] = useState(price + shippingCost);

  // Update Final Price When Coupon Changes
  useEffect(() => {
    const discountedPrice = calculateFinalPrice(price, coupon);
    setFinalPrice(discountedPrice);
  }, [price, coupon]);

  // Update Total Price When Final Price or Shipping Cost Changes
  useEffect(() => {
    setTotalPrice(finalPrice + shippingCost);
  }, [finalPrice, shippingCost]);

  // Update Form Data When Product, Coupon, or Total Price Changes
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      product,
      coupon,
      totalPrice,
      price,
      shippingCost,
      totalWeight,
    }));
  }, [product, coupon, totalPrice, price, shippingCost, totalWeight]);

  // Handle Shipping Details Change
  const handleShippingChange = (updatedShippingData) => {
    const requiredFields = [
      "firstName",
      "lastName",
      "contactNumber",
      "address",
      "pincode",
    ];
    const isValid = requiredFields.every((field) => updatedShippingData[field]);

    if (!isValid) {
      setShippingError("Please fill all required shipping details");
    } else {
      setShippingError("");
    }

    setFormData({
      ...formData,
      ...updatedShippingData,
    });
  };

  // Handle Coupon Application
  const handleApplyCoupon = (data) => {
    // console.log("coupon data",data)
    setCoupon(data);
  };

  // Handle Coupon Removal
  const handleRemoveCoupon = () => {
    setCoupon(null);
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate Shipping Details Before Submission
    const requiredFields = [
      "firstName",
      "lastName",
      "contactNumber",
      "email",
      "address",
      "pincode",
    ];
    const isValid = requiredFields.every((field) => formData[field]);

    if (!isValid) {
      setShippingError("Please fill all required shipping details");
      toast.error("Please fill all required shipping details");
      return;
    }

    // Validate contact number (10 digits)
    if (!/^\d{10}$/.test(formData.contactNumber)) {
      setShippingError("Contact number must be exactly 10 digits.");
      toast.error("Contact number must be exactly 10 digits.");
      return;
    }

    console.log("Form Data: ", formData);
    buyProduct(formData, navigate, dispatch);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Checkout Page
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-8"
      >
        {/* Main Layout */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Section: Shipping Details */}
          <div className="w-full md:w-2/3">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Shipping Details
            </h3>
            <ShippingDetails onShippingChange={handleShippingChange} />
            {/* Display Shipping Error */}
            {shippingError && (
              <p className="text-red-500 text-sm mt-2">{shippingError}</p>
            )}
          </div>

          {/* Right Section: Order Summary */}
          <div className="w-full md:w-1/3">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Order Summary
            </h3>
            <OrderSummary product={product} />

            {/* Coupon Display */}
            {coupon && (
              <div className="border border-green-500 bg-green-100 text-green-800 rounded-lg p-4 shadow-md flex items-center justify-between mb-4">
                <div className="font-semibold">
                  Coupon Applied:{" "}
                  <span className="font-normal">{coupon.code}</span>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-red-600 hover:text-red-800 transition duration-300"
                >
                  <IoClose size={20} />
                </button>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="p-4 bg-gray-100 rounded-lg shadow-md">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>Final Price:</span>
                <span>₹{finalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>Shipping Cost:</span>
                <span>₹{shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total Price:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Apply Coupon */}
            <ApplyCoupon onApply={handleApplyCoupon} price={price} />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckOut;
