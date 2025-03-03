
// Sample Data
const partenaires = [
    { id: 1, name: "Mohammed Alami" },
    { id: 2, name: "Ahmed Benomar" },
    { id: 3, name: "Khalid El Mansouri" },
    { id: 4, name: "Fatima Zahra Othmani" },
    { id: 5, name: "Youssef Idrissi" },
    { id: 6, name: "Amal Benslimane" }
];


const articles = [
    { id: 1, name: "Chemise à bulle jaune" },
    { id: 2, name: "Chemise en arabas" },
    { id: 3, name: "Chemise a sangle" },
    { id: 4, name: "Chemise cartonnée" },
    { id: 5, name: "Correcteur forme de stylo" },
    { id: 6, name: "Encre de photocopieur Konica minolta" },
    { id: 7, name: "Encre de photocopieur Ricoh Aficio MP 2000" }
];

// Initialize variables
let selectedArticles = new Map();

// Utility Functions
function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'MAD'
    }).format(price);
}

function calculateTotals() {
    let totalHT = 0;
    let totalTVA = 0;

    selectedArticles.forEach((data) => {
        const subtotal = data.price * data.quantity;
        totalHT += subtotal;
        totalTVA += subtotal * (data.tva / 100);
    });

    const totalTTC = totalHT + totalTVA;

    document.getElementById('totalHT').value = formatPrice(totalHT);
    document.getElementById('totalTVA').value = formatPrice(totalTVA);
    document.getElementById('totalTTC').value = formatPrice(totalTTC);
}

// Add Article
function addArticle(article) {
    // Ensure article is not already added
    if (selectedArticles.has(article.id)) {
        alert('Article déjà ajouté');
        return;
    }

    // Add article to selectedArticles with default quantity and price
    selectedArticles.set(article.id, {
        ...article,
        quantity: 1,
        unitPrice: 0,  // Default value for unit price
        vat: 0         // Default value for VAT
    });

    // Update the list of selected articles
    updateSelectedArticlesList();
}

// Update Selected Articles List
function updateSelectedArticlesList() {
    const container = document.getElementById('selectedArticles');
    container.innerHTML = '';

    selectedArticles.forEach((data, id) => {
        const div = document.createElement('div');
        div.className = 'product-item';
        div.innerHTML = `

            <div class="d-flex flex-column flex-md-row align-items-center gap-3 bg-info p-3 text-white rounded">
                <p class="text-white">${data.name}</p>
                <br>
                <div class="d-flex gap-2 flex-wrap">
                    <div class="form-group">
                        <label for="quantity-${id}" class="form-label">Quantité</label>
                        <input id="quantity-${id}" type="number" class="form-control quantity-input input-rounded" value="${data.quantity}" min="1" data-id="${id}" placeholder="Entrez la quantité">
                    </div>

                    <div class="form-group">
                        <label for="unit-price-${id}" class="form-label">Prix Unitaire</label>
                        <input id="unit-price-${id}" type="number" class="form-control input-rounded" value="${data.unitPrice}" min="1" data-id="${id}" placeholder="Entrez le prix">
                    </div>

                    <div class="form-group">
                        <label for="vat-${id}" class="form-label">TVA</label>
                        <input id="vat-${id}" type="number" class="form-control input-rounded" value="${data.vat}" min="1" data-id="${id}" placeholder="Entrez la TVA">
                    </div>

                    <button class="btn btn-sm btn-danger remove-article" data-id="${id}" title="Supprimer l'article">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;

        // Handle changes in quantity, unit price, and VAT
        div.querySelector('.quantity-input').onchange = (e) => {
            const quantity = parseInt(e.target.value);
            if (quantity > 0) {
                const articleData = selectedArticles.get(id);
                selectedArticles.set(id, { ...articleData, quantity });
                calculateTotals();
            }
        };

        div.querySelector('.input-rounded').onchange = (e) => {
            const inputId = e.target.id;
            const value = parseFloat(e.target.value);

            if (inputId.includes('unit-price')) {
                const articleData = selectedArticles.get(id);
                selectedArticles.set(id, { ...articleData, unitPrice: value });
            } else if (inputId.includes('vat')) {
                const articleData = selectedArticles.get(id);
                selectedArticles.set(id, { ...articleData, vat: value });
            }

            calculateTotals();
        };

        // Handle removal of article
        div.querySelector('.remove-article').onclick = () => {
            selectedArticles.delete(id);
            updateSelectedArticlesList();
            calculateTotals();
        };

        container.appendChild(div);
    });

    calculateTotals();
}

// Total Calculation (stub for example)
function calculateTotals() {
    // Example calculation of total price (this function should calculate based on quantity, unitPrice, and vat)
    let total = 0;
    selectedArticles.forEach((article) => {
        total += article.quantity * article.unitPrice * (1 + article.vat / 100);
    });
    document.getElementById('totalPrice').textContent = `Total: ${total.toFixed(2)} MAD`;
}

document.getElementById('scanButton').addEventListener('click', function() {
    alert('Fonctionnalité de scanner à implémenter');
});




// start
const currentUser = JSON.parse(localStorage.getItem("user-infos"));
function getAndFillData() {
    const query = `
    query MyQuery {
        getAllEntrees {
            id
            numeroBand
            designation
            dateTimeEntree
            totalTtc
            totalHt
            totalTva
            partenaire {
                id
                nom
            }
            detailEntrees {
                prixUnitaire
                quantite
                article {
                    id
                    nom
                }
            }
        }
    }`;

    async function fetchEntree() {
        fetch(window.constants.backend_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
        })
        .then((response) => response.json())
        .then(data => data?.data?.getAllEntrees)
        .then(data => {

            data.forEach((entree, index) => {
                const actionMenu = `
                <td style="width: 250px;">
                    <div class="d-flex flex-wrap gap-3">
                        <div class="d-flex w-100 gap-2" id="admin-only-viewed">
                            <button type="button" class="btn btn-primary btn-sm pr-2 m-1 w-50 edit-btn" data-toggle="tooltip" title="Modifier">
                                <i class="fas fa-edit"></i> Modifier
                            </button>
                            <button type="button" class="btn btn-danger btn-sm pr-2 m-1 w-50 delete-btn" data-toggle="tooltip" title="Supprimer">
                                <i class="fas fa-trash-alt"></i> Supprimer
                            </button>
                        </div>
                        <div class="d-flex w-100 gap-2">
                            <button type="button" class="btn btn-green btn-sm pr-2 m-1 w-50 preview-btn" data-target="#previewModal" data-toggle="modal" title="Aperçu">
                                <i class="fas fa-eye"></i> Aperçu
                            </button>
                            <button type="button" class="btn btn-imprimer btn-sm pr-2 m-1 w-50" data-toggle="tooltip" title="Imprimer">
                                <i class="fas fa-print"></i> Imprimer
                            </button>
                        </div>
                    </div>
                </td>`;
                
                const htmlRow = `
                <tr data-index="${index}" data-id="${entree?.id}">
                    <td class="entree-nbl">${entree?.numeroBand}</td>
                    <td class="entree-partner" data-value="${entree?.partenaire?.id}">${entree?.partenaire?.nom}</td>
                    <td class="entree-designation">${entree?.designation}</td>
                    <td class="entree-date">${new Date(entree?.dateTimeEntree).toLocaleDateString()}</td>
                    <td class="entree-totalHt" data-value="${entree?.totalHt}">${entree?.totalHt} DH</td>
                    <td class="entree-totalTtc" data-value="${entree?.totalTtc}">${entree?.totalTtc} DH</td>
                    <td style="display: none;" class="entree-totalTva" data-value="${entree?.totalTva}">${entree?.totalTva} DH</td>
                    ${entree?.detailEntrees?.map(({article}) => 
                        `<td style="display: none;" class="entree-article" data-value="${article?.id}">${article?.nom}</td>`
                    )}
                    ${actionMenu}
                </tr>`;

                document.getElementById("entree-table-body").insertAdjacentHTML("beforeend", htmlRow);
            })
            document.getElementById("loader-row").style.display = "none";

            // Attach click event to preview buttons inside action menu
            document.querySelectorAll(".preview-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const row = this.closest("tr");
                    const index = row.getAttribute("data-index");
                    const entree = data[index];

                    document.getElementById("previewNbl").textContent = entree?.numeroBand || "N/A";
                    document.getElementById("previewPartenaire").textContent = entree?.partenaire?.nom || "N/A";
                    document.getElementById("previewDesignation").textContent = entree?.designation || "N/A";
                    document.getElementById("previewDateAjoute").textContent = new Date(entree?.dateTimeEntree).toLocaleDateString() || "N/A";
                    document.getElementById("quantite").textContent = (entree?.detailEntrees?.[0]?.quantite || "N/A")  + " pieces";
                    document.getElementById("unitPrice").textContent = entree?.detailEntrees?.[0]?.prixUnitaire + " DH" || "N/A";
                    document.getElementById("previewTotalTtc").textContent = entree?.totalTtc + " DH" || "N/A";
                    document.getElementById("previewTotalHt").textContent = entree?.totalHt + " DH" || "N/A";
                    document.getElementById("previewTotalTva").textContent = entree?.totalTva + " DH" || "N/A";

                    const myNode = document.getElementById("entree-preview-left-col-articles");
                    myNode.textContent = '';

                    row.querySelectorAll(".entree-article").forEach((entreeArticle, entreeArticleIndex) => {
                        
                        const htmlArticle = `
                        <div class="form-group">
                            <label class="font-weight-bold">Article ${Number.parseInt(entreeArticleIndex)+1}</label>
                            <p class="border-bottom pb-2">${entreeArticle.textContent}</p>
                        </div>`;
                        myNode.insertAdjacentHTML('beforeend', htmlArticle);
                    })
                });
            });

            // edite modal
            document.querySelectorAll(".edit-btn").forEach(button => {
                button.addEventListener("click", function () {
                    let row = this.closest("tr");
                    const currentId = row.dataset.id;
                    document.getElementById("nouvelleEntreeModalLabel").textContent = "Editer l'entree " + currentId
                    const form = document.getElementById("entryForm");
                    form.dataset.type = "edit";
                    form.dataset.rowId = currentId;
                    form.querySelector("button[type=submit]").textContent = "Editer";
                    
                    // Fetch data from the row
                    let nbl = row.querySelector(".entree-nbl")?.textContent.trim() || "";
                    let partner = row.querySelector(".entree-partner")?.dataset.value || "";
                    let description = row.querySelector(".entree-designation")?.textContent.trim() || "";
                    let totalHt = row.querySelector(".entree-totalHt")?.dataset.value || "";                                        
                    let totalTtc = row.querySelector(".entree-totalTtc")?.dataset.value || "";                                        
                    let totalTva = row.querySelector(".entree-totalTva")?.dataset.value || "";                                        
                    let articleId = row.querySelector(".entree-article")?.dataset.value || "";                                        

                    // Populate modal fields
                    document.getElementById("nbl").value = nbl;
                    document.getElementById("selectedPartenaire").value = partner;
                    document.getElementById("designation").value = description;
                    document.getElementById("selectArticles").value = articleId;
                    document.getElementById("totalHT").value = totalHt;
                    document.getElementById("totalTVA").value = totalTva;
                    document.getElementById("totalTTC").value = totalTtc;
        
                    // Open the modal manually (if needed)
                    $("#nouvelleEntreeModal").modal("show");
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

            if (currentUser.role === window.constants.USERS_ROLES.user) {
                document.querySelectorAll("#admin-only-viewed")
                .forEach((actionMenu) => {
                    actionMenu.className = "d-none w-100 gap-2";
                })
            }
            

        }).catch()
    }
    fetchEntree()

    
    const articlesAndPartenersQuery = `
    query MyQuery {
        getAllArticles {
            id
            nom
        }
        getAllPartenaires {
            id
            nom
        }
    }`;

    async function fetchArticlesAndPartenersQuery() {
        fetch(window.constants.backend_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: articlesAndPartenersQuery }),
        })
        .then((response) => response.json())
        .then(data => data?.data)
        .then((data) => {
            const selectedPartenaire = document.getElementById("selectedPartenaire");
            
            data?.getAllPartenaires?.forEach(partner => {
                selectedPartenaire.insertAdjacentHTML("beforeend", 
                    `<option value="${partner?.id}">${partner?.nom}</option>`)
            })
            
            const selectArticlesDropdown = document.getElementById("selectArticles");
            
            data?.getAllArticles?.forEach(article => {
                selectArticlesDropdown.insertAdjacentHTML("beforeend", 
                    `<option value="${article?.id}">${article?.nom}</option>`)
            })
            
            
        })
        .catch(() => {
            console.error("Failed to fetch articles and partners");
        });

    }
    fetchArticlesAndPartenersQuery();
}

getAndFillData()

document.querySelector(".show-add-entree-modal-btn").addEventListener("click", () => {
    const form = document.getElementById("entryForm");
    form.dataset.type = "add";

    form.querySelector("button[type=submit]").textContent = "Ajouter l'entree";
    document.getElementById("nouvelleEntreeModalLabel").textContent = "Nouvelle Entrée";
    form.reset();

})

const form = document.getElementById("entryForm");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formObject = Object.fromEntries(new FormData(document.querySelector('#entryForm')));

    if(form.dataset.type === "add"){
        const currentDate = new Date().toISOString();
        form.querySelector("button[type=submit]").disabled = true;
        
        const query = `
        mutation MyMutation {
            createEntree(
                input: {partenaireId: "${formObject.selectedPartenaire}", 
                designation: "${formObject.designation}", 
                numeroBand: "${formObject.nbl}", 
                totalHt: ${formObject.totalHT}, 
                totalTtc: ${formObject.totalTTC}, 
                totalTva: ${formObject.totalTVA}, 
                details: {
                    articleId: "${formObject.selectArticles}"
                }}
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
            updateEntree(
                id: "${form.dataset.rowId}"
                input: {
                    partenaireId: "${formObject.selectedPartenaire}", 
                    totalHt: ${formObject.totalHT}, 
                    totalTtc: ${formObject.totalTTC}, 
                    totalTva: ${formObject.totalTVA}, 
                    numeroBand: "${formObject.nbl}", 
                    details: {
                        articleId: "${formObject.selectArticles}"
                    }, 
                    designation: "${formObject.designation}", 
                }
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
        .then((response) => response.json())
        .then(() => {
            window.location.reload()
        })
        .catch(() => {
            window.location.reload()
            console.error("Failed to create article");
        });


    }

})

const confirmDeleteBtn = document.getElementById("confirmDelete");
confirmDeleteBtn.addEventListener("click", function () {
    let rowId = this.dataset.rowId;
    confirmDeleteBtn.disabled = true;

    const deleteQuery = `
    mutation MyMutation2 {
        deleteEntree(id: "${rowId}") {
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
