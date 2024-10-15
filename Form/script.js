 // Wait for the DOM to load
 document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('checkoutForm');
    const successMessage = document.getElementById('successMessage');

    // Helper function to show error
    function showError(input, message) {
        const errorElement = document.getElementById(input.id + 'Error');
        errorElement.textContent = message;
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    }

    // Helper function to show success
    function showSuccess(input) {
        const errorElement = document.getElementById(input.id + 'Error');
        errorElement.textContent = '';
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }

    // Function to validate email format
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
        return re.test(String(email).toLowerCase());
    }

    // Event listener for form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent form from submitting

        // Get input values
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const address = document.getElementById('address');
        const city = document.getElementById('city');

        let isFormValid = true;

        // Validate Name
        if (name.value.trim() === '') {
            showError(name, 'Name is required');
            isFormValid = false;
        } else {
            showSuccess(name);
        }

        // Validate Email
        if (email.value.trim() === '') {
            showError(email, 'Email is required');
            isFormValid = false;
        } else if (!isValidEmail(email.value.trim())) {
            showError(email, 'Please enter a valid email');
            isFormValid = false;
        } else {
            showSuccess(email);
        }

        // Validate Address
        if (address.value.trim() === '') {
            showError(address, 'Address is required');
            isFormValid = false;
        } else {
            showSuccess(address);
        }

        // Validate City
        if (city.value.trim() === '') {
            showError(city, 'City is required');
            isFormValid = false;
        } else {
            showSuccess(city);
        }

        // If form is valid, display success message
        if (isFormValid) {
            successMessage.classList.remove('d-none');
            form.reset();

            // Remove validation classes
            const inputs = form.querySelectorAll('.form-control');
            inputs.forEach(input => {
                input.classList.remove('is-valid');
                input.classList.remove('is-invalid');
            });

            // Hide success message after 3 seconds
            setTimeout(() => {
                successMessage.classList.add('d-none');
            }, 3000);
        } else {
            successMessage.classList.add('d-none');
        }
    });
});