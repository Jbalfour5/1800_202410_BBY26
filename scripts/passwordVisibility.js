//Toggling password visibility with an icon on login/signup
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