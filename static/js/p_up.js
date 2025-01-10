const slideFileInput = document.getElementById("slide-file");
const petFileInput = document.getElementById("pet-file");
const ctFileInput = document.getElementById("ct-file");
const analyzeBtn = document.getElementById("analyze-btn");

// Handle "Analyze" button click for predictions
analyzeBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  if (predictBtn.classList.contains("active") && slideFileInput.files.length > 0) {
    // Prepare form data and send prediction request
    const formData = new FormData(document.getElementById("upload-form"));
    try {
      const response = await fetch("/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Update prediction results and switch screen
        const data = await response.json();
        document.getElementById("prediction-text").textContent = data.prediction ?? "No prediction";
        document.getElementById("confidence-text").textContent = data.confidence ?? "No confidence score";
        switchScreen("screen-2");
      } else {
        console.error("Prediction failed");
      }
    } catch (error) {
      console.error("Error during prediction:", error);
    }
  }
});

// Update the state of the "Analyze" button based on prediction mode and file upload
function updateAnalyzeButtonState() {
  const isPredictActive = predictBtn.classList.contains("active");
  const slideFileUploaded = slideFileInput.files.length > 0;

  if (isPredictActive && slideFileUploaded) {
    analyzeBtn.disabled = false;
    analyzeBtn.classList.add("active");
    analyzeBtn.style.backgroundColor = "#68b7ff";
  } else {
    analyzeBtn.disabled = true;
    analyzeBtn.classList.remove("active");
    analyzeBtn.style.backgroundColor = "#b3d9fd";
  }
}

// Update UI when a new pathology slide file is selected
slideFileInput.addEventListener("change", () => {
  const fileName = slideFileInput.files[0]?.name || "No file uploaded";
  document.getElementById("slide-status").innerText = fileName;
  updateAnalyzeButtonState();
});

// Update UI for PET file selection
petFileInput.addEventListener("change", () => {
  const fileName = petFileInput.files[0]?.name || "No file uploaded";
  document.getElementById("pet-status").innerText = fileName;
});

// Update UI for CT file selection
ctFileInput.addEventListener("change", () => {
  const fileName = ctFileInput.files[0]?.name || "No file uploaded";
  document.getElementById("ct-status").innerText = fileName;
});

// Initial button state update on page load
window.addEventListener("load", () => {
  updateAnalyzeButtonState();
});