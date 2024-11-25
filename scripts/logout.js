/**
 * Logs out the current authenticated user.
 * 
 * This function triggers the Firebase authentication sign-out method. 
 * Upon successful sign-out, the user is redirected to the index.html page 
 * and a success message is logged to the console.
 * Upon an unsucessful sign-out attempt, an error message is logged to the console.
 * 
 */
function logout() {
  firebase.auth().signOut().then(() => {
    console.log("User signed out successfully.");
    window.location.href = "index.html";
  }).catch((error) => {
    console.error("Error signing out:", error);
  });
}
