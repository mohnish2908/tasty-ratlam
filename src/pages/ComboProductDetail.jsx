import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getComboProductById } from "../services/operations/productAPI";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import RatingStars from "../common/RatingStars";
import GetAvgRating from "../utils/avgRating";
import AddReview from "../common/AddReview";
import NavBar from "../common/NavBar";
import ProductReview from "../common/ProductReview";
import Footer from "../common/Footer";
import Skeleton from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css";
const ComboProductDetail = () => {
  // const user=JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  const [reviewButton, setReviewButton] = useState(false);
  console.log("product in detail", product);
  const sortedReviews = product?.ratings
    .sort((a, b) => b.rating - a.rating)
  console.log("sortedReviews", sortedReviews)
  useEffect(() => {
    const count = GetAvgRating(product?.ratings);
    setAvgReviewCount(count);
  }, [product]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getComboProductById(id);
        if (response?.data?.data) {
          const productData = response.data.data;
          setProduct(productData);
          setSelectedImage(productData.images[0]);
        } else {
          throw new Error("Invalid API response structure");
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Error fetching product details");
        toast.error("Error fetching product details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ ...product, quantity, price: product.price }));
      toast.success("Combo product added to cart");
    }
  };

  const handleBuyNow = () => {
    // if(!user){
    //   localStorage.setItem("pendingBuyNow", JSON.stringify({productId:product._id, productType: "combo-product"}));
    //   navigate("/login");
    //   return;
    // }

    if (product) {
      const data = { ...product, quantity };
      navigate("/checkout", { state: { products: [data] } });
    }
  };

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleReview = () => {
    setReviewButton(!reviewButton);
  }

  if (loading) {
    return (
      <div>
        <NavBar />
        <div className="lg:w-3/4 sm:w-full mx-auto px-4 py-10 flex flex-col lg:flex-row gap-10">
          <div className="flex-1">
            <Skeleton height={400} />
            <div className="flex gap-2 mt-4">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} width={64} height={64} />
              ))}
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <Skeleton height={40} width={300} />
            <Skeleton height={20} width={100} />
            <Skeleton height={30} width={150} />
            <Skeleton height={20} width={200} />
            <Skeleton height={50} width={200} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-lg font-semibold text-red-500">
        {error}
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="sm:w-full lg:w-3/4 mx-auto px-4 py-10">
        <div className="lg:flex lg:gap-10">
          <div className="lg:w-1/2">
            <div className=" rounded-lg overflow-hidden w-full">
              <img
                src={selectedImage}
                alt={product.name}
                className="object-contain w-full h-full"
              />
            </div>
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-16 h-16 object-cover border-2 rounded cursor-pointer ${
                    selectedImage === image
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => setSelectedImage(image)}
                />
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 flex flex-col gap-6">
            <h1 className="text-5xl ">
              {product.name || "No Name Available"}
            </h1>
            <div className="text-md flex flex-wrap items-center gap-2">
              <RatingStars Review_Count={avgReviewCount} />
              <span>{`(${product?.ratings.length} reviews)`}</span>
            </div>

            {product.pricePerWeight?.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold">Price Options:</h3>
                <div className="space-y-2">
                  {product.pricePerWeight.map((option) => (
                    <p key={option._id} className="text-sm text-black">
                      {option.weightInGrams}g - ₹{option.price}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-1xl text-black">
                ₹ {product.price || "N/A"}
              </p>
            )}

            <div className="flex flex-col gap-4">
              <label className="text-lg text-gray-600">Quantity:</label>
              <div className="flex items-center gap-2 ">
                <div className='border border-black'>
                <button
                  className="px-4 py-3 rounded"
                  onClick={decrementQuantity}
                >
                  -
                </button>
                <span className="px-4 py-3 rounded">{quantity}</span>
                <button
                  className="px-4 py-3 rounded"
                  onClick={incrementQuantity}
                >
                  +
                </button>
                </div>
              </div>
            </div>
            {product.status === "available" ? (
              <div className="flex flex-col gap-4">
                <button
                  className=" text-black px-4 py-3  border border-black hover:border-2"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
                <button
                  className="bg-black text-white px-4 py-3 hover:border-1"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>
              </div>
            ) : (
              <p>Product is unavailable</p>
            )}

            <p className="text-gray-600 text-sm">
              {product.description || "No description available"}
            </p>

            {product.heading && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {product.heading}
                </h2>
                {product.subHeading?.length > 0 && (
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {product.subHeading.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
        
      </div>
      <div className='flex justify-center items-center flex-col lg:mt-10 lg:w-3/4 mx-auto px-4 py-10'>
        <div><p className='text-lg'>Customer Reviews</p><RatingStars Review_Count={avgReviewCount} className=''/><p className='text-sm text-gray-600'>Based on {product?.ratings.length} review</p></div>
        <button onClick={handleReview} className='px-4 py-2 bg-yellow-500 m-3 text-white'>{reviewButton ?(<p>Cancel</p>):(<p>Write a review</p>)}</button>
        {
          reviewButton && <AddReview comboProductId={id} />
        }
        <div className='w-full'><ProductReview sortedReviews={sortedReviews} /></div>
      </div>
      <Footer />  
    </>
  );
};

export default ComboProductDetail;
