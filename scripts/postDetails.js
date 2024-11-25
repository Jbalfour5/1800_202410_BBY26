/**
 * Retrieves the value of the specified queuery parameter from the current pages URL.
 * 
 * This function extracts the value of the querey paramater by its name from the URL's querey string.
 * 
 * @param {string} name - The name of the query parameter to retrieve.
 * @returns {string|null} - The value of the query parameter, or null if it does not exist
 */
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

//
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
