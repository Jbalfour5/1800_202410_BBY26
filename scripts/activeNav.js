/**
 * Highlights the active navigation link in the bottom navbar.
 * 
 * This function compares the href attribute of each anchor tag in the 
 * bottomNavbar.html to the current pages file name.
 * If they match, the navLinkActive class is 
 * added to the corresponding anchor to visually distinguish the active selection.
 * 
 */
function activateNav() {
    const navLinks = document.querySelectorAll('.navLink');
    const currentPage = window.location.pathname.split('/').pop();

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            console.log("Adding navLinkActive to:", linkHref);
            link.classList.add('navLinkActive');
        } else {
            link.classList.remove('navLinkActive');
        }
    });
}
