// import React, { useState } from "react";
// import "./Institution.css";

// const Institution = () => {
//   const [file, setFile] = useState(null);
//   const [fileName, setFileName] = useState("");
//   const [minGrade, setMinGrade] = useState("");
//   const [maxGrade, setMaxGrade] = useState("");
//   const [processedFile, setProcessedFile] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Handle file selection
//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//       setFileName(selectedFile.name);
//       setError("");
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setError("");
    
//     // Validation
//     if (!file) {
//       setError("Please upload an Excel file.");
//       return;
//     }
    
//     if (!minGrade || !maxGrade) {
//       setError("Please enter both minimum and maximum grades.");
//       return;
//     }
    
//     if (parseInt(minGrade) > parseInt(maxGrade)) {
//       setError("Minimum grade cannot be greater than maximum grade.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("minGrade", minGrade);
//     formData.append("maxGrade", maxGrade);

//     setIsLoading(true);
    
//     try {
//       const response = await fetch("http://127.0.0.1:5000/process", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error(`Server responded with status: ${response.status}`);
//       }

//       const data = await response.json();
//       setProcessedFile(data.processedFile);
//     } catch (error) {
//       console.error("Error processing file:", error);
//       setError("Failed to process file. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Reset form
//   const handleReset = () => {
//     setFile(null);
//     setFileName("");
//     setMinGrade("");
//     setMaxGrade("");
//     setError("");
//   };

//   return (
//     <div className="bg-state">
//       <div className="card-container">
//       {/* Left Section */}
//       <div className="option-card-inst">
//         <h2>Upload Student Data</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="file-upload-container">
//             <label className="file-upload-label" style={{ color: 'black' }}>
//               {fileName ? fileName : "Choose Excel File (.xlsx, .xls)"}
//               <input 
//                 type="file" 
//                 accept=".xlsx, .xls" 
//                 onChange={handleFileChange} 
//                 className="file-input" 
//               />
//             </label>
//             {fileName && (
//               <button 
//                 type="button" 
//                 className="clear-file-btn" 
//                 onClick={() => {
//                   setFile(null);
//                   setFileName("");
//                 }}
//               >
//                 ×
//               </button>
//             )}
//           </div>
          
//           <div className="grade-inputs">
//             <div className="input-group">
//               <label htmlFor="min-grade" style={{ color: 'black' }}
//               >Minimum Grade:</label>
//               <input
//                 id="min-grade"
//                 type="number"
//                 placeholder="0"
//                 value={minGrade}
//                 onChange={(e) => setMinGrade(e.target.value)}
//               />
//             </div>
            
//             <div className="input-group">
//               <label htmlFor="max-grade" style={{ color: 'black' }}>Maximum Grade:</label>
//               <input
//                 id="max-grade"
//                 type="number"
//                 placeholder="100"
//                 value={maxGrade}
//                 onChange={(e) => setMaxGrade(e.target.value)}
//               />
//             </div>
//           </div>
          
//           {error && <div className="error-message">{error}</div>}
          
//           <div className="form-actions">
//             <button 
//               type="submit" 
//               disabled={isLoading}
//             >
//               {isLoading ? "Processing..." : "Upload & Process"}
//             </button>
//             <button 
//               type="button" 
//               className="reset-btn" 
//               onClick={handleReset}
//             >
//               Reset
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Right Section */}
//       <div className="option-card-inst">
//         <h2>Processed Data</h2>
//         <div className="result-container">
//           {isLoading ? (
//             <div className="loading-indicator">
//               <div className="spinner"></div>
//               <p>Processing your data...</p>
//             </div>
//           ) : processedFile ? (
//             <div className="download-container">
//               <p>Your file has been processed successfully!</p>
//               <a 
//                 href={`http://127.0.0.1:5000/download/${processedFile}`} 
//                 download
//                 className="download-link"
//               >
//                 <button className="download-btn">Download Processed File</button>
//               </a>
//             </div>
//           ) : (
//             <div className="placeholder-content">
//               <p>Upload a file and set grade range parameters to process student data.</p>
//               <p className="note">The processed Excel file will appear here after successful processing.</p>
//             </div>
//           )}
//         </div>
//       </div>
//       </div>
//     </div>
//   );
// };

// export default Institution;
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

  // API Base URL - automatically detects environment
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://grade-predictor3.onrender.com' 
    : 'http://127.0.0.1:5000';

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Please upload a valid Excel file (.xlsx or .xls)");
        return;
      }

      // Check file size (limit to 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size too large. Please upload a file smaller than 10MB.");
        return;
      }

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
    
    if (parseInt(minGrade) >= parseInt(maxGrade)) {
      setError("Minimum grade must be less than maximum grade.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("minGrade", minGrade);
    formData.append("maxGrade", maxGrade);

    setIsLoading(true);
    
    try {
      console.log("Uploading to:", `${API_BASE_URL}/process`);
      console.log("File:", file.name, "Size:", file.size);
      
      const response = await fetch(`${API_BASE_URL}/process`, {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response:", errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || `Server error: ${response.status}`);
        } catch (parseError) {
          throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
      }

      const data = await response.json();
      console.log("Success response:", data);
      setProcessedFile(data.processedFile);
    } catch (error) {
      console.error("Error processing file:", error);
      setError(`Failed to process file: ${error.message}`);
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
    setProcessedFile(null);
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
          
          {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
          
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
                href={`${API_BASE_URL}/download/${processedFile}`} 
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
              <div style={{marginTop: '20px', fontSize: '12px', color: '#666'}}>
                <p><strong>Required Excel columns:</strong></p>
                <p>G1, G2, studytime, failures, absences</p>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Institution;