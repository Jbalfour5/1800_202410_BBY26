var currentUser; //points to the document of the user who is logged in
/**
 * Populates the user information fields with data retrieved from the Firebase Firestore database.
 * 
 * This function listens for changes in the Firebase authentication state. When a user is logged in, 
 * it retrieves the user's document from Firestore, extracts relevant data fields (name, age, city, etc.), 
 * and populates corresponding form fields in the UI.
 * 
 * Some or several parts of this function have been extracted from Carly's demo.
 */
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
    userName = document.getElementById('nameInput').value;
    userAge = document.getElementById('ageInput').value;
    userCity = document.getElementById('cityInput').value;
    userAccess = document.getElementById('accessInput').value;
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

/**
 * Fetches and displays posts from the Firebase firestore database.
 * 
 * This function retrieves the posts from the 'posts' collection within Firestore, 
 * orders them by creation date in descending order (newest-oldest)
 * and dynamically generates bootstrap cards to display each post.
 * The bootstrap cards contain a:
 *  - title
 *  - description
 *  - image
 *  - address
 *  - like/dislike button
 *  - author box
 * 
 * This function also sets up event listeners for the like and dislike buttons to handle user reactions.
 * 
 */
function displayPosts(loadMore = false) {
    const postContainer = document.querySelector('.postContainer');
    if (!loadMore) {
        postContainer.innerHTML = '';
        lastVisible = null;
    }
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const userId = user.uid;
            let query = db.collection("posts")
                .where("creatorID", "==", userId)
                .orderBy("createdAt", "desc")
                .limit(POSTS_PER_PAGE);

            if (lastVisible) {
                query = query.startAfter(lastVisible);
            }

            query.get()
                .then((querySnapshot) => {
                    if (querySnapshot.empty) {
                        const loadMoreButton = document.getElementById('loadMoreButton');
                        if (loadMoreButton) loadMoreButton.style.display = 'none';
                        return;
                    }

                    lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

                    const row = document.createElement('div');
                    row.className = 'row g-4 mt-4';

                    querySnapshot.forEach((doc) => {
                        const postData = doc.data();
                        const postId = doc.id;

                        const col = document.createElement('div');
                        col.className = 'col-lg-4 col-md-6 col-sm-12';

                        const card = document.createElement('div');
                        card.className = 'card h-100';

                        const img = document.createElement('img');
                        img.className = 'card-img-top';
                        img.src = postData.imageUrl || 'images/noImage.png';

                        const cardBody = document.createElement('div');
                        cardBody.className = 'card-body d-flex flex-column';

                        const cardTitle = document.createElement('h5');
                        cardTitle.className = 'card-title';
                        cardTitle.textContent = postData.title;

                        const cardText = document.createElement('p');
                        cardText.className = 'card-text';
                        cardText.textContent = postData.description;

                        const addressText = document.createElement('p');
                        addressText.className = 'text-muted small text-center mt-2';
                        addressText.textContent = postData.address || 'Address not available';

                        const createdAtText = document.createElement('span');
                        createdAtText.className = 'text-muted small';
                        if (postData.createdAt instanceof firebase.firestore.Timestamp) {
                            const createdAtDate = postData.createdAt.toDate();
                            createdAtText.textContent = `Created on: ${createdAtDate.toLocaleString()}`;
                        } else {
                            createdAtText.textContent = `Created on: ${postData.createdAt}`;
                        }

                        const viewMoreButton = document.createElement('a');
                        viewMoreButton.className = 'btn btn-success w-100';
                        viewMoreButton.textContent = 'View More';
                        viewMoreButton.href = `postDetails.html?id=${postId}`;

                        const reactionContainer = document.createElement('div');
                        reactionContainer.className = 'mt-3 d-flex justify-content-between align-items-center';

                        const likeButton = document.createElement('button');
                        likeButton.className = 'btn btn-outline-success btn-sm likeButton';
                        likeButton.innerHTML = '<span class="material-icons">thumb_up</span>';
                        likeButton.dataset.postId = postId;

                        const dislikeButton = document.createElement('button');
                        dislikeButton.className = 'btn btn-outline-success btn-sm dislikeButton';
                        dislikeButton.innerHTML = '<span class="material-icons">thumb_down</span>';
                        dislikeButton.dataset.postId = postId;

                        const likeCount = document.createElement('span');
                        likeCount.className = 'ms-2';
                        likeCount.textContent = postData.likes || 0;

                        const dislikeCount = document.createElement('span');
                        dislikeCount.className = 'ms-2';
                        dislikeCount.textContent = postData.dislikes || 0;

                        const reliabilityText = document.createElement('span');
                        reliabilityText.className = 'text-center mx-3 small text-muted';

                        const updateReliabilityText = () => {
                            const likes = postData.likes || 0;
                            const dislikes = postData.dislikes || 0;
                            if (likes + dislikes === 0) {
                                reliabilityText.textContent = "Unreliable";
                            } else {
                                const ratio = likes / (likes + dislikes);
                                if (ratio >= 0.75) {
                                    reliabilityText.textContent = "Mostly Reliable";
                                } else if (ratio >= 0.5) {
                                    reliabilityText.textContent = "Reliable";
                                } else if (ratio >= 0.25) {
                                    reliabilityText.textContent = "Barely Reliable";
                                } else {
                                    reliabilityText.textContent = "Unreliable";
                                }
                            }
                        };

                        updateReliabilityText();

                        likeButton.appendChild(likeCount);
                        dislikeButton.appendChild(dislikeCount);

                        reactionContainer.appendChild(likeButton);
                        reactionContainer.appendChild(reliabilityText);
                        reactionContainer.appendChild(dislikeButton);

                        cardBody.appendChild(cardTitle);
                        cardBody.appendChild(cardText);
                        cardBody.appendChild(viewMoreButton);
                        cardBody.appendChild(reactionContainer);
                        cardBody.appendChild(addressText);
                        cardBody.appendChild(createdAtText);

                        card.appendChild(img);
                        card.appendChild(cardBody);

                        col.appendChild(card);
                        row.appendChild(col);
                    });

                    postContainer.appendChild(row);
                })
                .catch((error) => {
                    console.log("Error fetching user posts: ", error);
                });
        } else {
            console.log("No user is signed in.");
        }
    });
}

// Ensure the displayPosts function runs after DOM is loaded
window.addEventListener('DOMContentLoaded', () => displayPosts());











let reportIdToDelete;

function displayUserReports() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const userId = user.uid;
            const reportContainer = document.querySelector('#reportContainer');
            db.collection("reports")
                .where("userID", "==", userId)
                .get()
                .then((querySnapshot) => {
                    reportContainer.innerHTML = ''; // Clear any existing content
                    querySnapshot.forEach((doc) => {
                        const reportData = doc.data();
                        const reportId = doc.id;

                        // Create a Bootstrap card for each report
                        const card = document.createElement('div');
                        card.className = 'card mb-4 col-md-6';

                        const cardBody = document.createElement('div');
                        cardBody.className = 'card-body';

                        const cardTitle = document.createElement('h5');
                        cardTitle.className = 'card-title';
                        cardTitle.textContent = reportData.title;

                        const cardRating = document.createElement('p');
                        cardRating.textContent = `Rating: ${reportData.rating}/5`;

                        const cardComments = document.createElement('p');
                        cardComments.textContent = `Comments: ${reportData.commentsFeedback}`;

                        const cardDate = document.createElement('p');
                        const date = reportData.timestamp ? reportData.timestamp.toDate().toLocaleString() : 'Date not available';
                        cardDate.textContent = `Date: ${date}`;

                        const cardFooter = document.createElement('div');
                        cardFooter.className = 'card-footer text-center';

                        const viewMoreButton = document.createElement('a');
                        viewMoreButton.className = 'btn btn-success';
                        viewMoreButton.textContent = 'Read More';
                        viewMoreButton.href = `reportDetails.html?id=${reportId}&ref=profile`;

                        const deleteButton = document.createElement('button');
                        deleteButton.className = 'btn btn-danger ms-2';
                        deleteButton.textContent = 'Delete';
                        deleteButton.dataset.reportId = reportId;
                        deleteButton.dataset.bsToggle = 'modal';
                        deleteButton.dataset.bsTarget = '#deleteModal';

                        // Set up event listener for delete button
                        deleteButton.addEventListener('click', function () {
                            reportIdToDelete = reportId;
                        });

                        cardFooter.appendChild(viewMoreButton);
                        cardFooter.appendChild(deleteButton);

                        cardBody.appendChild(cardTitle);
                        cardBody.appendChild(cardRating);
                        cardBody.appendChild(cardComments);
                        cardBody.appendChild(cardDate);

                        card.appendChild(cardBody);
                        card.appendChild(cardFooter);

                        reportContainer.appendChild(card);
                    });

                    // Set up the delete confirmation button
                    document.getElementById('confirmDeleteButton').addEventListener('click', function () {
                        if (reportIdToDelete) {
                            db.collection("reports").doc(reportIdToDelete).delete().then(() => {
                                console.log("Report successfully deleted!");
                                displayUserReports(); // Refresh the reports after deletion

                                // Hide the modal programmatically
                                var deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
                                deleteModal.hide();

                                // Reset the global variable
                                reportIdToDelete = null;
                            }).catch((error) => {
                                console.error("Error removing report: ", error);
                            });
                        }
                    });
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
        } else {
            console.log("No user is signed in.");
        }
    });
}

// Call the function to display reports
displayUserReports();






















