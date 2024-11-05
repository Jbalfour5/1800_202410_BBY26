function togglePassword() {
    const passwordField = document.getElementById("passwordInput");
    const toggleIcon = document.getElementById("toggleIcon");

    if (passwordField.type === "password") {
      passwordField.type = "text";
      toggleIcon.src = "images/passwordhidden.png"; // Path to your "hide" icon
      toggleIcon.alt = "Hide Password";
    } else {
      passwordField.type = "password";
      toggleIcon.src = "images/passwordvisible.png"; // Path to your "show" icon
      toggleIcon.alt = "Show Password";
    }
  }