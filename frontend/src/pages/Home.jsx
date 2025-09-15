import { motion, useSpring, useTransform, useVelocity, useMotionValue } from "framer-motion";
import { useLenis, ReactLenis } from "lenis/react"; // Smooth scroll library
import ProjectCard from "../components/ProjectCard";
import projects from "../Data/projects.json";

const lenisOptions = {
    lerp: 0.1,
    duration: 1.2,
    smoothTouch: true,
    smoothWheel: true,
  };

const Home = () => {
  const scrollY = useMotionValue(0);

  // Using Lenis scroll event to set scrollY
  useLenis(({ scroll }) => {
    scrollY.set(scroll);
  });

  const scrollVelocity = useVelocity(scrollY);
  const springConfig = {
    stiffness: 100,
    damping: 50,
  }

  // Mapping scrollVelocity to z perspective
  const targetZ = useTransform(scrollVelocity, [-1500, 0, 1500], [-150, 0, -150], { clamp: false });
  const z = useSpring(targetZ, springConfig);
  
  // Keep the origin of perspective change in the center of the screen dynamically
  const perspectiveOrigin = useTransform(scrollY, y => `50% ${y + window.innerHeight / 2}px`);

  

  return (
    <ReactLenis root options={lenisOptions}>
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
    </ReactLenis>
  );
};


export default Home; 