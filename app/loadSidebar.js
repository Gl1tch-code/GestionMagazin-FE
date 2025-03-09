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
            console.log(document.getElementById("expandable"));
    
            document.querySelectorAll("#expandable").forEach(expandable => {
                const anchor = expandable.querySelector("#expand-icon");
                
                anchor.addEventListener("click", () => {
                    if (expandable.dataset.opened === "false") {
                        openExpandeableSideBarTab(expandable, anchor);
                    } else {
                        closeExpandeableSideBarTab(expandable, anchor);
                    }
                });
            });

            if (window.isGlobalJsLoaded) {
                handleSidebarContentDependingOnUserRole();
            }

            return data;
        })
        .then((data) => {
            // Make sure sidebar and toggle icon exist before trying to add event listener
            const sideBar = document.querySelector('.nk-sidebar');
            const sidebarToggleIcon = document.querySelector('.sidebar-toggle-icon');

            if (sidebarToggleIcon) {
                sidebarToggleIcon.addEventListener("click", () => {
                    if (sideBar !== null) {
                        if (sideBar.style.left === "" || sideBar.style.left === "-100%") {
                            sideBar.style.left = "0px";
                        } else {
                            sideBar.style.left = "-100%";
                        }

                        console.log(sideBar.style.left);
                    }
                });
            } else {
                console.warn('.sidebar-toggle-icon not found!');
            }

            const refreshIcon = document.querySelector(".refresh-page-icon");
            if (refreshIcon) {
                refreshIcon.addEventListener("click", () => {
                    window.location.reload();
                });
            } else {
                console.warn('.refresh-page-icon not found!');
            }

        })
        .catch(error => {
            console.error("Error loading sidebar:", error);
            sidebarPlaceholder.innerHTML = "<p>Failed to load sidebar</p>";
        });
});

function openExpandeableSideBarTab(expandable, anchor) {
    expandable.dataset.opened = "true";
    anchor.className = "has-arrow up-arrow";
    expandable.querySelector("#expandable-elements").style.display = "block";
}

function closeExpandeableSideBarTab(expandable, anchor) {
    expandable.dataset.opened = "false";
    anchor.className = "has-arrow down-arrow";
    expandable.querySelector("#expandable-elements").style.display = "none";
}
