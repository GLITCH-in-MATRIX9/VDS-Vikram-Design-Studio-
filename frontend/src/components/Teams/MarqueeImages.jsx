import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import teamApi from "../../services/teamapi";

const MarqueeImages = () => {
  const [width, setWidth] = useState(0);
  const [images, setImages] = useState([]);
  const marqueeRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Measure width after images render and on resize
  useEffect(() => {
    let rafId = 0;
    const measure = () => {
      if (marqueeRef.current) {
        const singleSetWidth = marqueeRef.current.scrollWidth / 2;
        setWidth(singleSetWidth);
        setIsReady(singleSetWidth > 0);
      }
    };

    // Measure after next paint to ensure images have loaded
    rafId = requestAnimationFrame(() => setTimeout(measure, 50));

    const onResize = () => {
      // small debounce
      setTimeout(measure, 100);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, [images]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await teamApi.getTeamPage();
        setImages((data.marquee_images || []).map((m) => m.img_src));
      } catch (err) {
        console.error("Failed to load marquee images:", err);
      }
    };
    load();
  }, []);

  // compute duration proportional to width for consistent speed
  const baseDuration = 20; // fallback
  const duration =
    width > 0 ? Math.max(12, Math.round(width / 100)) : baseDuration;

  const marqueeVariants = {
    animate: {
      x: [0, -width],
      transition: {
        x: {
          repeat: Infinity,
          duration,
          ease: "linear",
        },
      },
    },
  };

  const reverseMarqueeVariants = {
    animate: {
      x: [-width, 0],
      transition: {
        x: {
          repeat: Infinity,
          duration,
          ease: "linear",
        },
      },
    },
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const allImages = [...images, ...images];

  return (
    <div className="flex flex-col gap-8 overflow-hidden bg-[#f2efee] pb-15 md:pb-20">
      {/* Row 1 - Left to Right */}
      <motion.div
        className="relative overflow-hidden whitespace-nowrap"
        variants={fadeInVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <motion.div
          ref={marqueeRef}
          className="inline-flex gap-6"
          variants={marqueeVariants}
          animate={isReady ? "animate" : undefined}
        >
          {allImages.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Marquee Image ${idx + 1}`}
              className="w-[340px] h-[280px] object-cover rounded-md flex-shrink-0"
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Row 2 - Right to Left */}
      <motion.div
        className="relative overflow-hidden whitespace-nowrap"
        variants={fadeInVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <motion.div
          className="inline-flex gap-6"
          variants={reverseMarqueeVariants}
          animate={isReady ? "animate" : undefined}
        >
          {allImages.map((src, idx) => (
            <img
              key={idx + 100}
              src={src}
              alt={`Marquee Image ${idx + 4}`}
              className="w-[340px] h-[280px] object-cover rounded-md flex-shrink-0"
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MarqueeImages;
