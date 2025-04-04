import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { setCart } from '../slices/cartSlice';
import Navbar from '../common/NavBar';
import { useNavigate } from 'react-router-dom';
import { RiDeleteBin6Line } from "react-icons/ri";
import Footer from "../common/Footer";
const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.cart);
  console.log("cart",cart)  
  const total = useSelector((state) => state.cart.total);

  const handleRemoveFromCart = (id, selectedOption) => {
    const updatedCart = cart.filter((item) => 
      item._id !== id || (item.selectedOption && item.selectedOption !== selectedOption)
    );
    dispatch(setCart(updatedCart));
    toast.success("Product removed from cart");
  };

  const handleIncreaseQuantity = (id, selectedOption) => {
    const updatedCart = cart.map((item) =>
      item._id === id && item.selectedOption === selectedOption
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    dispatch(setCart(updatedCart));
  };

  const handleDecreaseQuantity = (id, selectedOption) => {
    const updatedCart = cart.map((item) =>
      item._id === id && item.selectedOption === selectedOption && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    dispatch(setCart(updatedCart));
  };

  const handleBuyNow = () => {
    // Navigate to the checkout page or handle the buy now action
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Cart</h1>
        {cart.length === 0 ? (
          <p className="text-gray-600">Your cart is empty</p>
        ) : (
          <>
            <ul className="space-y-4">
              {cart.map((item) => (
                <li key={item._id + (item.selectedOption || '')} className="bg-white shadow-md rounded-lg p-4 flex flex-col  md:flex-row items-center justify-between">
                  <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <img
                      src={item.images && item.images.length > 0 ? item.images[0] : "https://via.placeholder.com/150"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                      {/* <p className="text-gray-600 text-sm">{item.description}</p> */}
                      {item.selectedWeight && (
                        <p className="text-gray-600 text-sm">Weight: {item.selectedWeight.weightInGrams}g</p>
                      )}
                      <p className="text-gray-600 text-sm">Price: ₹{item.selectedWeight ? item.selectedWeight.price : item.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-5 ">
                    <div className="flex items-center space-x-2 border border-black">
                      <button
                        className="  text-gray-800 font-semibold p-3 rounded"
                        onClick={() => handleDecreaseQuantity(item._id, item.selectedOption)}
                      >
                        -
                      </button>
                      <span className="text-gray-800 p-3">{item.quantity}</span>
                      <button
                        className="  text-gray-800 font-semibold p-3 rounded"
                        onClick={() => handleIncreaseQuantity(item._id, item.selectedOption)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className=" font-semibold p-3rounded"
                      onClick={() => handleRemoveFromCart(item._id, item.selectedOption)}
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <h2 className="text-xl font-bold">Estimated Total: ₹{total}</h2>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                className="bg-black  text-white font-semibold py-3 px-20  w-full md:w-auto"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;