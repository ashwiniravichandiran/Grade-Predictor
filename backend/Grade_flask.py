from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
import os
import uuid

app = Flask(__name__)

# CORS configuration for both local and production
CORS(app, origins=[
    'https://gradepredict.netlify.app',  # Your Netlify URL
    'http://localhost:3000',             # Local React dev server
    'http://127.0.0.1:3000',            # Local React dev server alt
    'http://localhost:5173',             # Vite dev server
    'http://127.0.0.1:5173'             # Vite dev server alt
])

# Create necessary directories
UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

# Load the dataset
script_dir = os.path.dirname(__file__)
dataset_path = os.path.join(script_dir, 'student_performance.csv')

# Check if dataset exists
if not os.path.exists(dataset_path):
    print(f"Warning: Dataset not found at {dataset_path}")
    df = None
else:
    df = pd.read_csv(dataset_path)

selected_features = ['G1', 'G2', 'studytime', 'failures', 'absences']

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Grade Prediction API is running',
        'dataset_loaded': df is not None
    })

@app.route('/predict', methods=['POST'])
def analyze_individual():
    if df is None:
        return jsonify({'error': 'Dataset not loaded'}), 500
        
    data = request.get_json()

    try:
        min_grade = float(data['minGrade'])
        max_grade = float(data['maxGrade'])

        if min_grade >= max_grade:
            return jsonify({'error': 'Minimum grade must be less than maximum grade'}), 400

        # Train model
        X_selected = df[selected_features].copy()
        y_selected = df['G3'].copy()
        scaler = MinMaxScaler()
        X_selected[['G1', 'G2']] = scaler.fit_transform(X_selected[['G1', 'G2']])
        y_selected = (y_selected - min_grade) / (max_grade - min_grade)
        X_train, X_test, y_train, y_test = train_test_split(X_selected, y_selected, test_size=0.1, random_state=42)
        model = LinearRegression()
        model.fit(X_train, y_train)

        # Predict
        features = pd.DataFrame([[
            float(data['G1']),
            float(data['G2']),
            int(data['studytime']),
            int(data['failures']),
            int(data['absences'])
        ]], columns=selected_features)

        features[['G1', 'G2']] = scaler.transform(features[['G1', 'G2']])
        prediction = model.predict(features)[0]
        prediction = prediction * (max_grade - min_grade) + min_grade
        prediction = round(max(min(prediction, max_grade), min_grade), 2)

        return jsonify({'predictedGrade': prediction})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/process', methods=['POST'])
def process_file():
    if df is None:
        return jsonify({'error': 'Dataset not loaded'}), 500
        
    try:
        # Get file, minGrade, and maxGrade
        file = request.files.get('file')
        min_grade = float(request.form.get('minGrade', 0))
        max_grade = float(request.form.get('maxGrade', 100))

        if not file:
            return jsonify({'error': 'No file uploaded'}), 400

        if min_grade >= max_grade:
            return jsonify({'error': 'Invalid grade range'}), 400

        filename = secure_filename(file.filename)
        if not filename:
            return jsonify({'error': 'Invalid filename'}), 400
            
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        # Read Excel file with openpyxl engine
        try:
            df_excel = pd.read_excel(filepath, engine='openpyxl')
        except Exception as e:
            return jsonify({'error': f'Error reading Excel file: {str(e)}'}), 400
        
        print("Excel file contents:", df_excel.head())  # Debug print
        print("Excel columns:", df_excel.columns.tolist())  # Debug print

        # Check required columns
        required_columns = set(['G1', 'G2', 'studytime', 'failures', 'absences'])
        if not required_columns.issubset(set(df_excel.columns)):
            missing = required_columns - set(df_excel.columns)
            return jsonify({'error': f"Missing required columns: {missing}"}), 400

        # Prepare features - select columns in the right order regardless of file order
        X_input = df_excel[['G1', 'G2', 'studytime', 'failures', 'absences']].copy()

        # Train model on the original dataset
        X_selected = df[selected_features].copy()
        y_selected = df['G3'].copy()
        
        scaler = MinMaxScaler()
        X_selected[['G1', 'G2']] = scaler.fit_transform(X_selected[['G1', 'G2']])
        y_selected = (y_selected - min_grade) / (max_grade - min_grade)
        
        model = LinearRegression()
        model.fit(X_selected, y_selected)

        # Scale the input data using the same scaler
        X_input_scaled = X_input.copy()
        X_input_scaled[['G1', 'G2']] = scaler.transform(X_input[['G1', 'G2']])

        # Predict and denormalize
        predictions = model.predict(X_input_scaled)
        predictions = predictions * (max_grade - min_grade) + min_grade
        predictions = np.clip(predictions, min_grade, max_grade)
        df_excel['Predicted Grade'] = np.round(predictions, 2)

        print("Received file:", file.filename)
        print("Min Grade:", min_grade, "Max Grade:", max_grade)
        print("Excel Columns:", df_excel.columns.tolist())

        # Save the processed file
        processed_filename = f"processed_{uuid.uuid4().hex[:8]}_{filename}"
        processed_path = os.path.join(PROCESSED_FOLDER, processed_filename)
        df_excel.to_excel(processed_path, index=False, engine='openpyxl')

        # Clean up uploaded file
        try:
            os.remove(filepath)
        except:
            pass

        return jsonify({'processedFile': processed_filename})

    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print("Error processing file:", error_trace)
        return jsonify({'error': f"Processing error: {str(e)}"}), 400

@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    try:
        return send_from_directory(PROCESSED_FOLDER, filename, as_attachment=True)
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

# Add the rest of your routes here...



# @app.route('/process', methods=['POST'])
# def process_file():
#     try:
#         # Get file, minGrade, and maxGrade
#         file = request.files.get('file')
#         min_grade = float(request.form.get('minGrade', 0))
#         max_grade = float(request.form.get('maxGrade', 100))

#         if not file:
#             return jsonify({'error': 'No file uploaded'}), 400

#         if min_grade >= max_grade:
#             return jsonify({'error': 'Invalid grade range'}), 400

#         filename = secure_filename(file.filename)
#         filepath = os.path.join(UPLOAD_FOLDER, filename)
#         file.save(filepath)

#         # Read Excel file with openpyxl engine
#         df_excel = pd.read_excel(filepath, engine='openpyxl')
        
#         print("Excel file contents:", df_excel.head())  # Debug print
#         print("Excel columns:", df_excel.columns.tolist())  # Debug print

#         # Check required columns
#         required_columns = set(['G1', 'G2', 'studytime', 'failures', 'absences'])
#         if not required_columns.issubset(set(df_excel.columns)):
#             missing = required_columns - set(df_excel.columns)
#             return jsonify({'error': f"Missing required columns: {missing}"}), 400

#         # Prepare features - select columns in the right order regardless of file order
#         X_input = df_excel[['G1', 'G2', 'studytime', 'failures', 'absences']].copy()

        

#         X_selected = df[selected_features].copy()
#         y_selected = df['G3'].copy()
        
#         X_selected[['G1', 'G2']] = MinMaxScaler().fit_transform(X_selected[['G1', 'G2']])
#         y_selected = (y_selected - min_grade) / (max_grade - min_grade)
        
#         model = LinearRegression()
#         model.fit(X_selected, y_selected)

#         # Predict and denormalize
#         predictions = model.predict(X_input)
#         predictions = predictions * (max_grade - min_grade) + min_grade
#         predictions = np.clip(predictions, min_grade, max_grade)
#         df_excel['Predicted Grade'] = np.round(predictions, 2)

#         print("Received file:", file.filename)
#         print("Min Grade:", min_grade, "Max Grade:", max_grade)
#         print("Excel Columns:", df_excel.columns.tolist())


#         # Save the processed file
#         processed_filename = f"processed_{filename}"
#         processed_path = os.path.join(PROCESSED_FOLDER, processed_filename)
#         df_excel.to_excel(processed_path, index=False)

#         return jsonify({'processedFile': processed_filename})

#     except Exception as e:
#         import traceback
#         error_trace = traceback.format_exc()
#         print("Error processing file:", error_trace)
#         return jsonify({'error': f"Processing error: {str(e)}. Check server logs for details."}), 400
