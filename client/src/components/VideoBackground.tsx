import { useEffect, useRef } from "react";

interface VideoBackgroundProps {
  videoUrl?: string;
  posterUrl?: string;
  children?: React.ReactNode;
}

export function VideoBackground({
  videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-luxury-watch-close-up-4244-large.mp4",
  posterUrl,
  children,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75; // Slow motion effect
    }
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video element */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        poster={posterUrl}
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div className="video-overlay" />

      {/* Content */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
