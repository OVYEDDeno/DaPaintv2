import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
export const Auth = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isLogin, setIsLogin] = useState(true);
  const [showCard, setShowCard] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [users, setUsers] = useState([]);
  const [donePaints, setDonePaints] = useState([]);
  const [rating, setRating] = useState(1);
  const [feedback, setFeedback] = useState("");

  const placeholderImage =
    "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Man-3d-Medium-Dark-icon.png";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    zipcode: "",
    phone: "",
    birthday: "",
  });
  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    zipcode: "",
    phone: "",
    birthday: "",
    general: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError((prevError) => ({
      ...prevError,
      [name]: "",
      general: "", // Clear general error when typing
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? import.meta.env.VITE_BACKEND_URL + "/api/login"
      : import.meta.env.VITE_BACKEND_URL + "/api/signup";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok) {
        if (isLogin) {
          localStorage.setItem("token", result.access_token);
          navigate("/lineupondapaint");
          console.log("Log in successful!");
          console.log("Token:", result.access_token);
        } else {
          window.location.reload();
          localStorage.setItem("username", formData.name);
          // Optionally show success message or handle invite_code if needed
          if (result.invite_code) {
            alert(`User created successfully! Are ready to Lock In!`);
          }
        }
      } else {
        // Initialize new error state
        let newError = {
          name: "",
          email: "",
          password: "",
          city: "",
          zipcode: "",
          phone: "",
          birthday: "",
          general: result.msg || "An error occurred. Please try again.",
        };

        // Handle login errors
        if (isLogin) {
          switch (result.msg) {
            case "No username/email or password":
              newError.email =
                "Please provide an email or username and password.";
              break;
            case "No such user":
              newError.email = "No user found with that email or username.";
              break;
            case "Bad password":
              // newError.password = "Incorrect password.";
              break;
            default:
              newError.general = result.msg;
          }
        } else {
          // Handle signup errors from the structured 'errors' object
          if (result.errors) {
            newError = {
              ...newError,
              ...result.errors,
            };
          } else if (result.msg) {
            newError.general = result.msg;
          }
        }

        setError(newError);
      }
    } catch (error) {
      console.error("Error:", error);
      setError((prevError) => ({
        ...prevError,
        general: "System Overload. Please try again another time.",
      }));
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const url = import.meta.env.VITE_BACKEND_URL + "/api/forgot-password";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email }),
    });
    const result = await response.json();

    if (response.ok) {
      alert("email has been sent");
    } else {
      alert("failed to send email", result.message);
    }
    console.log("Forgot password submission for:", formData.email);
  };

  const toggleCard = () => {
    setShowCard((prevState) => !prevState);
  };

  useEffect(() => {
    async function getPublicDapaintList() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/public-lineup`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const EventList = await response.json();
          setEvents(EventList);
          console.log("EventList from lineup.js: ", EventList);
        } else {
          const error = await response.json();
          console.error("Failed to retrieve list of events:", error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    getPublicDapaintList();
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/city`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
          console.log("Users from auth.js: ", data);
        } else {
          const error = await response.json();
          console.error("Failed to retrieve list of data:", error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchUsers();
  }, []);

  useEffect(() => {
    async function fetchDonePaints() {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/done`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDonePaints(data);
          console.log("DonePaints from auth.js: ", data);
        } else {
          const error = await response.json();
          console.error("Failed to retrieve list of data:", error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchDonePaints();
  }, []);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback || rating === 0) {
      alert("Please provide both feedback and rating.");
      return;
    }
    try {
      // Assuming actions.submitFeedback is removed, this will cause an error
      // If it's meant to be removed, this function should also be removed
      // For now, keeping it as is, but it will likely break
      // const response = await actions.submitFeedback(feedback, rating);
      // if (response && response.msg) {
      //   alert(response.msg);
      //   setFeedback("");
      //   setRating(1);
      // }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("There was an error submitting your feedback. Please try again.");
    }
  };

  return (
    <>
      <div className="scroll-container">
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setIsForgotPassword(false);
          }}
          className="btn-secondary w-100"
        >
          <h3 className="m-0">
            Click Here to {isLogin ? "Sign Up1" : "Login"}
          </h3>
        </button>
        {showCard && (
          <div className="m-3">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setIsForgotPassword(false);
              }}
              className="btn-secondary w-100"
            >
              <h3 className="m-0">
                Click Here to {isLogin ? "Sign Up2" : "Login"}
              </h3>
            </button>
            <div className="hold-box w-50">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setIsForgotPassword(false);
                }}
                className="btn-secondary w-100"
              >
                <h3 className="m-0">
                  Click Here to {isLogin ? "Sign Up3" : "Login"}
                </h3>
              </button>

              <div className="container">
                <div className="pill-container1 mx-auto bg-black">
                  <h6 className="m-0 auth-challenge-text">
                    BEAT 10 PLAYERS IN A ROW, WIN $1,000!!
                  </h6>
                </div>
                {/*<h6 className="text-center mb-3 text-black">
                   DaPaint make fitness a joyful and rewarding journey with a
                  supportive community. 
                  
                </h6>*/}

                {!isForgotPassword ? (
                  <>
                    <form
                      onSubmit={handleSubmit}
                      className="form-container1 bg-transparent p-0 mx-auto flex flex-col justify-center items-center h-full"
                    >
                      {!isLogin && (
                        <>
                          {/* Name and Phone */}
                          <div className="input-pair">
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Username/Creative alias"
                              className="form-control"
                              required
                            />
                            <input
                              type="number"
                              name="phone"
                              placeholder="Phone Number"
                              value={formData.phone}
                              onChange={handleChange}
                              className="form-control"
                              required
                            />
                          </div>
                          {error.name && (
                            <div className="alert alert-danger" role="alert">
                              {error.name}
                            </div>
                          )}
                          {error.phone && (
                            <div className="alert alert-danger" role="alert">
                              {error.phone}
                            </div>
                          )}

                          {/* Email and Password */}
                          <div className="input-pair">
                            <input
                              type="email"
                              name="email"
                              placeholder="Your Email"
                              value={formData.email}
                              onChange={handleChange}
                              className="form-control"
                              required
                            />

                            <input
                              type="password"
                              name="password"
                              placeholder="Password"
                              value={formData.password}
                              onChange={handleChange}
                              className="form-control"
                              required
                            />
                          </div>
                          {error.email && (
                            <div className="alert alert-danger" role="alert">
                              {error.email}
                            </div>
                          )}
                          {error.password && (
                            <div className="alert alert-danger" role="alert">
                              {error.password}
                            </div>
                          )}

                          {/* City and Zipcode */}
                          <div className="input-pair">
                            <input
                              type="text"
                              name="city"
                              placeholder="City"
                              value={formData.city}
                              onChange={handleChange}
                              className="form-control"
                              required
                            />
                            <input
                              type="text"
                              name="zipcode"
                              placeholder="Zipcode"
                              value={formData.zipcode}
                              onChange={handleChange}
                              className="form-control"
                              required
                            />
                          </div>
                          {error.city && (
                            <div className="alert alert-danger" role="alert">
                              {error.city}
                            </div>
                          )}
                          {error.zipcode && (
                            <div className="alert alert-danger" role="alert">
                              {error.zipcode}
                            </div>
                          )}

                          {/* Birthday */}
                          <div className="relative">
                            <label className="form-label">Your Birthday </label>
                            <input
                              type="date"
                              name="birthday"
                              value={formData.birthday}
                              onChange={handleChange}
                              className="form-control w-45 m-0 pt-6"
                              required
                            />
                            {error.birthday && (
                              <div className="alert alert-danger" role="alert">
                                {error.birthday}
                              </div>
                            )}
                          </div>

                          {/* Submit Button */}
                          <button
                            type="submit"
                            onClick={() => setIsLogin(false)}
                            className="btn-secondary w-5 m-2"
                          >
                            <h6 className="m-0">Sign Up</h6>
                          </button>

                          {/* Terms and Privacy Policy */}
                          <h6 className="text-xs text-black m-2 auth-terms-text">
                            By signing up, you're agreeing to our{" "}
                            <a
                              href="/terms"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              terms of service
                            </a>{" "}
                            and{" "}
                            <a
                              href="/privacy"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              privacy policy
                            </a>
                            .
                          </h6>
                        </>
                      )}
                      {isLogin && (
                        <>
                          <div className="input-pair">
                            <input
                              type="text"
                              name="email"
                              placeholder="Email/Username (case sensitive)"
                              value={formData.email}
                              onChange={handleChange}
                              className="form-control mx-auto"
                              required
                              autoFocus
                            />
                            <input
                              type="password"
                              name="password"
                              placeholder="Password"
                              value={formData.password}
                              onChange={handleChange}
                              className="form-control"
                              required
                            />
                          </div>
                          {error.email && (
                            <div className="alert alert-danger" role="alert">
                              {error.email}
                            </div>
                          )}
                          {error.password && (
                            <div className="alert alert-danger" role="alert">
                              {error.password}
                            </div>
                          )}
                          {error.general && (
                            <div className="alert alert-danger" role="alert">
                              {error.general}
                            </div>
                          )}

                          <div className="input-pair">
                            <button
                              type="submit"
                              className="btn-secondary w-50 m-2"
                              onClick={() => setIsLogin(true)}
                            >
                              <h6 className="m-0 auth-button-text">
                                Login
                              </h6>
                            </button>
                            <button
                              type="submit"
                              className="btn-secondary w-50 m-2"
                              onClick={() => setIsForgotPassword(true)}
                            >
                              <h6 className="m-0 auth-button-text">
                                Forgot Password?
                              </h6>
                            </button>
                          </div>

                        </>
                      )}
                    </form>
                  </>
                ) : (
                  <>
                    <form
                      onSubmit={handleForgotPassword}
                      className="form-container1 bg-transparent p-0 mx-auto flex flex-col justify-center items-center"
                    >
                      <input
                        type="text"
                        name="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                      <div className="input-pair">
                        <button
                          type="submit"
                          className="btn-secondary w-100 mx-auto"
                          onClick={() => setIsLogin(true)}
                        >
                          <h6 className="m-0">Reset Password</h6>
                        </button>
                        <button
                          type="submit"
                          className="btn-secondary w-100 mx-auto"
                          onClick={() => setIsForgotPassword(false)}
                        >
                          <h6 className="m-0">Back to Login</h6>
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
              {/*<div className="container m-0 p-0">
                 <img
                  src="https://i.ibb.co/XfgKRgmz/BAB-Before-After-Bridge-2.png"
                  alt="BAB-Before-After-Bridge-2"
                  border="0"
                  className="auth-image"
                ></img>

              </div> */}
              {/* <Ads /> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Auth;
