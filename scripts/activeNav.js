function activateNav() {
    const navLinks = document.querySelectorAll('.navLink');
    const currentPage = window.location.pathname.split('/').pop(); 

    console.log("Current Page:", currentPage);
    console.log("Nav Links:", navLinks);

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href'); 
        console.log("Link Href:", linkHref); 

        if (linkHref === currentPage) {
            console.log("Adding navLinkActive to:", linkHref);
            link.classList.add('navLinkActive');
        } else {
            link.classList.remove('navLinkActive'); 
        }
    });

   
}
