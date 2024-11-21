//Loads the navbar and other skeletal items depending on user state
function loadSkeleton() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User IS signed in
            $('#navbarPlaceholder').load('./navbarAfterLogin.html', function() {
                activateNav();
            });
            $('#bottomNavPlaceholder').load('./bottomNavbar.html', function() {
                activateNav();
            });
        } else {
            //User NOT signed in
            $('#navbarPlaceholder').load('./navbarBeforeLogin.html', function() {
                activateNav();
            });
            $('#footerPlaceholder').load('./footer.html');
        }
    });
}

//Runs the function once the window has loaded
window.onload = function() {
    loadSkeleton();
};



