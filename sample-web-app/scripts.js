document.getElementById('applicationForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = {};

        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }

        console.log('Form Data:', data);

        document.getElementById('successMessage').style.display = 'block';

        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
            this.reset();
                document.getElementById('successMessage').style.display = 'none';
        },  3000);
    });

    const requiredFields = document.querySelectorAll('input[required], select[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.style.borderColor = '#e74c3c';
            } else {
                this.style.borderColor = '#28a745';
            }
        });
    });

    document.getElementById('email').addEventListener('blur', function() {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(this.value)) {
            this.style.borderColor = '#e74c3c';
        } else {
            this.style.borderColor = '#28a745';
        }
    });