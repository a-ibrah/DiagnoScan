from flask import Blueprint, render_template, request, jsonify, flash
from werkzeug.utils import secure_filename
import os
from .model import validate_file, store_file, predict_image
from .sql import generate_user_id, save_metadata, fetch_data, update_metadata
from .drive import upload_photo
from flask import redirect, url_for

# Initialize Blueprint
core_bp = Blueprint('core_bp', __name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@core_bp.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        file = request.files.get('slide_file')
        
        if not file:
            flash("No file uploaded.", "danger")
            return jsonify({"error": "File upload failed", "prediction": None, "confidence": None})

        if not validate_file(file):
            flash("Invalid file type. Only .jpg, .jpeg, .png, and .svs are allowed.", "danger")
            return jsonify({"error": "File upload failed", "prediction": None, "confidence": None})

        # Save and process the file
        try:
            temp_file_path = store_file(file)
            prediction_value, confidence_str = predict_image(temp_file_path)

            # Silent success: No flash for successful predictions
            return jsonify({
                'prediction': prediction_value,
                'confidence': confidence_str
            })
        except Exception as e:
            flash("Error processing the file.", "danger")
            print(f"Error processing the image: {str(e)}")
            return jsonify({'prediction': None, 'confidence': None, 'error': str(e)})
        finally:
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)  # Cleanup temp file

    # If it's a GET request, just render the page with defaults
    return render_template('index.html', prediction=None)

@core_bp.route("/upload", methods=["POST"])
def upload():
    # Use the correct key for form submissions
    uploaded_file = request.files.get('slide_file')
    if not uploaded_file or not uploaded_file.filename:
        flash("No file selected.", "danger")
        return redirect(url_for('core_bp.upload_page'))

    user_id = generate_user_id()
    file_extension = os.path.splitext(uploaded_file.filename)[1]
    new_file_name = f"{user_id}{file_extension}"
    file_path = os.path.join(UPLOAD_FOLDER, new_file_name)

    try:
        uploaded_file.save(file_path)
        response = upload_photo(file_path)

        if response["status"] == "success":
            save_metadata(user_id, new_file_name, response["file_id"])
            flash("File uploaded successfully!", "success")
        else:
            flash("File upload failed during processing.", "danger")
    except Exception as e:
        flash("An error occurred during upload.", "danger")
        print(f"Error: {str(e)}")
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

    return redirect(url_for('core_bp.upload_page'))
 
@core_bp.route("/data", methods=["GET"])
def data():
    """Fetch data for display."""
    draw = request.args.get('draw', type=int)
    start = request.args.get('start', type=int)
    length = request.args.get('length', type=int)
    search_value = request.args.get('search[value]', default='')
    patient_search = request.args.get('columns[1][search][value]', default='')
    timestamp_search = request.args.get('columns[2][search][value]', default='')
    order_column = request.args.get('order[0][column]', type=int)
    order_dir = request.args.get('order[0][dir]', default='asc')
    filter_status = request.args.get('filterStatus', default=None)

    rows, filtered_total = fetch_data(draw, start, length, search_value, 
                                      patient_search, timestamp_search, 
                                      order_column, order_dir, filter_status)

    result = {
        "draw": draw,
        "recordsTotal": filtered_total,
        "recordsFiltered": filtered_total,
        "data": [
            {
                "id": row[0],
                "patient_name": row[1],
                "upload_timestamp": row[2],
                "status": row[3],
                "classification": row[4] if row[4] else "Not Classified",
                "link": f"https://drive.google.com/file/d/{row[5]}",
            }
            for row in rows
        ]
    }
    return jsonify(result)

@core_bp.route("/update_metadata", methods=["POST"])
def update_metadata_route():
    """Update metadata for a file."""
    data = request.json
    slide_id = data.get("id")
    classification = data.get("classification")

    if not slide_id or not classification:
        flash("Invalid data provided for metadata update.", "danger")
        return jsonify({"error": "Invalid data"}), 400

    update_metadata(slide_id, classification)
    flash("Metadata updated successfully!", "success")
    return jsonify({"message": "Metadata updated successfully!"}), 200

@core_bp.route('/about')
def about():
    return render_template('about.html')

@core_bp.route("/contribute")
def contribute():
    return render_template("contribute.html")

@core_bp.route("/view")
def view_page():
    return render_template("view.html")

@core_bp.route("/upload")
def upload_page():
    return render_template("upload.html")