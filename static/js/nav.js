// Element references
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


