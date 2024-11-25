let emailInput = document.getElementById('emailInput');
let passwordInput = document.getElementById('passwordInput');
let firstNameInput = document.getElementById('firstNameInput');
let lastNameInput = document.getElementById('lastNameInput');
let loginForm = document.getElementById('login-form');

/**
 * Handles the user registration process when the form is submitted.
 * @param {Event} evt - The event object triggered by form submission.
 */
let RegisterUser = evt => {
  evt.preventDefault();

  //Creates a user with email and password
  auth.createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
    .then((credentials) => {
      console.log(credentials);

      const userId = credentials.user.uid;
      const userRef = db.collection('users').doc(userId);
      const userData = {
        email: emailInput.value, //User Email
        firstName: firstNameInput.value,//User First Name
        lastName: lastNameInput.value,//User Last Name
        createdAt: firebase.firestore.FieldValue.serverTimestamp()//When user was created
      };
      userRef.set(userData, { merge: true })
        .then(() => {
          console.log("User data saved to Firestore:", userData);

          window.location.href = "main.html";
        })
        .catch((error) => {
          console.error("Error saving user data to Firestore: ", error);
        });
    })
    .catch((error) => {
      alert(error.message);
      console.log(error.code);
      console.log(error.message);
    })
}
loginForm.addEventListener('submit', RegisterUser);//Runs the function on submission