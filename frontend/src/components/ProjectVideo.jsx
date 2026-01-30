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
  } catch {
    // Ignore errors, return null
    return null;
  }

  return null;
};

const ProjectVideo = ({ src }) => {
  const playerMountRef = useRef(null);
  const playerRef = useRef(null);

  const videoId = extractYouTubeVideoId(src);
  const isYouTube = Boolean(videoId);

  const [dimensions, setDimensions] = useState({ width: 0, height: 450 });
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(16 / 9); // width / height

  // ----- Dimension logic (unchanged) -----
  const updateDimensions = () => {
    const height = window.innerWidth <= 640 ? 220 : 450;
    // width is derived from the detected aspect ratio; keep height fixed
    const width = Math.round(aspectRatio * height);
    setDimensions({ width, height });
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [aspectRatio]);

  // ----- Aspect ratio detection -----
  useEffect(() => {
    if (!src) return;

    let cancelled = false;

    // For YouTube: treat /shorts/ as vertical (9:16), otherwise default to 16:9
    if (isYouTube && videoId) {
      try {
        const parsed = new URL(src);
        if (parsed.pathname.includes("/shorts/")) {
          if (!cancelled) setAspectRatio(9 / 16);
        } else {
          if (!cancelled) setAspectRatio(16 / 9);
        }
      } catch {
        if (!cancelled) setAspectRatio(16 / 9);
      }

      return () => {
        cancelled = true;
      };
    }

    // For direct video files (mp4/webm etc.) load metadata to detect natural aspect ratio
    const vid = document.createElement("video");
    vid.preload = "metadata";
    vid.src = src;

    const handleLoaded = () => {
      if (cancelled) return;
      const w = vid.videoWidth || 16;
      const h = vid.videoHeight || 9;
      if (w > 0 && h > 0) setAspectRatio(w / h);
      else setAspectRatio(16 / 9);
    };

    const handleError = () => {
      if (cancelled) return;
      setAspectRatio(16 / 9);
    };

    vid.addEventListener("loadedmetadata", handleLoaded);
    vid.addEventListener("error", handleError);

    // If the src is a blob URL or same-origin this will trigger; otherwise fallback
    // to 16:9 after a short timeout to avoid waiting forever.
    const fallbackTimer = setTimeout(() => {
      if (!cancelled && (isNaN(vid.videoWidth) || vid.videoWidth === 0)) {
        setAspectRatio(16 / 9);
      }
    }, 1200);

    return () => {
      cancelled = true;
      vid.removeEventListener("loadedmetadata", handleLoaded);
      vid.removeEventListener("error", handleError);
      clearTimeout(fallbackTimer);
      try {
        vid.src = "";
      } catch {
        // ignore cleanup errors
      }
    };
  }, [src, isYouTube, videoId]);

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
