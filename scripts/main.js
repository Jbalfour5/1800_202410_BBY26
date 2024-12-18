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
let lastVisible = null; // Tracks the last document fetched
const POSTS_PER_PAGE = 3; // Number of posts to load per page

/**
 * Displays posts from the Firestore database in the post container.
 * 
 * This function retrieves and displays a set number of posts in the order of their creation date.
 * It supports pagination and dynamically creates Bootstrap cards for each post.
 * 
 * @param {boolean} loadMore - Determines if additional posts are being loaded (true) or the display is reset (false).
 */
function displayPosts(loadMore = false) {
  const postContainer = document.querySelector('.postContainer');
  if (!loadMore) {
    postContainer.innerHTML = '';
    lastVisible = null;
  }
  // Query Firestore with pagination
  let query = db.collection("posts")
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

        const creatorName = document.createElement('p');
        creatorName.className = 'text-muted small text-center mt-2';
        creatorName.textContent = `Posted by: ${postData.createdBy || "Anonymous"}`;


        const createdAtText = document.createElement('span');
        createdAtText.className = 'text-muted small';
        createdAtText.textContent = ` on ${postData.createdAt}`;

        // Check if createdAt is a Firestore Timestamp and convert it
        if (postData.createdAt instanceof firebase.firestore.Timestamp) {
          const createdAtDate = postData.createdAt.toDate();
          createdAtText.textContent = ` on ${createdAtDate.toLocaleString()}`;
        } else {
          createdAtText.textContent = ` on ${postData.createdAt}`;
        }
        creatorName.appendChild(createdAtText);

        const viewMoreButton = document.createElement('a');
        viewMoreButton.className = 'btn btn-success w-100';
        viewMoreButton.textContent = 'View More';
        viewMoreButton.href = `postDetails.html?id=${doc.id}`;

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
            reliabilityText.textContent = "Undetermined Reliability ";
          } else {
            const ratio = likes / (likes + dislikes);
            if (ratio >= 0.75) {
              reliabilityText.textContent = "Completely Reliable";
            } else if (ratio >= 0.5) {
              reliabilityText.textContent = "Mostly Reliable";
            } else if (ratio >= 0.25) {
              reliabilityText.textContent = "Mostly Unreliable";
            } else {
              reliabilityText.textContent = "Completely Unreliable";
            }
          }
        };


        updateReliabilityText();

        likeButton.addEventListener('click', () => {
          updateReaction(postId, "like", likeButton, dislikeButton, likeCount, dislikeCount);
          updateReliabilityText();
        });

        dislikeButton.addEventListener('click', () => {
          updateReaction(postId, "dislike", likeButton, dislikeButton, likeCount, dislikeCount);
          updateReliabilityText();
        });

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
        cardBody.appendChild(creatorName);

        card.appendChild(img);
        card.appendChild(cardBody);

        col.appendChild(card);
        row.appendChild(col);
      });



      postContainer.appendChild(row);
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}

/**
 * Adds click event listeners for the "Load More" button.
 * 
 * This function ensures that additional posts are loaded when the user clicks the button.
 */
document.getElementById('loadMoreButton').addEventListener('click', () => {
  displayPosts(true);
});
//Triggers the displayPosts function once the DOM content has fully loaded
window.addEventListener('DOMContentLoaded', displayPosts);

/**
 * Handles the showing and hiding of the post creation form.
 * 
 * This function alters the visibility of the post creation by 
 * adding and removing the show and hide classes to the form 
 * when the user clicks the create post button, submit button or the close button.
 */
$(document).ready(function () {
  $('#createPostButton').click(function () {
    $('#postForm').addClass('show');
    $('#postForm').removeClass('hide');
  });
  $('#submitPostButton').click(function () {
    $('#postForm').addClass('hide');
    $('#postForm').removeClass('show');
  });
  $('#closeButton').click(function () {
    $('#postForm').addClass('hide');
    $('#postForm').removeClass('show');
  });
});

/**
 * Updates the users reaction (like or dislike) for any given post.
 * 
 * This function updates the like and dislike counts for a post based on the user's reaction (like or dislike).
 * It adjusts the dataset for the buttons accordingly 
 * and ensure the like and dislike buttons are mutually exclusive (can only do one or the other). 
 * 
 * @param {string} postId - ID of the post being reacted to
 * @param {string} reaction - Reaction type (like or dislike)
 * @param {HTMLElement} likeButton - DOM element for the like button
 * @param {HTMLElement} dislikeButton - DOM element for the dislike button
 * @param {HTMLElement} likeCount - DOM element displaying the like count
 * @param {HTMLElement} dislikeCount - DOM element displaying the dislike count
 */
async function updateReaction(postId, reaction, likeButton, dislikeButton, likeCount, dislikeCount) {
  const postDoc = db.collection("posts").doc(postId);

  // Get the current reaction stored in the button dataset
  const currentLikeReaction = likeButton.dataset.reaction || "none";
  const currentDislikeReaction = dislikeButton.dataset.reaction || "none";

  let likesChange = 0;
  let dislikesChange = 0;
  likeButton.classList.remove("active");
  dislikeButton.classList.remove("active");

  if (reaction === "like") {
    if (currentLikeReaction === "liked") {
      // User unlikes the post
      likeButton.dataset.reaction = "none";
      likesChange = -1;
    } else if (currentDislikeReaction === "disliked") {
      // User switches from dislike to like
      likeButton.dataset.reaction = "liked";
      dislikeButton.dataset.reaction = "none";
      likesChange = 1;
      dislikesChange = -1;
    } else {
      // User likes the post
      likeButton.dataset.reaction = "liked";
      likesChange = 1;
    }
    likeButton.classList.add("active");
  } else if (reaction === "dislike") {
    if (currentDislikeReaction === "disliked") {
      // User undislikes the post
      dislikeButton.dataset.reaction = "none";
      dislikesChange = -1;

    } else if (currentLikeReaction === "liked") {
      dislikeButton.dataset.reaction = "disliked";
      likeButton.dataset.reaction = "none";
      likesChange = -1;
      dislikesChange = 1;
    } else {
      // User dislikes the post
      dislikeButton.dataset.reaction = "disliked";
      dislikesChange = 1;
    }
    dislikeButton.classList.add("active");
  }
  window.addEventListener('DOMContentLoaded', displayPosts);


  window.addEventListener('DOMContentLoaded', displayReports);
  try {
    await postDoc.update({
      likes: firebase.firestore.FieldValue.increment(likesChange),
      dislikes: firebase.firestore.FieldValue.increment(dislikesChange),
    });
    likeCount.textContent = parseInt(likeCount.textContent) + likesChange;
    dislikeCount.textContent = parseInt(dislikeCount.textContent) + dislikesChange;
  } catch (error) {
    console.error("Error updating reaction:", error);
  }
}

let reportIDToDelete = null;
let deleteModal = null;

/**
 * Fetches and displays user reports from the Firestore database.
 * 
 * This function retrieves reports in descending order of their timestamps,
 * fetches associated user details, and dynamically generates Bootstrap cards to display the reports.
 */
function displayReports() {
  const reportContainer = document.getElementById('reportContainer');
  reportContainer.innerHTML = '';

  console.log("Fetching reports from Firestore...");

  db.collection("reports")
    .orderBy("timestamp", "desc")
    .get()
    .then((querySnapshot) => {
      console.log("Reports fetched:", querySnapshot.size);

      querySnapshot.forEach((doc) => {
        const reportData = doc.data();
        console.log("Report Data:", reportData);

        db.collection("users").doc(reportData.userID).get().then((userDoc) => {
          if (userDoc.exists) {
            const userData = userDoc.data();
            console.log("User Data:", userData);

            // Create a Bootstrap card for each report
            const card = document.createElement('div');
            card.className = 'card mb-4 col-md-4';

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';

            const cardTitle = document.createElement('h5');
            cardTitle.className = 'card-title';
            cardTitle.textContent = reportData.title;

            const cardText = document.createElement('p');
            cardText.className = 'card-text';
            cardText.textContent = `Rating: ${reportData.rating}/5`;

            const cardFooter = document.createElement('p');
            cardFooter.className = 'card-text';
            cardFooter.textContent = `Comments: ${reportData.commentsFeedback}`;

            const cardDate = document.createElement('p');
            cardDate.className = 'card-text';
            cardDate.textContent = `Date: ${reportData.timestamp.toDate().toLocaleString()}`;

            const cardUser = document.createElement('p');
            cardUser.className = 'card-text';
            cardUser.textContent = `Created by: ${userData.firstName} ${userData.lastName}`;

            // Create the Read More button
            const readMoreButton = document.createElement('a');
            readMoreButton.className = 'btn btn-success';
            readMoreButton.textContent = 'Read More';
            readMoreButton.href = `reportDetails.html?id=${doc.id}`;

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardText);
            cardBody.appendChild(cardFooter);
            cardBody.appendChild(cardDate);
            cardBody.appendChild(cardUser);
            cardBody.appendChild(readMoreButton);

            // Check if the current user is the creator of the report
            firebase.auth().onAuthStateChanged((user) => {
              if (user && user.uid === reportData.userID) {
                const deleteButton = document.createElement('button');
                deleteButton.className = 'btn btn-danger ml-2';
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => {
                  reportIDToDelete = doc.id;
                  deleteModal.show();
                };
                cardBody.appendChild(deleteButton);
              }
            });

            card.appendChild(cardBody);
            reportContainer.appendChild(card);
          } else {
            console.log(`User document not found: ${reportData.userID}`);
          }
        }).catch((error) => {
          console.log("Error getting user document: ", error);
        });
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}

window.addEventListener('DOMContentLoaded', () => {
  displayReports();
  deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'), {
    backdrop: 'static',
    keyboard: false
  });
});

document.getElementById('confirmDeleteButton').onclick = () => {
  if (reportIDToDelete) {
    db.collection("reports").doc(reportIDToDelete).delete().then(() => {
      console.log("Document successfully deleted!");
      reportIDToDelete = null;
      displayReports();
      deleteModal.hide();
    }).catch((error) => {
      console.error("Error removing document: ", error);
    });
  }
};


/**
 * Filters the reports displayed by a user-defined time window.
 * 
 * This function retrieves the start and end dates from the input fields and uses them
 * to query the Firestore database for reports that have a timestamp within the specified range.
 * It then dynamically generates a Bootstrap card for each report, displaying the title, rating, 
 * comments, and a "Read More" button that links to the detailed report page.
 * 
 * If there are no reports within the selected date range, the report container is cleared,
 * and the filtered reports are displayed. Any errors encountered during the Firestore query 
 * are logged to the console.
 */
function filterReportsByDate() {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const reportContainer = document.getElementById('reportContainer');
  reportContainer.innerHTML = ''; 

  db.collection("reports")
    .where("timestamp", ">=", new Date(startDate))
    .where("timestamp", "<=", new Date(endDate))
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const reportData = doc.data();

        const card = document.createElement('div');
        card.className = 'card mb-4 col-md-4';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title';
        cardTitle.textContent = reportData.title;

        const cardText = document.createElement('p');
        cardText.className = 'card-text';
        cardText.textContent = `Rating: ${reportData.rating}/5`;

        const cardFooter = document.createElement('p');
        cardFooter.className = 'card-text';
        cardFooter.textContent = `Comments: ${reportData.commentsFeedback}`;

        // Create the Read More button
        const readMoreButton = document.createElement('a');
        readMoreButton.className = 'btn btn-success';
        readMoreButton.textContent = 'Read More';
        readMoreButton.href = `reportDetails.html?id=${doc.id}`;

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(cardFooter);
        cardBody.appendChild(readMoreButton);
        card.appendChild(cardBody);

        reportContainer.appendChild(card);
      });
    }).catch((error) => {
      console.log("Error getting documents: ", error);
    });
}

/**
 * Initializes and manages the filter button slider functionality.
 * 
 * This script adjusts a visual slider to align with the active filter button when a new filter is selected. 
 * It calculates the size and position of the active button and updates the slider's width and position dynamically.
 * 
 * Functionality:
 * - Listens for changes to filter buttons (radio inputs).
 * - Dynamically positions the slider to align with the active filter button.
 * - Adjusts on page load and when the user selects a different filter.
 * 
 * @listens DOMContentLoaded - Executes the slider initialization once the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', function () {
  const filterButtons = document.querySelectorAll('#filterButtons label');
  const slider = document.getElementById('slider');

  function updateSliderPosition() {
    const activeButton = document.querySelector('#filterButtons input[type="radio"]:checked');
    const activeLabel = activeButton.nextElementSibling;

    const buttonWidth = activeLabel.offsetWidth;
    const buttonLeft = activeLabel.getBoundingClientRect().left;

    slider.style.width = `${buttonWidth}px`;
    const containerLeft = document.getElementById('filterButtons').getBoundingClientRect().left;

    slider.style.left = `${buttonLeft - containerLeft}px`;
  }
  const radioButtons = document.querySelectorAll('#filterButtons input[type="radio"]');
  radioButtons.forEach(radio => {
    radio.addEventListener('change', updateSliderPosition);
  });

  updateSliderPosition();
});

const postsToggle = document.getElementById('option1');  // Posts
const allToggle = document.getElementById('option2');    // All
const reportsToggle = document.getElementById('option3'); // Reports

const postContainer = document.querySelector('.togglePosts');  // Container for posts
const reportContainer = document.querySelector('.toggleReports'); // Container for reports

postsToggle.addEventListener('change', filterContent);
allToggle.addEventListener('change', filterContent);
reportsToggle.addEventListener('change', filterContent);

/**
 * Allows the filtering of the content displayed on main.
 * 
 * This function alters the display style of the content on the dashboard 
 * depending on the selected toggle.
 * When the postsToggle is active, the posts display is block and the report display is none.
 * When the reportsToggle is active, the reports display is block and the post display is none.
 * When the allToggle is checked, both the reports and post display is block.
 */
function filterContent() {
  console.log("Posts:", postsToggle.checked);
  console.log("Reports:", reportsToggle.checked);
  console.log("All:", allToggle.checked);
  // Check the selected toggle option
  if (postsToggle.checked) {
    console.log("Showing Posts");
    postContainer.style.display = 'block';
    reportContainer.style.display = 'none';
  } else if (reportsToggle.checked) {
    console.log("Showing Reports");
    postContainer.style.display = 'none';
    reportContainer.style.display = 'block';
  } else if (allToggle.checked) {
    console.log("Showing Both");
    postContainer.style.display = 'block';
    reportContainer.style.display = 'block';
  }
}

// Initial filter based on the default checked option
filterContent();

document.addEventListener("DOMContentLoaded", function () {
  const option1 = document.getElementById("option1");
  const option2 = document.getElementById("option2");
  const option3 = document.getElementById("option3");
  const createReportDiv = document.getElementById("createReportDiv");
  const createPostDiv = document.getElementById("createPostDiv");
  const orDiv = document.getElementById("orDiv");
  const loadMore = this.getElementById("loadMoreButton");
  const backToTopText = this.getElementById("backToTop");


  option1.addEventListener("change", function () {
    createReportDiv.style.display = "none";  // Hide Create Report
    createPostDiv.style.display = "block";   // Show Create Post
    orDiv.style.display = "none";            // Hide "or"
    loadMore.style.display = "block";        // Show load More
    backToTopText.style.display = "block";   // Show Back to Top? text
  });
  option2.addEventListener("change", function () {
    createReportDiv.style.display = "block"; // Show Create Report
    createPostDiv.style.display = "block";   // Show Create Post
    orDiv.style.display = "block";           // Show "or"
    loadMore.style.display = "block";        // Show load More
    backToTopText.style.display = "block";   // Show Back to Top? text
  });
  option3.addEventListener("change", function () {
    createReportDiv.style.display = "block"; // Show Create Report
    createPostDiv.style.display = "none";    // Hide Create Post
    orDiv.style.display = "none";            // Hide "or"
    loadMore.style.display = "none";        // Show load More
    backToTopText.style.display = "none";   // Show Back to Top? text
  });
});

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    displayGreeting(user);
  } else {
    console.log("No user is logged in.");
  }
});

/**
 * Displays a personalized greeting message for the logged-in user.
 * 
 * This function retrieves the user's first name from the Firestore database using their unique user ID (UID).
 * If the user data is successfully retrieved, a welcome message is displayed in the "welcome-message" element.
 * 
 * @param {Object} user - The currently logged-in Firebase user object. 
 *                        Contains the unique user ID (UID) used to query Firestore.
 */
function displayGreeting(user) {
  if (user) {
    var userId = user.uid;
    var db = firebase.firestore();
    db.collection("users").doc(userId).get().then(function (doc) {
      if (doc.exists) {
        var userFirstName = doc.data().firstName;
        document.getElementById("welcome-message").innerHTML = "Welcome, " + userFirstName + "!";
      } else {
        console.log("No user document found!");
      }
    }).catch(function (error) {
      console.error("Error getting user data: ", error);
    });
  } else {
    console.log("No user is logged in.");
  }
}

