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
                    if(expandable.dataset.opened === "false") {
                        openExpandeableSideBarTab(expandable, anchor);
                    } else{
                        closeExpandeableSideBarTab(expandable, anchor);
                    }
                })
            })
            if (window.isGlobalJsLoaded) {
                handleSidebarContentDependingOnUserRole();
            }

            return data;

        })
        .then((data) => {
            
            const sideBar = document.querySelector(`.nk-sidebar`)
            document.querySelector(".sidebar-toggle-icon").addEventListener("click", () => {
                if(sideBar !== undefined) {

                    if(sideBar.style.left === "" || sideBar.style.left === "-100%"){
                        sideBar.style.left = "0px";
                    } else {
                        sideBar.style.left = "-100%";
                    }

                    console.log(sideBar.style.left);
                    
                }
            })

            document.querySelector(".refresh-page-icon").addEventListener("click", () => {
                window.location.reload();
            })

        })
        .catch(error => {
            console.error("Error loading sidebar:", error);
            sidebarPlaceholder.innerHTML = "<p>Failed to load sidebar</p>";
        });
});

function openExpandeableSideBarTab(expandable, anchor) {
    expandable.dataset.opened = "true";
    anchor.className = "has-arrow up-arrow";
    expandable.querySelector("#expandable-elements").style.display = "block"
}

function closeExpandeableSideBarTab(expandable, anchor) {
    expandable.dataset.opened = "false";
    anchor.className = "has-arrow down-arrow";
    expandable.querySelector("#expandable-elements").style.display = "none"
}
