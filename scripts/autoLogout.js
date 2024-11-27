// Check if a user is signed in when the page loads
window.addEventListener('load', function () {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // If a user is logged in, log them out
        firebase.auth().signOut().then(function() {
          console.log('User has been logged out.');
        }).catch(function(error) {
          console.log('Error logging out: ', error);
        });
      }
    });
  });
  