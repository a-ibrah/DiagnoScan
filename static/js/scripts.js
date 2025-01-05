const contributeBtn = document.getElementById("contribute-btn");
const predictBtn = document.getElementById("predict-btn");
const slideFileInput = document.getElementById("slide-file");
const petFileInput = document.getElementById("pet-file");
const ctFileInput = document.getElementById("ct-file");
const submitBtn = document.getElementById("submit-btn");
const requiredText = document.getElementById("required-text");

// Function to switch between screens
function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
  }
  
  // Function to check conditions for enabling the "Next" button
  function updateSubmitButtonState() {
    const isContributeActive = contributeBtn.classList.contains("active");
    const isPredictActive = predictBtn.classList.contains("active");
    const slideFileUploaded = slideFileInput.files.length > 0; // Check if Pathology Slide file is uploaded
  
    if (isPredictActive) {
      submitBtn.disabled = !slideFileUploaded;
      submitBtn.innerHTML = `Analyze &rarr;`;
    } else if (isContributeActive) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Label &rarr;`;
    } else {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `&rarr;`;
    }
  }

// Handle "Make Prediction" button click
predictBtn.addEventListener("click", () => {
    predictBtn.classList.add("active");
    contributeBtn.classList.remove("active");
    requiredText.classList.remove("hidden"); // Show the required text
    slideFileInput.required = true;
    updateSubmitButtonState();
  });
  
  // Handle "Contribute to Database" button click
  contributeBtn.addEventListener("click", () => {
    contributeBtn.classList.add("active");
    predictBtn.classList.remove("active");
    requiredText.classList.add("hidden"); // Hide the required text
    slideFileInput.required = false;
    updateSubmitButtonState();
  });

  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();
  
    const isPredictActive = predictBtn.classList.contains("active");
    const slideFileUploaded = slideFileInput.files.length > 0;
  
    if (isPredictActive && slideFileUploaded) {
        const formData = new FormData(document.getElementById("upload-form"));
  
        const response = await fetch("/", {
            method: "POST",
            body: formData,
        });
  
        const data = await response.json(); 
        // data = { prediction: "...", confidence: "...", [error: "..."] }
  
        // Update the DOM text:
        document.getElementById("prediction-text").textContent = data.prediction ?? '';
        document.getElementById("confidence-text").textContent = data.confidence ?? '';
  
        // After setting prediction & confidence, show screen-3:
        switchScreen("screen-3");
  
    } else {
        // If not predicting or file wasn't uploaded, go to screen 2
        switchScreen("screen-2");
    }
  });

  // Update file status on file change
    slideFileInput.addEventListener("change", () => {
        const fileName = slideFileInput.files[0]?.name || "No file uploaded";
        document.getElementById("slide-status").innerText = fileName;
        updateSubmitButtonState();
    });

    // Update file status for PET scan input
petFileInput.addEventListener("change", () => {
    const fileName = petFileInput.files[0]?.name || "No file uploaded";
    document.getElementById("pet-status").innerText = fileName;
  });
  
  // Update file status for CT scan input
  ctFileInput.addEventListener("change", () => {
    const fileName = ctFileInput.files[0]?.name || "No file uploaded";
    document.getElementById("ct-status").innerText = fileName;
  });

  // Reset file inputs and other UI states on page reload
    window.addEventListener("load", () => {
        slideFileInput.value = "";
        document.getElementById("slide-status").innerText = "No file uploaded";
        contributeBtn.classList.remove("active");
        predictBtn.classList.remove("active");
        submitBtn.disabled = true;
        submitBtn.innerHTML = `&rarr;`; // Reset button text
        switchScreen('screen-1');
    });