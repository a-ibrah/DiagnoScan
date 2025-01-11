// Element references
const uploadSection = document.getElementById('upload-section');
const queryButtons = document.querySelector('.buttons-wrapper');
const uploadQueryBtn = document.getElementById('send-query-btn');
const viewQueryBtn = document.getElementById('label-query-btn');

// Automatically flash alerts after 3 seconds
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
      // Use Bootstrap's alert dismissal if available
      const bsAlert = new bootstrap.Alert(alert);
      bsAlert.close();
    });
  }, 3000); // 3000ms = 3 seconds
});

// Utility function to switch visible screens
function switchScreen(screenId) {
  // Remove any existing flash messages
  const flashContainer = document.getElementById('flash-messages');
  if(flashContainer) {
    flashContainer.innerHTML = '';
  }

  // Now switch screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
}

// Query Buttons Navigation
uploadQueryBtn.addEventListener('click', () => {
  uploadQueryBtn.classList.add('selected');
  viewQueryBtn.classList.remove('selected');
  window.location.href = '/upload';  
});

viewQueryBtn.addEventListener('click', () => {
  viewQueryBtn.classList.add('selected');
  uploadQueryBtn.classList.remove('selected');
  window.location.href = '/view';  
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

// Close Nav menu in mobile when clicking outside the screen or when switching views.
document.addEventListener('DOMContentLoaded', () => {
  const navbarCollapseEl = document.getElementById('navbarNav');
  const toggler = document.querySelector('.navbar-toggler');
  const collapseInstance = new bootstrap.Collapse(navbarCollapseEl, { toggle: false });

  navbarCollapseEl.addEventListener('shown.bs.collapse', () => {
    toggler.classList.add('active');
  });

  navbarCollapseEl.addEventListener('hidden.bs.collapse', () => {
    toggler.classList.remove('active');
    toggler.blur();
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (
      navbarCollapseEl.classList.contains('show') && 
      !navbarCollapseEl.contains(target) && 
      !toggler.contains(target)
    ) {
      collapseInstance.hide();
    }
  });

  // --- Event Delegation for Contribute and Predict Buttons ---
  document.addEventListener('click', function(event) {
    const contributeBtn = event.target.closest('#contribute-btn');
    const predictBtn = event.target.closest('#predict-btn');

    if (contributeBtn) {
      handleContributeClick();
    } else if (predictBtn) {
      handlePredictClick();
    }
  });

  function handleContributeClick() {
    const contributeBtn = document.getElementById("contribute-btn");
    const predictBtn = document.getElementById("predict-btn");
    const queryButtons = document.querySelector('.buttons-wrapper');
    const uploadSection = document.getElementById('upload-section');

    if(contributeBtn && predictBtn && queryButtons && uploadSection) {
      contributeBtn.classList.add("active");
      predictBtn.classList.remove("active");
      queryButtons.style.display = 'flex';
      uploadSection.style.display = 'none';
    }
  }

  function handlePredictClick() {
    const contributeBtn = document.getElementById("contribute-btn");
    const predictBtn = document.getElementById("predict-btn");
    const requiredText = document.getElementById("required-text");
    const slideFileInput = document.getElementById("slide-file");
    const queryButtons = document.querySelector('.buttons-wrapper');
    const uploadSection = document.getElementById('upload-section');

    if(contributeBtn && predictBtn && requiredText && slideFileInput && queryButtons && uploadSection) {
      predictBtn.classList.add("active");
      contributeBtn.classList.remove("active");
      requiredText.classList.remove("hidden");
      slideFileInput.required = true;
      if (typeof updateSubmitButtonState === 'function') {
        updateSubmitButtonState();
      }
      uploadSection.style.display = 'block';
      queryButtons.style.display = 'none';
    }
  }
});

