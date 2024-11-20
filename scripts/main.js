//Display posts from database
function displayPosts() {
  const postContainer = document.querySelector('.postContainer');

  db.collection("posts").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      const postId = doc.id;

      //Create a Bootstrap card for each post
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

      //Container for the button and address
      const buttonAddressContainer = document.createElement('div');
      buttonAddressContainer.className = 'd-flex justify-content-between align-items-center mt-3';

      const viewMoreButton = document.createElement('a');
      viewMoreButton.className = 'btn btn-primary';
      viewMoreButton.textContent = 'View More';
      viewMoreButton.href = `postDetails.html?id=${doc.id}`;

      const addressText = document.createElement('p');
      addressText.className = 'mb-0';
      addressText.textContent = postData.address || 'Address not available';
      addressText.style.marginLeft = '10px';

      // Like/Dislike container
      const likeDislikeContainer = document.createElement('div');
      likeDislikeContainer.className = 'd-flex mt-3 align-items-center';

      // Create spans for displaying the number of likes/dislikes
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

      // Append Like/Dislike buttons
      likeDislikeContainer.appendChild(likeButton);
      likeDislikeContainer.appendChild(dislikeButton);

      buttonAddressContainer.appendChild(viewMoreButton);
      buttonAddressContainer.appendChild(addressText);

      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardText);
      cardBody.appendChild(buttonAddressContainer);
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
  }).catch((error) => {
    console.log("Error getting documents: ", error);
  });
}
window.addEventListener('DOMContentLoaded', displayPosts); //Runs the function once the DOM content has loaded

//Handles the showing and hiding of the form when hitting create post
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
      dislikeButton.dataset.reaction = "none"; // reset dislike
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
      likeButton.dataset.reaction = "none"; // reset like
      likesChange = -1;
      dislikesChange = 1;
    } else {
      // User dislikes the post
      dislikeButton.dataset.reaction = "disliked";
      dislikesChange = 1;
    }
    dislikeButton.classList.add("active");
  }

  
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