import React from "react";

const OrderSummary = ({ product }) => {
  const calculateSubtotal = (products) =>
    products.reduce((total, p) => total + p.quantity * p.price, 0);

  const subtotal = calculateSubtotal(product);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      {/* Product List */}
      {product.map((p, index) => (
        <div
          key={`${p._id}-${index}`}
          className="flex items-center justify-between mb-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
        >
          {/* Left Section: Image and Details */}
          <div className="flex items-center space-x-4">
            {/* Product Image */}
            <img
              src={p.images[0]}
              alt={p.name}
              className="w-16 h-16 object-cover rounded"
            />
            {/* Product Details */}
            <div>
              <div className="font-semibold text-lg">{p.name}</div>
              <div className="text-sm text-gray-500">Qty: {p.quantity}</div>
            </div>
          </div>

          {/* Right Section: Price */}
          <div className="text-gray-700 font-medium text-lg">
            ₹{p.price * p.quantity}
          </div>
        </div>
      ))}

      {/* Subtotal */}
      {/* <div className="flex justify-between text-lg font-semibold mt-4">
        <span>Subtotal:</span>
        <span>₹{subtotal}</span>
      </div> */}
    </div>
  );
};

export default OrderSummary;