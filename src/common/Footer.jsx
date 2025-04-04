import React from "react";
import logo from "../assets/Logo_no_bg.png";
import { BiLogoInstagramAlt } from "react-icons/bi";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import { LuDot } from "react-icons/lu";

const Footer = () => {
  return (
    <>
    <div className="bg-white border-t border-gray-300 py-10 flex flex-col items-center">
      {/* Desktop & Tablet View */}
      <div className="w-[75%] flex flex-col sm:flex-row justify-between items-center sm:items-start text-center sm:text-left">
        
        {/* Logo - Centered on Mobile, Properly Aligned on Desktop */}
        <div className="sm:w-1/4 flex justify-center sm:justify-start">
          <img src={logo} alt="Tasty Ratlam Logo" className="w-[130px]" />
        </div>

        {/* Menu & Quick Links */}
        <div className="flex flex-col sm:flex-row gap-y-6 sm:gap-x-32 mt-6 sm:mt-0">
          {/* Menu Section */}
          <div>
            <p className="font-bold mb-2">Menu</p>
            <ul className="text-gray-600 space-y-2">
              <li><a href="home" className="hover:underline">Home</a></li>
              <li><a href="products" className="hover:underline">Shop Now</a></li>
              <li><a href="combo-products" className="hover:underline">Combo Deals</a></li>
              <li><a href="bulk-order" className="hover:underline">Bulk Order</a></li>
              <li><a href="about" className="hover:underline">About Us</a></li>
            </ul>
          </div>

          {/* Quick Links Section */}
          <div>
            <p className="font-bold mb-2">Quick links</p>
            <ul className="text-gray-600 space-y-2">
              <li><a href="products" className="hover:underline">Shop Now</a></li>
              <li><a href="orders" className="hover:underline">Orders</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Social Media Icons - Always Centered */}
      <div className="flex space-x-4 mt-8">
        <a href="https://www.facebook.com/people/Tasty-Ratlam/61569354040475/" className="text-black text-2xl"><FaFacebook /></a>
        <a href="https://www.instagram.com/tastyratlam/" className="text-black text-2xl"><BiLogoInstagramAlt /></a>
        <a href="https://www.youtube.com/@TastyRatlam" className="text-black text-2xl"><FaYoutube /></a>
      </div>
      
    </div>
    <div className='border-t border-gray-300 py-10 font-assistant'>
          <div className="flex flex-row items-center justify-center m-4 text-gray-600 text-2sm">
              <p>© 2025, Tasty Ratlam</p>
              <LuDot/>
              <p>Privacy Policy</p>
              <LuDot/>
              <p>Refund Policy</p>
              <LuDot/>
              <p>Term And Condition</p>
              <LuDot/>
              <p>Contact Information</p>
          </div>
    </div>
    </>
  );
};

export default Footer;
