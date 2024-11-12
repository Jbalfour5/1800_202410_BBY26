// const reportForm = document.getElementById('reportForm');
// const submitReportButton = document.getElementById('submitReportButton');

// submitReportButton.addEventListener('click', async () => {
//     const reportTitle = document.getElementById('reportTitle').value;
//     const starsReview = document.getElementById('starsReview').value;
//     const parking = document.getElementById('parking').value;
//     const transportation = document.getElementById('transportation').value;
//     const amenities = document.getElementById('amenities').value;
//     const safetyMeasures = document.getElementById('safetyMeasures').value;
//     const crowding = document.getElementById('crowding').value;
//     const lighting = document.getElementById('lighting').value;
//     const accessibility = document.getElementById('accessibility').value;
//     const description = document.getElementById('description').value;

//     // Debugging logs
//     console.log("Title:", reportTitle);
//     console.log("Review:", starsReview);
//     console.log("Parking:", parking);
//     console.log("Transportation:", transportation);
//     console.log("Amenities:", amenities);
//     console.log("Safety Measures:", safetyMeasures);
//     console.log("Crowding:", crowding);
//     console.log("lighting:", lighting);
//     console.log("Accessibility:", accessibility);
//     console.log("Comments/Feedback:", description);

//     const post = {
//         title: reportTitle,
//         review: starsReview,
//         parking: parking,
//         transportation: transportation,
//         amenities: amenities,
//         safetyMeasures: safetyMeasures,
//         crowding: crowding,
//         lighting: lighting,
//         accessibility: accessibility,
//         description: description,
//         createdAt: new Date(),
//     };

//     const db = firebase.firestore();
//     db.collection('reports').add(report)
//         .then((docRef) => {
//             console.log("Report written with ID: ", docRef.id);
//             window.location.reload();

//         })
//         .catch((error) => {
//             console.error("Error adding post: ", error);
//         });
// });
