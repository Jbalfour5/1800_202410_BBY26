/**
 * Displays the details of a specific report on the page.
 * 
 * This function extracts the report ID from the URL parameters, 
 * retreives the corresponding data for that report from the firestore database 
 * and populates different page elements with the report information. 
 * It also handles cases where the report ID is invalid or the data retreival fails.
 * 
 */
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

//Triggers the displayReportDetails function once the DOM content has fully loaded
window.addEventListener('DOMContentLoaded', displayReportDetails);

/**
 * 
 */
function displayReportInfo() {
    let params = new URL(window.location.href);
    let ID = params.searchParams.get("docID");
    console.log(ID);

    db.collection("reports")
        .doc(ID)
        .get()
        .then(doc => {
            thisReport = doc.data();
            reportCode = thisReport.code;
            reportName = doc.data().name;

            document.getElementById("reportName").innerHTML = reportName;
        });
}
displayReportInfo(); //Runs the function

//Saves the place and document ID to local storage and redirects the user
function savePlaceNameDocumentIDAndRedirect() {
    let params = new URL(window.location.href)
    let ID = params.searchParams.get("docID");
    localStorage.setItem('reportDocID', ID);
    window.location.href = 'report.html';
}

//Populates the report html page with all reports for a specific place
function populateReports() {
    console.log("test");
    let reportCardTemplate = document.getElementById("reportCardTemplate");
    let reportCardGroup = document.getElementById("reportCardGroup");

    let params = new URL(window.location.href);
    let reportID = params.searchParams.get("docID");


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
                var rating = doc.data().rating;
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


                let starRating = "";

                for (let i = 0; i < rating; i++) {
                    starRating += '<span class="material-icons">star</span>';
                }

                for (let i = rating; i < 5; i++) {
                    starRating += '<span class="material-icons">star_outline</span>';
                }
                reportCard.querySelector(".star-rating").innerHTML = starRating;

                reportCardGroup.appendChild(reportCard);
            });
        });
}
populateReports(); //Runs the function