//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // If the "user" variable is not null, then someone is logged in
            console.log($('#navbarPlaceholder').load('./navbarAfterLogin.html', function() {
                activateNav();
            }));
            console.log($('#bottomNavPlaceholder').load('./bottomNavbar.html', function() {
                activateNav();
            }));
        } else {
            // No user is signed in.
            console.log($('#navbarPlaceholder').load('./navbarBeforeLogin.html', function() {
                activateNav();
            }));
            console.log($('#footerPlaceholder').load('./footer.html'));
        }
    });
}

window.onload = function() {
    loadSkeleton();
};
