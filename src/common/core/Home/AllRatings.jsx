import React, { useEffect, useState } from "react";
import Slider from "react-slick"; // Import Slider from react-slick
import "slick-carousel/slick/slick.css"; // Import slick styles
import "slick-carousel/slick/slick-theme.css"; // Import slick theme styles
import { getAllReviews } from "../../../services/operations/productAPI";
import { toast } from "react-hot-toast";
import RatingStars from "../../RatingStars";

const AllRatings = () => {
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getAllReviews();
        setTotal(response.data.length);
        const data = response.data.filter((r) => r.rating >= 4).slice(0, 12); // Filter reviews with rating >= 4 and limit to 12
        setReviews(data);
      } catch (error) {
        toast.error("Error fetching product details");
      }
    };
    fetchReviews();
  }, []);

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Default number of slides visible at once
    slidesToScroll: 1, // Number of slides to scroll at once
    arrows: true, // Show navigation arrows
    autoplay: true, // Enable auto-scrolling
    autoplaySpeed: 3000, // Auto-scroll every 3 seconds (3000ms)
    pauseOnHover: true, // Pause auto-scroll when hovering over the slider
    responsive: [
      {
        breakpoint: 768, // Tablets and small devices
        settings: {
          slidesToShow: 1, // Show 1 slide on mobile
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="py-8">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Let customers speak for us</h2>
        <RatingStars Review_Count={4} />
        <div className="text-gray-600 mt-2">from {total} reviews</div>
      </div>

      {/* Slider Section */}
      <div className="px-4">
        <Slider {...sliderSettings}>
          {reviews.map((review) => (
            <div key={review._id} className="p-4">
              <div className="bg-white rounded-lg shadow-md p-6 h-full">
                <div className="flex justify-center">
                  <RatingStars Review_Count={review.rating} />
                </div>
                <h3 className="text-lg font-semibold mt-4 text-center">{review.title}</h3>
                <p className="text-gray-600 mt-2 text-center">{review.review}</p>
                <p className="text-gray-800 font-medium mt-4 text-center">{review.name}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default AllRatings;