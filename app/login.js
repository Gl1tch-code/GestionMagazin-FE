
function showLoginForm(type) {
    const portalSection = document.getElementById('portalSection');
    const employeeForm = document.getElementById('employeeLoginForm');
    const adminForm = document.getElementById('adminLoginForm');

    portalSection.style.opacity = '0';
    setTimeout(() => {
        portalSection.style.display = 'none';
        if (type === 'employee') {
            employeeForm.classList.add('active');
        } else {
            adminForm.classList.add('active');
        }
    }, 300);
}

function backToPortal() {
    const portalSection = document.getElementById('portalSection');
    const employeeForm = document.getElementById('employeeLoginForm');
    const adminForm = document.getElementById('adminLoginForm');

    employeeForm.classList.remove('active');
    adminForm.classList.remove('active');

    setTimeout(() => {
        portalSection.style.display = 'block';
        portalSection.style.opacity = '1';
    }, 300);
}

// to remove
localStorage.clear();

function loginEmployee(event) {
    event.preventDefault();

    const username = document.getElementById('employeeUsername').value;
    const password = document.getElementById('employeePassword').value;

    if (username && password) {
        const employeeLoginBtn = document.getElementById("employeeLoginBtn");
        employeeLoginBtn.style.display = "none";
        document.querySelector(".login-error-msg").style.display = "none";
        document.getElementById("loader").style.display = "inline-block";

        const query = `
        query {
            utilisateurLogin(username: "${username}", password: "${password}") {
                id
                username
            }
        }
        `;

        async function userLogin() {

            fetch(window.constants.backend_url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            }).then((response) => response.json())
            .then((data) => {
                data.data.utilisateurLogin.role = window.constants.USERS_ROLES.user;
                localStorage.setItem("user-infos", JSON.stringify(data?.data?.utilisateurLogin));
                window.location.pathname = window.location.pathname.replace("/login.html", "/Articles.html")
            })
            .catch(() => {
                document.getElementById("loader").style.display = "none";
                employeeLoginBtn.style.display = "block";
                document.querySelector(".login-error-msg").style.display = "inline-block";
                document.getElementById("employeeUsername").value = "";
                document.getElementById("employeePassword").value = "";
            });
        }
        
        userLogin();
    }
    return false;
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("employeeLoginForm");
    if (form) {
        form.addEventListener("submit", loginEmployee);
    }

    const adminform = document.getElementById("adminLoginForm");
    if (adminform) {
        adminform.addEventListener("submit", loginAdmin);
    }
    
});

function loginAdmin(event) {
    event.preventDefault();
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    if (username && password) {
        const adminLoginBtn = document.getElementById("adminLoginBtn");
        adminLoginBtn.style.display = "none";
        document.querySelector(".admin-login-error-msg").style.display = "none";
        document.getElementById("admin-loader").style.display = "inline-block";

        const query = `
        query {
            adminLogin(username: "${username}", password: "${password}") {
                id
                username
            }
        }
        `;

        async function userLogin() {

            fetch(window.constants.backend_url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            }).then((response) => response.json())
            .then((data) => {
                data.data.adminLogin.role = window.constants.USERS_ROLES.admin;
                localStorage.setItem("user-infos", JSON.stringify(data?.data?.adminLogin));
                window.location.pathname = window.location.pathname.replace("/login.html", "/dashboard.html")
            })
            .catch(() => {
                document.getElementById("admin-loader").style.display = "none";
                adminLoginBtn.style.display = "block";
                document.querySelector(".admin-login-error-msg").style.display = "inline-block";
                document.getElementById("adminUsername").value = "";
                document.getElementById("adminPassword").value = "";
            });
        }
        
        userLogin();
    }
    return false;
}