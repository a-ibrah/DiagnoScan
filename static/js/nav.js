// Automatically flash alerts after 3 seconds
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
      const bsAlert = new bootstrap.Alert(alert); // Use Bootstrap's alert dismissal
      bsAlert.close();
    });
  }, 3000); // 3000ms = 3 seconds
});

// function to switch visible screens
function switchScreen(screenId) {
  // Remove any existing flash messages
  const flashContainer = document.getElementById('flash-messages');
  if(flashContainer) {
    flashContainer.innerHTML = '';
  }
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
}

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
});

