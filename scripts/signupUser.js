    //Getting fields
    let emailInput = document.getElementById('emailInput');
    let passwordInput = document.getElementById('passwordInput');
    let firstNameInput = document.getElementById('firstNameInput');
    let lastNameInput = document.getElementById('lastNameInput');
    let loginForm = document.getElementById('login-form');    

    let RegisterUser = evt => {
      evt.preventDefault();
      //Add data to firebase
      auth.createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
      .then((credentials)=>{
        console.log(credentials);

        const userId = credentials.user.uid;
        const userRef = db.collection('users').doc(userId);
        const userData = {
          email: emailInput.value,
          firstName: firstNameInput.value,
          lastName: lastNameInput.value,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
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
      .catch((error)=>{
        alert(error.message);
        console.log(error.code);
        console.log(error.message);
      })
    }
loginForm.addEventListener('submit', RegisterUser);