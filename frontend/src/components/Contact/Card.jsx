import React, { useState } from "react";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  }, // Card slides up gently when it appears
};

const Card = ({ data }) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  return (
    <motion.article
      className="max-w-[1920px] flex justify-between flex-col md:flex-row gap-4 md:gap-8 px-3 md:px-6 xl:px-12 py-4 md:py-8 xl:py-12 border-[0.5px] border-[#BEBBBC] text-[#3E3C3C] md:border-1 rounded-lg md:rounded-2xl"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      {/* Left side: City, phone, address - all the info you need to reach us! */}
      <div className="card-text flex gap-12 md:gap-8 w-full flex-col justify-between">
        <h2 className="font-sora leading-[1.4] font-semibold uppercase text-base md:text-[28px] xl:text-[40px]">
          {data.city}
        </h2>
        <div className="details flex w-full md:flex-col md:gap-4 xl:flex-row justify-between">
          <div className="phone md:min-w-fit">
            <h3 className="font-sora leading-[1.4] font-semibold text-xs md:text-base xl:text-xl">
              Call us:
            </h3>
            {/* List of phone numbers for this location */}
            {data.phone_numbers.map((number, id) => (
              <p
                className="text-xs leading-[1.4] md:text-sm xl:text-base"
                key={id}
              >
                {number}
              </p>
            ))}
          </div>
          <div className="address min-w-fit">
            <h3 className="font-sora leading-[1.4] font-semibold text-xs md:text-base xl:text-xl">
              Address:
            </h3>
            {/* Physical address for this studio location */}
            <p className="text-xs leading-[1.4] md:text-sm xl:text-base w-[160px] md:w-[224px] ">
              {data.address}
            </p>
          </div>
        </div>
      </div>
      {/* Right side: Embedded Google Map so you can find us easily! */}
      <div className="relative md:max-w-[345px] xl:max-w-[420px] w-[100%] h-[162px] md:h-[250px] xl:h-[304px] rounded-lg med:rounded-2xl overflow-hidden">
        {/* skeleton behind the iframe until it loads */}
        {!iframeLoaded && (
          <div className="absolute inset-0 bg-gray-300 rounded animate-pulse" />
        )}
        <iframe
          title={`map-${data.city}`}
          className={`absolute grayscale inset-0 w-full h-full border-0 ${
            iframeLoaded ? "relative z-10" : "relative z-20 opacity-0"
          }`}
          src={data.google_maps_iframe_src}
          loading="lazy"
          onLoad={() => setIframeLoaded(true)}
        ></iframe>
      </div>
    </motion.article>
  );
};

export default Card;
