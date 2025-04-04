// Driver Profile JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentDriver = JSON.parse(localStorage.getItem('currentDriver'));
    if (!currentDriver) {
        window.location.href = 'driver-login.html';
        return;
    }
    
    // Update profile information
    document.getElementById('profile-name').textContent = currentDriver.name;
    document.getElementById('profile-full-name').textContent = currentDriver.name;
    document.getElementById('profile-email').textContent = currentDriver.email;
    document.getElementById('profile-hospital').textContent = currentDriver.hospital;
    document.getElementById('profile-tracker-id').textContent = currentDriver.trackerId;
    document.getElementById('view-location-map').href = currentDriver.location;
    
    // Update status indicator
    const statusIndicator = document.getElementById('profile-status-indicator');
    
    if (currentDriver.status === 'Available') {
        statusIndicator.className = 'status-available';
        statusIndicator.textContent = '● Available';
    } else if (currentDriver.status === 'On Duty') {
        statusIndicator.className = 'status-busy';
        statusIndicator.textContent = '● On Duty';
    } else {
        statusIndicator.className = 'status-offline';
        statusIndicator.textContent = '● Offline';
    }
    
    // In a real app, you would load the actual document links
    // For demo, we'll just use placeholder links
    document.getElementById('view-license').href = '#';
    document.getElementById('view-aadhaar').href = '#';
    
    // Edit profile button
    document.getElementById('edit-profile').addEventListener('click', function() {
        showEditProfileModal();
    });
});

// Show edit profile modal
function showEditProfileModal() {
    const modal = document.getElementById('edit-profile-modal');
    const currentDriver = JSON.parse(localStorage.getItem('currentDriver'));
    
    // Populate form with current values
    document.getElementById('edit-name').value = currentDriver.name;
    document.getElementById('edit-email').value = currentDriver.email;
    document.getElementById('edit-location').value = currentDriver.location;
    
    // Select current hospital in dropdown
    const hospitalSelect = document.getElementById('edit-hospital');
    for (let i = 0; i < hospitalSelect.options.length; i++) {
        if (hospitalSelect.options[i].value === currentDriver.hospital) {
            hospitalSelect.selectedIndex = i;
            break;
        }
    }
    
    // Show modal
    modal.style.display = 'block';
    
    // Get location button
    document.getElementById('edit-get-location').addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const locationUrl = `https://maps.app.goo.gl/?q=${lat},${lng}`;
                document.getElementById('edit-location').value = locationUrl;
            }, function(error) {
                alert('Error getting location: ' + error.message);
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    });
    
    // Form submission
    document.getElementById('edit-profile-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Update driver info
        currentDriver.name = document.getElementById('edit-name').value;
        currentDriver.email = document.getElementById('edit-email').value;
        currentDriver.hospital = document.getElementById('edit-hospital').value;
        currentDriver.location = document.getElementById('edit-location').value;
        
        // Save to localStorage
        localStorage.setItem('currentDriver', JSON.stringify(currentDriver));
        
        // Update UI
        document.getElementById('profile-name').textContent = currentDriver.name;
        document.getElementById('profile-full-name').textContent = currentDriver.name;
        document.getElementById('profile-email').textContent = currentDriver.email;
        document.getElementById('profile-hospital').textContent = currentDriver.hospital;
        document.getElementById('view-location-map').href = currentDriver.location;
        
        // Close modal
        modal.style.display = 'none';
        
        alert('Profile updated successfully!');
    });
    
    // Close button
    document.querySelector('.close-modal').onclick = function() {
        modal.style.display = 'none';
    };
    
    // Close when clicking outside the modal
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}