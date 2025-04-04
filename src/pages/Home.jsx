import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive"; // Import useMediaQuery
import NavBar from "../common/NavBar"; // Assuming you have a NavBar component
import {
  getAllComboProducts,
  getAllProducts,
} from "../services/operations/productAPI"; // API functions
import { toast } from "react-hot-toast"; // For loading and error messages
import Card from "../common/Card"; // Assuming you have a Card component
import Banner from "../common/core/Home/Banner";
import UpperNav from "../common/core/Home/UpperNav";
import img4 from "../assets/banner/4.png";
import AllRatings from "../common/core/Home/AllRatings";
import StorySection from "../common/core/Home/StorySection";
import Footer from "../common/Footer";
import Slider from "react-slick"; // Import Slider from react-slick
import "slick-carousel/slick/slick.css"; // Import slick styles
import "slick-carousel/slick/slick-theme.css"; // Import slick theme styles
import Skeleton from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css";
const Home = () => {
  const [products, setProducts] = useState([]);
  const [comboProducts, setComboProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Detect if the screen width is less than 768px (tablet size)
  const isMobileOrTablet = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllProducts();
        setProducts(response.data.data);
        const comboResponse = await getAllComboProducts();
        setComboProducts(comboResponse.data.data);
      } catch (err) {
        setError("Error fetching products or combo products");
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="mt-6 space-y-6 px-4 w-full">
        {/* Navbar Skeleton */}
        <div className="flex flex-col gap-3">
          <Skeleton 
            height={40} 
            width="100%" 
            className="rounded-md md:h-[50px] lg:h-[60px]" 
          />
          <Skeleton 
            height={30} 
            width="80%" 
            className="rounded-md md:h-[40px] lg:h-[50px]" 
          />
        </div>
  
        {/* Slider Skeleton */}
        <div className="w-full">
          <Skeleton
            height={300} // Default for mobile
            width="100%"
            baseColor="#E0E0E0"
            highlightColor="#F5F5F5"
            duration={1.5}
            className="rounded-md md:h-[400px] lg:h-[500px]"
          />
        </div>
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

  // Custom arrow components
  const PrevArrow = ({ onClick }) => (
    <button
      className="absolute top-1/2 left-2 transform -translate-x-3 -translate-y-1/2 z-10 bg-white text-black p-2 shadow-md border-2 border-gray-500"
      onClick={onClick}
    >
      &#10094; {/* Unicode for left arrow */}
    </button>
  );

  const NextArrow = ({ onClick }) => (
    <button
      className="absolute top-1/2 right-2 transform translate-x-3 -translate-y-1/2 z-10 bg-white text-black p-2 shadow-md border-2 border-gray-500"
      onClick={onClick}
    >
      &#10095; {/* Unicode for right arrow */}
    </button>
  );

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Default number of slides visible at once
    slidesToScroll: 1, // Number of slides to scroll at once
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024, // Tablets and small desktops
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // Small tablets and large phones
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // Mobile devices
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* <UpperNav /> */}
      {/* Navbar */}
      <NavBar />
      
      {/* Banner */}
      <div className="mb-8">
        <Banner />
      </div>
      {/* Main Content */}
      <div className="lg:w-3/4 mx-auto p-4 overflow-x-hidden relative">
        {/* Products Section with Slider */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Products</h1>

        {isMobileOrTablet ? (
          <div className="flex flex-wrap justify-center">
            {products
              .filter((product) => product.status === "available")
              .map((product) => (
                <div
                  key={product._id}
                  className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 p-2"
                >
                  <Card data={product} />
                </div>
              ))}
          </div>
        ) : (
          <div className="">
            <Slider {...sliderSettings}>
              {products
                .filter((product) => product.status === "available")
                .map((product) => (
                  <div key={product._id} className="px-2">
                    <Card data={product} />
                  </div>
                ))}
            </Slider>
          </div>
        )}
        {/* Combo Products Section */}
        <h1 className="text-3xl font-bold text-gray-800 mt-10 mb-6">
          Combo Offers
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {comboProducts
            .filter((comboProduct) => comboProduct.status === "available")
            .map((comboProduct) => (
              <Card key={comboProduct._id} data={comboProduct} />
            ))}
        </div>
      </div>
      <img
        src={img4}
        alt="bannerImage"
        className="w-full h-full object-cover"
      />
      <AllRatings />
      <div>
        <StorySection />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
