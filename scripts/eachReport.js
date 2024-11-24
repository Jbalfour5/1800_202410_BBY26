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
