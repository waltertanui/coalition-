// Function to update the UI with patient data
function updateUI(patientData) {
    // Update patient info
    document.getElementById('patientName').textContent = patientData.name;
    document.getElementById('patientDOB').textContent = patientData.date_of_birth;
    document.getElementById('patientGender').textContent = patientData.gender;
    document.getElementById('patientContact').textContent = patientData.phone_number;
    document.getElementById('patientEmergencyContact').textContent = patientData.emergency_contact;
    document.getElementById('patientInsurance').textContent = patientData.insurance_type;

    // Update patient avatar
    document.getElementById('patientAvatar').src = patientData.profile_picture;

    // Update vitals
    const latestDiagnosis = patientData.diagnosis_history[0];
    updateVital('respiratoryRate', latestDiagnosis.respiratory_rate);
    updateVital('temperature', latestDiagnosis.temperature);
    updateVital('heartRate', latestDiagnosis.heart_rate);

    // Update diagnostic list
    updateDiagnosticList(patientData.diagnostic_list);

    // Update blood pressure chart
    createBloodPressureChart(patientData.diagnosis_history);


    // Update lab results
    updateLabResults(patientData.lab_results);
}

// Helper function to update vital signs
function updateVital(id, data) {
    const element = document.getElementById(id);
    element.textContent = data.value;
    element.nextElementSibling.textContent = data.levels;
}

// Helper function to update diagnostic list
function updateDiagnosticList(diagnosticList) {
    const diagnosticListElement = document.getElementById('diagnosticList');
    diagnosticListElement.innerHTML = '';
    diagnosticList.forEach(diagnosis => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${diagnosis.name}</td>
            <td>${diagnosis.description}</td>
            <td>${diagnosis.status}</td>
        `;
        diagnosticListElement.appendChild(row);
    });
}

// Helper function to update blood pressure chart
function createBloodPressureChart(diagnosisHistory) {
    const ctx = document.getElementById('bloodPressureChart').getContext('2d');
    
    // Prepare data for the chart
    const labels = diagnosisHistory.map(entry => `${entry.month} ${entry.year}`);
    const systolicData = diagnosisHistory.map(entry => entry.blood_pressure.systolic.value);
    const diastolicData = diagnosisHistory.map(entry => entry.blood_pressure.diastolic.value);
    
    // Get the latest systolic and diastolic values and levels
    const latestEntry = diagnosisHistory[diagnosisHistory.length - 1];
    const latestSystolic = latestEntry.blood_pressure.systolic;
    const latestDiastolic = latestEntry.blood_pressure.diastolic;

    // Update the legend with the latest values and levels
    document.querySelector('.legend-item.systolic .legend-value').textContent = `Systolic ${latestSystolic.value}`;
    document.querySelector('.legend-item.systolic .legend-level').textContent = latestSystolic.levels;
    document.querySelector('.legend-item.diastolic .legend-value').textContent = `Diastolic ${latestDiastolic.value}`;
    document.querySelector('.legend-item.diastolic .legend-level').textContent = latestDiastolic.levels;

    // Create the chart
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Systolic',
                    data: systolicData,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Diastolic',
                    data: diastolicData,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    tension: 0.4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Blood Pressure History'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Blood Pressure (mmHg)'
                    },
                    suggestedMin: 60,
                    suggestedMax: 180
                }
            }
        }
    });
}

// Fetch data from API
fetch('https://fedskillstest.coalitiontechnologies.workers.dev', {
    headers: {
        'Authorization': 'Basic ' + btoa('coalition:skills-test')
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
    const jessicaTaylor = data.find(patient => patient.name === "Jessica Taylor");
    if (jessicaTaylor) {
        // Create the blood pressure chart
        createBloodPressureChart(jessicaTaylor.diagnosis_history);
        
        // Update the diagnostic list
        updateDiagnosticList(jessicaTaylor.diagnostic_list);

         // Update lab results
         updateLabResults(jessicaTaylor.lab_results);

        // Update other UI elements as needed
        updateUI(jessicaTaylor);
    } else {
        console.error('Jessica Taylor not found in the data');
    }
})
.catch(error => {
    console.error('Error fetching data:', error);
});



// Helper function to update lab results list
function updateLabResults(labResults) {
    const labResultsList = document.getElementById('labResultsList');
    labResultsList.innerHTML = '';
    labResults.forEach(result => {
        const li = document.createElement('li');
        li.textContent = result;
        labResultsList.appendChild(li);
    });
}