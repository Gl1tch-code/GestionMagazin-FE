const currentUser = JSON.parse(localStorage.getItem("user-infos"));
function getAndFillData() {
    const query = `
    query MyQuery {
        getAllPartenaires {
            id
            nom
            adresse
            telephone
            ice
            soldePlafond
            observation
        }
    }`;

    async function fetchPartenaires() {
        fetch(window.constants.backend_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
        })
        .then((response) => response.json())
        .then(data => data?.data?.getAllPartenaires)
        .then(data => {
            data?.forEach((partner, index) => {
                const actionMenu = `
                    <td style="width: 250px;">
                        <div class="d-flex flex-wrap gap-3">
                            <div class="d-flex w-100 gap-2">
                                <!-- First pair -->
                                <button type="button" class="edit-btn btn btn-primary btn-sm pr-2 m-1 w-50" data-toggle="modal" data-target="#addPartenaireModal" title="Modifier">
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
                    <tr data-index="${index}" data-id="${partner?.id}">
                        <td style="min-width: 70px;" class="partner-nom">${partner?.nom}</td>
                        <td style="min-width: 70px;" class="partner-address">${partner?.adresse}</td>
                        <td style="min-width: 70px;" class="partner-telephone">${partner?.telephone}</td>
                        <td style="min-width: 70px;" class="partner-ice">${partner?.ice}</td>
                        <td style="min-width: 70px;" class="partner-soldePlafond">${partner?.soldePlafond} DH</td>
                        <td style="min-width: 70px;" class="partner-observation">${partner?.observation}</td>
                        ${actionMenu}
                    </tr>`

                    document.getElementById("partener-table-body").insertAdjacentHTML('beforeend', htmlRow);
            });
        
            document.getElementById("loader-row").style.display = "none";
            
            // Attach click event to preview buttons inside action menu
            document.querySelectorAll(".preview-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const row = this.closest("tr");
                    const index = row.getAttribute("data-index");
                    const partenaire = data[index];

                    document.getElementById("previewNom").textContent = partenaire?.nom || "N/A";
                    document.getElementById("previewAddress").textContent = partenaire?.adresse || "N/A";
                    document.getElementById("previewTelephone").textContent = partenaire?.telephone || "N/A";
                    document.getElementById("previewICE").textContent = partenaire?.ice || "N/A";
                    document.getElementById("previewSoldPlafond").textContent = partenaire?.soldePlafond || "N/A";
                    document.getElementById("previewObservation").textContent = partenaire?.observation || "N/A";

                });
            });

            // edite modal
            document.querySelectorAll(".edit-btn").forEach(button => {                
                button.addEventListener("click", function () {
                    let row = this.closest("tr");
                    const index = row.getAttribute("data-index");
                    const partner = data[index];

                    const currentId = row.dataset.id;
                    document.getElementById("addPartenaireModalLabel").textContent = "Editer le partenaire ";
                    
                    const form = document.getElementById("addPartenaireForm");

                    form.dataset.type = "edit";
                    form.dataset.rowId = currentId;
                    form.querySelector("button[type=submit]").textContent = "Editer";

                    document.getElementById("selectedNom").value = partner?.nom;
                    document.getElementById("selectedIce").value = partner?.ice;
                    document.getElementById("selectedAdresse").value = partner?.adresse;
                    document.getElementById("selectedTelephone").value = partner?.telephone;
                    document.getElementById("selectedObservation").value = partner?.observation;
                    document.getElementById("selectedSoldePlafond").value = partner?.soldePlafond;

                    // Open the modal manually (if needed)
                    $("#addPartenaireModal").modal("show");
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

            // Print button click handler
            document.querySelectorAll('button[title="Imprimer"]').forEach(printBtn => {
                printBtn.addEventListener('click', function() {
                    // Here you would typically trigger the actual print operation
                    window.print();
                });
            })

        })
    }
    fetchPartenaires()

}

getAndFillData();


document.querySelector(".show-add-partener-modal-btn").addEventListener("click", () => {
    const form = document.getElementById("addPartenaireForm");
    form.dataset.type = "add";

    form.querySelector("button[type=submit]").textContent = "Ajouter";
    document.getElementById("addPartenaireModalLabel").textContent = "Ajouter un partenaire";
    form.reset();
})


const form = document.getElementById("addPartenaireForm");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formObject = Object.fromEntries(new FormData(document.querySelector('#addPartenaireForm')));

    if(form.dataset.type === "add"){
        form.querySelector("button[type=submit]").disabled = true;
        
        const query = `
        mutation MyMutation2 {
            createPartenaire(
                nom: "${formObject?.nom}"
                ice: "${formObject?.ice}"
                adresse: "${formObject?.adresse}"
                telephone: "${formObject?.telephone}"
                observation: "${formObject?.observation}"
                soldePlafond: ${Number.parseInt(formObject?.soldePlafond)}
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
        .then(() => {
            window.location.reload();
        })
        .catch(() => {
            window.location.reload();
            console.error("Failed to create article");
        });

        
    } else if(form.dataset.type === "edit") {
        form.querySelector("button[type=submit]").disabled = true;

        const query = `
        mutation MyMutation {
            updatePartenaire(
                id: "${form.dataset.rowId}"
                nom: "${formObject?.nom}"
                ice: "${formObject?.ice}"
                adresse: "${formObject?.adresse}"
                telephone: "${formObject?.telephone}"
                observation: "${formObject?.observation}"
                soldePlafond: ${Number.parseInt(formObject?.soldePlafond)}
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
        .then(() => {
            window.location.reload();
        })
        .catch(() => {
            window.location.reload();
            console.error("Failed to create article");
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
        deletePartenaire(id: "${rowId}") {
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
        // window.location.reload();
    })
    .catch(() => {
        // window.location.reload()
        console.error("Failed to delete article");
    });
});
