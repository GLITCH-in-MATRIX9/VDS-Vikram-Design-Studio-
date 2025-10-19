import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import leftArrowImg from "../../assets/Icons/ArrowLeft.png";
import rightArrowImg from "../../assets/Icons/ArrowRight.png";

const AboutSection = ({ data }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollRef = useRef(null);
  const scrollAmount = 416;

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    // Add 'dragging' class for cursor change (optional styling)
    scrollRef.current.classList.add("active-dragging");
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      // Stop dragging if mouse leaves while dragging
      setIsDragging(false);
      if (scrollRef.current) {
        scrollRef.current.classList.remove("active-dragging");
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollRef.current) {
      // Remove 'dragging' class
      scrollRef.current.classList.remove("active-dragging");
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault(); // Prevent text selection/default drag behavior
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier (adjust as needed)
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="px-4 md:px-8 xl:px-20 py-12 md:py-20 bg-[#F2EFEE] ">
      <div className="flex flex-col gap-12 max-w-screen-xl mx-auto">
        {/* Big heading */}
        <motion.h1
          className="font-sora font-semibold text-[#3E3C3C]
            text-[28px] md:text-[40px]
            leading-tight tracking-[-0.01em] uppercase"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          {data.heading}
        </motion.h1>

        {/* Introductory paragraphs */}
        {data.paragraphs && (
          <motion.div
            className="font-inter leading-[1.4em] max-w-4xl space-y-4 sm:space-y-6 
            text-xs md:text-sm xl:text-base text-[#474545]"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {data.paragraphs.map((para) => (
              <motion.p key={para.id} variants={itemVariants}>
                {para.text}
              </motion.p>
            ))}
          </motion.div>
        )}

        {/* Horizontally scrollable cards */}
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          viewport={{ once: true, amount: 0.1 }}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          {/* Control Buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full p-2"
          >
            <img src={leftArrowImg} alt="" className="mix-blend-difference" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full p-2"
          >
            <img src={rightArrowImg} alt="" />
          </button>

          {/* Horizontal Scroll component */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 sm:gap-6 py-4 scroll-smooth no-scrollbar items-center"
          >
            {data.carousel_cards.map((card) => (
              <motion.div
                key={card.id}
                className="flex flex-col gap-4 flex-shrink-0 "
                variants={itemVariants}
              >
                {card.img_src ? (
                  <>
                    <img
                      src={card.img_src}
                      alt={`${card.project_name} image`}
                      className="w-[250px] xl:w-[400px] h-[140px] xl:h-[225px] rounded-2xl object-cover object-center grid place-content-center bg-[#D1D1D1] text-xs"
                      loading="lazy"
                    />
                    <div>
                      <p className="text-[6px] md:text-[8px] leading-[1em] text-[#6D6D6D] uppercase mb-1 ">
                        {card.project_name} - {card.project_location}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className=" mb-6">
                    <p className="text-[#6D6D6D] leading-[140%] w-2xs md:w-[400px] md:leading-relaxed whitespace-pre-wrap text-xs md:text-sm xl:text-base ">
                      {card.text}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
