import React, { useEffect, useState } from "react";
import NavBar from "../common/NavBar"; // Assuming you have a NavBar component
import {
  getAllComboProducts,
  getAllProducts,
} from "../services/operations/productAPI"; // API functions
import { toast } from "react-hot-toast"; // For loading and error messages
import Card from "../common/Card"; // Assuming you have a Card component
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Footer from "../common/Footer";
const Product = () => {
  const [products, setProducts] = useState([]);
  // const [comboProducts, setComboProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // toast.loading("Fetching Products...");
        const response = await getAllProducts();
        setProducts(response.data.data);
        // toast.dismiss();

        // toast.loading("Fetching Combo Products...");
        // const comboResponse = await getAllComboProducts();
        // setComboProducts(comboResponse.data.data);
        // toast.dismiss();
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
      <div>
        <NavBar />
        <div className="md:w-[85%] mx-auto p-4 sm:w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            <Skeleton width={150} height={40} />
          </h1>
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, index) => (
              <div 
                key={index}
                className="w-full sm:w-[15%] md:w-1/4 lg:w-1/5 p-2" // Adjusted responsive widths
              >
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  {/* Image Skeleton */}
                  <Skeleton 
                    height={200} 
                    className="w-full aspect-square" 
                  />
                  
                  {/* Text Skeleton */}
                  <div className="p-3">
                    <Skeleton width={120} height={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
    <NavBar />
      <div className="md:w-[85%] mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Products</h1>
        <div className="flex flex-wrap mt-3">
          {products.map((product) => (
            product.status === "available" && (
              
              <div
                  key={product._id}
                  className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 p-2"
                >
                  {/* <Card data={product} /> */}
                  <Card key={product._id} data={product} />
                </div>
            )
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Product;
