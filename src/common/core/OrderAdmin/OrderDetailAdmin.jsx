import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById, updateOrder } from '../../../services/operations/orderAPI';
import toast from 'react-hot-toast';
import { RxCross2 } from "react-icons/rx";
import { useSelector } from 'react-redux';

const OrderDetailAdmin = () => {
  const adminToken = useSelector((state) => state.admin.adminToken);
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shippingCarrier, setShippingCarrier] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderDetails = await getOrderById(id);
        setOrder(orderDetails.order);
        setTrackingNumber(orderDetails.order?.trackingNumber || "");
        setShippingCarrier(orderDetails.order?.shippingCarrier || "");
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast.error("Error fetching order details");
      }
    };
    fetchData();
  }, [id]);

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    toast.loading("Updating order...");
    try {
      const response = await updateOrder(id, trackingNumber, shippingCarrier, adminToken);
      setOrder(prev => ({
        ...prev,
        trackingNumber,
        shippingCarrier,
        status: "Shipped"
      }));
      toast.success("Order updated successfully");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Error updating order");
    } finally {
      toast.dismiss();
    }
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Order #{order._id}</h1>
              <p className="text-gray-500 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN')}
              </p>
            </div>
            <div className="mt-4 md:mt-0 space-y-1 text-right">
              <div className={`badge px-3 py-1 rounded-full text-sm font-medium 
                ${order.status === 'Shipped' ? 'bg-green-100 text-green-800' :
                  order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'}`}>
                {order.status}
              </div>
              <div className="badge px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                {order.paymentStatus}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Customer Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Customer Details Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Details</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-gray-900">{order.firstName} {order.lastName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Contact</dt>
                  <dd className="mt-1 text-gray-900">{order.contactNumber}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-gray-900 break-all">{order.email}</dd>
                </div>
              </dl>
            </div>

            {/* Coupon Section */}
      <div className="bg-white shadow-md p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Coupon Applied</h2>
        <div className="space-y-2">
          {order.coupon && (
            <>
              <p><strong>Coupon Code:</strong> {order.coupon.code}</p>
              <p><strong>Discount:</strong> {order.coupon.discountPercentage}% off</p>
              <p><strong>Condition:</strong> ₹{order.coupon.condition}</p>
              <p><strong>Description:</strong> {order.coupon.description}</p>
            </>
          )}
          {!order.coupon && <p>No coupon applied</p>}
        </div>
      </div>

            {/* Shipping Address Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping Address</h2>
              <div className="space-y-2">
                <p className="text-gray-900">{order.address}</p>
                {order.landmark && <p className="text-gray-600">Landmark: {order.landmark}</p>}
                <p className="text-gray-600">
                  {order.city}, {order.state} - {order.pincode}
                </p>
              </div>
            </div>
          </div>

          

          {/* Middle Column - Order Items */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.products.map((item) => (
                  <div key={item._id} className="flex items-start border-b pb-4 last:border-b-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium text-gray-800">{item.product.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.weightInGrams}g × {item.quantity}
                      </p>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span>Price: ₹{item.price}</span>
                        <RxCross2 className="mx-2" size={12} />
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">₹{order.price}</span>
                </div>
                {order.coupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({order.coupon.code})</span>
                    <span>- ₹{(order.price * order.coupon.discountPercentage)/100}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-800">₹{order.shippingCost}</span>
                </div>
                <div className="flex justify-between pt-3 border-t font-medium">
                  <span className="text-gray-800">Total</span>
                  <span className="text-gray-800">₹{order.totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Shipping Update Card */}
            {order.paymentStatus === "Paid" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Update Shipping</h2>
                <form onSubmit={handleUpdateOrder} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tracking Number
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shipping Carrier
                    </label>
                    <input
                      type="text"
                      value={shippingCarrier}
                      onChange={(e) => setShippingCarrier(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Shipping Details
                  </button>
                </form>
              </div>
            )}

            

            {/* Shipping Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping Details</h2>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Tracking Number:</span>{" "}
                  {order.trackingNumber || "Not available"}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Carrier:</span>{" "}
                  {order.shippingCarrier ? (
                    <a
                      href={order.shippingCarrier.startsWith('http') 
                        ? order.shippingCarrier 
                        : `https://${order.shippingCarrier}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {order.shippingCarrier}
                    </a>
                  ) : "Not available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    
    </div>
  );
}

export default OrderDetailAdmin;