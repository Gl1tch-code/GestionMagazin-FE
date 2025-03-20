document.addEventListener("DOMContentLoaded", function() {
    const navbarPlaceholder = document.getElementById("navbar-placeholder");

    // Fetch the navbar HTML and insert it
    fetch("includes/navbar.html")
    .then(respone => {
        if(!respone.ok){
            throw new Error("Failed to load navbar");
        }
        return respone.text();
    })
    .then(data => {
        navbarPlaceholder.innerHTML = data;
    })
    .catch(error => {
        console.error("Error loading navbar: ", error);
        navbarPlaceholder.innerHTML = "<p>Failed to load navbar</p>";
    });

});