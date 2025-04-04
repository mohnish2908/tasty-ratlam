import React from 'react';
import { FaRegUserCircle } from "react-icons/fa";
import RatingStars from './RatingStars';

const ProductReview = ({ sortedReviews }) => {
  // console.log("a",sortedReviews)
  return (
    <div>
      {
        sortedReviews.map((review) => (
          <div key={review._id} className='flex flex-col gap-2 p-4 border-b border-gray-200'>
            <div className='flex justify-between items-center'>
              <RatingStars Review_Count={review.rating} />
              <p className='text-gray-500'>{review.createdAt.split("T")[0]}</p>
            </div>
            <div className='flex items-center gap-2'>
              <FaRegUserCircle className='text-2xl text-gray-700' />
              <p className='text-yellow-700'>{review.name}</p>
            </div>
            <p className='font-bold'>{review.title}</p>
            <p>{review.review}</p>
          </div>
        ))
      }
    </div>
  );
}

export default ProductReview;
