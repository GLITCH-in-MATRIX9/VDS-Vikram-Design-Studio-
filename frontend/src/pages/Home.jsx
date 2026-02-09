import { useState, useEffect } from "react";
import {
  motion,
  useSpring,
  useTransform,
  useVelocity,
  useMotionValue,
} from "framer-motion";
import { useLenis, ReactLenis } from "lenis/react"; // Smooth scroll library

import ProjectCard from "../components/ProjectCard";
import projectApi from "../services/projectApi";
import LoadingScreen from "../components/LoadingScreen";
import { useFilters } from "../context/filterContext";
import { useSearch } from "../context/searchContext";

const lenisOptions = {
  lerp: 0.1,
  duration: 1.2,
  smoothTouch: true,
  smoothWheel: true,
};

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { categoryContext, subCategoryContext } = useFilters();
  const { searchQuery } = useSearch();

  const scrollY = useMotionValue(0);

  // Using Lenis scroll event to set scrollY
  useLenis(({ scroll }) => {
    scrollY.set(scroll);
  });

  const scrollVelocity = useVelocity(scrollY);
  const springConfig = { stiffness: 100, damping: 50 };

  // Map scrollVelocity to z perspective
  const targetZ = useTransform(
    scrollVelocity,
    [-1500, 0, 1500],
    [-150, 0, -150],
    { clamp: true }
  );
  const z = useSpring(targetZ, springConfig);

  // Keep perspective origin in the center of the screen
  const perspectiveOrigin = useTransform(
    scrollY,
    (y) => `50% ${y + window.innerHeight / 2}px`
  );

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectApi.getProjects();

        // 🔽 Ensure projects follow admin-defined order
        const ordered = [...data].sort((a, b) => {
          // if you store numeric order
          if (typeof a.order === "number" && typeof b.order === "number") {
            return a.order - b.order;
          }

          // fallback: keep API order
          return 0;
        });

        setProjects(ordered);
        setError(null);
      } catch (err) {
        // console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects based on category, subcategory, and search
  useEffect(() => {
    let result = [...projects];

    if (categoryContext) {
      result = result.filter(
        (project) =>
          project.category.toLowerCase() === categoryContext.toLowerCase()
      );
    }

    if (subCategoryContext) {
      result = result.filter(
        (project) =>
          project.subCategory?.toLowerCase() ===
          subCategoryContext.toLowerCase()
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (project) =>
          project.name.toLowerCase().includes(query) ||
          project.location.toLowerCase().includes(query) ||
          project.client.toLowerCase().includes(query) ||
          project.collaborators.toLowerCase().includes(query) ||
          project.projectTeam.toLowerCase().includes(query) ||
          project.projectLeaders.some((pl) =>
            pl.toLowerCase().includes(query)
          ) ||
          project.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    setFilteredProjects(result);
  }, [projects, categoryContext, subCategoryContext, searchQuery]);

  if (loading)
    return (
      <div className="text-center py-20">
        <p className="text-[#6e6a6b] uppercase ">Loading Projects...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-[#F2EFEE] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <ReactLenis root options={lenisOptions}>
      <motion.div
        style={{ perspective: "1200px", perspectiveOrigin }}
        className="bg-[#F2EFEE] flex flex-col items-center py-6"
      >
        <motion.div
          style={{ z }}
          className="w-full flex flex-col items-center gap-3 md:gap-6 xl:gap-8"
        >
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#6e6a6b] uppercase ">No results yet</p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project._id}
                id={`project-${project._id}`} // 👈 ADD THIS
                className="w-full flex justify-center overflow-hidden"
              >
                <ProjectCard project={project} />
              </div>
            ))
          )}
        </motion.div>
      </motion.div>
    </ReactLenis>
  );
};

export default Home;
