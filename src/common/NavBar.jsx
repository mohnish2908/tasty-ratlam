import React from "react";
import { BsCart2 } from "react-icons/bs";
import { FiMenu } from "react-icons/fi";
import { IoPersonOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Disclosure } from "@headlessui/react";
import { GiTireIronCross } from "react-icons/gi";
import { FaFacebook, FaYoutube, FaInstagram } from "react-icons/fa";
import UpperNav from "./core/Home/UpperNav";
import logo_wbg from "../assets/Logo_no_bg.png";
import { logout } from "../services/operations/authAPI";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const cart = useSelector((state) => state.cart?.cart || []);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Product", href: "/products" },
    { name: "Combo Product", href: "/combo-products" },
    { name: "Order", href: "/orders" },
    { name: "Bulk Order", href: "/bulk-order" },
    { name: "About Us", href: "/about" },
  ];

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout(navigate));
    navigate("/");
  };

  return (
    <nav className="bg-white border-b shadow-sm">
      <UpperNav />
      <div className="container mx-auto flex items-center justify-between px-4 py-2 md:px-6">
        
        {/* Mobile Hamburger Menu */}
        <div className="flex md:hidden">
          <Disclosure>
            {({ open }) => (
              <div> {/* Wrapped inside a div to prevent React Fragment issues */}
                <Disclosure.Button className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none">
                  {open ? <GiTireIronCross size={24} /> : <FiMenu size={24} />}
                </Disclosure.Button>

                <Disclosure.Panel className="fixed inset-0 top-[64px] bg-white shadow-md z-50 flex flex-col transition-transform duration-300 ease-in-out">
                  {/* Mobile Menu Top Section */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <Disclosure.Button className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none">
                      <GiTireIronCross size={24} />
                    </Disclosure.Button>
                    <Link to="/">
                      <img src={logo_wbg} alt="Logo" className="h-20" />
                    </Link>
                    <div className="flex items-center gap-4">
                      <Link to="/orders" className="text-gray-700">
                        <IoPersonOutline size={24} />
                      </Link>
                      <Link to="/cart" className="text-gray-700 relative">
                        <BsCart2 size={24} />
                        {cart.length > 0 && (
                          <span className="absolute -top-2 -right-2 text-xs text-white bg-red-500 rounded-full px-1">
                            {cart.length}
                          </span>
                        )}
                      </Link>
                    </div>
                  </div>

                  {/* Mobile Navigation Links */}
                  <ul className="flex flex-col p-4">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className="block text-gray-700 hover:text-blue-500 py-2"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {/* Social Media Links */}
                  <div className="border-t p-4">
                    {/* <button
                      className="w-full text-left text-gray-700 hover:text-blue-500 py-2"
                      onClick={handleLogout}
                    >
                      Logout
                    </button> */}
                    <div className="flex items-center justify-center gap-4 mt-4">
                      <a
                        href="https://www.facebook.com/people/Tasty-Ratlam/61569354040475/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-blue-500"
                      >
                        <FaFacebook size={24} />
                      </a>
                      <a
                        href="https://www.youtube.com/@TastyRatlam"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-blue-500"
                      >
                        <FaYoutube size={24} />
                      </a>
                      <a
                        href="https://www.instagram.com/tastyratlam/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-blue-500"
                      >
                        <FaInstagram size={24} />
                      </a>
                    </div>
                  </div>
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        </div>

        {/* Desktop Logo */}
        <div className="flex items-center">
          <Link to="/">
            <img src={logo_wbg} alt="Logo" className="h-20 md:h-18" />
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center justify-center flex-1 mx-4">
          <ul className="flex flex-row items-center gap-6">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className="text-gray-700 hover:text-blue-500"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Cart & Profile Icons */}
        <div className="flex items-center gap-4">
          <Link to="/orders" className="text-gray-700">
            <IoPersonOutline size={24} />
          </Link>
          <Link to="/cart" className="text-gray-700 relative">
            <BsCart2 size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 text-xs text-white bg-red-500 rounded-full px-1">
                {cart.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
