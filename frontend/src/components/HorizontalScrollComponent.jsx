import React, { useRef, useState } from "react";
import { FiArrowRight, FiArrowLeft, FiX, FiMapPin } from "react-icons/fi";
import ProjectSectionDisplay from "./ProjectSectionDisplay";

const HorizontalScrollComponent = ({ onClose, project }) => {
  const scrollContainerRef = useRef(null);
  const scrollByAmount = 1060;

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  const onDragStart = (e) => {
    setIsDragging(true);
    setStartX(e.pageX || e.touches[0].pageX);
    setScrollLeftStart(scrollContainerRef.current.scrollLeft);
  };

  const onDragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX || e.touches[0].pageX;
    const walk = startX - x;
    scrollContainerRef.current.scrollLeft = scrollLeftStart + walk;
  };

  const onDragEnd = () => {
    setIsDragging(false);
  };

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({
      left: -scrollByAmount,
      behavior: "smooth"
    });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({
      left: scrollByAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full font-inter overflow-hidden">
      {/* Top left: Close button for exiting the gallery view */}
      <div className="absolute top-4 left-4 flex items-center gap-2 z-20 sm:top-5 sm:left-5 sm:gap-3">
        <button
          onClick={onClose}
          aria-label="Close"
          className="rounded-full border border-gray-400 w-9 h-9 sm:w-10 sm:h-10 bg-white cursor-pointer text-gray-500 flex items-center justify-center"
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Left/right scroll buttons (only visible on desktop) for navigating through the gallery */}
      <button
        onClick={scrollLeft}
        className="absolute z-10 left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-500 p-2 rounded-full shadow-md transition hidden md:flex"
      >
        <FiArrowLeft size={20} />
      </button>

      <button
        onClick={scrollRight}
        className="absolute z-10 right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-500 p-2 rounded-full shadow-md transition hidden md:flex"
      >
        <FiArrowRight size={20} />
      </button>

      {/* Main scrollable area: now fills the available space with no fixed width */}
      <div
        ref={scrollContainerRef}
        className={`flex overflow-x-auto h-full box-border scroll-smooth hide-scrollbar ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={onDragStart}
        onMouseMove={onDragMove}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={onDragStart}
        onTouchMove={onDragMove}
        onTouchEnd={onDragEnd}
        onTouchCancel={onDragEnd}
      >
        {/* Project details: a fixed-width container */}
        <div className="hidden md:flex min-w-[240px] leading-[1.4] flex-col justify-center font-medium text-right items-end flex-shrink-0">
          <div className="flex flex-col gap-2 text-xs sm:text-sm">
            <div className="text-[#7E797A] font-medium text-xs uppercase">{project?.category || "RESIDENTIAL"}</div>
            <h1 className="text-[#3E3C3C] font-sora font-semibold text-xl m-0">{project?.title || project?.name || "Project Name"}</h1>
            <div className="flex flex-col gap-1 text-[#474545] text-xs">
              <p className="flex items-center justify-end gap-1 ">
                <FiMapPin />
                <span>{project?.location || "Location"}</span>
              </p>
              <p>{project?.year || "Year"}</p>
            </div>
          </div>
          <div className="mt-12 flex flex-col gap-6 text-[#474545] text-[10px] uppercase">
            <div>
              <div className="text-[#6E6A6B] mb-1">CLIENT</div>
              <div>{project?.client || "Client Name"}</div>
            </div>
            <div>
              <div className="text-[#6E6A6B] mb-1">PROJECT TEAM</div>
              <div>{project?.project_team || project?.projectTeam || "Team Name"}</div>
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

        {/* Project sections container: this is the main part of the horizontal scroller */}
        <div className="flex-grow flex-shrink-0 flex items-center gap-6 md:gap-8 md:ml-4 w-auto h-full">
            <ProjectSectionDisplay sections={project?.sections} />
        </div>
        
      </div>
      {/* Project details: tablet size and smaller */}
      <div className="grid grid-cols-2 py-3 leading-[1.4] md:hidden">
        <div className="project-type">
            <div className="text-[#7E797A] font-medium text-xs uppercase grid">{project?.category || "RESIDENTIAL"}</div>
            <h1 className="text=[#3E3C3C] font-sora font-semibold text-xl m-0">{project?.title || project?.name || "Project Name"}</h1>
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