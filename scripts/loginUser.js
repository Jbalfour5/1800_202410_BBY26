/**
 * The email input field where the user enters their email for login.
 */
let emailInput = document.getElementById('emailInput');

/**
 * The password input field where the user enters their password for login.
 */
let passwordInput = document.getElementById('passwordInput');

/**
 * The form element that handles the login submission.
 */
let loginForm = document.getElementById('login-form');

/**
 * Handles the login form submission and signs the user in with an email and password.
 * 
 * This function listens for the form submission event and prevents the default submission event. 
 * It then attempts to sign in using the email and password 
 * values that were inputted into the corresponding email and password fields.
 * If the user has been successfully authenticated, the user is redirected to the main page.
 * If there is an error with authentication, 
 * the error code and message is logged into the console and shows an alert to the user.
 * 
 * @param {*} evt - The event object for the submission.
 *
 */
let SignInUser = evt => {
  evt.preventDefault();

  //Signs in the user with email and password
  auth.signInWithEmailAndPassword(emailInput.value, passwordInput.value)
    .then((credentials) => {
      console.log(credentials);
      window.location.href = "main.html";
    })
    .catch((error) => {
      alert(error.message);
      console.log(error.code);
      console.log(error.message);
    })
}

//Adds an event listener to the form which triggers the SignInUser function on submission.
loginForm.addEventListener('submit', SignInUser);