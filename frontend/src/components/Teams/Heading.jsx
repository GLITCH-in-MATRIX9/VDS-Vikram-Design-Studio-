import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import teamApi from "../../services/teamapi";

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
  const [heading, setHeading] = useState({
    title: "",
    subtitle: "",
    paragraphs: [],
    image: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await teamApi.getTeamPage();
        setHeading(data.heading || { paragraphs: [] });
      } catch (err) {
        console.error("Failed to load heading:", err);
      }
    };
    load();
  }, []);

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
          {heading.title || ""}
        </motion.h1>

        {/* Paragraphs from backend */}
        {Array.isArray(heading.paragraphs) &&
          heading.paragraphs.map((p, idx) => (
            <motion.p
              key={p.id || idx}
              className="font-inter font-normal text-xs md:text-sm xl:text-base leading-[1.4em] tracking-[-0.01em]"
              variants={itemVariants}
            >
              {p.text}
            </motion.p>
          ))}
      </div>

      {/* Right Content: subtitle */}
      <div className="flex items-end justify-end text-right">
        <motion.p
          className="font-sora font-semibold text-[20px] leading-[28px] tracking-[0] text-[#7E797A]"
          variants={itemVariants}
        >
          {heading.subtitle || ""}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Heading;
