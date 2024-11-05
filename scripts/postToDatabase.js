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
        createdAt: new Date(),
    };

    const db = firebase.firestore(); // Ensure firestore is initialized
    db.collection('posts').add(post)
    .then((docRef) => {
        console.log("Post written with ID: ", docRef.id);
        // Optionally clear the form or show a success message
    })
    .catch((error) => {
        console.error("Error adding post: ", error);
    });
});
