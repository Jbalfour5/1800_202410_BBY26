

// Function to load the header
function loadHeader() {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
        })
        .catch(error => console.error('Error loading the header:', error));
}

// Load the header on page load
window.onload = loadHeader;
