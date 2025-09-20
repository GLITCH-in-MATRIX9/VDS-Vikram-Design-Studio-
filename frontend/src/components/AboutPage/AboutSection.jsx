import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { getImageUrl } from "../../utils/assetHelper";

const AboutSection = ({data}) => {
  const scrollRef = useRef(null);
  const scrollAmount = 416;
  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
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
        <motion.div
          className="font-inter leading-[1.4em] max-w-4xl space-y-4 sm:space-y-6 
            text-xs md:text-sm xl:text-base text-[#454545]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {data.paragraphs.map((para) => (
            <motion.p 
              key={para.id}
              variants={itemVariants}
            >
              {para.text}
            </motion.p>
          ))}
        </motion.div>

        {/* Horizontally scrollable cards */}
        <motion.div 
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Control Buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#f2efee] shadow-md rounded-full p-2"
          >
            ←
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#f2efee] shadow-md rounded-full p-2"
          >
            →
          </button>
          
          {/* Horizontal Scroll component */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 sm:gap-6 py-4 scroll-smooth no-scrollbar"
          >
            {data.carousel_cards.map(card => (
              <motion.div
                key={card.id}
                className="flex flex-col gap-4 w-[250px] xl:w-[400px] flex-shrink-0"
                variants={itemVariants}
              >
                <img
                  src={getImageUrl(card.img_src)}
                  alt={`${card.project_name} image`}
                  className="w-full h-[140px] xl:h-[225px] rounded-2xl object-cover object-center grid place-content-center bg-[#D1D1D1] text-xs"
                  loading="lazy"
                />
                <div>
                  <p className="text-[6px] md:text-[8px] leading-[1em] text-[#6D6D6D] uppercase mb-1">{card.project_name} - {card.project_location}</p>
                  <p className="text-[6px] md:text-[8px] leading-[1em]  text-[#6D6D6D] uppercase">
                    {card.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;