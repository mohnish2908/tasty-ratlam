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
const ComboProduct = () => {
  const [products, setProducts] = useState([]);
  // const [comboProducts, setComboProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllComboProducts();
        setProducts(response.data.data);
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
        <div className="md:w-[85%] mx-auto p-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            <Skeleton width={150} height={40} />
          </h1>
          <div className="flex flex-wrap gap-4">
            {[...Array(5)].map((_, index) => (
              <div 
                key={index}
                className="sm:w-full lg:w-1/5 md:w-1/2 p-2" // Adjusted responsive widths
              >
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  {/* Image Skeleton */}
                  <Skeleton 
                    height={300} 
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
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Combo Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
            product.status === "available" && (
              <Card key={product._id} data={product} />
            )
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ComboProduct;
