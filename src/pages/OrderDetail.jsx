import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../services/operations/orderAPI";
import { toast } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderDetails = await getOrderById(id);
        setOrder(orderDetails.order);
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast.error("Error fetching order details");
      }
    };
    fetchData();
  }, [id]);

  console.log("order", order);

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        Loading...
      </div>
    );
  }

  
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Order Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>
        <p className="text-gray-600 mt-2">
          Order ID: {order._id} | Placed on{" "}
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
        <div className="mt-4 p-4 bg-green-100 rounded-lg">
          <span className="font-semibold text-green-700">
            Payment Status: {order.paymentStatus}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Customer Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            <div className="space-y-2 text-gray-600">
              <p>
                Name: {order.firstName} {order.lastName}
              </p>
              <p>Email: {order.email}</p>
              <p>Contact: {order.contactNumber}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="space-y-2 text-gray-600">
              <p>{order.address}</p>
              {order.landmark && <p>Landmark: {order.landmark}</p>}
              <p>
                {order.city}, {order.state} - {order.pincode}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
            <div className="space-y-2 text-gray-600">
              <p>Tracking Number: {order.trackingNumber}</p>
              <p>
                Carrier:{" "}
                <a
                  href={
                    order.shippingCarrier.startsWith("http")
                      ? order.shippingCarrier
                      : `https://${order.shippingCarrier}`
                  }
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {order.shippingCarrier}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          {/* Products List */}
          <div className="space-y-4 mb-6">
            {order.products.map((item) => (
              <div key={item._id} className="flex border-b pb-4">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded mr-4"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">
                    {item.weightInGrams}g × {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{order.price}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>₹{order.shippingCost}</span>
            </div>
            {order.coupon && (
              <div className="flex justify-between text-green-600">
                <span>Coupon ({order.coupon.code}):</span>
                <span>- ₹{(order.price * order.coupon.discountPercentage)/100}</span>
              </div>
            )}
            <div className="flex justify-between font-bold border-t pt-3">
              <span>Total:</span>
              <span>₹{order.totalPrice}</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-sm text-gray-500">
            <p>Total Weight: {order.totalWeight}g</p>
            {order.coupon && (
              <p className="mt-2">
                Applied Coupon: {order.coupon.code} (
                {order.coupon.discountPercentage}% off)
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
