import os
import torch
from torchvision import transforms
from torchvision.models import resnet18, ResNet18_Weights
import torch.nn.functional as F
from PIL import Image

# Constants
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'svs'}
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "models", "temp_best_model_fold_2.pth")
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

# Utility functions
def validate_file(file):
    """Validate if the file extension is allowed."""
    return file and '.' in file.filename and \
           file.filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def store_file(file):
    """Store the uploaded file temporarily."""
    temp_dir = os.path.join(BASE_DIR, "..", "temp")
    os.makedirs(temp_dir, exist_ok=True)
    temp_file_path = os.path.join(temp_dir, file.filename)
    file.save(temp_file_path)
    return temp_file_path

def predict_image(file_path):
    """Run prediction on the uploaded image."""
    with Image.open(file_path) as img:
        img = img.convert("RGB")
        img_tensor = image_transform(img).unsqueeze(0).to(device)

    # Perform inference
    with torch.no_grad():
        outputs = model(img_tensor)
        probabilities = F.softmax(outputs, dim=1).squeeze().cpu().numpy()

    class_names = ["Adenocarcinoma", "Squamous Cell Carcinoma", "Benign Tissue"]
    prediction_value = class_names[probabilities.argmax()]
    confidence_value = probabilities.max() * 100

    return prediction_value, f"{confidence_value:.1f}%"