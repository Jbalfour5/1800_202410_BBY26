const selectImageButton = document.getElementById('selectImageButton');
const imageInput = document.getElementById('imageInput');
const selectedImage = document.getElementById('selectedImage');

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
            };
        };
        reader.readAsDataURL(file); 
    }
});

const submitPostButton = document.getElementById('submitPostButton');

submitPostButton.addEventListener('click', () => {
    const postTitle = document.getElementById('postTitle').value;
    const postDesc = document.getElementById('postDesc').value;

    // Debugging logs
    console.log("Title:", postTitle);
    console.log("Description:", postDesc);

    const post = {
        title: postTitle,
        description: postDesc,
        image: file,
        createdAt: new Date(),
    };

    const db = firebase.firestore(); 
    db.collection('posts').add(post)
    .then((docRef) => {
        console.log("Post written with ID: ", docRef.id);
        $('#submitPostButton').click(function() {
            $('#postForm').addClass('hide');
            $('#postForm').removeClass('show'); 
        
        });
    })
    .catch((error) => {
        console.error("Error adding post: ", error);
    });
});
