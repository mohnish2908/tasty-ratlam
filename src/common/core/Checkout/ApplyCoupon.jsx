import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { getCoupon } from "../../../services/operations/couponAPI";
// import {toast} from "react-hot-toast";

const ApplyCoupon = ({ onApply, price }) => {
  const [couponCode, setCouponCode] = useState("");

  const handleApplyCoupon = async () => {
    try {

      const response = await getCoupon(couponCode);
      // console.log("response on applly", response);
      if (response.data.data.condition > price) {
        toast.error("Coupon is not applicable for this order"); 
        return;
      }
      onApply(response.data.data);
      toast.success("Coupon applied successfully!");
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error("Invalid coupon code");
      } else {
        console.error(err);
      }
    }
    
  };

  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Apply Coupon</h3>
      <input
        type="text"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-2"
        placeholder="Enter coupon code"
      />
      <button
        type="button" // Explicitly set type to "button"
        onClick={handleApplyCoupon}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Apply
      </button>
    </div>
  );
};

export default ApplyCoupon;