const contributeBtn = document.getElementById("contribute-btn");
const predictBtn = document.getElementById("predict-btn");
const requiredText = document.getElementById("required-text");
const uploadSection = document.getElementById('upload-section');
const queryButtons = document.querySelector('.buttons-wrapper');
const uploadQueryBtn = document.getElementById('send-query-btn');
const viewQueryBtn = document.getElementById('label-query-btn');

function toggleMode(mode) {
  const isContribute = mode === "contribute";
  const isPredict = mode === "predict";

  // Toggle active states for buttons
  contributeBtn.classList.toggle("active", isContribute);
  predictBtn.classList.toggle("active", isPredict);

  // Adjust visibility of sections
  const querySection = document.getElementById("query-section"); // Query section reference
  if (isContribute) {
    querySection.style.display = "block"; // Show query section
    uploadSection.style.display = "none"; // Hide upload section
    requiredText.classList.add("hidden"); // Hide the required text
    requiredTextElements.forEach(el => el.classList.add("hidden"));
  } else if (isPredict) {
    querySection.style.display = "none"; // Hide query section
    uploadSection.style.display = "block"; // Show upload section
    slideFileInput.required = true;
    requiredText.classList.remove("hidden"); // Show the required text
    requiredTextElements.forEach(el => el.classList.remove("hidden"));
    if (typeof updateSubmitButtonState === "function") {
      updateSubmitButtonState();
    }
  }
}

// Add event listeners for mode switching
contributeBtn.addEventListener("click", () => toggleMode("contribute"));
predictBtn.addEventListener("click", () => toggleMode("predict"));

// Query Buttons Navigation
uploadQueryBtn.addEventListener("click", () => {
  uploadQueryBtn.classList.add("selected");
  viewQueryBtn.classList.remove("selected");
  window.location.href = "/upload";  
});

viewQueryBtn.addEventListener("click", () => {
  viewQueryBtn.classList.add("selected");
  uploadQueryBtn.classList.remove("selected");
  window.location.href = "/view";  
});

// Reset UI state on page load
window.addEventListener("load", () => {
  slideFileInput.value = "";
  document.getElementById("slide-status").innerText = "No file uploaded";
  contributeBtn.classList.remove("active");
  predictBtn.classList.remove("active");
  requiredText.classList.add("hidden"); // Ensure required text is hidden on load
  submitBtn.disabled = true;
  submitBtn.innerHTML = `&rarr;`;
  switchScreen("screen-1");
});