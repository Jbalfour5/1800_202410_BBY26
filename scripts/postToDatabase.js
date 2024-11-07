const selectImageButton = document.getElementById('selectImageButton');
const imageInput = document.getElementById('imageInput');
const selectedImage = document.getElementById('selectedImage');
let imageDataUrl;

const targetWidth = 500; 
const targetHeight = 300; 

const postForm = document.getElementById('postForm');

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

const submitPostButton = document.getElementById('submitPostButton');

submitPostButton.addEventListener('click', async () => {
    const postTitle = document.getElementById('postTitle').value;
    const postDesc = document.getElementById('postDesc').value;

    const postLatitude = document.getElementById('postLatitude').value;
    const postLongitude = document.getElementById('postLongitude').value;

    const address = await getAddressFromCoordinates(postLatitude, postLongitude);

    // Debugging logs
    console.log("Title:", postTitle);
    console.log("Description:", postDesc);

    const post = {
        title: postTitle,
        description: postDesc,
        image: imageDataUrl,
        address: address, 
        createdAt: new Date(),
    };


    const db = firebase.firestore(); 
    db.collection('posts').add(post)
    .then((docRef) => {
        console.log("Post written with ID: ", docRef.id);
      
    })
    .catch((error) => {
        console.error("Error adding post: ", error);
    });
});
