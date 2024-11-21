// Function to get the value of a query parameter from the URL
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }
  
  const postId = getQueryParam('id');
  

db.collection('posts').doc(postId).get().then((doc) => {
  if (doc.exists) {
    const post = doc.data();
    
    // Update the page content with the post details
    document.getElementById('postTitle').innerText = post.title || 'No title available';
    document.getElementById('postDescription').innerHTML = `<strong>Address:</strong> ${post.address || 'No address available'}`;
    document.getElementById('postPriority').innerHTML = `<strong>Priority:</strong> ${post.priorityLevel || 'No priority available'}`;
    document.getElementById('postLocation').innerHTML = post.description || 'No description available';
  } else {
    console.log("Post not found");
  }
}).catch((error) => {
  console.error("Error getting post: ", error);
});
