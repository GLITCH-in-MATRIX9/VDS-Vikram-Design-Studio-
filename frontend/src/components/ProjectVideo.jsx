import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// Extract YouTube video ID from URL
const extractYouTubeVideoId = (url) => {
  try {
    const parsed = new URL(url);

    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1);
    }

    if (parsed.searchParams.has("v")) {
      return parsed.searchParams.get("v");
    }

    const match = parsed.pathname.match(/\/(embed|shorts)\/([^/?]+)/);
    if (match) return match[2];
  } catch {
    return null;
  }

  return null;
};

const ProjectVideo = ({ src }) => {
  const wrapperRef = useRef(null);
  const playerMountRef = useRef(null);
  const playerRef = useRef(null);
  const observerRef = useRef(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 450 });
  const [isVisible, setIsVisible] = useState(false);

  // ----- Dimension logic (UNCHANGED) -----
  const updateDimensions = () => {
    const height = window.innerWidth <= 640 ? 220 : 450;
    const width = Math.round((16 / 9) * height);
    setDimensions({ width, height });
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // ----- Intersection Observer (lazy-load trigger) -----
  useEffect(() => {
    if (!wrapperRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observerRef.current.disconnect(); // load only once
        }
      },
      { threshold: 0.25 }
    );

    observerRef.current.observe(wrapperRef.current);

    return () => observerRef.current?.disconnect();
  }, []);

  // ----- YouTube Player init (ONLY when visible) -----
  useEffect(() => {
    if (!isVisible) return;

    const videoId = extractYouTubeVideoId(src);
    if (!videoId) return;

    const initPlayer = () => {
      if (playerRef.current) return;

      playerRef.current = new window.YT.Player(playerMountRef.current, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          loop: 1,
          playlist: videoId, // REQUIRED for loop
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: (e) => {
            e.target.mute();
            e.target.playVideo();
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        initPlayer();
      };
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [isVisible, src]);

  // ----- Skeleton while sizing -----
  if (dimensions.width === 0) {
    return (
      <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />
    );
  }

  return (
    <motion.div
      ref={wrapperRef}
      style={{ width: dimensions.width, height: dimensions.height }}
      className="relative rounded-lg shadow-md overflow-hidden m-auto"
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Player mount (only filled after visible) */}
      <div ref={playerMountRef} className="absolute inset-0 w-full h-full" />

      {/* Drag overlay */}
      <div className="absolute inset-0 z-10 cursor-grab bg-transparent" />
    </motion.div>
  );
};

export default ProjectVideo;
