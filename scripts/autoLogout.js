/**
 * Logs out the currently signed in user.
 * 
 * This function signs out the user when the page loads. 
 * Wherever this function is referenced in html, it will log the user out on that respective page.
 */
window.addEventListener('load', function () {
  // Only log out on pages where it makes sense, e.g., not on the sign-up page.
  if (window.location.pathname !== "/signup.html") {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.auth().signOut().then(function() {
          console.log('User has been logged out.');
        }).catch(function(error) {
          console.log('Error logging out: ', error);
        });
      }
    });
  }
});
  