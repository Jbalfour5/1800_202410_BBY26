/**
 * Toggles the visibility for the passwordInput field.
 * 
 * This function allows the user to change the 
 * passwordInput field from a regular text field to a password field hiding the input.
 * This is acheived 
 */
function togglePassword() {
  const passwordField = document.getElementById("passwordInput");
  const toggleIcon = document.getElementById("toggleIcon");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    toggleIcon.src = "images/passwordhidden.png";
    toggleIcon.alt = "Hide Password";
  } else {
    passwordField.type = "password";
    toggleIcon.src = "images/passwordvisible.png";
    toggleIcon.alt = "Show Password";
  }
}