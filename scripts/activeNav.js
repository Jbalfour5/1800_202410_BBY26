//Setting the color of the bottom navbar icons to an accent color if the links href matches the current page
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
