// Driver Authentication JavaScript

// Sample driver data (in a real app, this would come from a server)
const sampleDrivers = [
    {
        id: 1,
        name: "Arpita Patel",
        email: "driver1@example.com",
        password: "password1", // In a real app, this would be hashed
        hospital: "Park Hospital",
        location: "https://maps.app.goo.gl/joiFrMpV7F1L81of6",
        trackerId: "TR1001",
        licensePhoto: "license_photo_1.jpg",
        aadhaarCard: "aadhaar_card_1.jpg",
        status: "Available"
    },
    {
        id: 2,
        name: "Rahul Sharma",
        email: "driver2@example.com",
        password: "password2",
        hospital: "City Hospital",
        location: "https://maps.app.goo.gl/abcdefg",
        trackerId: "TR1002",
        licensePhoto: "license_photo_2.jpg",
        aadhaarCard: "aadhaar_card_2.jpg",
        status: "Available"
    }
];

// Login form handler
const loginForm = document.getElementById('driver-login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Find driver with matching email
        const driver = sampleDrivers.find(d => d.email === email);
        
        if (driver && driver.password === password) {
            // Store driver info in localStorage (in a real app, you'd use a token-based auth system)
            localStorage.setItem('currentDriver', JSON.stringify({
                id: driver.id,
                name: driver.name,
                email: driver.email,
                hospital: driver.hospital,
                location: driver.location,
                trackerId: driver.trackerId,
                status: driver.status
            }));
            
            // Redirect to dashboard
            window.location.href = 'driver-dashboard.html';
        } else {
            alert('Invalid email or password. Please try again.');
        }
    });
}

// Registration form handler
const registrationForm = document.getElementById('driver-registration-form');
if (registrationForm) {
    // Get location button
    const getLocationBtn = document.getElementById('get-location');
    if (getLocationBtn) {
        getLocationBtn.addEventListener('click', function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const locationUrl = `https://maps.app.goo.gl/?q=${lat},${lng}`;
                    document.getElementById('location').value = locationUrl;
                }, function(error) {
                    alert('Error getting location: ' + error.message);
                });
            } else {
                alert('Geolocation is not supported by this browser.');
            }
        });
    }
    
    // Form submission
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const hospital = document.getElementById('hospital').value;
        const location = document.getElementById('location').value;
        
        // Check if email already exists
        if (sampleDrivers.some(d => d.email === email)) {
            alert('Email already registered. Please use a different email.');
            return;
        }
        
        // In a real app, you would send this data to the server
        // For demo purposes, we'll just show a success message and redirect
        alert('Registration successful! Please login with your credentials.');
        window.location.href = 'driver-login.html';
    });
}

// Logout handler
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Clear driver info from localStorage
        localStorage.removeItem('currentDriver');
        
        // Redirect to login page
        window.location.href = 'driver-login.html';
    });
}

// Check if user is logged in
function checkAuth() {
    const currentDriver = localStorage.getItem('currentDriver');
    
    // If on a protected page and not logged in, redirect to login
    if (!currentDriver && 
        (window.location.pathname.includes('driver-dashboard') || 
         window.location.pathname.includes('driver-profile') || 
         window.location.pathname.includes('driver-tracking'))) {
        window.location.href = 'driver-login.html';
    }
    
    // If on login/register page and already logged in, redirect to dashboard
    if (currentDriver && 
        (window.location.pathname.includes('driver-login') || 
         window.location.pathname.includes('driver-register'))) {
        window.location.href = 'driver-dashboard.html';
    }
}

// Run auth check when page loads
document.addEventListener('DOMContentLoaded', checkAuth);