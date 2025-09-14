import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { FaYoutube, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

import logo from "../assets/navbar/LogoIcon.png";
import searchIcon from "../assets/Icons/Search.png";
import filterIcon from "../assets/Icons/Vector.png";
import hamburgerIcon from "../assets/navbar/HamburgerMenu.png";
import closeIcon from "../assets/navbar/Close.png";

import FilterSidebar from "./FilterSideBar";

// Filter options data (used for both desktop and mobile versions)
const filterOptions = {
    Education: ["Schools", "Training Institutions/Centres", "Research Centres", "Colleges & Universities"],
    Healthcare: ["Hospitals", "Medical Colleges", "Diagnostic Labs", "Clinics"],
    Civic: ["Auditoriums", "Town Halls", "Police Stations", "Public toilets & amenities"],
    Workspace: ["Government offices", "Corporate offices", "Research Centres"],
    Sports: ["Stadiums", "Sports complex", "Multipurpose sports halls"],
    Culture: ["Religious", "Memorials", "Cultural complex", "Museums"],
    Residential: ["Staff quarters", "Private Villas", "Housing", "Hostels", "Guest Houses"],
    Hospitality: ["Hotels", "Resorts", "Restaurants", "Tourism Lodges"],
    Retail: ["Showrooms", "Shopping complex", "Departmental stores", "Multiplexes"],
};

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const location = useLocation();
    const isHome = location.pathname === "/";

    const closeAllMenus = () => {
        setMenuOpen(false);
        setFilterOpen(false);
        setMobileFilterOpen(false);
    };

    return (
        <>
            {/* Main Navbar */}
            <nav className="w-full bg-[#f3efee] border-b border-[#e0dcd7] relative z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Left - Logo */}
                    <div className="flex items-center space-x-3">
                        <Link to="/" className="flex items-center space-x-3" onClick={closeAllMenus}>
                            <img src={logo} alt="Vikram Design Studio Logo" className="h-10 w-auto" />
                            <span className="text-gray-700 text-lg">Vikram Design Studio</span>
                        </Link>
                    </div>

                    {/* Center - Desktop menu */}
                    <div className="hidden md:flex flex-grow justify-center">
                        <ul className="flex gap-8 text-sm font-medium text-gray-700 tracking-wider">
                            <li><Link to="/about" onClick={closeAllMenus}>ABOUT</Link></li>
                            <li><Link to="/team" onClick={closeAllMenus}>TEAM</Link></li>
                            <li><Link to="/contact" onClick={closeAllMenus}>CONTACT</Link></li>
                        </ul>
                    </div>

                    {/* Right - Search / Filter / Hamburger */}
                    <div className="flex items-center gap-4">
                        {/* Desktop Icons (visible on md and up) */}
                        <div className={`hidden md:flex items-center gap-4 ${!isHome && 'invisible pointer-events-none'}`}>
                            <button
                                onClick={() => {
                                    setFilterOpen((prev) => !prev);
                                    setSelectedCategory(null);
                                    setMenuOpen(false);
                                }}
                                className="hover:text-[#af2b1e] transition"
                            >
                                <img src={filterIcon} alt="filter" className="h-4 w-4 object-contain" />
                            </button>
                            <div className="relative flex items-center">
                                <img src={searchIcon} alt="search" className="h-7 w-4 object-contain absolute left-2" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-8 pr-3 py-1 h-8 w-56 text-sm rounded-full border border-gray-300 outline-none focus:border-gray-500 transition"
                                />
                            </div>
                        </div>

                        {/* Mobile Icons (visible below md) */}
                        <div className={`md:hidden flex items-center gap-4 ${!isHome && 'invisible pointer-events-none'}`}>
                            <button onClick={() => {
                                setMobileFilterOpen((prev) => !prev);
                                setMenuOpen(false);
                            }}>
                                <img src={filterIcon} alt="filter" className="h-4 w-4 object-contain" />
                            </button>
                            <button onClick={() => setMenuOpen(true)}>
                                <img src={hamburgerIcon} alt="menu" className="h-8 w-8 object-contain" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Desktop Filter Categories Bar */}
            <AnimatePresence>
                {isHome && filterOpen && (
                    <motion.div
                        key="filters"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="w-full bg-[#f3efee] border-b border-[#e0dcd7] overflow-hidden z-40"
                    >
                        <div className="max-w-7xl mx-auto px-6 py-3 grid grid-cols-2 md:flex justify-evenly flex-wrap gap-2">
                            {Object.keys(filterOptions).map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                                    className={`px-4 py-2 rounded-md font-medium transition ${selectedCategory === category ? "bg-gray-700 text-white" : "text-gray-700 hover:bg-gray-200"} text-xs sm:text-sm`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Subcategories Bar */}
            <AnimatePresence>
                {isHome && selectedCategory && filterOpen && (
                    <motion.div
                        key="subfilters"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="w-full bg-[#f3efee] overflow-hidden z-30"
                    >
                        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-evenly flex-wrap gap-2 text-gray-600">
                            {filterOptions[selectedCategory].map((option, i) => (
                                <div key={i} className="px-3 py-1 text-xs rounded-md cursor-pointer hover:bg-gray-200 transition">
                                    {option}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Sliding Menu - MODIFIED FOR RIGHT SLIDE-IN */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: '0%' }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="fixed inset-0 z-[100] bg-[#f9f6f3] flex flex-col items-center pt-6"
                    >
                        <div className="absolute top-6 right-6">
                            <button onClick={() => closeAllMenus()}>
                                <img src={closeIcon} alt="close" className="h-6 w-6" />
                            </button>
                        </div>

                        <ul className="flex flex-col space-y-14 mt-52 text-[#af2b1e] font-semibold text-4xl text-center">
                            <li><Link to="/" onClick={closeAllMenus}>HOME</Link></li>
                            <li><Link to="/about" onClick={closeAllMenus}>ABOUT</Link></li>
                            <li><Link to="/team" onClick={closeAllMenus}>TEAM</Link></li>
                            <li><Link to="/careers" onClick={closeAllMenus}>CAREERS</Link></li>
                            <li><Link to="/contact" onClick={closeAllMenus}>CONTACT</Link></li>
                        </ul>

                        <div className="mt-auto mb-10 flex space-x-6 text-[#af2b1e] text-xl">
                            <a href="#"><FaYoutube /></a>
                            <a href="#"><FaFacebookF /></a>
                            <a href="#"><FaInstagram /></a>
                            <a href="#"><FaLinkedinIn /></a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Render the new FilterSidebar component for mobile only */}
            <FilterSidebar isOpen={mobileFilterOpen} onClose={() => setMobileFilterOpen(false)} />
        </>
    );
};

export default Navbar;