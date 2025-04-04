import React, { useState } from "react";
import { bulkOrder } from "../services/operations/orderAPI";
import Navbar from "../common/NavBar";
import toast from "react-hot-toast";
import Footer from "../common/Footer";
const BulkOrder = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.loading("Sending your message...");
    try {
      const response = await bulkOrder(email, firstName, lastName, message, contactNumber);
      setEmail("");
      setFirstName("");
      setLastName("");
      setMessage("");
      setContactNumber("");
      // console.log(response)
    } catch (error) {
      console.log("Error adding review");
    }
    finally{
      toast.dismiss();
      toast.success("Message sent successfully");

    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center mt-5">
        <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[50%] px-4 py-10 ">
          <h1 className="text-5xl  text-center mb-6">Contact Us</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">First Name:</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex-1 mt-4 sm:mt-0">
                <label className="block text-sm font-medium text-gray-700">Last Name:</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number:</label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Message:</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="mt-2 px-8 py-3 bg-black text-white "
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BulkOrder;
