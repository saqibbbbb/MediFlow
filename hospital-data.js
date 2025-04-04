// Hospital data for dropdown menus

// Sample hospital data (in a real app, this would come from a server)
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
    },
    {
        id: "103",
        name: "Metro Medical Center",
        city: "Bangalore",
        contact: "8765432109",
        totalBeds: "150",
        icuBeds: "30",
        emergencyService: "Yes",
        totalDoctors: "400",
        totalNurses: "600",
        satisfaction: "4.5",
        location: "https://maps.app.goo.gl/hijklmn"
    },
    {
        id: "104",
        name: "Apollo Hospital",
        city: "Chennai",
        contact: "7654321098",
        totalBeds: "200",
        icuBeds: "45",
        emergencyService: "Yes",
        totalDoctors: "500",
        totalNurses: "750",
        satisfaction: "4.7",
        location: "https://maps.app.goo.gl/opqrstu"
    }
];

// Populate hospital dropdown in registration form
document.addEventListener('DOMContentLoaded', function() {
    const hospitalSelect = document.getElementById('hospital');
    const editHospitalSelect = document.getElementById('edit-hospital');
    
    if (hospitalSelect) {
        hospitals.forEach(hospital => {
            const option = document.createElement('option');
            option.value = hospital.name;
            option.textContent = hospital.name;
            hospitalSelect.appendChild(option);
        });
    }
    
    if (editHospitalSelect) {
        hospitals.forEach(hospital => {
            const option = document.createElement('option');
            option.value = hospital.name;
            option.textContent = hospital.name;
            editHospitalSelect.appendChild(option);
        });
    }
});

// Function to get hospital details by name
function getHospitalByName(name) {
    return hospitals.find(hospital => hospital.name === name);
}