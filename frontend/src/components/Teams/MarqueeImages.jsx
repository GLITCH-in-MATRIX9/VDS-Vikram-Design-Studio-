import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const images = [
  'https://res.cloudinary.com/ddrsuvea0/image/upload/v1758057665/yqbxzbkijtuvtde5nilu.jpg',
  'https://res.cloudinary.com/ddrsuvea0/image/upload/v1758057651/xadw3lwnfahqwjxpakbf.jpg',
  'https://res.cloudinary.com/ddrsuvea0/image/upload/v1758057650/c2l4o8vfowaghj1bfy4n.jpg',
  'https://res.cloudinary.com/ddrsuvea0/image/upload/v1758057646/cqakxcxvhrabwwg5hylr.jpg'
];

const MarqueeImages = () => {
  const [width, setWidth] = useState(0);
  const marqueeRef = useRef(null);
  
  useEffect(() => {
    
    if (marqueeRef.current) {
     
      const singleSetWidth = marqueeRef.current.scrollWidth / 2;
      setWidth(singleSetWidth);
    }
  }, [marqueeRef]);

  
  const marqueeVariants = {
    animate: {
      x: [0, -width],
      transition: {
        x: {
          repeat: Infinity,
          duration: 20, 
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
          duration: 20, 
          ease: "linear",
        },
      },
    },
  };

  
  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

 
  const allImages = [...images, ...images]; 

  return (
    <div className="flex flex-col gap-8 overflow-hidden bg-[#f7f6f4]">
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
          animate="animate"
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
          animate="animate"
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