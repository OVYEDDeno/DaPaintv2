import React, { useState } from 'react';

const Feedback = () => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    console.log('Feedback submitted:', feedback);
    setFeedback('');
  };

  return (
    <div className="simple-page">
      <img 
        src="https://res.cloudinary.com/dj2umay9c/image/upload/v1733970532/Saturday_30th_DaPaint_Playoff-removebg-preview_yaiflb.png" 
        alt="DaPaint Logo" 
        className="page-logo"
      />
      <h1 className="page-title">Feedback</h1>
      <p className="page-description">
        Help us improve DaPaint! Share your thoughts, suggestions, or report any issues you've encountered.
      </p>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Tell us what you think..."
        className="feedback-textarea"
      />
      <button onClick={handleSubmit} className="primary-button">Submit Feedback</button>
    </div>
  );
};

export default Feedback; 