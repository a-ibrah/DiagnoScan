const contributeBtn = document.getElementById("contribute-btn");
const predictBtn = document.getElementById("predict-btn");
const requiredText = document.getElementById("required-text");

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
  
  function initHomeButtons() {
    const contributeBtn = document.getElementById("contribute-btn");
    const predictBtn = document.getElementById("predict-btn");
    const requiredText = document.getElementById("required-text");
    const queryButtons = document.querySelector('.buttons-wrapper');
    const uploadSection = document.getElementById('upload-section');
    const slideFileInput = document.getElementById("slide-file");
  
    if(contributeBtn && predictBtn) {
      contributeBtn.addEventListener("click", () => {
        contributeBtn.classList.add("active");
        predictBtn.classList.remove("active");
        queryButtons.style.display = 'flex';
        uploadSection.style.display = 'none';
      });
  
      predictBtn.addEventListener("click", () => {
        predictBtn.classList.add("active");
        contributeBtn.classList.remove("active");
        requiredText.classList.remove("hidden");
        if(slideFileInput) slideFileInput.required = true;
        updateSubmitButtonState && updateSubmitButtonState();
        uploadSection.style.display = 'block';
        queryButtons.style.display = 'none';
      });
    }
  }