// loadSidebar.js
document.addEventListener("DOMContentLoaded", async function () {
    const sidebarPlaceholder = document.getElementById("sidebar-placeholder");

    // Fetch the sidebar HTML and insert it
    await fetch("includes/sidebar.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load sidebar");
            }
            return response.text();
        })
        .then(data => {
            sidebarPlaceholder.innerHTML = data;
            if (window.isGlobalJsLoaded) {
                handleSidebarContentDependingOnUserRole();
            }
        })
        .catch(error => {
            console.error("Error loading sidebar:", error);
            sidebarPlaceholder.innerHTML = "<p>Failed to load sidebar</p>";
        });
});
