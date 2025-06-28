import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Adstoken = ({ bearerToken, onLogout }) => {
	const navigate = useNavigate();
	const [showCreateAd, setShowCreateAd] = useState(false);
	const [userAds, setUserAds] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	// Ad form state
	const [adForm, setAdForm] = useState({
		title: "",
		description: "",
		imageUrl: "",
		targetUrl: "",
		budget: "",
		campaignType: "cpm", // cpm or cpv
		targetAudience: "",
		duration: "7" // days
	});


	// Fetch user's ads on component mount
	useEffect(() => {
		fetchUserAds();
	}, []);

	const fetchUserAds = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/user/ads', {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${bearerToken}`,
					'Content-Type': 'application/json',
				},
			});

			if (response.ok) {
				const ads = await response.json();
				setUserAds(ads);
			} else {
				setError("Failed to fetch your ads");
			}
		} catch (error) {
			console.error('Error fetching ads:', error);
			setError("Error loading your ads");
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setAdForm(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleCreateAd = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setSuccess("");

		try {
			const response = await fetch('/api/ads/create', {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${bearerToken}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(adForm)
			});

			if (response.ok) {
				const newAd = await response.json();
				setUserAds(prev => [...prev, newAd]);
				setSuccess("Ad created successfully!");
				setAdForm({
					title: "",
					description: "",
					imageUrl: "",
					targetUrl: "",
					budget: "",
					campaignType: "cpm",
					targetAudience: "",
					duration: "7"
				});
				setShowCreateAd(false);
			} else {
				const errorData = await response.json();
				setError(errorData.message || "Failed to create ad");
			}
		} catch (error) {
			console.error('Error creating ad:', error);
			setError("Error creating ad. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteAd = async (adId) => {
		if (!window.confirm("Are you sure you want to delete this ad?")) return;

		try {
			const response = await fetch(`/api/ads/${adId}`, {
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${bearerToken}`,
					'Content-Type': 'application/json',
				},
			});

			if (response.ok) {
				setUserAds(prev => prev.filter(ad => ad.id !== adId));
				setSuccess("Ad deleted successfully!");
			} else {
				setError("Failed to delete ad");
			}
		} catch (error) {
			console.error('Error deleting ad:', error);
			setError("Error deleting ad");
		}
	};

	return (
		<>
			<div className="scroll-container">
				<main className="m-3">
					{/* Header */}
					<section className="hero-section">
						<h1 className="heroh1 text-center" style={{ marginTop: "168px" }}>
							Your Advertising Dashboard
						</h1>
						<div className="text-center" style={{ color: "#ffffff", fontSize: "17px" }}>
							<p className="mb-3">
								Manage your campaigns and track performance on DaPaint.org
							</p>
							<button
								className="golden-button rounded-pill w-50 mt-2"
								onClick={() => setShowCreateAd(!showCreateAd)}
							>
								<span className="golden-text" style={{ fontSize: "17px" }}>
									{showCreateAd ? "View My Ads" : "Create New Ad"}
								</span>
							</button>
						</div>
					</section>

					{/* Messages */}
					{error && (
						<div className="alert alert-danger mt-3" role="alert">
							{error}
						</div>
					)}
					{success && (
						<div className="alert alert-success mt-3" role="alert">
							{success}
						</div>
					)}

					{/* Create Ad Form */}
					{showCreateAd && (
						<section className="container" style={{ marginTop: "100px" }}>
							<h2 className="text-black mb-4 text-center">Create New Advertisement</h2>

							<form onSubmit={handleCreateAd} className="row g-3">
								<div className="col-md-6">
									<label htmlFor="title" className="form-label">Ad Title *</label>
									<input
										type="text"
										className="form-control"
										id="title"
										name="title"
										value={adForm.title}
										onChange={handleInputChange}
										required
										maxLength="100"
									/>
								</div>

								<div className="col-md-6">
									<label htmlFor="campaignType" className="form-label">Campaign Type *</label>
									<select
										className="form-select"
										id="campaignType"
										name="campaignType"
										value={adForm.campaignType}
										onChange={handleInputChange}
										required
									>
										<option value="cpm">CPM ($1.99 per 1,000 views)</option>
										<option value="cpv">CPV ($0.00199 per view)</option>
									</select>
								</div>

								<div className="col-12">
									<label htmlFor="description" className="form-label">Ad Description *</label>
									<textarea
										className="form-control"
										id="description"
										name="description"
										rows="3"
										value={adForm.description}
										onChange={handleInputChange}
										required
										maxLength="300"
									/>
								</div>

								<div className="col-md-6">
									<label htmlFor="imageUrl" className="form-label">Image URL *</label>
									<input
										type="url"
										className="form-control"
										id="imageUrl"
										name="imageUrl"
										value={adForm.imageUrl}
										onChange={handleInputChange}
										required
										placeholder="https://example.com/image.jpg"
									/>
								</div>

								<div className="col-md-6">
									<label htmlFor="targetUrl" className="form-label">Target URL *</label>
									<input
										type="url"
										className="form-control"
										id="targetUrl"
										name="targetUrl"
										value={adForm.targetUrl}
										onChange={handleInputChange}
										required
										placeholder="https://your-website.com"
									/>
								</div>

								<div className="col-md-4">
									<label htmlFor="budget" className="form-label">Budget ($) *</label>
									<input
										type="number"
										className="form-control"
										id="budget"
										name="budget"
										min="10"
										step="0.01"
										value={adForm.budget}
										onChange={handleInputChange}
										required
										placeholder="50.00"
									/>
								</div>

								<div className="col-md-4">
									<label htmlFor="duration" className="form-label">Duration (days) *</label>
									<select
										className="form-select"
										id="duration"
										name="duration"
										value={adForm.duration}
										onChange={handleInputChange}
										required
									>
										<option value="7">7 days</option>
										<option value="14">14 days</option>
										<option value="30">30 days</option>
										<option value="60">60 days</option>
									</select>
								</div>

								<div className="col-md-4">
									<label htmlFor="targetAudience" className="form-label">Target Audience</label>
									<select
										className="form-select"
										id="targetAudience"
										name="targetAudience"
										value={adForm.targetAudience}
										onChange={handleInputChange}
									>
										<option value="">All Users</option>
										<option value="sports">Sports Enthusiasts</option>
										<option value="gaming">Gaming Community</option>
										<option value="fitness">Fitness & Health</option>
										<option value="tech">Technology</option>
									</select>
								</div>

								<div className="col-12">
									<button
										type="submit"
										className="golden-button rounded-pill w-100"
										disabled={loading}
									>
										<span className="golden-text">
											{loading ? "Creating Ad..." : "Create Advertisement"}
										</span>
									</button>
								</div>
							</form>
						</section>
					)}

					{/* User's Ads Dashboard */}
					{!showCreateAd && (
						<section className="container" style={{ marginTop: "100px" }}>
							<h2 className="text-black mb-4 text-center">Your Active Campaigns</h2>

							{loading ? (
								<div className="text-center">
									<div className="spinner-border" role="status">
										<span className="visually-hidden">Loading...</span>
									</div>
								</div>
							) : userAds.length === 0 ? (
								<div className="text-center">
									<p>You haven't created any ads yet.</p>
									<button
										className="golden-button rounded-pill"
										onClick={() => setShowCreateAd(true)}
									>
										<span className="golden-text">Create Your First Ad</span>
									</button>
								</div>
							) : (
								<div className="row">
									{userAds.map((ad) => (
										<div key={ad.id} className="col-md-6 col-lg-4 mb-4">
											<div className="card h-100">
												<img
													src={ad.imageUrl}
													className="card-img-top"
													alt={ad.title}
													style={{ height: "200px", objectFit: "cover" }}
												/>
												<div className="card-body d-flex flex-column">
													<h5 className="card-title">{ad.title}</h5>
													<p className="card-text flex-grow-1">{ad.description}</p>
													<div className="mt-auto">
														<p className="mb-1">
															<strong>Type:</strong> {ad.campaignType.toUpperCase()}
														</p>
														<p className="mb-1">
															<strong>Budget:</strong> ${ad.budget}
														</p>
														<p className="mb-1">
															<strong>Status:</strong>
															<span className={`badge ms-1 ${ad.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
																{ad.status || 'Pending'}
															</span>
														</p>
														<p className="mb-3">
															<strong>Views:</strong> {ad.views || 0}
														</p>
														<div className="d-grid gap-2">
															<a
																href={ad.targetUrl}
																target="_blank"
																rel="noopener noreferrer"
																className="btn btn-outline-primary btn-sm"
															>
																View Target
															</a>
															<button
																className="btn btn-danger btn-sm"
																onClick={() => handleDeleteAd(ad.id)}
															>
																Delete Ad
															</button>
														</div>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</section>
					)}

				</main>
			</div>
		</>
	);
};