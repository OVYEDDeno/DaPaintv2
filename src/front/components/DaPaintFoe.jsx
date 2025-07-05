import React, { useState } from "react";

// Auth modal styles
const authStyles = `
  .auth-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.8);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
  }
  
  .auth-modal {
	background: white;
	border-radius: 15px;
	padding: 0;
	max-width: 400px;
	width: 90%;
	max-height: 90vh;
	overflow-y: auto;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
  
  .auth-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px 25px;
	border-bottom: 1px solid #eee;
  }
  
  .auth-header h2 {
	margin: 0;
	color: #333;
  }
  
  .close-btn {
	background: none;
	border: none;
	font-size: 24px;
	cursor: pointer;
	color: #666;
	padding: 0;
	width: 30px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
  }
  
  .close-btn:hover {
	color: #333;
  }
  
  .auth-content {
	padding: 25px;
  }
  
  .auth-form .form-control {
	border: 2px solid #eee;
	border-radius: 8px;
	padding: 12px 15px;
	font-size: 16px;
  }
  
  .auth-form .form-control:focus {
	outline: none;
	border-color: #ffd700;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
	const styleSheet = document.createElement("style");
	styleSheet.innerText = authStyles;
	document.head.appendChild(styleSheet);
}

export const DaPaintFoe = ({ showDaPaintFoe, toggleDaPaintFoe, onCreateSuccess }) => {
	const [signIn, setSignIn] = useState(true);
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		confirmPassword: '',
		birthDate: ''
	});

	const toggleSignIn = () => {
		setSignIn(!signIn);
		setFormData({
			email: '',
			password: '',
			confirmPassword: '',
			birthDate: ''
		});
	};

	const handleInputChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Basic validation
		if (!signIn && formData.password !== formData.confirmPassword) {
			alert("Passwords don't match!");
			return;
		}

		try {
			const endpoint = signIn ? '/api/login' : '/api/register';
			const payload = signIn
				? { email: formData.email, password: formData.password }
				: formData;

			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});

			const data = await response.json();

			if (response.ok) {
				// Store token (in real app, use React state instead of localStorage)
				const token = data.token;

				// Call success callback
				if (onCreateSuccess) {
					onCreateSuccess(token);
				}

				// Close modal
				toggleDaPaintFoe();
			} else {
				alert(data.message || 'Authentication failed');
			}
		} catch (error) {
			console.error('Auth error:', error);
			alert('An error occurred. Please try again.');
		}
	};

	if (!showDaPaintFoe) return null;

	return (
		<div className="auth-overlay">
			<div className="auth-modal">
				<div className="auth-header">
					<h2>{signIn ? "Lock In DaPaint" : "Create A DaPaint"}</h2>
					<button className="close-btn" onClick={toggleDaPaintFoe}>×</button>
				</div>
				<div className="auth-content">
					<form className="auth-form" onSubmit={handleSubmit}>
						<div className="form-group">
							<input
								type="email"
								name="email"
								placeholder="Email"
								className="form-control mb-3"
								value={formData.email}
								onChange={handleInputChange}
								required
							/>
						</div>
						<div className="form-group">
							<input
								type="password"
								name="password"
								placeholder="Password"
								className="form-control mb-3"
								value={formData.password}
								onChange={handleInputChange}
								required
							/>
						</div>
						{!signIn && (
							<>
								<div className="form-group">
									<input
										type="password"
										name="confirmPassword"
										placeholder="Confirm Password"
										className="form-control mb-3"
										value={formData.confirmPassword}
										onChange={handleInputChange}
										required
									/>
								</div>
								<div className="form-group">
									<input
										type="date"
										name="birthDate"
										placeholder="Birth Date"
										className="form-control mb-3"
										value={formData.birthDate}
										onChange={handleInputChange}
										required
									/>
								</div>
							</>
						)}
						<button type="submit" className="golden-button  w-100 mb-3">
							<span className="golden-text">{signIn ? "Sign In" : "Sign Up"}</span>
						</button>
						<p className="text-center">
							{signIn ? "Don't have an account?" : "Already have an account?"}
							<a href="#" className="golden-text ml-1" onClick={toggleSignIn}>
								{signIn ? " Sign Up" : " Sign In"}
							</a>
						</p>
					</form>
				</div>
			</div>
		</div>
	);
};