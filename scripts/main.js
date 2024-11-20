//Display posts from database
function displayPosts() {
  const postContainer = document.querySelector('.postContainer');

  db.collection("posts").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const postData = doc.data();

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

      buttonAddressContainer.appendChild(viewMoreButton);
      buttonAddressContainer.appendChild(addressText);

      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardText);
      cardBody.appendChild(buttonAddressContainer);
      card.appendChild(img);
      card.appendChild(cardBody);

      postContainer.appendChild(card);
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
