import { motion, useSpring, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import ProjectCard from "../components/ProjectCard";
import projects from "../Data/projects.json";

const Home = () => {
  const {scrollY} = useScroll();
  const [isScrolling, setIsScrolling] = useState(false);
  const timeoutRef = useRef(null);

  const springConfig = {
    stiffness: 100,
    damping: 50,
  }

  // Smooth scaling spring
  const z = useSpring(0, springConfig);
  
  // Keep the origin of perspective change in the center of the screen dynamically
  const perspectiveOrigin = useTransform(scrollY, y => `50% ${y + window.innerHeight / 2}px`);

  useEffect(() => {
    z.set(isScrolling ? -250 : 0);
  }, [isScrolling, z]);

  useMotionValueEvent(scrollY, "change", () => {
    setIsScrolling(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  });

  return (
    <motion.div style={{perspective: "1200px", perspectiveOrigin}} className="bg-[#faf6f3] flex flex-col items-center py-6">
      <motion.div style={{z}} className="w-full flex flex-col items-center gap-8">
        {projects.map((project) => (
          <div
            key={project._id}
            className="w-full flex justify-center overflow-hidden"
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};


export default Home; 