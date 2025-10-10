import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";
import ProjectImageGallery from "./ProjectImageGallery";
import HorizontalScrollComponent from "./HorizontalScrollComponent";

const ProjectCard = ({ project }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); 
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <motion.div
      layout
      className={`relative w-full overflow-hidden`}
      transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div
            key="collapsed"
            ref={cardRef}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="cursor-pointer"
            onClick={handleToggleExpand}
          >
            {/* Main grid container: 1 column on mobile, 3 columns on desktop for centering */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 justify-items-center items-center px-4 lg:px-0">
              
              {/* Left Column (Desktop Only) - Text Content, right-aligned */}
              <div className="hidden lg:flex flex-col items-end text-right w-full lg:pl-4 lg:pr-8">
                <p className="text-xs text-[#7E797A] uppercase">
                  {project?.category || "Residential"}
                </p>
                <h2 className="font-sora text-xl font-semibold text-[#3E3C3C] mt-1">
                  {project?.name || project?.title || "Project Name"}
                </h2>
                <div className="flex flex-col text-sm text-[#474545] mt-4">
                  <div className="flex items-center gap-2 text-xs">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span>{project?.location || "Location"}</span>
                  </div>
                  {/* <p className="mt-1">{project?.year || "2015"}</p> */}
                </div>
              </div>

              {/* Center Column (Desktop) / Main Column (Mobile) - Image Gallery */}
              <div className="order-1 lg:order-2 flex items-start w-full max-w-[400px] lg:max-w-[800px]">
                <ProjectImageGallery sections={project.sections} isZoomed={false} />
              </div>

              {/* Mobile-only Text Content - Centered below image */}
              <div className="lg:hidden max-w-[400px] lg:max-w-[800px] order-2 flex gap-1 flex-col w-full py-3">
                <p className="text-xs text-[#7E797A] uppercase">
                  {project?.category || "Residential"}
                </p>
                <h2 className="font-sora text-xl font-semibold text-[#3E3C3C]">
                  {project?.name || project?.title || "Project Name"}
                </h2>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full overflow-hidden"
          >
            <HorizontalScrollComponent onClose={handleToggleExpand} project={project} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectCard;