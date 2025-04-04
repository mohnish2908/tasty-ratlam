import React, { useState } from "react";  
import { toast } from "react-hot-toast";  
import { addProduct } from "../../../services/operations/productAPI";  
import { useSelector } from "react-redux";
const AddProduct = () => {  
  const adminToken = useSelector((state) => state.admin.adminToken);
  const [name, setName] = useState("");  
  const [description, setDescription] = useState("");  
  const [heading, setHeading] = useState("");  
  const [subHeadings, setSubHeadings] = useState([""]);  
  const [pricePerWeight, setPricePerWeight] = useState([{ weightInGrams: "", price: "" }]);  
  const [images, setImages] = useState([]);  

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

  const handlePriceChange = (index, field, value) => {  
    const updatedPricePerWeight = [...pricePerWeight];  
    updatedPricePerWeight[index][field] = value;  
    setPricePerWeight(updatedPricePerWeight);  
  };  

  const addPriceField = () => {  
    setPricePerWeight([...pricePerWeight, { weightInGrams: "", price: "" }]);  
  };  

  const removePriceField = (index) => {  
    const updatedPricePerWeight = pricePerWeight.filter((_, i) => i !== index);  
    setPricePerWeight(updatedPricePerWeight);  
  };  

  const handleImageChange = (event) => {  
    setImages((prevImages) => [...prevImages, ...Array.from(event.target.files)]); // Append new files to existing images array  
  };  

  const handleSubmit = async (e) => {  
    e.preventDefault(); // Prevent default form submission  
    console.log("Form submitted", name, description, heading, subHeadings, pricePerWeight, images);  
    
    try {  
      console.log("images in forntend", images);
      const response = await addProduct(name, description, heading, subHeadings, pricePerWeight, images,adminToken);  
      toast.success("Product added successfully!"); // Success toast  
      console.log("Product added successfully", response.data);  
      setName("");  
      setDescription("");
      setHeading("");
      setSubHeadings([""]);
      setPricePerWeight([{ weightInGrams: "", price: "" }]);
      setImages([]);
    } catch (error) {  
      console.error("Error adding product", error);  
      toast.error("Error adding product!"); // Error toast  
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
        <label className="block text-gray-700 font-semibold">Price Per Weight:</label>  
        {pricePerWeight.map((item, index) => (  
          <div key={index} className="flex items-center space-x-2">  
            <input  
              type="number"  
              placeholder="Weight in grams"  
              value={item.weightInGrams}  
              onChange={(e) => handlePriceChange(index, "weightInGrams", e.target.value)}  
              required  
              className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"  
            />  
            <input  
              type="number"  
              placeholder="Price"  
              value={item.price}  
              onChange={(e) => handlePriceChange(index, "price", e.target.value)}  
              required  
              className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"  
            />  
            <button  
              type="button"  
              onClick={() => removePriceField(index)}  
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"  
            >  
              Remove  
            </button>  
          </div>  
        ))}  
        <button  
          type="button"  
          onClick={addPriceField}  
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"  
        >  
          Add Price Field  
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
        Add Product  
      </button>  
    </form>  
  );  
};  

export default AddProduct;
