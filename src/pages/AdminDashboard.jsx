import React, { useEffect, useState } from "react";
import NavBar from "../common/NavBar";
import {
  getAllComboProducts,
  getAllProducts,
  deleteComboProduct,
  deleteProduct,
} from "../services/operations/productAPI";
import { toast } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/operations/authAPI";
// import {useSelector} from 'react-redux'
const AdminDashboard = () => {
  const adminToken=useSelector(state=>state.admin.adminToken)
  // console.log("adminToken",adminToken)
  const [products, setProducts] = useState([]);
  const [comboProducts, setComboProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        toast.loading("Fetching Products...");
        const response = await getAllProducts();
        setProducts(response.data.data);

        toast.dismiss();
        toast.loading("Fetching Combo Products...");
        const comboResponse = await getAllComboProducts();
        setComboProducts(comboResponse.data.data);
        toast.dismiss();
      } catch (err) {
        setError("Error fetching products or combo products");
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateProductStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "available" ? "unavailable" : "available";
      toast.loading(`Updating Product Status to ${newStatus}...`);
      await deleteProduct(id, newStatus,adminToken);
      setProducts((prev) =>
        prev.map((product) =>
          product._id === id ? { ...product, status: newStatus } : product
        )
      );
      toast.dismiss();
      toast.success(`Product marked as ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error("Error updating product status");
    }
  };

  const handleUpdateComboProductStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "available" ? "unavailable" : "available";
      toast.loading(`Updating Combo Product Status to ${newStatus}...`);
      await deleteComboProduct(id, newStatus,adminToken);
      setComboProducts((prev) =>
        prev.map((comboProduct) =>
          comboProduct._id === id ? { ...comboProduct, status: newStatus } : comboProduct
        )
      );
      toast.dismiss();
      toast.success(`Combo Product marked as ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error("Error updating combo product status");
    }
  };

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-lg font-semibold">Loading...</div>
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
    <div>
      <NavBar />
      <div className="max-w-7xl mx-auto p-4 flex flex-col">
        {/* Header Section - Stack vertically on mobile */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Products</h1>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm w-full sm:w-auto"
              onClick={handleLogout}
            >
              Logout
            </button>
            <Link
              to="/add-promo-code"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm w-full sm:w-auto text-center"
            >
              Add Promo Code
            </Link>
            <Link
              to="/order-admin"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm w-full sm:w-auto text-center"
            >
              Orders
            </Link>
          </div>
        </div>

        {/* Add Product Button - Full width on mobile */}
        <div className="p-4 bg-gray-100 border-t border-gray-200 mt-4">
          <Link
            to="/add-product"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm block w-full sm:w-auto text-center"
          >
            Add Product
          </Link>
        </div>

        {/* Products Table - Horizontal scroll on mobile */}
        <div className="overflow-x-auto">
          <table className="min-w-full mt-6 bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b hidden sm:table-cell">Image</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b hidden sm:table-cell">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const { _id, name, pricePerWeight, price, status, images } = product;
                return (
                  <tr key={_id} className="border-b">
                    <td className="py-2 px-4 hidden sm:table-cell">
                      <img src={images[0]} alt={name} className="w-12 h-12 sm:w-16 sm:h-16 object-cover" />
                    </td>
                    <td className="py-2 px-4 text-sm sm:text-base">{name}</td>
                    <td className="py-2 px-4 text-sm sm:text-base">
                      {pricePerWeight
                        ? <>
                            <span className="sm:hidden">From ₹{Math.min(...pricePerWeight.map(p => p.price))}</span>
                            <div className="hidden sm:block">
                              {pricePerWeight.map((option) => (
                                <div key={option._id}>
                                  {option.weightInGrams}g - ₹{option.price}
                                </div>
                              ))}
                            </div>
                          </>
                        : `₹${price}`}
                    </td>
                    <td className="py-2 px-4 hidden sm:table-cell">
                      <span className={`${status === "available" ? "bg-green-200" : "bg-red-200"} px-2 py-1 rounded text-sm`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <button
                        className={`${
                          status === "available" ? "bg-red-500" : "bg-green-500"
                        } hover:opacity-90 text-white px-3 py-1.5 rounded-md text-xs sm:text-sm`}
                        onClick={() => handleUpdateProductStatus(_id, status)}
                      >
                        {status === "available" ? "Unavailable" : "Available"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Combo Products Section */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-8 mb-4">
          Combo Products
        </h1>
        
        {/* Add Combo Product Button */}
        <div className="p-4 bg-gray-100 border-t border-gray-200">
          <Link
            to="/add-combo-product"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm block w-full sm:w-auto text-center"
          >
            Add Combo Product
          </Link>
        </div>

        {/* Combo Products Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full mt-4 bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b hidden sm:table-cell">Image</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b hidden sm:table-cell">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {comboProducts.map((comboProduct) => {
                const { _id, name, price, status, images } = comboProduct;
                return (
                  <tr key={_id} className="border-b">
                    <td className="py-2 px-4 hidden sm:table-cell">
                      <img src={images[0]} alt={name} className="w-12 h-12 sm:w-16 sm:h-16 object-cover" />
                    </td>
                    <td className="py-2 px-4 text-sm sm:text-base">{name}</td>
                    <td className="py-2 px-4 text-sm sm:text-base">₹{price}</td>
                    <td className="py-2 px-4 hidden sm:table-cell">
                      <span className={`${status === "available" ? "bg-green-200" : "bg-red-200"} px-2 py-1 rounded text-sm`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <button
                        className={`${
                          status === "available" ? "bg-red-500" : "bg-green-500"
                        } hover:opacity-90 text-white px-3 py-1.5 rounded-md text-xs sm:text-sm`}
                        onClick={() => handleUpdateComboProductStatus(_id, status)}
                      >
                        {status === "available" ? "Unavailable" : "Available"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;