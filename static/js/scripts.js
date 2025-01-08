// Element references
const contributeBtn = document.getElementById("contribute-btn");
const predictBtn = document.getElementById("predict-btn");
const slideFileInput = document.getElementById("slide-file");
const petFileInput = document.getElementById("pet-file");
const ctFileInput = document.getElementById("ct-file");
const submitBtn = document.getElementById("submit-btn");
const requiredText = document.getElementById("required-text");
const uploadSection = document.getElementById('upload-section');
const queryButtons = document.querySelector('.buttons-wrapper');
const uploadQueryBtn = document.getElementById('send-query-btn');
const viewQueryBtn = document.getElementById('label-query-btn');

// Utility function to switch visible screens
function switchScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
}

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

/* 
  Event Listeners 
*/

// Activate "Contribute" mode on click
contributeBtn.addEventListener("click", () => {
  contributeBtn.classList.add("active");
  predictBtn.classList.remove("active");
  queryButtons.style.display = 'flex';
  uploadSection.style.display = 'none';
});

// Activate "Make Prediction" mode on click and update UI elements accordingly
predictBtn.addEventListener("click", () => {
  predictBtn.classList.add("active");
  contributeBtn.classList.remove("active");
  requiredText.classList.remove("hidden");
  slideFileInput.required = true;
  updateSubmitButtonState();
  uploadSection.style.display = 'block';
  queryButtons.style.display = 'none';
});

// Query Buttons Navigation
uploadQueryBtn.addEventListener('click', () => {
  uploadQueryBtn.classList.add('selected');
  viewQueryBtn.classList.remove('selected');
  window.location.href = '/upload';  // Use route URL
});

viewQueryBtn.addEventListener('click', () => {
  viewQueryBtn.classList.add('selected');
  uploadQueryBtn.classList.remove('selected');
  window.location.href = '/view';  // Use route URL
});

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

// Reset UI state on page load
window.addEventListener("load", () => {
  slideFileInput.value = "";
  document.getElementById("slide-status").innerText = "No file uploaded";
  contributeBtn.classList.remove("active");
  predictBtn.classList.remove("active");
  submitBtn.disabled = true;
  submitBtn.innerHTML = `&rarr;`;
  switchScreen('screen-1');
});


