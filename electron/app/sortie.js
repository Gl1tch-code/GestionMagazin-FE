
// document.getElementById('addProductBtn').addEventListener('click', function () {
//     const productList = document.getElementById('productList');
//     const selectedProducts = document.getElementById('selectedProducts');
//     const prixTotalInput = document.getElementById('prixTotal');
//     let total = 0;

//     Array.from(productList.selectedOptions).forEach(option => {
//         const productId = option.value;

//         // Check if product is already added
//         if (!document.querySelector(`.product-item[data-product-id="${productId}"]`)) {
//             const productItem = document.createElement('div');
//             productItem.classList.add('product-item', 'mb-2');
//             productItem.setAttribute('data-product-id', productId);

//             const price = Math.floor(Math.random() * 1000) + 100; // Example random price
//             total += price;

//             productItem.innerHTML = `
//                 <span>${option.text}</span> 
//                 <input type="number" class="form-control w-25 d-inline ms-2" placeholder="Quantité">
//                 <input type="number" class="form-control w-25 d-inline ms-2" placeholder="Prix">
//                 <input type="text" class="form-control w-25 d-inline ms-2" placeholder="TVA">
//                 <button class="btn btn-sm btn-danger ms-2 remove-product">Supprimer</button>
//             `;

//             selectedProducts.appendChild(productItem);
//         }
//     });

//     prixTotalInput.value = total + " DH";

//     // Remove product event
//     selectedProducts.addEventListener('click', function (e) {
//         if (e.target.classList.contains('remove-product')) {
//             const productPrice = parseInt(e.target.previousElementSibling.textContent.split(' ')[0]);
//             total -= productPrice;
//             prixTotalInput.value = total + " DH";
//             e.target.closest('.product-item').remove();
//         }
//     });
// });




// start
const currentUser = JSON.parse(localStorage.getItem("user-infos"));
function getAndFillData() {
    const query = `
    query MyQuery {
        getAllSorties {
            id
            motif
            dateTimeSortie
            fonctionnaire {
                id
                nom
                prenom
                serviceClass {
                    id
                    nom
                    division {
                        id
                        nom
                    }
                }
            }
            detailSorties {
                id
                quantite
                article {
                    unite
                    id
                    nom
                    designation
                    detailEntrees {
                        tva
                        prixUnitaire
                    }
                }
            }
        }
    }`;

    async function fetchSorties() {
        fetch(window.constants.backend_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
        })
        .then((response) => response.json())
        .then(data => data?.data?.getAllSorties)
        .then(data => {
            console.log(data);

            data?.forEach((sortie, index) => {
                let totalQuantite = 0;
                sortie?.detailSorties?.forEach(ds => {
                    totalQuantite += ds?.quantite;                    
                })
                const prix = 100;
 
                const actionMenu = `
                <td style="width: 250px;">
                    <div class="d-flex flex-wrap gap-3">
                        <div class="d-flex w-100 gap-2" id="admin-only-viewed">
                            <!-- First pair -->
                            <button type="button" class="edit-btn btn btn-primary btn-sm pr-2 m-1 w-50" data-toggle="tooltip" data-placement="top" title="Modifier">
                                <i class="fas fa-edit"></i> Modifier
                            </button>
                            <button type="button" class="delete-btn btn btn-danger btn-sm pr-2 m-1 w-50" data-toggle="tooltip" data-placement="top" title="Supprimer">
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
                </td>`;
                
                const htmlRow = `
                <tr data-index="${index}" data-id="${sortie?.id}">
                    <td class="sortie-sortieNum">${sortie?.id}</td>
                    <td class="sortie-fonctionnaire" data-value="${sortie?.fonctionnaire?.id}">${`${sortie?.fonctionnaire?.prenom} ${sortie?.fonctionnaire?.nom}`}</td>
                    <td class="sortie-division" data-value="${sortie?.fonctionnaire?.serviceClass?.division?.id}">${sortie?.fonctionnaire?.serviceClass?.division?.nom}</td>
                    <td class="sortie-service" data-value="${sortie?.fonctionnaire?.serviceClass?.id}">${sortie?.fonctionnaire?.serviceClass?.nom}</td>
                    <td class="sortie-date" data-value="${sortie?.dateTimeSortie}">${new Date(sortie?.dateTimeSortie)?.toLocaleDateString()}</td>
                    ${actionMenu}
                </tr>`;

                document.getElementById("sortie-table-body").insertAdjacentHTML('beforeend', htmlRow);
            });

            document.getElementById("loader-row").style.display = "none";

            // Attach click event to preview buttons inside action menu
            document.querySelectorAll(".preview-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const row = this.closest("tr");
                    const index = row.getAttribute("data-index");
                    const sortie = data[index];

                    document.getElementById("previewSortieNum").textContent = sortie?.id || "N/A";
                    document.getElementById("previewPartenaire").textContent = `${sortie?.fonctionnaire?.prenom} ${sortie?.fonctionnaire?.nom}`;
                    document.getElementById("previewMotif").textContent = sortie?.motif;
                    document.getElementById("previewDateAjoute").textContent = new Date(sortie?.dateTimeSortie).toLocaleDateString() || "N/A";
                    document.getElementById("previewDevision").textContent = sortie?.fonctionnaire?.serviceClass?.division?.nom;
                    document.getElementById("previewService").textContent = sortie?.fonctionnaire?.serviceClass?.nom;
                    
                    const myNode = document.getElementById("sortie-preview-right-col-articles");
                    myNode.textContent = '';
                    
                    sortie?.detailSorties?.forEach((detailSortie, detailSortieIndex) => {

                        const htmlArticle = `
                        <div class="form-group">
                            <label class="font-weight-bold">Article ${Number.parseInt(detailSortieIndex)+1}</label>
                            <p class="border-bottom pb-2">${detailSortie?.article?.nom} (${detailSortie?.quantite} pcs)</p>
                        </div>`;
                        myNode.insertAdjacentHTML('beforeend', htmlArticle);
                    })
                });
            });


            // edite modal
            document.querySelectorAll(".edit-btn").forEach(button => {                
                button.addEventListener("click", function () {
                    duplicateArticles(true);
                    let row = this.closest("tr");
                    const index = row.getAttribute("data-index");
                    const sortie = data[index];

                    const currentId = row.dataset.id;
                    document.getElementById("nouvelleSortieModalLabel").textContent = "Editer la sortie " + currentId
                    
                    const form = document.getElementById("nouvelleSortieForm");

                    console.log(form);
                    
                    form.dataset.type = "edit";
                    form.dataset.rowId = currentId;
                    form.querySelector("button[type=submit]").textContent = "Editer";
                    
                    // Fetch data from the row
                    let fonctionnaire = row.querySelector(".sortie-fonctionnaire")?.dataset.value || "";
                    let division = row.querySelector(".sortie-division")?.dataset.value || "";
                    let service = row.querySelector(".sortie-service")?.dataset.value || "";

                    // Populate modal fields
                    document.getElementById("selectedFonctionnaire").value = fonctionnaire;
                    document.getElementById("sortieMotif").value = sortie?.motif;
                    document.getElementById("selectedDivision").value = division;
                    document.getElementById("selectedService").value = service;
        
                    sortie?.detailSorties?.forEach((detailSortie, index) => {

                        if(index > 0) {
                            duplicateArticles();
                        }

                        const container = document.getElementById('articles-container');

                        const lastArticleChild = container?.lastElementChild;
                        lastArticleChild.querySelector("#selectedArticle").value = detailSortie?.article?.id;
                        lastArticleChild.querySelector("#selectedArticleQuantite").value = detailSortie?.quantite;
                    })

                    document.getElementById("selectedDivision").disabled = true;
                    document.getElementById("selectedService").disabled = true;

                    // Open the modal manually (if needed)
                    $("#nouvelleSortieModal").modal("show");
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
                    let row = this.closest("tr"); // Get the closest row
                    let rowId = row.dataset.id; // Fetch article ID from dataset
                    const index = row.getAttribute("data-index");
                    const sortie = data[index];

                    let finalHtmlContent = "";

                    sortie?.detailSorties?.forEach(detailSortie => {

                        const htmlContent = `
                        <tr>
                            <td>${detailSortie?.article?.id}</td>
                            <td>${detailSortie?.article?.designation}</td>
                            <td>${detailSortie?.article?.unite}</td>
                            <td>${detailSortie?.quantite}</td>
                            <td>${detailSortie?.article?.detailEntrees?.[0]?.prixUnitaire} DH</td>
                            <td>${detailSortie?.article?.detailEntrees?.[0]?.prixUnitaire * detailSortie?.quantite} DH</td>
                        </tr>`;
                        finalHtmlContent+= htmlContent;
    
                        document.getElementById("montant-total-ht").textContent = `${detailSortie?.article?.detailEntrees?.[0]?.prixUnitaire * detailSortie?.quantite} DH`;
                        document.getElementById("montant-tva").textContent = `${detailSortie?.article?.detailEntrees?.[0]?.tva || 0} DH`;
                        document.getElementById("montant-total-ttc").textContent = `${(detailSortie?.article?.detailEntrees?.[0]?.prixUnitaire * detailSortie?.quantite) + (detailSortie?.article?.detailEntrees?.[0]?.tva || 0)} DH`;
                    })
                    document.getElementById("date").textContent = new Date().toLocaleDateString();

                    document.getElementById("benificiaire").textContent = `${sortie?.fonctionnaire?.prenom} ${sortie?.fonctionnaire?.nom}`;
                    document.getElementById("division").textContent = sortie?.fonctionnaire?.serviceClass?.division?.nom;
                    document.getElementById("service").textContent = sortie?.fonctionnaire?.serviceClass?.nom;

                    document.getElementById("responsable").textContent = JSON.parse(localStorage.getItem("user-infos"))?.username;
                    document.getElementById("emplacement").textContent = "..........................";

                    document.getElementById("montants").insertAdjacentHTML("beforebegin", finalHtmlContent)

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

        })
    }
    fetchSorties()

    const query2 = `
    query MyQuery {
        getAllFonctionnaires {
            id
            nom
        }
        getAllDivisions {
            id
            nom
        }
        getAllServiceClasses {
            id
            nom
        }
        getAllArticles {
            id
            nom
        }
    }`;

    async function fetchFonctionnaires() {
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
            const selectedFonctionnaire = document.getElementById("selectedFonctionnaire");
            
            data?.getAllFonctionnaires?.forEach(fonctionnaire => {
                selectedFonctionnaire.insertAdjacentHTML("beforeend", 
                    `<option value="${fonctionnaire?.id}">${fonctionnaire?.nom}</option>`)
            })
 
            const selectedDivision = document.getElementById("selectedDivision");
            
            data?.getAllDivisions?.forEach(division => {
                selectedDivision.insertAdjacentHTML("beforeend", 
                    `<option value="${division?.id}">${division?.nom}</option>`)
            })
 
            const selectedService = document.getElementById("selectedService");
            
            data?.getAllServiceClasses?.forEach(service => {
                selectedService.insertAdjacentHTML("beforeend", 
                    `<option value="${service?.id}">${service?.nom}</option>`)
            })
            
            const selectedArticle = document.getElementById("selectedArticle");
            
            data?.getAllArticles?.forEach(article => {
                selectedArticle.insertAdjacentHTML("beforeend", 
                    `<option value="${article?.id}">${article?.nom}</option>`)
            })
            
        })
        .catch(() => {
            console.error("Failed to fetch articles and partners");
        });

    }
    fetchFonctionnaires();
}

getAndFillData();

document.querySelector(".show-add-sortie-modal-btn").addEventListener("click", () => {
    duplicateArticles(true);
    const form = document.getElementById("nouvelleSortieForm");
    document.getElementById("selectedDivision").disabled = false;
    document.getElementById("selectedService").disabled = false;

    form.dataset.type = "add";

    form.querySelector("button[type=submit]").textContent = "Ajouter Sortie";
    document.getElementById("nouvelleSortieModalLabel").textContent = "Ajouter Sortie";
    form.reset();

})

const form = document.getElementById("nouvelleSortieForm");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formObject = Object.fromEntries(new FormData(document.querySelector('#nouvelleSortieForm')));
    const articlesList = [];
    
    Object.keys(formObject).forEach((currentKey) => {

        if(currentKey.startsWith("articleId")) {
            const currentArticle = {
                id: formObject?.[currentKey],
                quantite: formObject?.["articleQuantity-" + currentKey.split("-")?.[1]]
            };
            articlesList.push(currentArticle);
            
        }

    })

    if(form.dataset.type === "add"){
        const currentDate = new Date().toISOString();
        form.querySelector("button[type=submit]").disabled = true;

        const query = `
        mutation MyMutation {
            createSortie(
                input: {
                    dateTimeSortie: "${currentDate.slice(0, currentDate.indexOf("."))}", 
                    motif: "${formObject?.motif}", 
                    fonctionnaireId: "${formObject?.fonctionnaire}", 
                    details: [${articlesList?.map((article) => {
                        return `{ quantite: ${article?.quantite}, articleId: ${article?.id} }`
                    })}]
                }
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
        const currentDate = new Date().toISOString();
        form.querySelector("button[type=submit]").disabled = true;

        const query = `
        mutation MyMutation {
            updateSortie(
                id: "${form.dataset.rowId}"
                input: {
                    dateTimeSortie: "${currentDate.slice(0, currentDate.indexOf("."))}", 
                    motif: "${formObject?.motif}", 
                    fonctionnaireId: "${formObject?.fonctionnaire}", 
                    details: [${articlesList?.map((article) => {
                        return `{ quantite: ${article?.quantite}, articleId: ${article?.id} }`
                    })}]
                }
            ) {
                id
            }
        }`
        console.log("edit", formObject);

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

function duplicateArticles(leaveOne = false) {
    const container = document.getElementById('articles-container');

    const cloned = container.firstElementChild.cloneNode(true);
    const containerChildrenLength = container.children.length;

    cloned.id = cloned.id + containerChildrenLength;
    cloned.querySelector("#selectedArticle").value = "";
    cloned.querySelector("#selectedArticle").name = "articleId-" + (leaveOne === true ? "0" : containerChildrenLength);
    cloned.querySelector("#selectedArticleQuantite").value = '';
    cloned.querySelector("#selectedArticleQuantite").name = "articleQuantity-" + (leaveOne === true ? "0" : containerChildrenLength);
    
    console.log(cloned);

    if (leaveOne === true) {
        container.textContent = "";
    } 

    
    container.appendChild(cloned);
} 

document.getElementById('add-article').addEventListener('click', () => duplicateArticles());

const confirmDeleteBtn = document.getElementById("confirmDelete");
confirmDeleteBtn.addEventListener("click", function () {
    let rowId = this.dataset.rowId;
    confirmDeleteBtn.disabled = true;

    const deleteQuery = `
    mutation MyMutation {
        deleteSortie(id: "${rowId}") {
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
