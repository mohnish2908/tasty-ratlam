import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { addComboProduct } from "../../../services/operations/productAPI"; // Assuming you have an API function for adding combo products
import {useSelector} from 'react-redux'
// import { set } from "mongoose";
const AddComboProduct = () => {
  const adminToken = useSelector(state => state.admin.adminToken)
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [heading, setHeading] = useState("");
  const [subHeadings, setSubHeadings] = useState([""]);
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [products, setProducts] = useState([""]);
  const [weightInGrams, setWeightInGrams] = useState("");

  const handleSubHeadingChange = (index, value) => {
    const updatedSubHeadings = [...subHeadings];
    updatedSubHeadings[index] = value;
    setSubHeadings(updatedSubHeadings);
  };

  const addSubHeading = () => {
    setSubHeadings([...subHeadings, ""]);
  };

  const removeSubHeading = (index) => {
    const updatedSubHeadings = subHeadings.filter((_, i) => i !== index);
    setSubHeadings(updatedSubHeadings);
  };

  const handleImageChange = (event) => {
    setImages((prevImages) => [...prevImages, ...Array.from(event.target.files)]);
  };

  const handleProductChange = (index, value) => {
    const updatedProducts = [...products];
    updatedProducts[index] = value;
    setProducts(updatedProducts);
  };

  const addProductField = () => {
    setProducts([...products, ""]);
  };

  const removeProductField = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted", name, description, heading, subHeadings, price, images, products, weightInGrams);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("heading", heading);
    formData.append("price", price);
    formData.append("weightInGrams", weightInGrams);
    subHeadings.forEach((subHeading, index) => {
      formData.append(`subHeadings[${index}]`, subHeading);
    });
    products.forEach((product, index) => {
      formData.append(`products[${index}]`, product);
    });
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await addComboProduct(formData,adminToken);
      toast.success("Combo Product added successfully!");
      console.log("Combo Product added successfully", response.data);
      setName("");
      setDescription("");
      setHeading("");
      setSubHeadings([""]);
      setPrice("");
      setImages([]);
      setProducts([""]);
      setWeightInGrams("");
    } catch (error) {
      console.error("Error adding combo product", error);
      toast.error("Error adding combo product!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-gray-100 rounded-lg shadow-md space-y-6">
      <div className="space-y-2">
        <label className="block text-gray-700 font-semibold">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-semibold">Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-semibold">Heading:</label>
        <input
          type="text"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-semibold">SubHeadings:</label>
        {subHeadings.map((subHeading, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={subHeading}
              onChange={(e) => handleSubHeadingChange(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => removeSubHeading(index)}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addSubHeading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add SubHeading
        </button>
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-semibold">Price:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-semibold">Total Weight (in grams):</label>
        <input
          type="number"
          value={weightInGrams}
          onChange={(e) => setWeightInGrams(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-semibold">Products:</label>
        {products.map((product, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={product}
              onChange={(e) => handleProductChange(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => removeProductField(index)}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addProductField}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Product
        </button>
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-semibold">Images:</label>
        <input
          type="file"
          multiple
          onChange={handleImageChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
        />
        <div className="flex flex-wrap space-x-2">
          {images.map((image, index) => (
            <div key={index} className="w-24 h-24 border border-gray-300 rounded-md overflow-hidden">
              <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        Add Combo Product
      </button>
    </form>
  );
};

export default AddComboProduct;
