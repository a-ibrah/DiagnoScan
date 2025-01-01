import os
import tempfile
from flask import Flask, render_template, request, redirect, url_for, flash, session
from werkzeug.utils import secure_filename
from PIL import Image

app = Flask(__name__)
app.secret_key = 'yoursecretkey'  # Needed for flash messages

# Allowed extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    """Check if the filename has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # If the submit button is clicked, get the file from the request
        file = request.files.get('image_file')

        if file and allowed_file(file.filename):
            # Secure the filename
            filename = secure_filename(file.filename)

            # Create a temporary file
            temp_dir = tempfile.gettempdir()
            temp_file_path = os.path.join(temp_dir, filename)

            # Save the file in the temporary directory
            file.save(temp_file_path)

            # Store the path in the session
            session['uploaded_file'] = temp_file_path

            # Temporary testing: Check if the image can be read
            try:
                with Image.open(temp_file_path) as img:
                    img_properties = {
                        "format": img.format,  # e.g., PNG, JPEG
                        "mode": img.mode,      # e.g., RGB, L
                        "size": img.size       # e.g., (width, height)
                    }
                flash(f"Image uploaded successfully! Properties: {img_properties}", "success")
            except Exception as e:
                flash(f"Error reading the image file: {str(e)}", "danger")

            return redirect(url_for('index'))
        else:
            flash("Please upload a valid image file (jpg, png, gif).", "danger")
            return redirect(url_for('index'))

    # For GET requests, just show the page
    return render_template('index.html')

@app.teardown_request
def cleanup_temp_files(exception=None):
    """Delete the temporary file when the session ends or app is stopped."""
    temp_file_path = session.pop('uploaded_file', None)
    if temp_file_path and os.path.exists(temp_file_path):
        try:
            os.remove(temp_file_path)
        except OSError:
            pass  # Ignore errors during file deletion

@app.route('/about')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    app.run(debug=True)