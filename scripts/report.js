var reportDocID = localStorage.getItem("reportDocID");
console.log(reportDocID);

function getReportName(id) {
    db.collection("reports")
        .doc(id)
        .get()
        .then((thisReport) => {
            var reportName = thisReport.data().name;
            document.getElementById("reportName").innerHTML = reportName;
        });
}

getReportName(reportDocID);



// Add this JavaScript code to make stars clickable

// Select all elements with the class name "star" and store them in the "stars" variable
const stars = document.querySelectorAll('.star');

// Iterate through each star element
stars.forEach((star, index) => {
    // Add a click event listener to the current star
    star.addEventListener('click', () => {
        // Fill in clicked star and stars before it
        for (let i = 0; i <= index; i++) {
            // Change the text content of stars to 'star' (filled)
            document.getElementById(`star${i + 1}`).textContent = 'star';
        }
    });
});



function writeReport() {
    console.log("inside write report");
    let placeTitle = document.getElementById("title").value;
    let placeParking = document.getElementById("parking").value;
    let placeTransportation = document.getElementById("transportation").value;
    let placeAmenities = document.getElementById("amenities").value;
    let placeSafetyMeasures = document.getElementById("safetyMeasures").value;
    let placeCrowding = document.getElementById("crowding").value;
    let placeLighting = document.getElementById("lighting").value;
    let placeAccessibility = document.getElementById("accessibility").value;
    let placeDescription = document.getElementById("description").value;

    // Get the star rating
    // Get all the elements with the class "star" and store them in the 'stars' variable
    const stars = document.querySelectorAll('.star');
    // Initialize a variable 'hikeRating' to keep track of the rating count
    let placeRating = 0;
    // Iterate through each element in the 'stars' NodeList using the forEach method
    stars.forEach((star) => {
        // Check if the text content of the current 'star' element is equal to the string 'star'
        if (star.textContent === 'star') {
            // If the condition is met, increment the 'hikeRating' by 1
            placeRating++;
        }
    });

    console.log(placeTitle, placeParking, placeTransportation, placeAmenities, placeSafetyMeasures, placeCrowding, placeLighting, placeAccessibility, placeDescription);

    var user = firebase.auth().currentUser;
    if (user) {
        var currentUser = db.collection("users").doc(user.uid);
        var userID = user.uid;

        // Get the document for the current user.
        db.collection("reports").add({
            reportDocID: reportDocID,
            userID: userID,
            title: placeTitle,
            parking: placeParking,
            transportation: placeTransportation,
            amenities: placeAmenities,
            safety: placeSafetyMeasures,
            crowding: placeCrowding,
            lighting: placeLighting,
            accessibility: placeAccessibility,
            rating: placeRating,
            commentsFeedback: placeDescription,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            window.location.href = "thanks.html"; // Redirect to the thanks page
        });
    } else {
        console.log("No user is signed in");
        window.location.href = 'report.html';
    }
}






