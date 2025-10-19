import { BrowserRouter, useLocation } from "react-router-dom";
import Routes from "./routes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/authContext";
import { FilterProvider } from "./context/filterContext";
import { SearchProvider } from "./context/searchContext";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "./components/LoadingScreen";
import SectionDivider from "./components/SectionDivider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <FilterProvider>
          <SearchProvider>
            <AppContent />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </SearchProvider>
        </FilterProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = location.pathname.startsWith("/admin");
  const isContact = location.pathname.startsWith("/contact");
  const isCareer = location.pathname.startsWith("/career");

  const showNavbar = !isAdmin;
  const showFooter = !isAdmin && !isCareer;

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence>
        {isLoading ? (
          // The key is essential for AnimatePresence
          <LoadingScreen
            key="loader"
            onAnimationComplete={handleLoadingComplete}
          />
        ) : (
          // This motion.div wraps your entire "page"
          <motion.div
            key="main-content"
            initial={{ y: "100vh" }} // Start off-screen at the bottom
            animate={{ y: "0vh" }} // Animate to its normal position (top of screen)
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }} // This is the slide-up animation
          >
            {showNavbar && <Navbar />}
            <SectionDivider />
            <div className="min-h-[80vh] bg-[#f2efee]">
              <Routes />
            </div>
            <SectionDivider />
            {showFooter && <Footer />}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
