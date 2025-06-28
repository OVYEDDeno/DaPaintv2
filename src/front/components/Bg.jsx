import React, { useState, useEffect } from "react";

export const Bg = ({ showCard = true }) => {
	// Array of background image URLs
	const backgroundImages = [
		"url(https://images.pexels.com/photos/2891884/pexels-photo-2891884.jpeg)",
	];

	// Add the missing currentImageIndex state
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
						backgroundImage: backgroundImages[currentImageIndex],
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
				>
					<source
						src="https://videos.pexels.com/video-files/5192157/5192157-hd_1920_1080_30fps.mp4"
						type="video/mp4"
					/>
					Your browser does not support the video tag.
				</video>
			)}
		</div>
	);
};