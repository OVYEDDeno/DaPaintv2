import React from "react";
const placeholderImage =
    "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Man-3d-Medium-Dark-icon.png";

export const DaPaintLockIn = () => {
	return (
		<div className="event-auto-scroll">
			<div className="event-track">
				{/* Placeholder events */}
				{[1, 2, 3, 4, 5].map((_, index) => (
					<div className="event-row" key={index}>
						<div className="dapaint-container">
							<div className="event-profile">
								<div className="pill-container" type="button">
									<img
										src={placeholderImage}
										alt="Host"
										className="pill-image"
									/>
									<span className="pill-name">Host Player</span>
								</div>
								<div className="event-details">
									<span className="event-style">2:30 PM</span>
									<span className="event-style">Basketball</span>
								</div>
							</div>
							<h6>VS</h6>
							<div className="event-profile">
								<div className="pill-container" type="button">
									<img
										src={placeholderImage}
										alt="Foe"
										className="pill-image"
									/>
									<span className="pill-name">Foe Player</span>
								</div>
								<div className="event-details">
									<span className="event-location">Court 1</span>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};