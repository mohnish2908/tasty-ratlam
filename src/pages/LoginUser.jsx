// this page is not in use

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setContactNumber } from "../slices/userSlice";
import logo from "../assets/Logo_no_bg.png";
import  {auth}  from "../firebase.config.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast } from "react-hot-toast";

const LoginUser = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTrackingPreventionWarning, setShowTrackingPreventionWarning] = useState(false);
  const [verificationId,setVerificationId]=useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const user = useSelector((state) => state.auth);

  

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setMobileNumber(value);
    }
  };

  const handleTrackingPreventionDismiss = () => {
    setShowTrackingPreventionWarning(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mobileNumber.length !== 10) {
      setError("Mobile number must be 10 digits.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Validate and dispatch contact number
      dispatch(setContactNumber(mobileNumber));

      // Prepare phone number
      const formattedPhone = `+91${mobileNumber}`;

      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          console.log("reCAPTCHA solved!");
        }
      });
      const appVerifier = window.recaptchaVerifier;
      const data=signInWithPhoneNumber(auth,formattedPhone, appVerifier);
      window.confirmationResult=data;
      setVerificationId(data.verificationId);
      console.log("vvv",data)
      toast.success("OTP sent successfully!");
      navigate("/verify-otp");
    } catch (error) {
      console.error("OTP Send Error:", error);
      
      // Detailed error handling
      const errorMessage = error.message || "Failed to send OTP";
      
      if (errorMessage.includes("connection")) {
        toast.error("Network issue. Check your internet connection.");
      } else if (errorMessage.includes("storage")) {
        toast.error("Browser storage access blocked. Adjust browser settings.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      {/* Tracking Prevention Warning Modal */}
      {/* {showTrackingPreventionWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-600">Browser Tracking Prevention Detected</h2>
            <p className="mb-4">
              Your browser's tracking prevention might interfere with authentication. 
              Please adjust your browser settings or add this site to exceptions.
            </p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={handleTrackingPreventionDismiss}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )} */}

      <div id="recaptcha-container" className="mb-4"></div>
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-16 w-auto" />
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Login to Your Account
        </h2>
        <p className="text-gray-500 text-center text-sm mb-6">
          Enter your mobile number to receive an OTP
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Mobile Number:</label>
            <input
              type="text"
              value={mobileNumber}
              onChange={handleInputChange}
              placeholder="Enter your mobile number"
              className={`mt-2 w-full px-4 py-2 border ${error ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 mt-2 text-white font-semibold rounded-lg shadow-md transition duration-200 ${
              isLoading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-black to-indigo-500 hover:from-indigo-600 hover:to-black"
            }`}
          >
            {isLoading ? "Sending..." : "Get OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginUser;