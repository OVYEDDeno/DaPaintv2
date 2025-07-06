import React, { useState, useEffect } from "react";

export const Bg = ({ showCard = true }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile-optimized background images
  const mobileBackgroundImages = [
    "url(https://images.pexels.com/photos/2891884/pexels-photo-2891884.jpeg?auto=compress&cs=tinysrgb&w=800)",
  ];

  // Desktop background images
  const desktopBackgroundImages = [
    "url(https://images.pexels.com/photos/2891884/pexels-photo-2891884.jpeg?auto=compress&cs=tinysrgb&w=1920)",
  ];

  const backgroundImages = isMobile ? mobileBackgroundImages : desktopBackgroundImages;

  return (
    <div
      className="bg-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        ...(showCard
          ? {
            backgroundImage: backgroundImages[0],
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }
          : {}
        )
      }}
    >
      {!showCard && (
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="video-background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1
          }}
          poster={isMobile 
            ? "https://images.pexels.com/photos/2891884/pexels-photo-2891884.jpeg?auto=compress&cs=tinysrgb&w=800"
            : "https://images.pexels.com/photos/2891884/pexels-photo-2891884.jpeg?auto=compress&cs=tinysrgb&w=1920"
          }
        >
          <source
            src={isMobile 
              ? "https://videos.pexels.com/video-files/5192157/5192157-sd_640_360_30fps.mp4"
              : "https://videos.pexels.com/video-files/5192157/5192157-hd_1920_1080_30fps.mp4"
            }
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};