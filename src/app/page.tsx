"use client";

import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [activeBuffer, setActiveBuffer] = useState<"a" | "b">("a");

  const [srcA, setSrcA] = useState("");
  const [srcB, setSrcB] = useState("");

  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);

  // Poll for video changes
  useEffect(() => {
    const checkVideo = async () => {
      try {
        const res = await fetch("/api/video");
        const data = await res.json();
        const newVideo = data.video;

        if (!newVideo) return;

        // Determine current video being displayed
        const currentVideo = activeBuffer === "a" ? srcA : srcB;

        // If video changed, update the inactive buffer and swap
        if (newVideo !== currentVideo) {
          if (activeBuffer === "a") {
            setSrcB(newVideo);
            setActiveBuffer("b");
          } else {
            setSrcA(newVideo);
            setActiveBuffer("a");
          }
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    };

    // Initial check
    checkVideo();

    // Poll every 2 seconds
    const interval = setInterval(checkVideo, 2000);
    return () => clearInterval(interval);
  }, [activeBuffer, srcA, srcB]);

  // Reload video A when source changes
  useEffect(() => {
    if (videoARef.current && srcA) {
      videoARef.current.load();
    }
  }, [srcA]);

  // Reload video B when source changes
  useEffect(() => {
    if (videoBRef.current && srcB) {
      videoBRef.current.load();
    }
  }, [srcB]);

  // Reset time and play when buffer becomes active
  useEffect(() => {
    if (activeBuffer === "a" && videoARef.current) {
      videoARef.current.currentTime = 0;
      videoARef.current.play().catch((e) => console.error("Play error:", e));
    } else if (activeBuffer === "b" && videoBRef.current) {
      videoBRef.current.currentTime = 0;
      videoBRef.current.play().catch((e) => console.error("Play error:", e));
    }
  }, [activeBuffer]);

  return (
    <main className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      {/* Video Buffer A */}
      <video
        ref={videoARef}
        autoPlay
        loop
        muted
        playsInline
        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-[3000ms] ${
          activeBuffer === "a" ? "opacity-100 z-10" : "opacity-0 z-0"
        }`}
      >
        {srcA && <source src={`/${srcA}`} type="video/mp4" />}
      </video>

      {/* Video Buffer B */}
      <video
        ref={videoBRef}
        autoPlay
        loop
        muted
        playsInline
        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-[3000ms] ${
          activeBuffer === "b" ? "opacity-100 z-10" : "opacity-0 z-0"
        }`}
      >
        {srcB && <source src={`/${srcB}`} type="video/mp4" />}
      </video>

      {/* Overlay content if needed */}
      <div className="relative z-20 flex items-center justify-center h-full pointer-events-none">
        {/* Content goes here */}
      </div>
    </main>
  );
}
