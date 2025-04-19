import React, { useState } from "react";
import "./Institution.css";

const Institution = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [minGrade, setMinGrade] = useState("");
  const [maxGrade, setMaxGrade] = useState("");
  const [processedFile, setProcessedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError("");
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    
    // Validation
    if (!file) {
      setError("Please upload an Excel file.");
      return;
    }
    
    if (!minGrade || !maxGrade) {
      setError("Please enter both minimum and maximum grades.");
      return;
    }
    
    if (parseInt(minGrade) > parseInt(maxGrade)) {
      setError("Minimum grade cannot be greater than maximum grade.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("minGrade", minGrade);
    formData.append("maxGrade", maxGrade);

    setIsLoading(true);
    
    try {
      const response = await fetch("http://127.0.0.1:5000/process", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      setProcessedFile(data.processedFile);
    } catch (error) {
      console.error("Error processing file:", error);
      setError("Failed to process file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFile(null);
    setFileName("");
    setMinGrade("");
    setMaxGrade("");
    setError("");
  };

  return (
    <div className="bg-state">
      <div className="card-container">
      {/* Left Section */}
      <div className="option-card-inst">
        <h2>Upload Student Data</h2>
        <form onSubmit={handleSubmit}>
          <div className="file-upload-container">
            <label className="file-upload-label" style={{ color: 'black' }}>
              {fileName ? fileName : "Choose Excel File (.xlsx, .xls)"}
              <input 
                type="file" 
                accept=".xlsx, .xls" 
                onChange={handleFileChange} 
                className="file-input" 
              />
            </label>
            {fileName && (
              <button 
                type="button" 
                className="clear-file-btn" 
                onClick={() => {
                  setFile(null);
                  setFileName("");
                }}
              >
                ×
              </button>
            )}
          </div>
          
          <div className="grade-inputs">
            <div className="input-group">
              <label htmlFor="min-grade" style={{ color: 'black' }}
              >Minimum Grade:</label>
              <input
                id="min-grade"
                type="number"
                placeholder="0"
                value={minGrade}
                onChange={(e) => setMinGrade(e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="max-grade" style={{ color: 'black' }}>Maximum Grade:</label>
              <input
                id="max-grade"
                type="number"
                placeholder="100"
                value={maxGrade}
                onChange={(e) => setMaxGrade(e.target.value)}
              />
            </div>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Upload & Process"}
            </button>
            <button 
              type="button" 
              className="reset-btn" 
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Right Section */}
      <div className="option-card-inst">
        <h2>Processed Data</h2>
        <div className="result-container">
          {isLoading ? (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Processing your data...</p>
            </div>
          ) : processedFile ? (
            <div className="download-container">
              <p>Your file has been processed successfully!</p>
              <a 
                href={`http://127.0.0.1:5000/download/${processedFile}`} 
                download
                className="download-link"
              >
                <button className="download-btn">Download Processed File</button>
              </a>
            </div>
          ) : (
            <div className="placeholder-content">
              <p>Upload a file and set grade range parameters to process student data.</p>
              <p className="note">The processed Excel file will appear here after successful processing.</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Institution;