function displayPosts() {
  const postContainer = document.querySelector('.postContainer'); 

  // Fetch posts from the "posts" collection in Firestore
  db.collection("posts").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          const postData = doc.data();

          // Create a Bootstrap card for each post
          const card = document.createElement('div');
          card.className = 'card mb-4'; 
          
          card.classList.add('col-md-3');

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

          const viewMoreButton = document.createElement('a');
          viewMoreButton.className = 'btn btn-primary';
          viewMoreButton.textContent = 'View More';
          viewMoreButton.href = `postDetails.html?id=${doc.id}`;

          // Append all elements to form the card structure
          cardBody.appendChild(cardTitle);
          cardBody.appendChild(cardText);
          cardBody.appendChild(viewMoreButton); // Append the button here
          card.appendChild(img);
          card.appendChild(cardBody);
          
          // Append the card to the main container
          postContainer.appendChild(card);
      });
  }).catch((error) => {
      console.log("Error getting documents: ", error);
  });
}

window.addEventListener('DOMContentLoaded', displayPosts);
