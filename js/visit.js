// Initialize cart count from local storage
const savedCart = localStorage.getItem("cartItems");
if (savedCart) {
    const items = JSON.parse(savedCart);
    const spn = document.querySelector("#spn");
    if (spn) {
        spn.innerHTML = items.length;
    }
}

// Form submission handler
document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    // Validate form inputs
    if (!name || !email || !subject || !message) {
        Swal.fire({
            icon: "error",
            title: "Validation Error",
            text: "Please fill in all fields",
            timer: 1500,
            showConfirmButton: false
        });
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        Swal.fire({
            icon: "error",
            title: "Invalid Email",
            text: "Please enter a valid email address",
            timer: 1500,
            showConfirmButton: false
        });
        return;
    }

    // Store message in localStorage
    let messages = localStorage.getItem("contactMessages");
    messages = messages ? JSON.parse(messages) : [];

    const newMessage = {
        id: Date.now(),
        name: name,
        email: email,
        subject: subject,
        message: message,
        timestamp: new Date().toLocaleString()
    };

    messages.push(newMessage);
    localStorage.setItem("contactMessages", JSON.stringify(messages));

    // Show success message
    Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: `Thank you ${name}! We will get back to you soon.`,
        timer: 2000,
        showConfirmButton: false
    });

    // Reset form
    document.getElementById("contactForm").reset();
});

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Log stored messages (optional - for debugging)
function viewStoredMessages() {
    const messages = localStorage.getItem("contactMessages");
    if (messages) {
        console.log("Stored Messages:", JSON.parse(messages));
    }
}
