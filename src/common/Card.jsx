import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import GetAvgRating from "../utils/avgRating";
import RatingStars from "./RatingStars";

const Card = ({ data }) => {
  // console.log("card data",data)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, images, pricePerWeight, ratings } = data;
  const [selectedOption, setSelectedOption] = useState(
    pricePerWeight && pricePerWeight.length > 0 ? pricePerWeight[0]._id : null
  );
  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(data?.ratings);
    // console.log("ccoutn", count);
    setAvgReviewCount(count);
  }, [ratings]);

  const handleAddToCart = () => {
    if (pricePerWeight && selectedOption) {
      const selectedWeight = pricePerWeight.find(
        (option) => option._id === selectedOption
      );
      dispatch(
        addToCart({
          ...data,
          selectedOption,
          selectedWeight,
          weightInGrams: selectedWeight.weightInGrams,
          price: selectedWeight.price,
        })
      );
      toast.success("Product added to cart");
    } else if (!pricePerWeight) {
      dispatch(addToCart({ ...data }));
      toast.success("Combo product added to cart");
    } else {
      toast.error("Please select a weight option");
    }
  };

  const handleProductClick = (e) => {
    e.stopPropagation();
    if (pricePerWeight) {
      navigate(`/product/${data._id}`);
    } else {
      navigate(`/combo-product/${data._id}`);
    }
  };

  return (
    <div className=" text-center cursor-pointer ">
      <img
        src={
          images && images.length > 0
            ? images[0]
            : "https://via.placeholder.com/150"
        }
        alt={name}
        className=""
        onClick={handleProductClick}
      />
      <div className="">
        <div className="cursor-pointer" onClick={handleProductClick}>
          <div className='w-9/10 text-gray-800 text-sm'>
          <h2 >
           {/* className="lg:text-lg  text-gray-800 text-center sm:text-5sm" */}
            {name}
          </h2>
          </div>
          <div className="flex flex-row gap-1 justify-center items-center">
            <RatingStars Review_Count={avgReviewCount} />
            <span>({ratings.length})</span>
          </div>
        </div>
        {pricePerWeight && (
          <div className="mt-4" onClick={(e) => e.stopPropagation()}>
            <select
              id="pricePerWeight"
              className="mt-1 block w-full text-center bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              {pricePerWeight.map((option) => (
                <option key={option._id} value={option._id} >
                  {option.weightInGrams}g - ₹{option.price}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="py-2 bg-black text-white cursor-pointer mt-4">
          <button
            className="w-full transform transition-transform duration-200 hover:scale-105"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
