document.getElementById("vipraFormHindi").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission
    console.log('Form submitted!'); // Debugging line

    const formData = new FormData(this); // Create FormData object from the form

    fetch("/api/send-email", { // Ensure you're calling the correct API endpoint
        method: "POST",
        body: formData, // Send the form data
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to send email. Please try again.");
        }
        return response.text(); // Parse response text
    })
    .then(data => {
        document.getElementById("responseMessage").textContent = data; // Show success message
        this.reset(); // Reset the form
    })
    .catch(error => {
        console.error('Error:', error); // Log the error
        document.getElementById("responseMessage").textContent = error.message; // Show error message
    });
});
