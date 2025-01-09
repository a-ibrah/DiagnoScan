document.addEventListener("DOMContentLoaded", () => {
    // Elements for classification UI
    const malignantOptions = $("#malignant-options");
    const malignantDropdown = $("#malignant-dropdown");
    const malignantOther = $("#malignant-other");
    const benignOptions = $("#benign-options");
    const benignLabel = $("#benign-label");
    const submitButton = $("#submit-classification");

    let selectedClassification = "";

    // Malignant Neoplasm Click Handler
    $("#btn-malignant").on("click", function () {
        malignantOptions.show();
        benignOptions.hide();
        submitButton.hide();
        selectedClassification = "";
        malignantDropdown.val("");
        malignantOther.hide();
    });

    // Benign or Non-Malignant Disease Click Handler
    $("#btn-benign").on("click", function () {
        benignOptions.show();
        malignantOptions.hide();
        submitButton.hide();
        selectedClassification = "";
    });

    // Healthy Tissue Click Handler
    $("#btn-normal").on("click", function () {
        malignantOptions.hide();
        benignOptions.hide();
        submitButton.show();
        selectedClassification = "Healthy Tissue";
    });

    // Malignant Dropdown Change Handler
    malignantDropdown.on("change", function () {
        const value = $(this).val();
        if (value === "other") {
            malignantOther.show();
        } else {
            malignantOther.hide();
        }
        selectedClassification = value;
        submitButton.show();
    });

    // Benign Input Change Handler
    benignLabel.on("input", function () {
        const value = $(this).val();
        selectedClassification = value;
        submitButton.show();
    });

    // Submit Button Click Handler
    submitButton.on("click", function () {
        if (!selectedRowId) {
            alert("No slide selected.");
            return;
        }

        let classification = selectedClassification;
        if (classification === "other") {
            classification = malignantOther.val();
        }

        if (!classification || classification.trim() === "") {
            alert("Please provide a valid classification.");
            return;
        }

        // Send data to backend to update metadata
        $.ajax({
            url: "/update_metadata",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                id: selectedRowId,
                classification: classification
            }),
            success: function (response) {
                alert("Classification submitted successfully!");

                // Hide classification screen and show queue
                $("#screen-2").hide();
                $("#screen-1").show();
                submitButton.hide();

                // Refresh both tables
                $('#slides-table').DataTable().ajax.reload(null, false);
                $('#completed-slides-table').DataTable().ajax.reload(null, false);

                // Reset selectedRowId after submission if needed
                selectedRowId = "";
            },
            error: function (xhr, status, error) {
                alert("Error updating classification: " + error);
            },
        });
    });
});