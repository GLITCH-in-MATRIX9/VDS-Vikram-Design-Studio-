import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import aboutApi from "../../services/aboutapi";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
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

const AboutHeading = () => {
  const [hero, setHero] = useState(null);

  /* ---------------- FETCH HERO DATA ---------------- */
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await aboutApi.getAboutPage();
        setHero(data?.hero || null);
      } catch (err) {
        console.error("Failed to load About hero:", err);
      }
    };

    fetchAbout();
  }, []);

  if (!hero) return null;

  return (
    <section className="bg-[#f2efee] px-4 md:px-8 xl:px-20 py-8 md:py-12 xl:py-20">
      {/* MAIN TITLE */}
      <div className="mx-auto">
        <motion.h1
          className="font-sora font-semibold text-[40px] md:text-[56px] xl:text-[72px]
          leading-[48px] md:leading-[64px] xl:leading-[80px]
          tracking-[-0.01em] text-[#3E3C3C] mb-6 xl:mb-16 uppercase"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          {hero.title || "ABOUT"}
        </motion.h1>
      </div>

      <motion.div
        className="mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* LEFT CONTENT */}
        <motion.div className="xl:col-span-2">
          {(hero.subtitle || hero.subtitleLine2) && (
            <motion.h2
              className="font-sora hidden xl:block text-xl font-semibold text-[#6D6D6D] mb-8 leading-snug"
              variants={itemVariants}
            >
              {hero.subtitle}
              {hero.subtitleLine2 && (
                <>
                  <br />
                  {hero.subtitleLine2}
                </>
              )}
            </motion.h2>
          )}

          {/* PARAGRAPHS */}
          <div
            className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8
            font-inter text-[#474545] leading-[1.4em]
            text-xs md:text-sm xl:text-base"
          >
            {[0, 1].map((col) => (
              <motion.div
                key={col}
                className="space-y-3 sm:space-y-4"
                variants={containerVariants}
              >
                {(hero.paragraphs || [])
                  .filter((_, i) => i % 2 === col)
                  .map((p) => (
                    <motion.p key={p.id} variants={itemVariants}>
                      {p.text}
                    </motion.p>
                  ))}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT IMAGE */}
        {hero.image && (
          <motion.div
            className="hidden xl:block w-full h-full xl:ml-2"
            variants={itemVariants}
          >
            <img
              src={hero.image}
              alt="About Hero"
              className="w-full h-full object-cover rounded-md"
              loading="lazy"
            />
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default AboutHeading;
