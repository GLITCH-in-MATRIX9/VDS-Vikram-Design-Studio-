import React from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Heading = () => {
  return (
    <motion.div
      className="grid grid-cols-1 xl:grid-cols-3 gap-20 text-[#474545] px-4 md:px-8 xl:px-20 py-8 md:py-12 xl:py-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Left Content */}
      <div className="xl:col-span-2 space-y-6">
        {/* Heading */}
        <motion.h1
          className="font-sora text-[#3E3C3C] font-semibold text-[40px] md:text-[56px] xl:text-[72px] leading-[48px] md:leading-[64px] xl:leading-[80px] tracking-[-0.01em] uppercase"
          variants={itemVariants}
        >
          TEAM
        </motion.h1>

        {/* Paragraphs */}
        <motion.p
          className="font-inter font-normal text-xs md:text-sm xl:text-base leading-[1.4em] tracking-[-0.01em]"
          variants={itemVariants}
        >
          Vikram Design Studio is led by a multidisciplinary team of architects,
          designers, visualizers, and technical experts working across diverse
          project scales. With our roots in Guwahati and a growing studio in
          Kolkata, we function as a collaborative, multi-office practice grounded in
          shared values and a design-first approach.
        </motion.p>
        <motion.p
          className="font-inter font-normal text-xs md:text-sm xl:text-base leading-[1.4em] tracking-[-0.01em]"
          variants={itemVariants}
        >
          While Guwahati remains our operational core, major design decisions
          are currently driven from our Kolkata studio, which will expand into a
          larger space next year. This dual presence helps us stay regionally
          rooted while scaling outwardly.
        </motion.p>
        <motion.p
          className="font-inter font-normal text-xs md:text-sm xl:text-base leading-[1.4em] tracking-[-0.01em]"
          variants={itemVariants}
        >
          Our studio values clarity, collaboration, and curiosity. We believe
          good design emerges from open dialogue, contextual awareness, and care
          for detail. Every member of our team contributes to a collective
          pursuit of quality—across architecture, interiors, landscape, and
          beyond.
        </motion.p>
      </div>

      {/* Right Content */}
      <div className="flex items-end justify-end text-right">
        <motion.p
          className="font-sora font-semibold text-[20px] leading-[28px] tracking-[0] text-[#7E797A]"
          variants={itemVariants}
        >
          As we grow across geographies, we remain committed to designing with
          humility, precision, and purpose.
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Heading;
