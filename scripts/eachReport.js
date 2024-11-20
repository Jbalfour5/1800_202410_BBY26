function displayReportDetails() {
    let params = new URLSearchParams(window.location.search);
    let reportID = params.get("id");

    if (reportID) {
        db.collection("reports").doc(reportID).get().then((doc) => {
            if (doc.exists) {
                let reportData = doc.data();
                document.getElementById("reportTitle").innerText = reportData.title;
                document.getElementById("reportRating").innerText = `Rating: ${reportData.rating}/5`;
                document.getElementById("reportComments").innerText = reportData.commentsFeedback;

                document.getElementById("reportParking").innerText = `Parking: ${reportData.parking}`;
                document.getElementById("reportTransportation").innerText = `Transportation: ${reportData.transportation}`;
                document.getElementById("reportAmenities").innerText = `Amenities: ${reportData.amenities}`;
                document.getElementById("reportSafety").innerText = `Safety Measures: ${reportData.safety}`;
                document.getElementById("reportCrowding").innerText = `Crowding: ${reportData.crowding}`;
                document.getElementById("reportLighting").innerText = `Lighting: ${reportData.lighting}`;
                document.getElementById("reportAccessibility").innerText = `Accessibility: ${reportData.accessibility}`;
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }
}

window.addEventListener('DOMContentLoaded', displayReportDetails);








function displayReportInfo() {
    let params = new URL(window.location.href); //get URL of search bar
    let ID = params.searchParams.get("docID"); //get value for key "id"
    console.log(ID);

    // doublecheck: is your collection called "Reviews" or "reviews"?
    db.collection("reports")
        .doc(ID)
        .get()
        .then(doc => {
            thisReport = doc.data();
            reportCode = thisReport.code;
            reportName = doc.data().name;

            // only populate title, and image
            document.getElementById("reportName").innerHTML = reportName;
        });
}

displayReportInfo();

function savePlaceNameDocumentIDAndRedirect() {
    let params = new URL(window.location.href) //get the url from the search bar
    let ID = params.searchParams.get("docID");
    localStorage.setItem('reportDocID', ID);
    window.location.href = 'report.html';
}


function populateReports() {
    console.log("test");
    let reportCardTemplate = document.getElementById("reportCardTemplate");
    let reportCardGroup = document.getElementById("reportCardGroup");

    let params = new URL(window.location.href); // Get the URL from the search bar
    let reportID = params.searchParams.get("docID");

    // Double-check: is your collection called "Reviews" or "reviews"?
    db.collection("reports")
        .where("reportDocID", "==", reportID)
        .get()
        .then((allReports) => {
            reports = allReports.docs;
            console.log(reports);
            reports.forEach((doc) => {
                var title = doc.data().title;
                var parking = doc.data().parking;
                var transportation = doc.data().transportation;
                var amenities = doc.data().amenities;
                var crowding = doc.data().crowding;
                var lighting = doc.data().lighting;
                var accessibility = doc.data().accessibility;
                var description = doc.data().description;
                var time = doc.data().timestamp.toDate();
                var rating = doc.data().rating; // Get the rating value
                console.log(rating)

                console.log(time);

                let reportCard = reportCardTemplate.content.cloneNode(true);
                reportCard.querySelector(".title").innerHTML = title;
                reportCard.querySelector(".time").innerHTML = new Date(
                    time
                ).toLocaleString();
                reportCard.querySelector(".parking").innerHTML = `Parking: ${parking}`;
                reportCard.querySelector(".transportation").innerHTML = `Transportation: ${transportation}`;
                reportCard.querySelector(".amenities").innerHTML = `Amenities: ${amenities}`;
                reportCard.querySelector(".crowding").innerHTML = `Crowding: ${crowding}`;
                reportCard.querySelector(".lighting").innerHTML = `Lighting: ${lighting}`;
                reportCard.querySelector(".accessibility").innerHTML = `Accessibility: ${accessibility}`;
                reportCard.querySelector(".description").innerHTML = `Description: ${description}`;


                // Populate the star rating based on the rating value

                // Initialize an empty string to store the star rating HTML
                let starRating = "";
                // This loop runs from i=0 to i<rating, where 'rating' is a variable holding the rating value.
                for (let i = 0; i < rating; i++) {
                    starRating += '<span class="material-icons">star</span>';
                }
                // After the first loop, this second loop runs from i=rating to i<5.
                for (let i = rating; i < 5; i++) {
                    starRating += '<span class="material-icons">star_outline</span>';
                }
                reportCard.querySelector(".star-rating").innerHTML = starRating;

                reportCardGroup.appendChild(reportCard);
            });
        });
}

populateReports();