import os
import tempfile
import torch
import psutil
from torchvision import transforms
from torchvision.models import resnet18, ResNet18_Weights
import torch.nn.functional as F
from flask import Flask, render_template, request, redirect, url_for, flash, session
from werkzeug.utils import secure_filename
from PIL import Image
from flask import jsonify

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

def store_file(file):
    # Validate the filetype
    if not file or '.' not in file.filename or \
            file.filename.rsplit('.', 1)[1].lower() not in ALLOWED_EXTENSIONS:
        return None, "Invalid file type."

    # Secure the filename and save it temporarily
    temp_dir = os.path.join(BASE_DIR, "temp")
    os.makedirs(temp_dir, exist_ok=True)
    temp_file_path = os.path.join(temp_dir, secure_filename(file.filename))
    file.save(temp_file_path)

    return temp_file_path, None

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        file = request.files.get('slide_file')
        temp_file_path, error = store_file(file)

        if error:
            flash(error, "danger")
            return jsonify({"error": "File upload failed", "prediction": None, "confidence": None})

        try:
            with Image.open(temp_file_path) as img:
                img = img.convert("RGB")
                img_tensor = image_transform(img).unsqueeze(0).to(device)

            # Perform inference
            with torch.no_grad():
                outputs = model(img_tensor)
                probabilities = F.softmax(outputs, dim=1).squeeze().cpu().numpy()

            # Save results in variables
            class_names = ["Adenocarcinoma", "Squamous Cell Carcinoma", "Benign Tissue"]
            prediction_value = class_names[probabilities.argmax()]
            confidence_value = probabilities.max() * 100

            # Convert confidence to a string with 1 decimal place + '%'
            confidence_str = f"{confidence_value:.1f}%"

            # Return JSON so the front end can update without reloading
            return jsonify({
                'prediction': prediction_value,
                'confidence': confidence_str
            })

        except Exception as e:
            print(f"Error processing the image: {str(e)}")
            return jsonify({'prediction': None, 'confidence': None, 'error': str(e)})

        finally:
            os.remove(temp_file_path)  # cleanup temp file

    # If it's a GET request, just render the page with defaults
    return render_template('index.html', prediction=None)

@app.route('/about')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    app.run(debug=True)