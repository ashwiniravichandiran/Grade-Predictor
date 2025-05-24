import React, { useState } from "react";
import "./Individual.css";

const Individual = () => {
  const [formData, setFormData] = useState({
    name: "",
    minGrade: "",
    maxGrade: "",
    G1: "",
    G2: "",
    studytime: "",
    failures: "",
    absences: "",
  });
  const [predictedGrade, setPredictedGrade] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (error) setError("");
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (
      !formData.name || 
      !formData.minGrade || 
      !formData.maxGrade || 
      !formData.G1 || 
      !formData.G2 || 
      !formData.studytime || 
      !formData.failures || 
      !formData.absences
    ) {
      setError("Please fill in all fields.");
      return;
    }
    
    if (parseInt(formData.minGrade) > parseInt(formData.maxGrade)) {
      setError("Minimum grade cannot be greater than maximum grade.");
      return;
    }

    // Additional validation
    if (parseInt(formData.G1) < 0 || parseInt(formData.G1) > 20) {
      setError("G1 must be between 0 and 20.");
      return;
    }

    if (parseInt(formData.G2) < 0 || parseInt(formData.G2) > 20) {
      setError("G2 must be between 0 and 20.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      setPredictedGrade(data.predictedGrade);
      setSuccess(true);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setError("Failed to get prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      name: "",
      minGrade: "",
      maxGrade: "",
      G1: "",
      G2: "",
      studytime: "",
      failures: "",
      absences: "",
    });
    setPredictedGrade(null);
    setError("");
    setSuccess(false);
  };

  return (
    <div className="individual-container">
      {/* Left Section */}
      <div className="card-container">
      <div className="left-section">
        <h2>Student Grade Prediction</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="summa">
            <label htmlFor="name">Student Name:</label>
            <input 
              id="name"
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              placeholder="Enter student name" 
            />
          </div>
          </div>

          <div className="grade-inputs">
            <div className="input-group">
              <label htmlFor="minGrade">Minimum Grade:</label>
              <input 
                id="minGrade"
                type="number" 
                name="minGrade" 
                value={formData.minGrade} 
                onChange={handleChange}
                placeholder="0" 
              />
            </div>

            <div className="input-group">
              <label htmlFor="maxGrade">Maximum Grade:</label>
              <input 
                id="maxGrade"
                type="number" 
                name="maxGrade" 
                value={formData.maxGrade} 
                onChange={handleChange}
                placeholder="20" 
              />
            </div>
          </div>

          <div className="previous-grades">
            <h3>Previous Performance</h3>
            <div className="grade-inputs">
              <div className="input-group">
                <label htmlFor="G1">First Period Grade (G1):</label>
                <input 
                  id="G1"
                  type="number" 
                  name="G1" 
                  value={formData.G1} 
                  onChange={handleChange}
                  placeholder="0-20" 
                />
              </div>

              <div className="input-group">
                <label htmlFor="G2">Second Period Grade (G2):</label>
                <input 
                  id="G2"
                  type="number" 
                  name="G2" 
                  value={formData.G2} 
                  onChange={handleChange}
                  placeholder="0-20" 
                />
              </div>
            </div>
          </div>

          <div className="other-factors">
            <h3>Other Factors</h3>
            <div className="factors-grid">
              <div className="input-group">
                <label htmlFor="studytime">Weekly Study Hours:</label>
                <input 
                  id="studytime"
                  type="number" 
                  name="studytime" 
                  value={formData.studytime} 
                  onChange={handleChange}
                  placeholder="1-4" 
                />
              </div>

              <div className="input-group">
                <label htmlFor="failures">Past Failures:</label>
                <input 
                  id="failures"
                  type="number" 
                  name="failures" 
                  value={formData.failures} 
                  onChange={handleChange}
                  placeholder="0-3" 
                />
              </div>

              <div className="input-group">
                <label htmlFor="absences">Absences:</label>
                <input 
                  id="absences"
                  type="number" 
                  name="absences" 
                  value={formData.absences} 
                  onChange={handleChange}
                  placeholder="0-93" 
                />
              </div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="submit"  disabled={isLoading}>
              {isLoading ? "Calculating..." : "Predict Final Grade"}
            </button>
            <button type="button" className="reset-btn" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <h2>Prediction Result</h2>
        <div className="result-container">
          {isLoading ? (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Calculating prediction...</p>
            </div>
          ) : predictedGrade !== null ? (
            <div className="prediction-result">
              <div className="grade-display">
                <span className="grade-value">{predictedGrade}</span>
                <span className="grade-label">Predicted Final Grade</span>
              </div>
              
              <div className="student-info">
                <p><strong>Student:</strong> {formData.name}</p>
                <p><strong>Grade Range:</strong> {formData.minGrade} - {formData.maxGrade}</p>
              </div>
              
              <div className="previous-performance">
                <h4>Previous Performance</h4>
                <div className="performance-metrics">
                  <div className="metric">
                    <span className="metric-value">{formData.G1}</span>
                    <span className="metric-label">First Period</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">{formData.G2}</span>
                    <span className="metric-label">Second Period</span>
                  </div>
                </div>
              </div>
              
              <button className="new-prediction-btn" onClick={handleReset}>
                Make New Prediction
              </button>
            </div>
          ) : (
            <div className="placeholder-content">
              <p>Enter student information and click "Predict Final Grade" to see the prediction result.</p>
              <p className="note">The model uses previous grades and other factors to predict the final grade.</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Individual;