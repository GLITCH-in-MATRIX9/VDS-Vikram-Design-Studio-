import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const Architecture = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
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
    <section className="px-4 sm:px-6 lg:px-20 py-10 sm:py-16 bg-[#f3efee] text-[#3E3C3C]">
      <div className="max-w-screen-xl mx-auto">
        {/* Big heading */}
        <motion.h1
          className="font-sora font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-[40px] leading-tight tracking-[-0.01em] mb-6 sm:mb-8 text-left"
          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600 }}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          ARCHITECTURE
        </motion.h1>

        {/* Introductory paragraphs */}
        <motion.div
          className="max-w-4xl space-y-4 sm:space-y-6 mb-10 sm:mb-16 text-sm sm:text-base"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            lineHeight: '140%',
            letterSpacing: '0',
          }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.p variants={itemVariants}>
            At VDS, architecture is an evolving dialogue—between people and place, ideas and
            constraints, light and material. Our work spans public institutions, cultural spaces,
            hospitality, and private residences—each shaped with a sensitivity to context and a
            commitment to design that endures.
          </motion.p>
          <motion.p variants={itemVariants}>
            Working in the diverse and often complex ecosystem of the northeast, we engage with
            everything from high-end villas to government projects. Some require navigating
            bureaucracy, cost-conscious detailing, or low-maintenance material strategies. Others
            demand immersive environments, refined finishes, and bespoke spatial experiences. What
            binds them all is our belief in clarity over complexity, expression without excess, and a
            design language that is bold, sensitive, and lighting-centric.
          </motion.p>
          <motion.p variants={itemVariants}>
            Over time, we’ve earned the trust of stakeholders and clients—not through spectacle, but
            through thoughtfulness. Whether it’s a cultural corridor or a compact office, we design
            spaces that perform with purpose and feel quietly powerful.
          </motion.p>
        </motion.div>

        {/* Horizontally scrollable cards */}
        <motion.div 
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <button
            onClick={() => scroll('left')}
            className="hidden sm:block absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#f3efee] shadow-md rounded-full p-2"
          >
            ←
          </button>
          <button
            onClick={() => scroll('right')}
            className="hidden sm:block absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#f3efee] shadow-md rounded-full p-2"
          >
            →
          </button>

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
                  src={`https://picsum.photos/seed/${item}/448/240`}
                  alt="Architecture"
                  className="w-full h-[140px] sm:h-[180px] md:h-[210px] lg:h-[240px] object-cover rounded-lg mb-4"
                />
                <div className="text-xs text-gray-400 uppercase mb-1">Category</div>
                <h3 className="font-bold text-base sm:text-lg mb-2">Title</h3>
                <p className="text-xs sm:text-sm text-gray-500">
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

export default Architecture;