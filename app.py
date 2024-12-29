import os
from flask import Flask, render_template, request, redirect, url_for, flash
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = 'yoursecretkey'  # Needed for flash messages

# Folder to store uploaded images
UPLOAD_FOLDER = os.path.join('static', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Make sure the folder exists
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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
            # Secure the filename to avoid malicious paths
            filename = secure_filename(file.filename)

            # Save the file to the uploads folder
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            
            flash("Image successfully uploaded!", "success")
            return redirect(url_for('index'))
        else:
            flash("Please upload a valid image file (jpg, png, gif).", "danger")
            return redirect(url_for('index'))

    # For GET requests, just show the page
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    app.run(debug=True)