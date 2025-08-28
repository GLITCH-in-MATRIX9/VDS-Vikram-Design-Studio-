import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaYoutube, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import logo from '../assets/navbar/LogoIcon.png';
import hamburgerIcon from '../assets/navbar/HamburgerMenu.png';
import closeIcon from '../assets/navbar/Close.png';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <nav className="w-full bg-[#f9f6f3] border-b border-[#e0dcd7]">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative">


                <Link to="/"><div className="flex items-center space-x-3">
                    <img src={logo} alt="Vikram Design Studio Logo" className="h-10 w-auto" />
                    <span className="text-gray-700 text-lg" style={{ fontFamily: 'Humanist521BT' }}>
                        Vikram Design Studio
                    </span>
                </div>
                </Link>


                <ul
                    className={`
            hidden md:flex gap-8 text-sm font-medium text-gray-700 tracking-wider
            ${isLargeScreen ? 'absolute left-1/2 transform -translate-x-1/2' : ''}
          `}
                >
                    <li><Link to="/about">ABOUT</Link></li>
                    <li><Link to="/team">TEAM</Link></li>
                    <li><Link to="/careers">CAREERS</Link></li>
                    <li><Link to="/contact">CONTACT</Link></li>
                </ul>


                <div className="md:hidden">
                    <button onClick={() => setMenuOpen(true)}>
                        <img src={hamburgerIcon} alt="menu" className="h-8 w-8 object-contain" />
                    </button>
                </div>


                <div
                    className={`fixed inset-0 z-50 bg-[#f9f6f3] flex flex-col items-center pt-6 transition-all duration-300 ease-in-out
    ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}
  `}
                >

                    <div className="absolute top-6 right-6">
                        <button onClick={() => setMenuOpen(false)}>
                            <img src={closeIcon} alt="close" className="h-6 w-6" />
                        </button>
                    </div>


                    <ul className="flex flex-col space-y-8 mt-24 text-[#af2b1e] font-bold text-2xl text-center">
                        <li><Link to="/" onClick={() => setMenuOpen(false)}>HOME</Link></li>
                        <li><Link to="/about" onClick={() => setMenuOpen(false)}>ABOUT</Link></li>
                        <li><Link to="/team" onClick={() => setMenuOpen(false)}>TEAM</Link></li>
                        <li><Link to="/careers" onClick={() => setMenuOpen(false)}>CAREERS</Link></li>
                        <li><Link to="/contact" onClick={() => setMenuOpen(false)}>CONTACT</Link></li>
                    </ul>


                    <div className="mt-auto mb-10 flex space-x-6 text-[#af2b1e] text-xl">
                        <a href="#"><FaYoutube /></a>
                        <a href="#"><FaFacebookF /></a>
                        <a href="#"><FaInstagram /></a>
                        <a href="#"><FaLinkedinIn /></a>
                    </div>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;
