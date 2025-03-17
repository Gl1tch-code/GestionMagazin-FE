const currentUser = JSON.parse(localStorage.getItem("user-infos"));
function getAndFillData() {
    const query = `
    query MyQuery {
        getAllFonctionnaires {
            id
            nom
            prenom
            grade
            serviceClass {
                id
                nom
            }
            utilisateurs {
                id
                username
                password
            }
        }
    }`;

    async function fetchFonctionnaires() {
        fetch(window.constants.backend_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
        })
        .then((response) => response.json())
        .then(data => data?.data?.getAllFonctionnaires)
        .then(data => {
            console.log(data);
            data?.forEach((fonctionnaire, index) => {
                const actionMenu = `
                    <td style="width: 250px;">
                        <div class="d-flex flex-wrap gap-3">
                            <div class="d-flex w-100 gap-2" id="admin-only-viewed">
                                <!-- First pair -->
                                <button type="button" class="edit-btn btn btn-primary btn-sm pr-2 m-1 w-50" data-toggle="modal" data-target="#nouveauFonctionnaireModal" title="Modifier">
                                <i class="fas fa-edit"></i> Modifier
                                </button>
                                <button type="button" class="delete-btn btn btn-danger btn-sm pr-2 m-1 w-50" data-toggle="modal" data-target="#deletePartenaireModal" title="Supprimer">
                                <i class="fas fa-trash-alt"></i> Supprimer
                                </button>
                            </div>
                            
                            <div class="d-flex w-100 gap-2">
                                <!-- Second pair -->
                                <button type="button" class="btn btn-green btn-sm pr-2 m-1 w-50 preview-btn" data-target="#previewModal" data-toggle="modal" data-placement="top" title="Apércu">
                                <i class="fas fa-eye"></i> Apércu
                                </button>
                                <button type="button" class="btn btn-imprimer btn-sm pr-2 m-1 w-50" data-toggle="tooltip" data-placement="top" title="Imprimer">
                                <i class="fas fa-print"></i> Imprimer
                                </button>
                            </div>
                        </div>                                                  
                    </td>`
                    
                const htmlRow = `
                    <tr data-index="${index}" data-id="${fonctionnaire?.id}">
                        <td style="min-width: 70px;" class="fonctionnaire-nom">${`${fonctionnaire?.nom} ${fonctionnaire?.prenom}`}</td>
                        <td style="min-width: 70px;" class="fonctionnaire-grade">${fonctionnaire?.grade}</td>
                        <td style="min-width: 70px;" class="fonctionnaire-service-class" data-valUe="${fonctionnaire?.serviceClass?.id}">${fonctionnaire?.serviceClass?.nom}</td>
                        <td style="min-width: 70px;" class="fonctionnaire-username" data-value="${fonctionnaire?.utilisateurs?.[0]?.id}">${fonctionnaire?.utilisateurs?.[0]?.username}</td>
                        ${actionMenu}
                    </tr>`

                    document.getElementById("fonctionnaires-table-body").insertAdjacentHTML('beforeend', htmlRow);
            });
        
            document.getElementById("loader-row").style.display = "none";


            // Attach click event to preview buttons inside action menu
            document.querySelectorAll(".preview-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const row = this.closest("tr");
                    const index = row.getAttribute("data-index");
                    const fonctionnaire = data[index];
                    console.log(fonctionnaire);
                    

                    document.getElementById("previewFonctionnaireNom").textContent = `${fonctionnaire?.nom} ${fonctionnaire?.prenom}`;
                    document.getElementById("previewFonctionnaireGrade").textContent = fonctionnaire?.grade || "N/A";
                    document.getElementById("previewFonctionnaireService").textContent = fonctionnaire?.serviceClass?.nom || "N/A";
                    document.getElementById("previewFonctionnaireUsername").textContent = fonctionnaire?.utilisateurs?.[0]?.username || "N/A";

                });
            });

            
            // edite modal
            document.querySelectorAll(".edit-btn").forEach(button => {                
                button.addEventListener("click", function () {
                    let row = this.closest("tr");
                    const index = row.getAttribute("data-index");
                    const fonctionnaire = data[index];

                    const currentId = row.dataset.id;
                    document.getElementById("nouveauFonctionnaireModalLabel").textContent = "Editer le fonctionnaire ";
                    console.log(row.querySelector(".fonctionnaire-service-class").dataset.value);
                    
                    const form = document.getElementById("nouveauFonctionnaireModalForm");

                    form.dataset.type = "edit";
                    form.dataset.rowId = currentId;
                    form.dataset.userid = fonctionnaire?.utilisateurs?.[0]?.id;
                    
                    form.querySelector("button[type=submit]").textContent = "Editer";

                    document.getElementById("fonctionnaireNom").value = fonctionnaire?.nom;
                    document.getElementById("fonctionnairePrenom").value = fonctionnaire?.prenom;
                    document.getElementById("fonctionnaireGrade").value = fonctionnaire?.grade;
                    document.getElementById("selectedServiceClass").value = row.querySelector(".fonctionnaire-service-class").dataset.value;
                    document.getElementById("fonctionnaireUsername").value = fonctionnaire?.utilisateurs?.[0]?.username;
                    document.getElementById("fonctionnairePassword").value = fonctionnaire?.utilisateurs?.[0]?.password;

                    // Open the modal manually (if needed)
                    $("#nouveauFonctionnaireModal").modal("show");
                });
            });

            document.querySelectorAll(".delete-btn").forEach(button => {
                button.addEventListener("click", function () {
                    let row = this.closest("tr"); // Get the closest row
                    let rowId = row.dataset.id; // Fetch article ID from dataset
            
                    // Store article ID in a dataset for confirmation later
                    document.getElementById("confirmDelete").dataset.rowId = rowId;
            
                    // Show the modal
                    $("#deleteModal").modal("show");
                });
            });

            if (currentUser.role === window.constants.USERS_ROLES.user) {
                document.querySelectorAll("#admin-only-viewed")
                .forEach((actionMenu) => {
                    actionMenu.className = "d-none w-100 gap-2";
                })
            }


        });


        document.getElementById("showPassCheckbox").addEventListener("change", (e) => {
            if(e.target.checked === true) {
                document.getElementById("fonctionnairePassword").type = "text";
            } else {
                document.getElementById("fonctionnairePassword").type = "password";
            }
            
        })
    }
    fetchFonctionnaires();

    async function fetchServiceClasses() {

        const query2 = `
        query MyQuery {
            getAllServiceClasses {
                id
                nom
            }
        }`;

        fetch(window.constants.backend_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: query2 }),
        })
        .then((response) => response.json())
        .then(data => data?.data)
        .then((data) => {
            const selectedServiceClass = document.getElementById("selectedServiceClass");
            
            data?.getAllServiceClasses?.forEach(serviceClass => {
                selectedServiceClass.insertAdjacentHTML("beforeend", 
                    `<option value="${serviceClass?.id}">${serviceClass?.nom}</option>`)
            })
            
        })
        .catch(() => {
            console.error("Failed to fetch articles and partners");
        });

    }
    fetchServiceClasses();
}

getAndFillData();


document.querySelector(".show-add-fonctionnaire-modal-btn").addEventListener("click", () => {
    const form = document.getElementById("nouveauFonctionnaireModalForm");
    form.dataset.type = "add";

    form.querySelector("button[type=submit]").textContent = "Ajouter";
    document.getElementById("nouveauFonctionnaireModalLabel").textContent = "Ajouter un fonctionnaire";
    form.reset();
})


const form = document.getElementById("nouveauFonctionnaireModalForm");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formObject = Object.fromEntries(new FormData(document.querySelector('#nouveauFonctionnaireModalForm')));

    if(form.dataset.type === "add"){
        form.querySelector("button[type=submit]").disabled = true;
        
        const query = `
            mutation MyMutation2 {
                createFonctionnaire(
                    serviceClassId: "${formObject?.serviceClass}", 
                    prenom: "${formObject?.prenom}", 
                    nom: "${formObject?.nom}", 
                    grade: "${formObject?.grade}"
                ) {
                    id
                }
            }`

        fetch(window.constants.backend_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
        })
        .then((response) => response.json())
        .then((data) => {
            const query2 = `
                mutation MyMutation2 {
                    createUtilisateur(
                        fonctionnaireId: "${data?.data?.createFonctionnaire?.id}", 
                        password: "${formObject?.password}", 
                        username: "${formObject?.username}"
                    ) {
                        id
                    }
                }`;

            fetch(window.constants.backend_url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: query2 }),
            })
            .then(() => {
                window.location.reload();
            })
            .catch(() => {
                window.location.reload();
            })
            
        })
        .catch(() => {
            window.location.reload();
            console.error("Failed to create fonctionnaire");
        });

        
    } else if(form.dataset.type === "edit") {
        form.querySelector("button[type=submit]").disabled = true;

        const query = `
            mutation MyMutation2 {
                updateFonctionnaire(
                id: "${form.dataset.rowId}"
                serviceClassId: "${formObject?.serviceClass}", 
                prenom: "${formObject?.prenom}", 
                nom: "${formObject?.nom}", 
                grade: "${formObject?.grade}"
                ) {
                    id
                }
            }`;

        fetch(window.constants.backend_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
        })
        .then(() => {
            const queryUpdateUser = `
            mutation MyMutation2 {
                updateUtilisateur(
                id: "${form.dataset.userid}"
                fonctionnaireId: "${form.dataset.rowId}", 
                password: "${formObject?.password}", 
                username: "${formObject?.username}"
                ) {
                    id
                }
            }`;

            const queryCreateUser = `
            mutation MyMutation2 {
                createUtilisateur(
                    fonctionnaireId: "${form.dataset.rowId}", 
                    password: "${formObject?.password}", 
                    username: "${formObject?.username}"
                ) {
                    id
                }
            }`;

            console.log(form.dataset.userid);
            

            fetch(window.constants.backend_url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: form.dataset.userid !== "undefined" ? queryUpdateUser : queryCreateUser }),
            })
            .then(() => {
                window.location.reload();
            })
            .catch(() => {
                window.location.reload();
            })

        })
        .catch(() => {
            window.location.reload();
        });        

    }

})


const confirmDeleteBtn = document.getElementById("confirmDelete");
confirmDeleteBtn.addEventListener("click", function () {
    let rowId = this.dataset.rowId;
    confirmDeleteBtn.disabled = true;

    console.log(rowId);
    
    const deleteQuery = `
    mutation MyMutation {
        deleteFonctionnaire(id: "${rowId}") {
            id
        }
    }`;

    fetch(window.constants.backend_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: deleteQuery }),
    })
    .then((response) => response.json())
    .then(() => {
        window.location.reload();
    })
    .catch(() => {
        window.location.reload()
        console.error("Failed to delete article");
    });
});
