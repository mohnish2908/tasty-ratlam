import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrderByContactNumber } from "../services/operations/orderAPI";
import NavBar from "../common/NavBar";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [contactNumber, setContactNumber] = useState("");
  const [error, setError] = useState(""); // For validation errors
  const navigate = useNavigate();

  const handleGetOrder = async () => {
    if (contactNumber.length !== 10) {
      setError("Please enter a valid 10-digit contact number.");
      return;
    }
    setError(""); // Clear error if valid

    try {
      const response = await getOrderByContactNumber(contactNumber);
      console.log("response in order", response);
      setOrders(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOrderClick = (e, order) => {
    e.stopPropagation();
    navigate(`/order/${order._id}`);
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Your Orders
          </h2>

          {/* Contact Number Input */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              value={contactNumber}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,10}$/.test(value)) {
                  setContactNumber(value);
                }
              }}
              placeholder="Enter your 10-digit contact number"
              className="w-full md:w-3/4 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
            />
            <button
              onClick={handleGetOrder}
              disabled={contactNumber.length !== 10}
              className={`w-full md:w-1/4 px-4 py-2 rounded-lg shadow-md transition duration-200 ${
                contactNumber.length === 10
                  ? "bg-black text-white hover:bg-red-600"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            >
              Get Orders
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Orders Table */}
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-100 text-gray-800 text-md">
                    <th className="py-3 px-4 border-b">Order</th>
                    <th className="py-3 px-4 border-b">Date</th>
                    <th className="py-3 px-4 border-b">Total Price</th>
                    <th className="py-3 px-4 border-b">Status</th>
                    <th className="py-3 px-4 border-b">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-200 cursor-pointer transition"
                      onClick={(e) => handleOrderClick(e, order)}
                    >
                      <td className="py-3 px-4 border-b text-center">
                        <img
                          src={order.products[0]?.product?.images[0]}
                          className="w-16 h-16 object-cover rounded-md mx-auto"
                          alt="Product"
                        />
                      </td>
                      <td className="py-3 px-4 border-b text-center">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 border-b text-center text-green-600 font-semibold">
                        Rs.{order.totalPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 border-b text-center capitalize font-medium">
                        {order.status}
                      </td>
                      <td className="py-3 px-4 border-b text-center">
                        <span
                          className={`px-3 py-1 rounded-lg text-sm ${
                            order.paymentStatus === "Paid"
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-4">No orders found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Order;
