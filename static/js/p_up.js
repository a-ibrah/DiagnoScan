const slideFileInput = document.getElementById("slide-file");
const petFileInput = document.getElementById("pet-file");
const ctFileInput = document.getElementById("ct-file");
const submitBtn = document.getElementById("submit-btn");

// Handle submit button click for predictions
submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();
  
    if (predictBtn.classList.contains("active") && slideFileInput.files.length > 0) {
      // Prepare form data and send prediction request
      const formData = new FormData(document.getElementById("upload-form"));
      const response = await fetch("/", {
        method: "POST",
        body: formData,
      });
  
      // Update prediction results and switch screen
      const data = await response.json();
      document.getElementById("prediction-text").textContent = data.prediction ?? '';
      document.getElementById("confidence-text").textContent = data.confidence ?? '';
      switchScreen("screen-2");
    }
  });
  
// Update the state of the submit button based on prediction mode and file upload
function updateSubmitButtonState() {
    const isPredictActive = predictBtn.classList.contains("active");
    const slideFileUploaded = slideFileInput.files.length > 0;
  
    if (isPredictActive) {
      submitBtn.disabled = !slideFileUploaded;
      submitBtn.innerHTML = `Analyze &rarr;`;
    } else {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `&rarr;`;
    }
  }

  // Update UI when a new pathology slide file is selected
slideFileInput.addEventListener("change", () => {
    const fileName = slideFileInput.files[0]?.name || "No file uploaded";
    document.getElementById("slide-status").innerText = fileName;
    updateSubmitButtonState();
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
