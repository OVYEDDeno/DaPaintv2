import React, { useState, useEffect } from "react";

export const Bg = ({ showCard = true, children }) => {
  const backgroundImages = [
    "url(https://images.pexels.com/photos/2891884/pexels-photo-2891884.jpeg)",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!showCard && backgroundImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [showCard]);

  return (
    <div
      className="bg-container"
      style={
        !showCard
          ? {
              backgroundImage: backgroundImages[currentImageIndex],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}
      }
    >
      {showCard && (
        <video autoPlay loop muted className="video-background" preload="auto">
          <source
            src="https://videos.pexels.com/video-files/5192157/5192157-hd_1920_1080_30fps.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      )}
      <div className="dark-overlay"></div>
      {children}
    </div>
  );
};