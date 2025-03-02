// Function to update the current date and time
function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',  // Display the full name of the day
        year: 'numeric',  // Display the year in numeric format
        month: 'long',    // Display the full name of the month
        day: 'numeric',   // Display the day of the month in numeric format
        hour: '2-digit',  // Display the hour in 2-digit format
        minute: '2-digit',// Display the minute in 2-digit format
        second: '2-digit' // Display the second in 2-digit format
    };
    // Update the content of the <h4> element with the formatted date and time
    document.getElementById('datetime').textContent = now.toLocaleString('fr-FR', options);
}

// Call the function immediately to display the datetime on page load
updateDateTime();

// Update the datetime every second
setInterval(updateDateTime, 1000);
