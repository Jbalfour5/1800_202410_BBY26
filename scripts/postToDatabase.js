const selectImageButton = document.getElementById('selectImageButton');
const imageInput = document.getElementById('imageInput');
const selectedImage = document.getElementById('selectedImage');
const postForm = document.getElementById('postForm');
const submitPostButton = document.getElementById('submitPostButton');

//Uploading image to posts
let imageDataUrl;
const targetWidth = 500;
const targetHeight = 300;

selectImageButton.addEventListener('click', function () {
    imageInput.click();
});

//Changes the image for the post (needs implementation to show image uploaded)
imageInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function () {

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = targetWidth;
                canvas.height = targetHeight;

                ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

                selectedImage.src = canvas.toDataURL('image/png');
                imageDataUrl = selectedImage.src;
            };
        };
        reader.readAsDataURL(file);
    }
});


//Updating database when submitting a post
submitPostButton.addEventListener('click', async () => {
    const db = firebase.firestore();
    const postTitle = document.getElementById('postTitle').value;
    const postDesc = document.getElementById('postDesc').value;
    const postLatitude = document.getElementById('postLatitude').value;
    const postLongitude = document.getElementById('postLongitude').value;
    const selectedPriority = document.querySelector('input[name="priority"]:checked').value;

    const address = await getAddressFromCoordinates(postLatitude, postLongitude);

    // Ensure the current user is signed in
    const currentUser = firebase.auth().currentUser;

    if (!currentUser) {
        console.error("No user is signed in.");
        return;
    }

    const userId = currentUser.uid;

    try {
        // Retrieve the user document
        const userDoc = await db.collection('users').doc(userId).get();

        if (!userDoc.exists) {
            console.error(`No document found for user ID: ${userId}`);
            return;
        }

        const userData = userDoc.data();
        const createdByDisplay = userData.name || userData.firstName || "Unknown User";

        //Debugging logs
        console.log("Title:", postTitle);
        console.log("Description:", postDesc);
        console.log("Adress:", address);
        console.log("Created at:", new Date());
        console.log("Created by:", createdByDisplay);
        console.log("Creator ID:", userId);
        console.log("Priority of post:", selectedPriority);

        const post = {
            title: postTitle,  //Name of the post
            description: postDesc, //Post description
            longitude: postLongitude, //Longitude of the location
            latitude: postLatitude, //Latitude of the location 
            address: address,  //Address the post is associated to
            createdAt: new Date(), //When the post was created
            createdBy: createdByDisplay, //Who created the post (saves first name if the user has not set a user name) for displaying on the card
            creatorID: userId, //Who created the post (saves the users id)
            priorityLevel: selectedPriority, //The Priority of the post
        };

        // Add the post to the database
        const docRef = await db.collection('posts').add(post);
        console.log("Post written with ID: ", docRef.id);
        window.location.reload();

    } catch (error) {
        console.error("Error fetching user or creating post:", error);
    }
});

