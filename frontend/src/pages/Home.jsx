import { motion, useSpring, useScroll, useTransform, useVelocity } from "framer-motion";
import ProjectCard from "../components/ProjectCard";
import projects from "../Data/projects.json";

const Home = () => {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  const springConfig = {
    stiffness: 100,
    damping: 50,
  }

  // Smooth scaling spring
  const targetZ = useTransform(scrollVelocity, [-1500, 0, 1500], [-150, 0, -150], { clamp: false });
  const z = useSpring(targetZ, springConfig);
  
  // Keep the origin of perspective change in the center of the screen dynamically
  const perspectiveOrigin = useTransform(scrollY, y => `50% ${y + window.innerHeight / 2}px`);

  

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