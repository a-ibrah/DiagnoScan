document.addEventListener("DOMContentLoaded", () => {
    // File Upload Functionality
    const fileInput = document.getElementById("slide-file");
    const slideStatus = document.getElementById("slide-status");
    const uploadBox = document.querySelector(".upload-box");
    const submitBtn = document.getElementById("submit-btn");

    if (fileInput && slideStatus && uploadBox) {
        // Trigger file input click
        const uploadBtn = document.querySelector(".upload-btn");
        if (uploadBtn) uploadBtn.addEventListener("click", () => fileInput.click());

        // Handle file selection
        fileInput.addEventListener("change", () => {
            const file = fileInput.files[0];
            slideStatus.textContent = file ? `Selected: ${file.name}` : "No file uploaded";
        });

        // Handle file upload
        submitBtn.addEventListener("click", () => {
            const file = fileInput.files[0];
            if (!file) {
                return; // Exit if no file is selected
            }
        
            showLoading(); // Show the loading animation
        
            const formData = new FormData();
            formData.append("file", file);
        
            fetch("/upload", { method: "POST", body: formData })
                .then(res => res.json())
                .catch(() => {})
                .finally(() => {
                    hideLoading(); // Hide the loading animation
                    fileInput.value = ""; // Reset file input
                    slideStatus.textContent = "No file uploaded";
                });
        });
    }
});