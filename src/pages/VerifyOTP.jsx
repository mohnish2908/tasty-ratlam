//this component is used to verify the OTP sent to the user which is not in use

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, sendOTP } from "../services/operations/authAPI";
import { setToken } from "../slices/userSlice";
import logo from "../assets/Logo_no_bg.png";
import { toast } from "react-hot-toast";
const VerifyOTP = () => {
  const { redirectPath } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(120); // 2 minutes timer
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const contactNumber = useSelector((state) => state.auth.contactNumber);

  useEffect(() => {
    if (user?.token) {
      navigate("/"); // Redirect to home if already logged in
    }
  }, [user, navigate]);

  useEffect(() => {
    let interval;
    if (isResendDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setOtp(value);
    }
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();
    try {
      // Assume you have a method to resend OTP
      // This might be a custom backend call or Firebase method
      await window.confirmationResult.reSend();
      toast.success("OTP resent successfully!");
      setIsResendDisabled(true);
      setTimer(120);
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("OTP must be 6 digits.");
      return;
    }

    try {
      // Use Firebase's OTP confirmation
      const result = await window.confirmationResult.confirm(otp);
      
      // If Firebase OTP verification is successful
      const firebaseUser = result.user;
      const firebaseToken = await firebaseUser.getIdToken();

      // Dispatch your login action with Firebase token
      const response = await dispatch(login({ 
        otp, 
        contactNumber, 
        firebaseToken 
      }));

      if (response.payload.success) {
        dispatch(setToken(response.payload.token));
        const pendingBuyNow = JSON.parse(localStorage.getItem("pendingBuyNow"));
        
        if (pendingBuyNow) {
          localStorage.removeItem("pendingBuyNow");
          navigate(`/${pendingBuyNow.productType}/${pendingBuyNow.productId}`);
        } else {
          navigate(redirectPath || "/", { replace: true });
        }
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      
      if (error.code === 'auth/invalid-verification-code') {
        setError("Invalid OTP. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <img src={logo} alt="Logo" className="h-16 w-auto mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Verify OTP
        </h2>
        <label className="block mb-5">
          <span className="text-gray-700 font-medium">OTP:</span>
          <input
            type="text"
            value={otp}
            onChange={handleInputChange}
            placeholder="Enter the OTP"
            className={`mt-2 block w-full px-4 py-2 border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-800`}
          />
        </label>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 px-4 rounded-lg shadow hover:bg-indigo-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
        >
          Verify OTP
        </button>
        <button
          onClick={handleResendOTP}
          disabled={isResendDisabled}
          className={`w-full mt-4 py-3 px-4 rounded-lg shadow transition duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
            isResendDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-500 text-white hover:bg-gray-600"
          }`}
        >
          {isResendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
        </button>
      </form>
    </div>
  );
};

export default VerifyOTP;
