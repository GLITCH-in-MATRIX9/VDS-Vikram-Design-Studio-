import { motion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import projects from "../Data/projects.json";

const Home = () => {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let timeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150); // a bit longer delay for smoother return
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scaling spring
  const scaleSpring = useSpring(isScrolling ? 1.03 : 1, {
    stiffness: 120,   
    damping: 18,      
    mass: 0.7,       
  });

  return (
    <div className="bg-[#faf6f3] flex flex-col items-center py-6 space-y-6">
      {projects.map((project) => (
        <motion.div
          key={project._id}
          style={{ scale: scaleSpring }}
          className="w-full flex justify-center overflow-hidden"
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </div>
  );
};

export default Home;
