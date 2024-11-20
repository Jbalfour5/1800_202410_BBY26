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
        addressText.className = 'mb-0 ml-4';
        addressText.textContent = postData.address || 'Address not available';

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
  window.addEventListener('DOMContentLoaded', displayPosts);
  

//-------------------------------------------------------------


  function displayReports() {
    const reportContainer = document.getElementById('reportContainer');

    db.collection("reports").get().then((querySnapshot) => {
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

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardText);
            cardBody.appendChild(cardFooter);
            card.appendChild(cardBody);

            reportContainer.appendChild(card);
        });
    }).catch((error) => {
        console.log("Error getting documents: ", error);
    });
}

window.addEventListener('DOMContentLoaded', displayReports);


//-------

function displayReports() {
  const reportContainer = document.getElementById('reportContainer');
  reportContainer.innerHTML = ''; // Clear previous content

  db.collection("reports").get().then((querySnapshot) => {
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
          readMoreButton.className = 'btn btn-primary';
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

window.addEventListener('DOMContentLoaded', displayReports);


//-------

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
              readMoreButton.className = 'btn btn-primary';
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

window.addEventListener('DOMContentLoaded', displayReports);
