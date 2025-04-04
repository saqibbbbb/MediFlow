// Driver Dashboard JavaScript

// Sample ambulance request data (in a real app, this would come from a server)
const ambulanceRequests = [
    {
        id: "REQ20250403001",
        patientName: "Khushi Patel",
        patientPhone: "9870362233",
        patientLocation: "https://maps.app.goo.gl/owANTMyiPg4dWi16A",
        emergencyType: "Critical",
        timestamp: "2025-04-03 09:30:00",
        status: "Pending",
        driverId: "",
        driverName: "",
        hospitalId: ""
    },
    {
        id: "REQ20250403002",
        patientName: "Raj Sharma",
        patientPhone: "9876543210",
        patientLocation: "https://maps.app.goo.gl/abcdefg",
        emergencyType: "Urgent",
        timestamp: "2025-04-03 10:15:00",
        status: "Pending",
        driverId: "",
        driverName: "",
        hospitalId: ""
    }
];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentDriver = JSON.parse(localStorage.getItem('currentDriver'));
    if (!currentDriver) {
        window.location.href = 'driver-login.html';
        return;
    }
    
    // Update driver info
    document.getElementById('driver-name').textContent = currentDriver.name;
    document.getElementById('tracker-id').textContent = currentDriver.trackerId;
    document.getElementById('hospital-name').textContent = currentDriver.hospital;
    document.getElementById('current-location').textContent = currentDriver.location;
    
    // Update status indicator
    const statusIndicator = document.getElementById('status-indicator');
    const toggleStatusBtn = document.getElementById('toggle-status');
    
    if (currentDriver.status === 'Available') {
        statusIndicator.className = 'status-available';
        statusIndicator.textContent = '● Available';
        toggleStatusBtn.textContent = 'Go Offline';
    } else if (currentDriver.status === 'On Duty') {
        statusIndicator.className = 'status-busy';
        statusIndicator.textContent = '● On Duty';
        toggleStatusBtn.textContent = 'Go Available';
    } else {
        statusIndicator.className = 'status-offline';
        statusIndicator.textContent = '● Offline';
        toggleStatusBtn.textContent = 'Go Available';
    }
    
    // Toggle status button
    toggleStatusBtn.addEventListener('click', function() {
        if (currentDriver.status === 'Available') {
            currentDriver.status = 'Offline';
            statusIndicator.className = 'status-offline';
            statusIndicator.textContent = '● Offline';
            this.textContent = 'Go Available';
        } else {
            currentDriver.status = 'Available';
            statusIndicator.className = 'status-available';
            statusIndicator.textContent = '● Available';
            this.textContent = 'Go Offline';
        }
        
        // Update localStorage
        localStorage.setItem('currentDriver', JSON.stringify(currentDriver));
    });
    
    // Update location button
    document.getElementById('update-location').addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const locationUrl = `https://maps.app.goo.gl/?q=${lat},${lng}`;
                
                // Update location in UI
                document.getElementById('current-location').textContent = locationUrl;
                
                // Update location in localStorage
                currentDriver.location = locationUrl;
                localStorage.setItem('currentDriver', JSON.stringify(currentDriver));
                
                alert('Location updated successfully!');
            }, function(error) {
                alert('Error getting location: ' + error.message);
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    });
    
    // Load ambulance requests
    loadAmbulanceRequests();
    
    // Check for new requests periodically (every 30 seconds)
    setInterval(checkForNewRequests, 30000);
});

// Load ambulance requests
function loadAmbulanceRequests() {
    const currentDriver = JSON.parse(localStorage.getItem('currentDriver'));
    const requestsTableBody = document.getElementById('requests-table-body');
    const noRequests = document.getElementById('no-requests');
    const notificationArea = document.getElementById('notification-area');
    
    // Filter requests for this driver (pending or accepted by this driver)
    const driverRequests = ambulanceRequests.filter(request => 
        request.status === 'Pending' || 
        (request.driverId === currentDriver.trackerId && request.status === 'Accepted')
    );
    
    // Clear existing content
    requestsTableBody.innerHTML = '';
    notificationArea.innerHTML = '';
    
    if (driverRequests.length === 0) {
        // Show no requests message
        noRequests.style.display = 'block';
        notificationArea.innerHTML = `
            <div class="no-notifications">
                <i class="fas fa-check-circle"></i>
                <p>No new notifications</p>
            </div>
        `;
    } else {
        // Hide no requests message
        noRequests.style.display = 'none';
        
        // Show notification for pending requests
        const pendingRequests = driverRequests.filter(request => request.status === 'Pending');
        if (pendingRequests.length > 0) {
            notificationArea.innerHTML = `
                <div class="notification-alert">
                    <h4><i class="fas fa-exclamation-triangle"></i> Patient in Danger!</h4>
                    <p>You have ${pendingRequests.length} pending request(s).</p>
                </div>
            `;
        }
        
        // Populate requests table
        driverRequests.forEach(request => {
            const row = document.createElement('tr');
            
            // Create emergency type badge
            let emergencyBadge = '';
            if (request.emergencyType === 'Critical') {
                emergencyBadge = '<span class="badge emergency-critical">Critical</span>';
            } else if (request.emergencyType === 'Urgent') {
                emergencyBadge = '<span class="badge emergency-urgent">Urgent</span>';
            } else {
                emergencyBadge = '<span class="badge emergency-non">Non-Emergency</span>';
            }
            
            // Create status badge
            let statusBadge = '';
            if (request.status === 'Pending') {
                statusBadge = '<span class="badge status-pending">Pending</span>';
            } else if (request.status === 'Accepted') {
                statusBadge = '<span class="badge status-accepted">Accepted</span>';
            } else {
                statusBadge = '<span class="badge status-completed">Completed</span>';
            }
            
            // Create action buttons
            let actionButtons = '';
            if (request.status === 'Pending') {
                actionButtons = `
                    <button class="btn primary-btn btn-sm accept-btn" data-id="${request.id}">
                        <i class="fas fa-check"></i> Accept
                    </button>
                    <button class="btn secondary-btn btn-sm reject-btn" data-id="${request.id}">
                        <i class="fas fa-times"></i> Reject
                    </button>
                `;
            } else if (request.status === 'Accepted' && request.driverId === currentDriver.trackerId) {
                actionButtons = `
                    <a href="driver-tracking.html?id=${request.id}" class="btn primary-btn btn-sm">
                        <i class="fas fa-map-marked-alt"></i> Track
                    </a>
                `;
            } else {
                actionButtons = `
                    <button class="btn secondary-btn btn-sm" disabled>No Action</button>
                `;
            }
            
            row.innerHTML = `
                <td>${request.id}</td>
                <td>${request.patientName}</td>
                <td>${emergencyBadge}</td>
                <td>${request.timestamp}</td>
                <td>${statusBadge}</td>
                <td>${actionButtons}</td>
            `;
            
            requestsTableBody.appendChild(row);
        });
        
        // Add event listeners to accept/reject buttons
        document.querySelectorAll('.accept-btn').forEach(button => {
            button.addEventListener('click', function() {
                const requestId = this.getAttribute('data-id');
                showEmergencyModal(requestId);
            });
        });
        
        document.querySelectorAll('.reject-btn').forEach(button => {
            button.addEventListener('click', function() {
                const requestId = this.getAttribute('data-id');
                rejectRequest(requestId);
            });
        });
    }
}

// Show emergency modal
function showEmergencyModal(requestId) {
    const modal = document.getElementById('emergency-modal');
    const request = ambulanceRequests.find(req => req.id === requestId);
    
    if (request) {
        document.getElementById('modal-patient-name').textContent = request.patientName;
        document.getElementById('modal-emergency-type').textContent = request.emergencyType;
        document.getElementById('modal-patient-location').textContent = request.patientLocation;
        
        // In a real app, you would load a map here
        document.getElementById('modal-map').innerHTML = `
            <div style="background-color: #f1f1f1; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                <p>Map showing patient location would be displayed here</p>
            </div>
        `;
        
        // Show modal
        modal.style.display = 'block';
        
        // Accept button
        document.getElementById('accept-request').onclick = function() {
            acceptRequest(requestId);
            modal.style.display = 'none';
        };
        
        // Reject button
        document.getElementById('reject-request').onclick = function() {
            rejectRequest(requestId);
            modal.style.display = 'none';
        };
        
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
}

// Accept request
function acceptRequest(requestId) {
    const currentDriver = JSON.parse(localStorage.getItem('currentDriver'));
    const requestIndex = ambulanceRequests.findIndex(req => req.id === requestId);
    
    if (requestIndex !== -1) {
        // Update request
        ambulanceRequests[requestIndex].status = 'Accepted';
        ambulanceRequests[requestIndex].driverId = currentDriver.trackerId;
        ambulanceRequests[requestIndex].driverName = currentDriver.name;
        
        // Update driver status
        currentDriver.status = 'On Duty';
        localStorage.setItem('currentDriver', JSON.stringify(currentDriver));
        
        // Update UI
        document.getElementById('status-indicator').className = 'status-busy';
        document.getElementById('status-indicator').textContent = '● On Duty';
        document.getElementById('toggle-status').textContent = 'Go Available';
        
        // Save request to localStorage for tracking page
        localStorage.setItem('currentRequest', JSON.stringify(ambulanceRequests[requestIndex]));
        
        // Reload requests
        loadAmbulanceRequests();
        
        // Redirect to tracking page
        window.location.href = `driver-tracking.html?id=${requestId}`;
    }
}

// Reject request
function rejectRequest(requestId) {
    const requestIndex = ambulanceRequests.findIndex(req => req.id === requestId);
    
    if (requestIndex !== -1) {
        // In a real app, you would reassign to another driver
        // For demo, we'll just mark as rejected
        ambulanceRequests[requestIndex].status = 'Rejected';
        
        // Reload requests
        loadAmbulanceRequests();
        
        alert('Request rejected');
    }
}

// Check for new requests
function checkForNewRequests() {
    // In a real app, you would make an API call to check for new requests
    // For demo, we'll just reload the existing requests
    loadAmbulanceRequests();
}