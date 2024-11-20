var currentUser;               //points to the document of the user who is logged in
function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    let userName = userDoc.data().name;
                    let firstName = userDoc.data().firstName;
                    let userAge = userDoc.data().age;
                    let userCity = userDoc.data().city;
                    let userAccess = userDoc.data().access || "none";

                    console.log("userName:", userName); // Log userName
                    console.log("firstName:", firstName); // Log firstName
                    //if the data fields are not empty, then write them in to the form.
                    if (userName != null || firstName != null) {
                        document.getElementById("nameInput").value = userName || firstName;
                    }
                    if (userAge != null) {
                        document.getElementById("ageInput").value = userAge;
                    }
                    if (userCity != null) {
                        document.getElementById("cityInput").value = userCity;
                    }
                    if (userAccess != null) {
                        document.getElementById("accessInput").value = userAccess;
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

populateUserInfo();

function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo() {
    //enter code here

    //a) get user entered values
    userName = document.getElementById('nameInput').value;       //get the value of the field with id="nameInput"
    userAge = document.getElementById('ageInput').value;     //get the value of the field with id="schoolInput"
    userCity = document.getElementById('cityInput').value;
    userAccess = document.getElementById('accessInput').value;    //get the value of the field with id="cityInput"
    //b) update user's document in Firestore
    currentUser.update({
        name: userName,
        age: userAge,
        city: userCity,
        access: userAccess
    })
        .then(() => {
            console.log("Document successfully updated!");
        })
    //c) disable edit 
    document.getElementById('personalInfoFields').disabled = true;
}

