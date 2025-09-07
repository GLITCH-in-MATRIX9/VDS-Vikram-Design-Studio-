import React, { useRef } from "react";
import { motion } from "framer-motion";

const Engineering = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Each card pops in one after another for a friendly intro
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }, // Cards gently float up as they appear
  };

  return (
    <section className="px-4 sm:px-6 lg:px-20 py-10 sm:py-16 bg-[#f3efee] text-[#3E3C3C]">
      <div className="max-w-screen-xl mx-auto">
        {/* Big title to introduce our engineering partners! */}
        <motion.h1
          className="font-sora font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-[40px] leading-tight tracking-[-0.01em] mb-6 sm:mb-8 text-left"
          style={{ fontFamily: "Sora, sans-serif", fontWeight: 600 }}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          ENGINEERING
        </motion.h1>

        {/* A little intro to set the mood for this section */}
        <motion.div
          className="max-w-4xl space-y-4 sm:space-y-6 mb-10 sm:mb-16 text-sm sm:text-base"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            lineHeight: "140%",
            letterSpacing: "0",
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p>
            Good design cannot exist without good engineering—and at VDS, both go hand in hand. We
            collaborate with structural, civil, and services engineers from early design stages to
            ensure ambition meets precision. Lighting integration is planned alongside structure and
            services—ensuring that fixtures, conduits, and light quality align with the architecture.
            From challenging sites to technical constraints, our engineering partners help us
            translate spatial ideas into systems that work seamlessly and sustainably.
          </p>
        </motion.div>

        {/* Here come the cards! You can scroll through them to meet our engineering collaborators. */}
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Tap these buttons to scroll left or right and explore more cards! */}
          <button
            onClick={() => scroll("left")}
            className="hidden sm:block absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#f3efee] shadow-md rounded-full p-2"
          >
            ←
          </button>
          <button
            onClick={() => scroll("right")}
            className="hidden sm:block absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#f3efee] shadow-md rounded-full p-2"
          >
            →
          </button>

          {/* Each card shows an engineering partner's photo and a short story about them */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 sm:gap-6 py-4 scroll-smooth no-scrollbar"
          >
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <motion.div
                key={item}
                className="w-[260px] sm:w-[340px] md:w-[400px] lg:w-[448px] h-[320px] sm:h-[370px] md:h-[400px] lg:h-[425px] bg-[#f3efee] border rounded-[16px] p-4 sm:p-8 flex-shrink-0 shadow-sm"
                variants={itemVariants}
              >
                <img
                  src={`https://picsum.photos/seed/engineering${item}/448/240`}
                  alt="Engineering"
                  className="w-full h-[140px] sm:h-[180px] md:h-[210px] lg:h-[240px] object-cover rounded-lg mb-4"
                />
                <div className="text-xs text-gray-400 uppercase mb-1">Category</div>
                <h3 className="font-bold text-base sm:text-lg mb-2">Title</h3>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    lineHeight: "140%",
                    letterSpacing: "0",
                  }}
                  className="text-xs sm:text-sm text-gray-500"
                >
                  Egestas elit dui scelerisque ut eu purus aliquam vitae habitasse.
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Engineering;