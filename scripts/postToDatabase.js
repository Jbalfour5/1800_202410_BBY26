//Getting elements
const selectImageButton = document.getElementById('selectImageButton');
const imageInput = document.getElementById('imageInput');
const selectedImage = document.getElementById('selectedImage');
const postForm = document.getElementById('postForm');
const submitPostButton = document.getElementById('submitPostButton');

//Uploading image to posts
let imageDataUrl;
const targetWidth = 500; 
const targetHeight = 300; 

selectImageButton.addEventListener('click', function() {
    imageInput.click();
});

imageInput.addEventListener('change', function(event) {
    const file = event.target.files[0]; 
    if (file) {
        const reader = new FileReader(); 
        reader.onload = function(e) {
            const img = new Image(); 
            img.src = e.target.result; 

            img.onload = function() {
                
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
    const postTitle = document.getElementById('postTitle').value;
    const postDesc = document.getElementById('postDesc').value;

    const address = await getAddressFromCoordinates(postLatitude, postLongitude);

    //Debugging logs
    console.log("Title:", postTitle);
    console.log("Description:", postDesc);
    console.log("Image:", imageDataUrl);
    console.log("Adress:", address);

    const post = {
        title: postTitle, //Name of the post
        description: postDesc, //Post description
        image: imageDataUrl, //Image data url
        address: address, //Address the post is associated to
        createdAt: new Date(), //When the post was created
    };
    
    const db = firebase.firestore(); 
    db.collection('posts').add(post)
    .then((docRef) => {
        console.log("Post written with ID: ", docRef.id);
        window.location.reload();
      
    })
    .catch((error) => {
        console.error("Error adding post: ", error);
    });
});
