
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

                const htmlRow = document.createElement('tr');
                htmlRow.dataset.index = index;
                htmlRow.dataset.id = entree?.id;
                htmlRow.innerHTML = `
                    <td class="entree-nbl">${entree?.numeroBand}</td>
                    <td class="entree-partner" data-value="${entree?.partenaire?.id}">${entree?.partenaire?.nom}</td>
                    <td class="entree-designation">${entree?.designation}</td>
                    <td class="entree-date">${new Date(entree?.dateTimeEntree).toLocaleDateString()}</td>
                    <td class="entree-totalHt" data-value="${entree?.totalHt}">${entree?.totalHt} DH</td>
                    <td class="entree-totalTtc" data-value="${entree?.totalTtc}">${entree?.totalTtc} DH</td>
                    <td style="display: none;" class="entree-totalTva" data-value="${entree?.totalTva}">${entree?.totalTva} DH</td>
                    ${actionMenu}
                    `;
                document.getElementById('entree-table-body').appendChild(htmlRow);
            })
            document.getElementById("files-upload-inactive-container").style.display = "none";
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
                    const index = row.getAttribute("data-index");
                    const currentId = row.dataset.id;
                    document.getElementById("nouvelleEntreeModalLabel").textContent = "Editer l'entree " + currentId
                    const form = document.getElementById("entryForm");
                    form.dataset.type = "edit";
                    form.dataset.rowId = currentId;
                    form.querySelector("button[type=submit]").textContent = "Editer";

                    document.getElementById("files-upload-inactive-container").style.display = "block";
                    document.getElementById("files-upload-container").style.display = "none";

                    // Fetch data from the row
                    let nbl = row.querySelector(".entree-nbl")?.textContent.trim() || "";
                    let partner = row.querySelector(".entree-partner")?.dataset.value || "";
                    let description = row.querySelector(".entree-designation")?.textContent.trim() || "";
                    let totalHt = row.querySelector(".entree-totalHt")?.dataset.value || "";                                        
                    let totalTtc = row.querySelector(".entree-totalTtc")?.dataset.value || "";                                        
                    let totalTva = row.querySelector(".entree-totalTva")?.dataset.value || "";                                        

                    // Populate modal fields
                    document.getElementById("nbl").value = nbl;
                    document.getElementById("selectedPartenaire").value = partner;
                    document.getElementById("designation").value = description;
                    document.getElementById("totalHT").value = totalHt;
                    document.getElementById("totalTVA").value = totalTva;
                    document.getElementById("totalTTC").value = totalTtc;

                    // Fill Articles
                    const entree = data[row.dataset.index];

                    console.log(entree);

                    document.getElementById("dateAjoute").value = entree?.dateTimeEntree;

                    document.getElementById("selectArticles").value = entree?.detailEntrees[0]?.article?.id;
                    document.getElementById("selectArticlesPrice").value = entree?.detailEntrees[0]?.prixUnitaire;
                    document.getElementById("selectArticlesQuantite").value = entree?.detailEntrees[0]?.quantite;

                    document.querySelectorAll(".new-select-article-row").forEach(elem => elem.remove());
                    for (let i = 1; i < entree?.detailEntrees.length; i++) {
                        const currentArticleData = entree?.detailEntrees[i];

                        console.log(currentArticleData);

                        handleAddArticleRow(currentArticleData?.article?.id, currentArticleData?.prixUnitaire, currentArticleData?.quantite, i-1);                               
                    }

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

}
getAndFillData()

    
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

async function fetchArticlesAndPartenersQuery(currentArticleValue, lineIndex) {
    console.log({currentArticleValue, lineIndex});
    
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
        
        const selectArticlesDropdown = document.querySelectorAll(".select-article");
        
        data?.getAllArticles?.forEach(article => {
            document.querySelectorAll(".new-select-article-row").forEach(articlesdropdown => {
                articlesdropdown.querySelector(".select-article").innerHTML = `<option value="" default>Toutes les articles</option>`;
            })
        })

        data?.getAllArticles?.forEach(article => {
            selectArticlesDropdown.forEach(articlesdropdown => {
                articlesdropdown.insertAdjacentHTML("beforeend", 
                    `<option value="${article?.id}">${article?.nom}</option>`);
            })
        })

        if(currentArticleValue !== undefined && lineIndex !== undefined) {
            selectArticlesDropdown[lineIndex].value = currentArticleValue;
        }
        
        
    })
    .catch(() => {
        console.error("Failed to fetch articles and partners");
    });

}
fetchArticlesAndPartenersQuery();

// Handle adding a new article row
document.getElementById('addRowBtn').addEventListener('click', () => handleAddArticleRow());


function handleAddArticleRow(currentArticleValue = undefined, currentArticlePrice = undefined, currentArticleQuantite = undefined ,lineIndex = undefined) {
    const articleRow = document.createElement('div');
    articleRow.classList.add('article-row', 'mb-2', 'new-select-article-row');
    articleRow.innerHTML = `
        <select name="selectArticles[]" class="form-control select-article">
            <option value="">Toutes les articles</option>
        </select>
        <input type="number" name="price[]" class="form-control price-input" placeholder="Prix" required min="0.01" step="0.01">
        <input type="number" name="quantite[]" class="form-control quntite-input" placeholder="Quantité" required min="1"  id="selectArticlesQuantite">
        <button type="button" class="btn btn-danger btn-sm delete-row-btn">Supprimer</button>
    `;
    document.getElementById('articlesContainer').appendChild(articleRow);

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
        const selectArticlesRow = document.querySelectorAll(".new-select-article-row");
        
        data?.getAllArticles?.forEach(() => {
            selectArticlesRow.forEach(articlesdropdown => {
                articlesdropdown.querySelector(".select-article").innerHTML = `<option value="" default>Toutes les articles</option>`;
            })
        })

        data?.getAllArticles?.forEach(article => {
            selectArticlesRow.forEach(articlesdropdown => {
                articlesdropdown.querySelector(".select-article").insertAdjacentHTML("beforeend", 
                    `<option value="${article?.id}">${article?.nom}</option>`);
            })
        })

        console.log(selectArticlesRow[lineIndex]);
        console.log(currentArticleValue);
        
        if(currentArticleValue !== undefined && lineIndex !== undefined) {
            selectArticlesRow[lineIndex].querySelector(".select-article").value = currentArticleValue;
        }
        
        if(currentArticlePrice !== undefined && lineIndex !== undefined) {
            selectArticlesRow[lineIndex].querySelector(".price-input").value = currentArticlePrice;
        }
        
        if(currentArticleQuantite !== undefined && lineIndex !== undefined) {
            selectArticlesRow[lineIndex].querySelector(".quntite-input").value = currentArticleQuantite;
        }
        
        
    })
    .catch(() => {
        console.error("Failed to fetch articles and partners");
    });


    // Attach delete event to the new delete button
    articleRow.querySelector('.delete-row-btn').addEventListener('click', function() {
        articleRow.remove();
    });
}


document.querySelector(".show-add-entree-modal-btn").addEventListener("click", () => {
    const form = document.getElementById("entryForm");
    form.dataset.type = "add";

    document.getElementById("files-upload-inactive-container").style.display = "none";
    document.getElementById("files-upload-container").style.display = "block";

    document.querySelectorAll(".new-select-article-row").forEach(elem => elem.remove());

    form.querySelector("button[type=submit]").textContent = "Ajouter l'entree";
    document.getElementById("nouvelleEntreeModalLabel").textContent = "Nouvelle Entrée";
    form.reset();

})

const form = document.getElementById("entryForm");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formObject = Object.fromEntries(new FormData(document.querySelector('#entryForm')));
    let filesIds = [];

    document.getElementById("file-list").childNodes?.forEach(fileElem => {
        fileElem?.querySelector(".remove-btn").dataset.fileId && filesIds.push(fileElem?.querySelector(".remove-btn").dataset.fileId);
    })

    formObject.filesIds = filesIds;

    const articlesData = [];

    // Get selected articles and prices
    const selectArticles = document.querySelectorAll('[name="selectArticles[]"]');
    const prices = document.querySelectorAll('[name="price[]"]');
    const quantites = document.querySelectorAll('[name="quantite[]"]');

    for (let i = 0; i < selectArticles.length; i++) {
        const articleId = selectArticles[i].value;
        const price = prices[i] ? prices[i].value : 0;
        const quantite = quantites[i] ? quantites[i].value : 0;

        if (articleId && price && quantite) {
            articlesData.push({
                articleId: articleId,
                prixUnitaire: parseFloat(price),
                quantite: quantite
            });
        }
    }

    // Add articles data to the form data
    formObject.articles = articlesData;

    // Now you can send this formObject to your server using fetch, AJAX, or any other method.
    console.log('Form data:', formObject);

    // Build the GraphQL mutation query string manually
    let articlesQueryString = articlesData.map(article => {
        return `{articleId:${article.articleId}, prixUnitaire:${article.prixUnitaire}, quantite:${article.quantite}}`;                  ////////////////////
    }).join(', ');

    if(form.dataset.type === "add"){
        form.querySelector("button[type=submit]").disabled = true;

        const query = `
        mutation MyMutation {
            createEntree(
                input: {
                    partenaireId: "${formObject.selectedPartenaire}", 
                    dateTimeEntree: "${formObject.dateAjoute}"
                    designation: "${formObject.designation?.replace(/\n/g, "\\n")}", 
                    numeroBand: "${formObject.nbl}", 
                    totalHt: ${formObject.totalHT}, 
                    totalTtc: ${formObject.totalTTC}, 
                    totalTva: ${formObject.totalTVA}, 
                    filesIds: ${JSON.stringify(formObject.filesIds)},
                    details: [${articlesQueryString}]
                }
            ) {
                id
            }
        }`;        

        console.log(query);
        
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
                    dateTimeEntree: "${formObject.dateAjoute}"
                    totalHt: ${formObject.totalHT}, 
                    totalTtc: ${formObject.totalTTC}, 
                    totalTva: ${formObject.totalTVA}, 
                    numeroBand: "${formObject.nbl}",
                    details: [${articlesQueryString}],
                    designation: "${formObject.designation?.replace(/\n/g, "\\n")}"
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
            // window.location.reload()
        })
        .catch(() => {
            // window.location.reload()
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

function addFileInput() {
    const container = document.createElement("div");
    container.classList.add("file-container");

    const input = document.createElement("input");
    input.type = "file";

    const fileName = document.createElement("span");
    fileName.classList.add("file-name");
    fileName.textContent = "No file selected";

    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-btn");
    removeButton.textContent = "Remove";
    removeButton.style.visibility = "hidden"; // Hide until file is uploaded
    removeButton.type = "button";

    input.addEventListener("change", function () {
        if (input.files.length > 0) {
            const file = input.files[0];
            fileName.textContent = "Uploading...";
            uploadFile(file, fileName, removeButton);
        }
    });

    removeButton.addEventListener("click", function () {
        deleteFile(removeButton.dataset.fileId, container);
    });

    container.appendChild(input);
    container.appendChild(fileName);
    container.appendChild(removeButton);
    document.getElementById("file-list").appendChild(container);
}

async function uploadFile(file, fileName, removeButton) {
    const formData = new FormData();
    formData.append("file", file);

    fetch(window.constants.domain + "/api/files/upload", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(id => { 
        const stringifiedId = id?.toString();       
        fileName.textContent = `✅ File uploaded successfully`;
        removeButton.style.visibility = "visible";
        removeButton.dataset.fileId = stringifiedId;
    })
    .catch(() => {
        fileName.textContent = `❌ Something went wrong`;
        console.log("Error uploading file");
    });

}

async function deleteFile(id, container) {
    fetch(window.constants.domain + "/api/files/delete/" + id, {
        method: "DELETE",
        body: {id},
    })
    .then(response => {
        response.ok && container.remove();
    })
    .catch(error => {
        alert("Error deleting file");
    });
}

addFileInput();
