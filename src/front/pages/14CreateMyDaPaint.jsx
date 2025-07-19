import React, { useState } from 'react';

const CreateMyDaPaint = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});

  const steps = [
    { label: 'Sport Type', example: 'Basketball, Football, etc.' },
    { label: 'Location', example: 'City, State' },
    { label: 'Date & Time', example: 'MM/DD/YYYY HH:MM' },
    { label: 'Entry Fee', example: '$10, $20, etc.' }
  ];

  const handleInputChange = (value) => {
    setFormData({ ...formData, [steps[step].label]: value });
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Creating DaPaint:', formData);
  };

  return (
    <div className="simple-page">
      <img 
        src="https://res.cloudinary.com/dj2umay9c/image/upload/v1733970532/Saturday_30th_DaPaint_Playoff-removebg-preview_yaiflb.png" 
        alt="DaPaint Logo" 
        className="page-logo-small"
      />
      <h2 className="page-title">Create a DaPaint - Step {step + 1} of {steps.length}</h2>
      <label className="form-label">{steps[step].label}</label>
      <input
        type="text"
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={`Enter ${steps[step].label.toLowerCase()}`}
        className="form-input"
      />
      <div className="form-example">Example: {steps[step].example}</div>
      <div className="form-buttons">
        <button onClick={handleBack} disabled={step === 0} className="secondary-button">Back</button>
        {step < steps.length - 1 ? (
          <button onClick={handleNext} className="primary-button">Next</button>
        ) : (
          <button onClick={handleSubmit} className="primary-button">Submit</button>
        )}
      </div>
    </div>
  );
};

export default CreateMyDaPaint; 