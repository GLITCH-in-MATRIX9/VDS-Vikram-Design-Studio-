import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getYouTubeAPI } from "../utils/youtubeApi";

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
  } catch {}

  return null;
};

const ProjectVideo = ({ src }) => {
  const playerMountRef = useRef(null);
  const playerRef = useRef(null);

  const videoId = extractYouTubeVideoId(src);
  const isYouTube = Boolean(videoId);

  const [dimensions, setDimensions] = useState({ width: 0, height: 450 });
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  // ----- Dimension logic (unchanged) -----
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

  // ----- YouTube Player init (IMMEDIATE) -----
  useEffect(() => {
    if (!isYouTube || !videoId) return;

    let cancelled = false;

    getYouTubeAPI().then((YT) => {
      if (cancelled || playerRef.current) return;

      playerRef.current = new YT.Player(playerMountRef.current, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          loop: 1,
          playlist: videoId,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: (e) => {
            e.target.mute();
            e.target.playVideo();
            setIsPlayerReady(true);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [isYouTube, videoId]);

  // ----- Skeleton while sizing -----
  if (dimensions.width === 0) {
    return (
      <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />
    );
  }

  return (
    <motion.div
      style={{ width: dimensions.width, height: dimensions.height }}
      className="relative rounded-lg shadow-md overflow-hidden m-auto"
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* 🔹 Thumbnail while player loads */}
      {isYouTube && !isPlayerReady && (
        <img
          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          draggable={false}
        />
      )}

      {/* 🔹 Player mount */}
      {isYouTube && (
        <div ref={playerMountRef} className="absolute inset-0 w-full h-full" />
      )}

      {/* 🔹 Drag overlay */}
      <div className="absolute inset-0 z-10 cursor-grab bg-transparent" />
    </motion.div>
  );
};

export default ProjectVideo;
