import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/operations/productAPI";
import { toast } from "react-hot-toast";
import Navbar from "../common/NavBar";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import RatingStars from "../common/RatingStars";
import GetAvgRating from "../utils/avgRating";
import AddReview from "../common/AddReview";
import  CheckOut  from "./CheckOut";
import ProductReview from "../common/ProductReview"
import Footer from "../common/Footer";
import Skeleton from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css";
const ProductDetail = () => {
  // const user=JSON.parse(localStorage.getItem('user'))
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(""); // State for main image
  const [selectedOption, setSelectedOption] = useState(null); // State for selected weight option
  const [price, setPrice] = useState(0); // State for price based on weight
  const [quantity, setQuantity] = useState(1); // State for quantity
  const [reviewButton, setReviewButton] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // console.log("product in detail", product);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        if (response?.data?.data) {
          const productData = response.data.data;
          setProduct(productData);
          setSelectedImage(productData.images[0]); // Set the first image as default
          if (productData.pricePerWeight?.length > 0) {
            setSelectedOption(productData.pricePerWeight[0]._id); // Set default weight option
            setPrice(productData.pricePerWeight[0].price); // Set default price
          }
        } else {
          throw new Error("Invalid API response structure");
        }
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Error fetching product details");
        toast.error("Error fetching product details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const count = GetAvgRating(product?.ratings);
    setAvgReviewCount(count);
  }, [product]);

  const handleWeightChange = (weightId) => {
    setSelectedOption(weightId);
    const selectedWeight = product.pricePerWeight.find(
      (option) => option._id === weightId
    );
    if (selectedWeight) {
      setPrice(selectedWeight.price);
    }
  };

  const handleAddToCart = () => {
    if (product && selectedOption) {
      const selectedWeight = product.pricePerWeight.find(
        (option) => option._id === selectedOption
      );
      dispatch(
        addToCart({
          ...product,
          selectedOption,
          selectedWeight,
          quantity,
          weightInGrams: selectedWeight.weightInGrams,
          price: selectedWeight.price,
        })
      );
      toast.success("Product added to cart");
    } else if (!product.pricePerWeight) {
      dispatch(addToCart({ ...product, quantity, price }));
      toast.success("Combo product added to cart");
    } else {
      toast.error("Please select a weight option before adding to cart");
    }
  };

  

  const handleBuyNow = () => {
    // if(!user){
    //   localStorage.setItem("pendingBuyNow", JSON.stringify({productId:product._id, productType: "product"}));
    //   navigate("/login");
    //   return;
    // }

    if (product && selectedOption) {
      const selectedWeight = product.pricePerWeight.find(
        (option) => option._id === selectedOption
      );
      const data = {
        ...product,
        selectedOption,
        selectedWeight,
        quantity,
        weightInGrams: selectedWeight.weightInGrams,
        price: selectedWeight.price,
      };
      navigate("/checkout", { state: { products: [data] } });
      toast.success("To buy");
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
        <Navbar />
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

  // Sort reviews by rating in descending order and get the top 4
  const sortedReviews = product.ratings
    .sort((a, b) => b.rating - a.rating)
    // .slice(0, 5);

    console.log("review",sortedReviews)

  return (
    <div className=''>
      <Navbar />
      <div className=" lg:w-3/4 sm:w-full mx-auto px-4 py-10 flex flex-col lg:flex-row gap-10  ">
        {/* Image Section */}
        <div className="flex-1 ">
          <div className="  rounded-lg overflow-hidden w-full top-50 sm:w-full sm:h-full">
            <img
              src={selectedImage}
              alt={product.name}
              className="object-contain w-full h-full "
            />
          </div>
          {/* Thumbnails */}
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

        {/* Product Details Section */}
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-4xl ">{product.name}</h1>
          <div className="text-md flex flex-wrap items-center gap-2">
            <RatingStars Review_Count={avgReviewCount} />
            <span>{`(${product?.ratings.length} reviews)`}</span>
          </div>

          <p className="text-black text-xl">₹ {price}</p>

          {/* Weight Selection */}
          <h3 className="text-gray-600">Weight:</h3>
          <div className="flex flex-wrap gap-4">
            {product.pricePerWeight.map(({ weightInGrams, price, _id }) => (
              <label key={_id} className="cursor-pointer ">
                <input
                  type="radio"
                  name="weightOption"
                  value={_id}
                  checked={selectedOption === _id}
                  onChange={() => handleWeightChange(_id)}
                  className="hidden"
                />
                <div
                  className={`px-5 py-2 rounded-3xl border-2 ${
                    selectedOption === _id
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {weightInGrams}g
                </div>
              </label>
            ))}
          </div>

          {/* Quantity Selector */}
          <div className="flex flex-col gap-4">
            <label className=" text-gray-600">Quantity:</label>
            <div className="flex items-center gap-2 ">
              <div className="border border-black ">
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

          <p className="text-gray-600">{product.description}</p>

          {/* Heading and Subheadings */}
          <h2 className="text-lg font-semibold">{product.heading}</h2>
          <ul className="list-disc pl-5">
            {product.subHeading.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className='flex justify-center items-center flex-col lg:mt-10 lg:w-3/4 mx-auto px-4 py-10'>
        <div><p className='text-lg'>Customer Reviews</p><RatingStars Review_Count={avgReviewCount} className=''/><p className='text-sm text-gray-600'>Based on {product?.ratings.length} review</p></div>
        <button onClick={handleReview} className='px-4 py-2 bg-yellow-500 m-3 text-white'>{reviewButton ?(<p>Cancel</p>):(<p>Write a review</p>)}</button>
        {
          reviewButton && <AddReview productId={id} />
        }
        <div className='w-full'><ProductReview sortedReviews={sortedReviews} /></div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
