const currentUser = JSON.parse(localStorage.getItem("user-infos"));

function getAndFillArticlesData() {
    const query = `
    query MyQuery {
        getArticlesDTO {
            id
            unite
            nom
            designation
            quantite
            categorieNom
            categorieId
        }
    }`;

    async function fetchArticles() {
        let stockStatus;
        fetch(window.constants.backend_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
        })
        .then((response) => response.json())
        .then(data => data?.data?.getArticlesDTO)
        .then(data => {
            data.forEach((article, index) => {
                stockStatus = article?.quantite > 50 
                    ? window.constants.STOCK_STATUS.enStock 
                    : (0 < article?.quantite && article?.quantite < 50) 
                    ? window.constants.STOCK_STATUS.faibleStock 
                    : window.constants.STOCK_STATUS.ruptureDeStock;
                
                const actionMenu = `
                    <td>
                        <div class="d-flex flex-wrap gap-3">
                            <div class="d-flex w-100 gap-2" id="admin-only-viewed">
                                <button type="button" class="btn btn-primary btn-sm pr-2 m-1 w-50 edit-btn" data-toggle="modal" title="Modifier" data-target="#addArticleModal" >
                                    <i class="fas fa-edit"></i> Modifier
                                </button>
                                <button type="button" class="btn btn-danger btn-sm pr-2 m-1 w-50 delete-btn" data-toggle="tooltip" data-placement="top" title="Supprimer">
                                    <i class="fas fa-trash-alt"></i> Supprimer
                                </button>
                            </div>
                            <div class="d-flex w-100 gap-2">
                                <button type="button" class="btn btn-green btn-sm pr-2 m-1 w-50 preview-btn" data-toggle="modal" data-target="#previewArticleModal">
                                    <i class="fas fa-eye"></i> Apércu
                                </button>
                                <button id="print-button" type="button" class="btn btn-imprimer btn-sm pr-2 m-1 w-50" data-toggle="tooltip" data-placement="top" title="Imprimer">
                                    <i class="fas fa-print"></i> Imprimer
                                </button>
                            </div>
                        </div>
                    </td>`;
                
                const htmlRow = `
                <tr data-index="${index}" data-id="${article?.id}">
                    <td class="article-name">${article?.nom}</td>
                    <td class="article-designation">${article?.designation}</td>
                    <td class="article-category" data-value="${article?.categorieId}">${article?.categorieNom || 'N/A'}</td>
                    <td class="article-unit" data-value="${article?.unite}">${article?.unite || 'N/A'}</td>
                    <td class="article-stock" data-value="${article?.quantite || 0}">
                        <span class="badge ${
                            stockStatus === window.constants.STOCK_STATUS.enStock ? "badge-success"
                            : stockStatus === window.constants.STOCK_STATUS.faibleStock ? "badge-warning"
                            : "badge-danger"
                        } px-2">${stockStatus} (${article?.quantite || 0})</span>
                    </td>
                    ${actionMenu}
                </tr>`;

                document.getElementById("articles-table").insertAdjacentHTML("beforeend", htmlRow);
            });
            document.getElementById("loader-row").style.display = "none";

            // Attach click event to preview buttons inside action menu
            document.querySelectorAll(".preview-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const index = this.closest("tr").getAttribute("data-index");
                    const article = data[index];
                    
                    document.getElementById("previewName").textContent = article?.nom || "N/A";
                    document.getElementById("previewUnit").textContent = article?.unite || "N/A";
                    document.getElementById("previewCategory").textContent = article?.categorieNom || "N/A";
                    document.getElementById("previewStock").textContent = `${stockStatus} (${article?.quantite || 0})`;
                    document.getElementById("previewDescription").textContent = article?.designation || "N/A";
                });
            });

            document.querySelectorAll(".edit-btn").forEach(button => {
                button.addEventListener("click", function () {
                    let row = this.closest("tr");
                    const currentArticleId = row.dataset.id;
                    document.getElementById("addModalLabel").textContent = "Editer l'article " + currentArticleId
                    const form = document.getElementById("addArticleForm");
                    form.dataset.type = "edit";
                    form.dataset.rowId = currentArticleId;
                    form.querySelector("button[type=submit]").textContent = "Editer";
                    

                    // Fetch data from the row
                    let name = row.querySelector(".article-name")?.textContent.trim() || "";
                    let category = row.querySelector(".article-category")?.dataset.value || "";
                    let description = row.querySelector(".article-designation")?.textContent.trim() || "";
                    let unit = row.querySelector(".article-unit")?.textContent.trim() || "";
                    let supplier = row.querySelector(".article-supplier")?.dataset.value || "";                    

                    console.log(unit);
                    

                    // Populate modal fields
                    document.getElementById("articleName").value = name;
                    document.getElementById("articleType").value = category;
                    document.getElementById("articleDescription").value = description;
                    document.getElementById("articleUnite").value = unit;
                    document.getElementById("articlePartner").value = supplier;
        
                    // Open the modal manually (if needed)
                    $("#addArticleModal").modal("show");
                });
            });

            document.querySelectorAll(".delete-btn").forEach(button => {
                button.addEventListener("click", function () {
                    let row = this.closest("tr"); // Get the closest row
                    let rowId = row.dataset.id; // Fetch article ID from dataset
            
                    // Store article ID in a dataset for confirmation later
                    document.getElementById("confirmDeleteBtn").dataset.rowId = rowId;
            
                    // Show the modal
                    $("#deleteArticleModal").modal("show");
                });
            });
        

            // Print button click handler
            document.querySelectorAll('button[title="Imprimer"]').forEach(printBtn => {
                printBtn.addEventListener('click', function() {
                    // Here you would typically trigger the actual print operation
                    window.print();
                    // Success message after print
                    $('#printSuccessModal').modal('show');
                });
            })

            if (currentUser.role === window.constants.USERS_ROLES.user) {
                console.log(document.getElementById("admin-only-viewed"))
                document.querySelectorAll("#admin-only-viewed")
                .forEach((actionMenu) => {
                    actionMenu.className = "d-none w-100 gap-2";
                })
            }
        })
        .catch(() => {
            console.error("Failed to fetch articles");
        });
    }
    fetchArticles();

    const categoriesAndPartenersQuery = `
    query MyQuery {
        getAllCategorieArticles {
            id
            nom
        }
    }`;

    async function fetchCategoriesAndPartenersQuery() {
        fetch(window.constants.backend_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: categoriesAndPartenersQuery }),
        })
        .then((response) => response.json())
        .then(data => data?.data)
        .then((data) => {
            const articleTypeDropdown = document.getElementById("articleType");
            

            console.log(data);
            
            data?.getAllCategorieArticles?.forEach(category => {
                articleTypeDropdown.insertAdjacentHTML("beforeend", 
                    `<option value="${category?.id}">${category?.nom}</option>`)
            })
            
            
        })
        .catch(() => {
            console.error("Failed to fetch articles");
        });

    }
    fetchCategoriesAndPartenersQuery();

}
getAndFillArticlesData();


document.querySelector(".show-add-article-modal-btn").addEventListener("click", () => {
    const form = document.getElementById("addArticleForm");
    form.dataset.type = "add";

    form.querySelector("button[type=submit]").textContent = "Ajouter l'article";
    document.getElementById("addModalLabel").textContent = "Ajouter un article";
    document.getElementById("addArticleForm").reset();

})


const form = document.getElementById("addArticleForm");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formObject = Object.fromEntries(new FormData(document.querySelector('#addArticleForm')));

    if(form.dataset.type === "add") {
        const currentDate = new Date().toISOString();
        form.querySelector("button[type=submit]").disabled = true;

        const createArticleQuery = `
            mutation MyMutation {
                createArticle(
                    categorieArticleId: "${formObject.categorieArticleId}"
                    designation: "${formObject.designation}"
                    nom: "${formObject.name}"
                    unite: "${formObject.unite}"
                    dateAjout: "${currentDate.slice(0, currentDate.indexOf("."))}"
                )
                    {
                id
                }
            }`;
    
            fetch(window.constants.backend_url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: createArticleQuery }),
            })
            .then((response) => response.json())
            .then(() => {
                window.location.reload();
            })
            .catch(() => {
                window.location.reload()
                console.error("Failed to create article");
            });
    } else if(form.dataset.type === "edit") {
        form.querySelector("button[type=submit]").disabled = true;

        const editArticleMutation = `
        mutation MyMutation {
            updateArticle(
                id: "${form.dataset.rowId}"
                categorieArticleId: "${formObject.categorieArticleId}"
                designation: "${formObject.designation}"
                nom: "${formObject.name}"
                unite: "${formObject.unite}"
            ) {
                id
            }
            }`

        console.log({...formObject, id: form.dataset.rowId});
        
        fetch(window.constants.backend_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: editArticleMutation }),
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
    
});


const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
confirmDeleteBtn.addEventListener("click", function () {
    let rowId = this.dataset.rowId;
    confirmDeleteBtn.disabled = true;

    const deleteQuery = `
    mutation MyMutation {
        deleteArticle(id: "${rowId}") {
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
