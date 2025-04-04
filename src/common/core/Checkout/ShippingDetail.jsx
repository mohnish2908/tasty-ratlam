import React, { useState } from "react";

const statesAndUTs = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
  "Delhi",
  "Puducherry",
  "Ladakh",
  "Jammu and Kashmir",
];

const ShippingDetails = ({ onShippingChange }) => {
  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
    address: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

    const updatedData = { ...shippingData, [name]: value };
    setShippingData(updatedData);

    onShippingChange(updatedData);
  };

  // **Validation Function**
  const validate = () => {
    const newErrors = {};

    if (shippingData.pincode.length !== 6) {
      newErrors.pincode = "Pincode must be exactly 6 digits.";
    }

    if (!/^\d{10}$/.test(shippingData.contactNumber)) {
      newErrors.contactNumber = "Contact number must be exactly 10 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Shipping Details</h3>

      {/* First Name */}
      <div className="flex flex-col">
        <label className="mb-1">First Name:</label>
        <input
          type="text"
          name="firstName"
          value={shippingData.firstName}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
      </div>

      {/* Last Name */}
      <div className="flex flex-col">
        <label className="mb-1">Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={shippingData.lastName}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
      </div>

      {/* Contact Number */}
      <div className="flex flex-col">
        <label className="mb-1">Contact Number:</label>
        <input
          type="text"
          name="contactNumber"
          value={shippingData.contactNumber}
          onChange={handleChange}
          maxLength="10"
          required
          className={`border p-2 rounded ${
            errors.contactNumber ? "border-red-500" : ""
          }`}
        />
        {errors.contactNumber && (
          <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col">
        <label className="mb-1">Email:</label>
        <input
          type="email"
          name="email"
          value={shippingData.email}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
      </div>

      {/* Address */}
      <div className="flex flex-col">
        <label className="mb-1">Address:</label>
        <input
          type="text"
          name="address"
          value={shippingData.address}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
      </div>

      {/* Landmark */}
      <div className="flex flex-col">
        <label className="mb-1">Landmark (Optional):</label>
        <input
          type="text"
          name="landmark"
          value={shippingData.landmark}
          onChange={handleChange}
          className="border p-2 rounded"
        />
      </div>

      {/* Pincode */}
      <div className="flex flex-col">
        <label className="mb-1">Pincode:</label>
        <input
          type="text"
          name="pincode"
          value={shippingData.pincode}
          onChange={handleChange}
          required
          maxLength="6"
          className={`border p-2 rounded ${
            errors.pincode ? "border-red-500" : ""
          }`}
        />
        {errors.pincode && (
          <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
        )}
      </div>

      {/* City */}
      <div className="flex flex-col">
        <label className="mb-1">City:</label>
        <input
          type="text"
          name="city"
          value={shippingData.city}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
      </div>

      {/* State */}
      <div className="flex flex-col">
        <label className="mb-1">State:</label>
        <select
          name="state"
          value={shippingData.state}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        >
          <option value="">Select State</option>
          {statesAndUTs.map((state, index) => (
            <option key={index} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ShippingDetails;
