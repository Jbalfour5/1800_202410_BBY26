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
function displayPosts() {
  const postContainer = document.querySelector('.postContainer');

  db.collection("posts")
    .orderBy("createdAt", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const postData = doc.data();
        const postId = doc.id;

        const card = document.createElement('div');
        card.className = 'card mb-4 col-md-3';

        const img = document.createElement('img');
        img.className = 'card-img-top';
        img.src = postData.imageUrl || 'images/noImage.png';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title';
        cardTitle.textContent = postData.title;

        const cardText = document.createElement('p');
        cardText.className = 'card-text';
        cardText.textContent = postData.description;

        const buttonAddressContainer = document.createElement('div');
        buttonAddressContainer.className = 'd-flex justify-content-between align-items-center mt-3';

        const viewMoreButton = document.createElement('a');
        viewMoreButton.className = 'btn btn-success';
        viewMoreButton.textContent = 'View More';
        viewMoreButton.href = `postDetails.html?id=${doc.id}`;

        const addressText = document.createElement('p');
        addressText.className = 'mb-0';
        addressText.textContent = postData.address || 'Address not available';
        addressText.style.marginLeft = '10px';

        const likeDislikeContainer = document.createElement('div');
        likeDislikeContainer.className = 'd-flex mt-3 align-items-center';

        const likeCount = document.createElement('span');
        likeCount.className = 'ms-2';
        likeCount.textContent = postData.likes || 0;

        const dislikeCount = document.createElement('span');
        dislikeCount.className = 'ms-2';
        dislikeCount.textContent = postData.dislikes || 0;

        const likeButton = document.createElement('button');
        likeButton.className = 'btn d-flex align-items-center me-2 likeButton reactionButton';
        likeButton.innerHTML = '<span class="material-icons">thumb_up</span>';
        likeButton.dataset.postId = postId;

        const dislikeButton = document.createElement('button');
        dislikeButton.className = 'btn d-flex align-items-center dislikeButton reactionButton';
        dislikeButton.innerHTML = '<span class="material-icons">thumb_down</span>';
        dislikeButton.dataset.postId = postId;

        const author = document.createElement('p');
        author.className = 'mt-3 text-muted'
        author.innerHTML = `Created by: ${postData.createdBy}`;


        likeDislikeContainer.appendChild(likeButton);
        likeDislikeContainer.appendChild(dislikeButton);

        buttonAddressContainer.appendChild(viewMoreButton);
        buttonAddressContainer.appendChild(addressText);

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(buttonAddressContainer);
        cardBody.appendChild(author);
        card.appendChild(img);
        card.appendChild(cardBody);

        cardBody.appendChild(likeDislikeContainer);
        likeButton.appendChild(likeCount);
        dislikeButton.appendChild(dislikeCount);

        postContainer.appendChild(card);

        // Add event listeners for like and dislike buttons
        likeButton.addEventListener("click", () => {
          updateReaction(postId, "like", likeButton, dislikeButton, likeCount, dislikeCount);
        });

        dislikeButton.addEventListener("click", () => {
          updateReaction(postId, "dislike", likeButton, dislikeButton, likeCount, dislikeCount);
        });
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}

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
      // User switches from like to dislike
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

function displayReports() {
  const reportContainer = document.getElementById('reportContainer');
  reportContainer.innerHTML = ''; // Clear previous content

  console.log("Fetching reports from Firestore...");

  db.collection("reports")
    .orderBy("timestamp", "desc") // Order by timestamp in descending order
    .get()
    .then((querySnapshot) => {
      console.log("Reports fetched:", querySnapshot.size);

      querySnapshot.forEach((doc) => {
        const reportData = doc.data();
        console.log("Report Data:", reportData);

        // Fetch user details
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
  reportContainer.innerHTML = ''; // Clear previous content

  db.collection("reports")
    .where("timestamp", ">=", new Date(startDate))
    .where("timestamp", "<=", new Date(endDate))
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const reportData = doc.data();

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
