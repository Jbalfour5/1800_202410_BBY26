//Logs the user out of firebase
function logout() {
  firebase.auth().signOut().then(() => {
    console.log("User signed out successfully.");
    window.location.href = "index.html";
  }).catch((error) => {
    console.error("Error signing out:", error);
  });
}
