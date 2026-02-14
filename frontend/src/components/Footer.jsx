import logo from "../assets/navbar/LogoIcon.png";
import {
  FaYoutube,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="bg-[#F2EFEE]">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-row xl:flex-row items-center justify-between text-sm gap-4 xl:gap-0">
        {/* Left section: Company logo and brand name, links to homepage */}
        <Link to="/">
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="Vikram Design Studio Logo"
              className="h-10 w-auto"
            />
            <span
              className="text-gray-700"
              style={{ fontFamily: "Humanist521BT" }}
            >
              Vikram Design Studio
            </span>
          </div>
        </Link>

        {/* Center section: Social media icons for connecting with VDS */}
        <div className="flex space-x-5 text-[#af2b1e] text-lg">
          <a
            href="https://www.youtube.com/@vikramdesignstudio4300/featured"
            target="_blank"
          >
            <FaYoutube />
          </a>
          <a
            href="https://www.facebook.com/VikramDesignStudioOfficial/"
            target="_blank"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.instagram.com/vikramdesignstudio/"
            target="_blank"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.linkedin.com/company/74880921/admin/dashboard/"
            target="_blank"
          >
            <FaLinkedinIn />
          </a>
        </div>

        {/* Right section: Copyright + legal links */}
        <div className="text-gray-500 text-xs hidden xl:flex flex-col items-end gap-1">
          <span>
            Vikram Design Studio © {currentYear}. All rights reserved.
          </span>

          <Link
            to="/terms-and-conditions"
            className="hover:text-gray-700 transition"
          >
            Terms & Conditions
          </Link>
          <Link to="/privacy-policy" className="hover:text-gray-700 transition">
            Privacy Policy
          </Link>
        </div>
      </div>
      <div className="text-gray-500 text-xs xl:hidden flex items-end justify-between gap-1 max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col items-start gap-2">
          <span>Vikram Design Studio © {currentYear}.</span>
          <span>All rights reserved.</span>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Link
            to="/terms-and-conditions"
            className="hover:text-gray-700 transition text-end"
          >
            Terms & Conditions
          </Link>
          <Link
            to="/privacy-policy"
            className="hover:text-gray-700 transition text-end"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
