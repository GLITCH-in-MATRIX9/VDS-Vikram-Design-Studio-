import React, { useRef, useState } from "react";
import { FiArrowRight, FiArrowLeft, FiX, FiMapPin } from "react-icons/fi";

const HorizontalScrollComponent = ({ onClose }) => {
  const scrollContainerRef = useRef(null);
  const scrollByAmount = 600;

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

  const handleNavigateToProjects = () => {
    window.location.href = "/projects";
  };

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({
      left: -scrollByAmount,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({
      left: scrollByAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full font-inter min-h-[520px] overflow-hidden">

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

      {/* Main scrollable area: contains project info, image, and description. Supports drag-to-scroll. */}
      <div
        ref={scrollContainerRef}
        className={`flex overflow-x-auto h-full px-4 sm:px-6 md:px-[60px] py-6 sm:py-[30px] box-border scroll-smooth hide-scrollbar ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        onMouseDown={onDragStart}
        onMouseMove={onDragMove}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={onDragStart}
        onTouchMove={onDragMove}
        onTouchEnd={onDragEnd}
        onTouchCancel={onDragEnd}
      >

        {/* Project details: shows type, name, location, year, and team info */}
        <div className="min-w-[180px] sm:min-w-[200px] pl-3 sm:pl-5 flex flex-col justify-center font-medium text-right items-end">
          <div className="flex flex-col gap-2 text-xs sm:text-sm">
            <div className="text-gray-500 font-semibold">RESIDENTIAL</div>
            <h1 className="font-bold text-xl sm:text-2xl m-0">Shanti Villa</h1>
            <div className="text-gray-500 flex flex-col gap-1">
              <p className="flex items-center justify-end gap-1">
                <FiMapPin />
                <span>Dimapur, Nagaland</span>
              </p>
              <p>2015</p>
            </div>
          </div>
          <div className="mt-4 sm:mt-6 flex flex-col gap-3 text-xs text-gray-700">
            <div>
              <div className="text-gray-500 font-semibold">CLIENT</div>
              <div>CLIENT NAME, CLIENT NAME</div>
            </div>
            <div>
              <div className="text-gray-500 font-semibold mt-2">PROJECT TEAM</div>
              <div>MANAGER, ARCHITECT, TEAM</div>
            </div>
            <div>
              <div className="text-gray-500 font-semibold mt-2">COLLABORATORS</div>
              <div>COLLABORATOR NAME</div>
            </div>
            <div>
              <div className="text-gray-500 font-semibold mt-2">STATUS</div>
              <div>COMPLETED</div>
            </div>
          </div>
        </div>

        {/* Main project image: large and prominent for visual impact */}
        <div className="w-[300px] sm:w-[500px] md:w-[800px] h-[200px] sm:h-[350px] md:h-[450px] ml-4 sm:ml-6 rounded-[16px] sm:rounded-[20px] overflow-hidden flex-shrink-0 flex justify-center items-center">
          <img
            src="https://picsum.dev/800/450"
            alt="Shanti Villa"
            className="h-full w-auto object-cover rounded-[16px] sm:rounded-[20px]"
          />
        </div>

        {/* Project description: summary or story about the project */}
        <div className="min-w-[250px] max-w-[90vw] sm:max-w-[400px] pl-4 sm:pl-[20px] text-xs sm:text-sm text-gray-700 leading-relaxed overflow-y-auto max-h-[200px] sm:max-h-[450px] mt-4 sm:mt-7 font-normal">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris suscipit ac amet vel sapien...
          </p>
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
