import React from "react";
import {
  FaYoutube,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import logo from "../../assets/navbar/LogoIcon.png";

const CareerFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700">
      {/* Logo and Newsletter */}
      <div className="px-6 md:px-12 xl:px-24 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
          <span className="text-md font-medium">Vikram Design Studio</span>
        </div>
        <div className="flex">
          <input
            type="email"
            placeholder="Enter your email to get the latest news..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-gray-500 text-white px-4 py-2 rounded-r-md hover:bg-gray-600 transition">
            SUBSCRIBE
          </button>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="px-6 md:px-12 xl:px-24 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        {/* Column One */}
        <div>
          <h4 className="font-semibold mb-2">Column One</h4>
          <ul className="space-y-1">
            <li>TWENTY ONE</li>
            <li>THIRTY TWO</li>
            <li>FOURTY THREE</li>
            <li>FIFTY FOUR</li>
          </ul>
        </div>

        {/* Column Two */}
        <div>
          <h4 className="font-semibold mb-2">Column Two</h4>
          <ul className="space-y-1">
            <li>SIXTY FIVE</li>
            <li>SEVENTY SIX</li>
            <li>EIGHTY SEVEN</li>
            <li>NINETY EIGHT</li>
          </ul>
        </div>

        {/* Column Three */}
        <div>
          <h4 className="font-semibold mb-2">Column Three</h4>
          <ul className="space-y-1">
            <li>ONE TWO</li>
            <li>THREE FOUR</li>
            <li>FIVE SIX</li>
            <li>SEVEN EIGHT</li>
          </ul>
        </div>

        {/* Social Icons */}
        <div>
          <h4 className="font-semibold mb-2">Join Us</h4>
          <div className="flex space-x-4 mt-2">
            <FaYoutube className="hover:text-red-600 cursor-pointer" />
            <FaFacebookF className="hover:text-blue-600 cursor-pointer" />
            <FaTwitter className="hover:text-sky-500 cursor-pointer" />
            <FaInstagram className="hover:text-pink-500 cursor-pointer" />
            <FaLinkedinIn className="hover:text-blue-700 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="px-6 md:px-12 xl:px-24 py-6 border-t border-gray-200 text-sm flex flex-col md:flex-row justify-between items-center">
        <p className="mb-4 md:mb-0">CompanyName © 202X. All rights reserved.</p>
        <div className="flex space-x-4">
          <span>ELEVEN</span>
          <span>TWELVE</span>
          <span>THIRTEEN</span>
        </div>
      </div>
    </footer>
  );
};

export default CareerFooter;
