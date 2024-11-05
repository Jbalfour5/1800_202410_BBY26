//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in
            $('#navbarPlaceholder').load('./navbarAfterLogin.html', function() {
                activateNav();
            });
            $('#bottomNavPlaceholder').load('./bottomNavbar.html', function() {
                activateNav();
            });
        } else {
            $('#navbarPlaceholder').load('./navbarBeforeLogin.html', function() {
                activateNav();
            });
            $('#footerPlaceholder').load('./footer.html');
        }
    });
}

window.onload = function() {
    loadSkeleton();
};
