import React, { useState } from "react";
import { TiStarFullOutline, TiStarOutline } from "react-icons/ti";
import { createRating } from "../services/operations/productAPI";

const AddReview = ({ productId, comboProductId }) => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [error, setError] = useState("");

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !rating || !title || !review) {
      setError("All fields are required.");
      return;
    }
    setError("");
    try {
      const response =await createRating(productId, name, rating, title, review, comboProductId);
      // console.log(response);
      window.location.reload();
    } catch {
      console.log("Error adding review");
    }
  };

  return (
    <div className=" lg:w-1/2 mx-auto p-6 bg-white shadow-md rounded-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Rating:</label>
          <div className="flex space-x-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleRating(star)}
                className={`cursor-pointer text-2xl ${
                  star <= rating ? "text-yellow-500" : "text-gray-300"
                }`}
              >
                {star <= rating ? <TiStarFullOutline /> : <TiStarOutline />}
              </span>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            maxLength="50"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Review:</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            maxLength="250"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-yellow-500 text-white font-medium"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddReview;