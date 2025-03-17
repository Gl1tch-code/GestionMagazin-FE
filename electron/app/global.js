// constants.js
// const domain = "http://localhost:4444"
const domain = "http://5.189.154.85"
const backend_url = domain + "/graphql";
const USERS_ROLES = {
    user: "USER",
    admin: "ADMIN"
}
const STOCK_STATUS = {
    enStock: "En stock",
    faibleStock: "Faible stock",
    ruptureDeStock: "En rupture"
}

// Expose constants globally so they can be accessed anywhere
window.constants = {
    domain,
    backend_url,
    USERS_ROLES,
    STOCK_STATUS
};

window.isGlobalJsLoaded = true;

const handleSidebarContentDependingOnUserRole = () => {

    const usrerInfos = JSON.parse(localStorage.getItem("user-infos"));
    if (usrerInfos) {
        if(usrerInfos.role === window.constants.USERS_ROLES.user){
            document.getElementById('dashboard-li').style.display = "none";
            document.getElementById('suivi_consommations-li').style.display = "none";
        }
    } else {
        alert("user Date unavailable")
    }
}

