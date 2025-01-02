import os
import tempfile
import torch
from torchvision import transforms
from torchvision.models import resnet18, ResNet18_Weights
import torch.nn.functional as F
from flask import Flask, render_template, request, redirect, url_for, flash, session
from werkzeug.utils import secure_filename
from PIL import Image

# Flask app configuration
app = Flask(__name__)
app.secret_key = 'yoursecretkey'  # Needed for flash messages

# Allowed file extensions for upload
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Model configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "temp_best_model_fold_2.pth")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load the trained model
model = resnet18(weights=ResNet18_Weights.DEFAULT)
model.fc = torch.nn.Linear(model.fc.in_features, 3)  # Adjust for your number of classes
model.load_state_dict(torch.load(MODEL_PATH, map_location=device, weights_only=True))
model = model.to(device)
model.eval()

# Define the image transformations
image_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# Helper function to check file extensions
def allowed_file(filename):
    """Check if the filename has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Get the uploaded file
        file = request.files.get('slide_file')  # Updated field name

        if file and allowed_file(file.filename):
            # Secure the filename and save it temporarily
            filename = secure_filename(file.filename)
            temp_dir = os.path.join(BASE_DIR, "temp")  # Create a 'temp' directory inside your project
            temp_file_path = os.path.join(temp_dir, filename)
            file.save(temp_file_path)

            try:
                # Load and preprocess the image
                with Image.open(temp_file_path) as img:
                    img = img.convert("RGB")  # Ensure it's in RGB mode
                    img_tensor = image_transform(img).unsqueeze(0).to(device)  # Add batch dimension

                # Perform inference
                with torch.no_grad():
                    outputs = model(img_tensor)
                    probabilities = F.softmax(outputs, dim=1).squeeze().cpu().numpy()

                # Map classes to names
                class_names = ["Adenocarcinoma", "Squamous Cell Carcinoma", "Benign Tissue"]
                predicted_class = class_names[probabilities.argmax()]
                confidence = probabilities.max() * 100

                # Display the result
                flash(f"Prediction: {predicted_class} (Confidence: {confidence:.2f}%)", "success")
            except Exception as e:
                flash(f"Error processing the image: {str(e)}", "danger")

            # Redirect back to the main page
            return redirect(url_for('index'))
        else:
            flash("Please upload a valid image file (jpg, png, gif).", "danger")
            return redirect(url_for('index'))

    # For GET requests, render the page
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