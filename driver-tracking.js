// Driver Tracking JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentDriver = JSON.parse(localStorage.getItem('currentDriver'));
    if (!currentDriver) {
        window.location.href = 'driver-login.html';
        return;
    }
    
    // Get request ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const requestId = urlParams.get('id');
    
    // Get request from localStorage or from sample data
    let currentRequest = JSON.parse(localStorage.getItem('currentRequest'));
    
    // If no request in localStorage or ID doesn't match, try to find in sample data
    if (!currentRequest || currentRequest.id !== requestId) {
        // Sample ambulance request data (in a real app, this would come from a server)
        const ambulanceRequests = [
            {
                id: "REQ20250403001",
                patientName: "Khushi Patel",
                patientPhone: "9870362233",
                patientLocation: "https://maps.app.goo.gl/owANTMyiPg4dWi16A",
                emergencyType: "Critical",
                timestamp: "2025-04-03 09:30:00",
                status: "Accepted",
                driverId: currentDriver.trackerId,
                driverName: currentDriver.name,
                hospitalId: "101"
            },
            {
                id: "REQ20250403002",
                patientName: "Raj Sharma",
                patientPhone: "9876543210",
                patientLocation: "https://maps.app.goo.gl/abcdefg",
                emergencyType: "Urgent",
                timestamp: "2025-04-03 10:15:00",
                status: "Accepted",
                driverId: currentDriver.trackerId,
                driverName: currentDriver.name,
                hospitalId: "102"
            }
        ];
        
        currentRequest = ambulanceRequests.find(req => req.id === requestId);
        
        if (!currentRequest) {
            alert('Request not found');
            window.location.href = 'driver-dashboard.html';
            return;
        }
        
        // Save to localStorage
        localStorage.setItem('currentRequest', JSON.stringify(currentRequest));
    }
    
    // Update request details
    document.getElementById('request-id').textContent = currentRequest.id;
    document.getElementById('request-time').textContent = currentRequest.timestamp;
    
    // Update emergency type badge
    const emergencyType = document.getElementById('emergency-type');
    if (currentRequest.emergencyType === 'Critical') {
        emergencyType.className = 'badge emergency-critical';
        emergencyType.textContent = 'Critical';
    } else if (currentRequest.emergencyType === 'Urgent') {
        emergencyType.className = 'badge emergency-urgent';
        emergencyType.textContent = 'Urgent';
    } else {
        emergencyType.className = 'badge emergency-non';
        emergencyType.textContent = 'Non-Emergency';
    }
    
    // Update patient details
    document.getElementById('patient-name').textContent = currentRequest.patientName;
    document.getElementById('patient-phone').textContent = currentRequest.patientPhone;
    document.getElementById('patient-location-link').href = currentRequest.patientLocation;
    document.getElementById('patient-location-text').textContent = currentRequest.patientLocation;
    
    // Update driver location
    document.getElementById('driver-location').textContent = currentDriver.location;
    
    // Update hospital details
    const hospitals = [
        {
            id: "101",
            name: "Park Hospital",
            city: "Delhi",
            contact: "7668622939",
            totalBeds: "86",
            icuBeds: "13",
            emergencyService: "No",
            totalDoctors: "207",
            totalNurses: "347",
            satisfaction: "3.8",
            location: "https://maps.app.goo.gl/joiFrMpV7F1L81of6"
        },
        {
            id: "102",
            name: "City Hospital",
            city: "Mumbai",
            contact: "9876543210",
            totalBeds: "120",
            icuBeds: "25",
            emergencyService: "Yes",
            totalDoctors: "350",
            totalNurses: "500",
            satisfaction: "4.2",
            location: "https://maps.app.goo.gl/abcdefg"
        }
    ];
    
    const hospital = hospitals.find(h => h.id === currentRequest.hospitalId);
    
    if (hospital) {
        document.getElementById('hospital-name').textContent = hospital.name;
        document.getElementById('hospital-location').textContent = hospital.city;
        document.getElementById('hospital-phone').textContent = hospital.contact;
        document.getElementById('hospital-beds').textContent = hospital.totalBeds;
        document.getElementById('hospital-icu').textContent = hospital.icuBeds;
        document.getElementById('hospital-directions').href = hospital.location;
    }
    
    // Simulate loading map
    setTimeout(function() {
        document.getElementById('tracking-map').innerHTML = `
            <div style="background-color: #f1f1f1; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                <p>Interactive map showing patient and driver locations would be displayed here</p>
            </div>
        `;
    }, 2000);
    
    // Simulate ETA calculation
    setTimeout(function() {
        document.getElementById('eta').textContent = 'Approximately 8 minutes';
    }, 3000);
    
    // Update location button
    document.getElementById('update-location').addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const locationUrl = `https://maps.app.goo.gl/?q=${lat},${lng}`;
                
                // Update location in UI
                document.getElementById('driver-location').textContent = locationUrl;
                
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
    
    // Patient picked up button
    document.getElementById('patient-picked').addEventListener('click', function() {
        alert('Patient picked up status updated!');
        // In a real app, you would update the request status in the database
    });
    
    // Complete request button
    document.getElementById('complete-request').addEventListener('click', function() {
        if (confirm('Are you sure you want to complete this request?')) {
            // Update request status
            currentRequest.status = 'Completed';
            localStorage.setItem('currentRequest', JSON.stringify(currentRequest));
            
            // Update driver status
            currentDriver.status = 'Available';
            localStorage.setItem('currentDriver', JSON.stringify(currentDriver));
            
            alert('Request completed successfully!');
            window.location.href = 'driver-dashboard.html';
        }
    });
});