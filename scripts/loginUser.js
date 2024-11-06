    let emailInput = document.getElementById('emailInput');
    let passwordInput = document.getElementById('passwordInput');
    let firstNameInput = document.getElementById('firstNameInput');
    let lastNameInput = document.getElementById('lastNameInput');
    let loginForm = document.getElementById('login-form');    

    let SignInUser = evt => {
      evt.preventDefault();

      auth.signInWithEmailAndPassword(emailInput.value, passwordInput.value)
      .then((credentials)=>{
        console.log(credentials);

        window.location.href = "main.html"; 
        
      })
      .catch((error)=>{
        alert(error.message);
        console.log(error.code);
        console.log(error.message);
      })
    }
  loginForm.addEventListener('submit', SignInUser);