import React, { useRef, useState, useEffect } from "react";
import { FiMapPin } from "react-icons/fi";
import { motion } from "framer-motion";
import ProjectSectionDisplay from "./ProjectSectionDisplay";
import LeftArrowIcon from "../assets/Icons/LeftArrowIcon.svg";
import RightArrowIcon from "../assets/Icons/RightArrowIcon.svg";
import CloseIcon from "../assets/Icons/CloseIcon.svg";

const HorizontalScrollComponent = ({ onClose, project }) => {
  const [xOffset, setXOffset] = useState(0);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [maxScroll, setMaxScroll] = useState(0);
  const scrollAmount = 960;

  // State for managing framer-motion's transition property dynamically
  const [transition, setTransition] = useState({
    duration: 1.4,
    ease: [0.76, 0, 0.24, 1],
  });

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const calculateMaxScroll = () => {
      const max =
        container.clientWidth - content.scrollWidth < 0
          ? container.clientWidth - content.scrollWidth
          : 0;
      setMaxScroll(max);
    };

    calculateMaxScroll();
    const resizeObserver = new ResizeObserver(calculateMaxScroll);
    resizeObserver.observe(content);

    return () => resizeObserver.disconnect();
  }, [project]);

  const scrollLeft = () => {
    // Ensure the smooth transition is used for button clicks
    setTransition({ duration: 1.4, ease: [0.76, 0, 0.24, 1] });
    // Use Math.min to prevent scrolling past the beginning
    setXOffset((prev) => Math.min(prev + scrollAmount, 0));
  };

  const scrollRight = () => {
    // Ensure the smooth transition is used for button clicks
    setTransition({ duration: 1.4, ease: [0.76, 0, 0.24, 1] });
    setXOffset((prev) => Math.max(prev - scrollAmount, maxScroll));
  };

  return (
    <div className="relative w-full font-inter overflow-hidden">
      {/* Top left: Close button for exiting the gallery view */}
      <div className="absolute top-4 left-2 flex items-center gap-2 z-20 sm:top-5 sm:gap-3">
        <button
          onClick={onClose}
          aria-label="Close"
          className="rounded-full border border-[#7E797A] bg-[#F2EFEE33] w-8 h-8 sm:w-10 sm:h-10 cursor-pointer flex items-center justify-center backdrop-blur-sm"
        >
          <img src={CloseIcon} alt="Close" className="w-3" />
        </button>
      </div>

      {/* Left/right scroll buttons (only visible on desktop) for navigating through the gallery */}
      <button
        onClick={scrollLeft}
        className="absolute z-10 left-2 top-1/2 transform -translate-y-1/2 bg-[#2B262433] w-8 h-8 rounded-full shadow-md transition hidden xl:flex items-center justify-center"
      >
        <img src={LeftArrowIcon} alt="Scroll Left" className="w-4" />
      </button>

      <button
        onClick={scrollRight}
        className="absolute z-10 right-2 top-1/2 transform -translate-y-1/2 bg-[#2B262433] w-8 h-8 rounded-full shadow-md transition hidden xl:flex items-center justify-center"
      >
        <img src={RightArrowIcon} className="w-4" />
      </button>

      {/* Main scrollable area: now fills the available space with no fixed width */}
      <div
        ref={containerRef}
        className={`flex overflow-x-auto h-full box-border scroll-smooth hide-scrollbar`}
      >
        <motion.div
          ref={contentRef}
          // Animate the 'x' property based on our state
          animate={{ x: xOffset }}
          transition={transition}
          className="flex flex-nowrap h-full items-center"
        >
          {/* Project details desktop: a fixed-width container */}
          <div className="hidden xl:flex w-[240px] leading-[1.4] flex-col ml-12 pr-3 text-right items-end flex-shrink-0">
            <div className="flex flex-col gap-1 text-xs sm:text-sm">
              <div className="text-[#7E797A] font-medium text-xs uppercase">
                {project?.category || "RESIDENTIAL"}
              </div>
              <h1 className="text-[#3E3C3C] font-sora font-semibold text-xl m-0">
                {project?.title || project?.name || "Project Name"}
              </h1>
            </div>
            <div className="flex flex-col gap-1 text-[#474545] text-xs mt-4">
              <p className="flex items-center justify-end gap-1 ">
                <FiMapPin />
                <span>{project?.location || "Location"}</span>
              </p>
              <p>{project?.year || "Year"}</p>
            </div>
            <div className="mt-[46px] flex flex-col gap-6 text-[#474545] text-[10px] uppercase">
              <div>
                <div className="text-[#6E6A6B] mb-1">CLIENT</div>
                <div>{project?.client || "Client Name"}</div>
              </div>
              <div>
                <div className="text-[#6E6A6B] mb-1">PROJECT TEAM</div>
                <div>
                  {project?.projectLeaders + " | "}
                  {project?.project_team || project?.projectTeam || "Team Name"}
                </div>
              </div>
              <div>
                <div className="text-[#6E6A6B] mb-1">COLLABORATORS</div>
                <div>{project?.collaborators || "Collaborator Name"}</div>
              </div>
              <div>
                <div className="text-[#6E6A6B] mb-1">STATUS</div>
                <div>{project?.status || "Status"}</div>
              </div>
            </div>
          </div>

          {/* Project sections container */}
          <div className="flex-grow flex-shrink-0 flex items-center gap-6 md:gap-8 w-auto h-full">
            <ProjectSectionDisplay sections={project?.sections} />
          </div>
        </motion.div>
      </div>
      {/* Project details: tablet size and smaller */}
      <div className="grid grid-cols-2 py-3 leading-[1.4] xl:hidden px-2">
        <div className="project-type">
          <div className="text-[#7E797A] font-medium text-xs uppercase">
            {project?.category || "RESIDENTIAL"}
          </div>
          <h1 className="text=[#3E3C3C] font-sora font-semibold text-xl m-0">
            {project?.title || project?.name || "Project Name"}
          </h1>
        </div>
        <div className="location">
          <div className="flex flex-col items-end gap-1 text-[#474545] text-xs text-right">
            <p className="flex items-center justify-end gap-1">
              <FiMapPin />
              <span>{project?.location || "Location"}</span>
            </p>
            <p>{project?.year || "Year"}</p>
          </div>
        </div>
        <div className="status text-[#474545] text-[10px] uppercase leading-normal mt-4">
          <div className="text-[#6E6A6B]">STATUS</div>
          <div>{project?.status || "Status"}</div>
        </div>
      </div>

      {/* Hide scrollbar for a cleaner look on all browsers */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default HorizontalScrollComponent;
