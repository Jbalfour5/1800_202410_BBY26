/**
 * Dynamically loads the navigation bar, bottom navigation, and footer based on the user's authentication state.
 * 
 * - If the user is signed in:
 *   - Loads a navigation bar specific to logged-in users (`navbarAfterLogin.html`) into the `navbarPlaceholder`.
 *   - Loads a bottom navigation bar (`bottomNavbar.html`) into the `bottomNavPlaceholder`.
 *   - Calls the `activateNav` function after each load to initialize navigation highlights or any related scripts.
 * 
 * - If the user is not signed in:
 *   - Loads a navigation bar for non-logged-in users (`navbarBeforeLogin.html`) into the `navbarPlaceholder`.
 *   - Loads a common footer (`footer.html`) into the `footerPlaceholder`.
 * 
 * The function is triggered whenever the user's authentication state changes.
 */
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



