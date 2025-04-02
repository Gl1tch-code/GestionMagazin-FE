
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
                    unite
                    designation
                    nom
                    categorieArticle {
                        nom
                    }
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
      .then((data) => data?.data?.getAllEntrees)
      .then((data) => {
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

          const htmlRow = document.createElement("tr");
          htmlRow.dataset.index = index;
          htmlRow.dataset.id = entree?.id;
          htmlRow.innerHTML = `
                    <td class="entree-nbl">${entree?.numeroBand}</td>
                    <td class="entree-partner" data-value="${
                      entree?.partenaire?.id
                    }">${entree?.partenaire?.nom}</td>
                    <td class="entree-designation">${entree?.designation}</td>
                    <td class="entree-date">${new Date(
                      entree?.dateTimeEntree
                    ).toLocaleDateString()}</td>
                    <td class="entree-totalHt" data-value="${
                      entree?.totalHt
                    }">${entree?.totalHt} MAD</td>
                    <td class="entree-totalTtc" data-value="${
                      entree?.totalTtc
                    }">${entree?.totalTtc} MAD</td>
                    <td style="display: none;" class="entree-totalTva" data-value="${
                      entree?.totalTva
                    }">${entree?.totalTva} MAD</td>
                    ${actionMenu}
                    `;
          document.getElementById("entree-table-body").appendChild(htmlRow);
        });
        document.getElementById(
          "files-upload-inactive-container"
        ).style.display = "none";
        document.getElementById("loader-row").style.display = "none";

        // Attach click event to preview buttons inside action menu
        document.querySelectorAll(".preview-btn").forEach((button) => {
          button.addEventListener("click", function () {
            const row = this.closest("tr");
            const index = row.getAttribute("data-index");
            const entree = data[index];

            document.getElementById("previewNbl").textContent =
              entree?.numeroBand || "N/A";
            document.getElementById("previewPartenaire").textContent =
              entree?.partenaire?.nom || "N/A";
            document.getElementById("previewDesignation").textContent =
              entree?.designation || "N/A";
            document.getElementById("previewDateAjoute").textContent =
              new Date(entree?.dateTimeEntree).toLocaleDateString() || "N/A";
            document.getElementById("quantite").textContent =
              (entree?.detailEntrees?.[0]?.quantite || "N/A") + " pieces";
            document.getElementById("unitPrice").textContent =
              entree?.detailEntrees?.[0]?.prixUnitaire + " MAD" || "N/A";
            document.getElementById("previewTotalTtc").textContent =
              entree?.totalTtc + " MAD" || "N/A";
            document.getElementById("previewTotalHt").textContent =
              entree?.totalHt + " MAD" || "N/A";
            document.getElementById("previewTotalTva").textContent =
              entree?.totalTva + " MAD" || "N/A";

            const myNode = document.getElementById(
              "entree-preview-left-col-articles"
            );
            myNode.textContent = "";

            row
              .querySelectorAll(".entree-article")
              .forEach((entreeArticle, entreeArticleIndex) => {
                const htmlArticle = `
                        <div class="form-group">
                            <label class="font-weight-bold">Article ${
                              Number.parseInt(entreeArticleIndex) + 1
                            }</label>
                            <p class="border-bottom pb-2">${
                              entreeArticle.textContent
                            }</p>
                        </div>`;
                myNode.insertAdjacentHTML("beforeend", htmlArticle);
              });
          });
        });

        // edite modal
        document.querySelectorAll(".edit-btn").forEach((button) => {
          button.addEventListener("click", function () {
            let row = this.closest("tr");
            const index = row.getAttribute("data-index");
            const currentId = row.dataset.id;
            document.getElementById("nouvelleEntreeModalLabel").textContent =
              "Editer l'entree " + currentId;
            const form = document.getElementById("entryForm");
            form.dataset.type = "edit";
            form.dataset.rowId = currentId;
            form.querySelector("button[type=submit]").textContent = "Editer";

            document.getElementById(
              "files-upload-inactive-container"
            ).style.display = "block";
            document.getElementById("files-upload-container").style.display =
              "none";

            // Fetch data from the row
            let nbl =
              row.querySelector(".entree-nbl")?.textContent.trim() || "";
            let partner =
              row.querySelector(".entree-partner")?.dataset.value || "";
            let description =
              row.querySelector(".entree-designation")?.textContent.trim() ||
              "";
            let totalHt =
              row.querySelector(".entree-totalHt")?.dataset.value || "";
            let totalTtc =
              row.querySelector(".entree-totalTtc")?.dataset.value || "";
            let totalTva =
              row.querySelector(".entree-totalTva")?.dataset.value || "";

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

            document.getElementById("dateAjoute").value =
              entree?.dateTimeEntree;

            document.getElementById("selectArticles").value =
              entree?.detailEntrees[0]?.article?.id;
            document.getElementById("selectArticlesPrice").value =
              entree?.detailEntrees[0]?.prixUnitaire;
            document.getElementById("selectArticlesQuantite").value =
              entree?.detailEntrees[0]?.quantite;

            document
              .querySelectorAll(".new-select-article-row")
              .forEach((elem) => elem.remove());
            for (let i = 1; i < entree?.detailEntrees.length; i++) {
              const currentArticleData = entree?.detailEntrees[i];

              console.log(currentArticleData);

              handleAddArticleRow(
                currentArticleData?.article?.id,
                currentArticleData?.prixUnitaire,
                currentArticleData?.quantite,
                i - 1
              );
            }

            // Open the modal manually (if needed)
            $("#nouvelleEntreeModal").modal("show");
          });
        });

        document.querySelectorAll(".delete-btn").forEach((button) => {
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
        document
          .querySelectorAll('button[title="Imprimer"]')
          .forEach((printBtn) => {
            printBtn.addEventListener("click", function () {
              document
                .querySelectorAll(".sortie-data-row")
                ?.forEach((sortiedatarow) => {
                  sortiedatarow?.remove();
                });

              let row = this.closest("tr"); // Get the closest row
              let rowId = row.dataset.id; // Fetch article ID from dataset
              const index = row.getAttribute("data-index");
              const entree = data[index];

              let finalHtmlContent = "";

              entree?.detailEntrees?.forEach((detailEntree, index) => {
                const htmlContent = `
                        <tr class="sortie-data-row">
                            <td>${index + 1}</td>
                            <td>${detailEntree?.article?.nom}</td>
                            <td>${detailEntree?.article?.unite}</td>
                            <td>${detailEntree?.quantite}</td>
                            <td>${detailEntree?.prixUnitaire} MAD</td>
                            <td>${
                              detailEntree?.prixUnitaire *
                              detailEntree?.quantite
                            } MAD</td>
                        </tr>`;
                finalHtmlContent += htmlContent;

                document.getElementById("montant-total-ht").textContent = `${
                  entree?.totalHt || 0
                } MAD`;
                document.getElementById("montant-tva").textContent = `${
                  entree?.totalTva || 0
                } %`;
                document.getElementById("montant-total-ttc").textContent = `${
                  entree?.totalTtc || 0
                } MAD`;
              });
              document.getElementById("date").textContent = new Date(
                entree?.dateTimeEntree
              ).toLocaleDateString();

              document.getElementById("nblExport").textContent =
                entree?.numeroBand?.split("Réference")?.[0];
              document.getElementById("objetdeprestation").textContent =
                entree?.designation?.split(":")?.[
                  entree?.designation?.split(":")?.length - 1
                ];
              document.getElementById("responsable").textContent = JSON.parse(
                localStorage.getItem("user-infos")
              )?.username;
              document.getElementById("firstArtCategory").textContent = entree?.detailEntrees?.[0]?.article?.categorieArticle?.nom;

              document.getElementById("identite").textContent =
                entree?.partenaire?.nom;
              document.getElementById("referance").textContent =
                entree?.numeroBand?.split(":")?.[
                  entree?.numeroBand?.split(":")?.length - 1
                ];

              document
                .getElementById("montants")
                .insertAdjacentHTML("beforebegin", finalHtmlContent);

              window.print();
            });
          });

        if (currentUser.role === window.constants.USERS_ROLES.user) {
          document
            .querySelectorAll("#admin-only-viewed")
            .forEach((actionMenu) => {
              actionMenu.className = "d-none w-100 gap-2";
            });
        }
      })
      .catch();
  }
  fetchEntree();
}
getAndFillData();

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
    .then((data) => data?.data)
    .then((data) => {
      const selectedPartenaire = document.getElementById("selectedPartenaire");

      data?.getAllPartenaires?.forEach((partner) => {
        selectedPartenaire.insertAdjacentHTML(
          "beforeend",
          `<option value="${partner?.id}">${partner?.nom}</option>`
        );
      });

      const selectArticlesDropdown =
        document.querySelectorAll(".select-article");

      data?.getAllArticles?.forEach((article) => {
        document
          .querySelectorAll(".new-select-article-row")
          .forEach((articlesdropdown) => {
            articlesdropdown.querySelector(
              ".select-article"
            ).innerHTML = `<option value="" default>Toutes les articles</option>`;
          });
      });

      data?.getAllArticles?.forEach((article) => {
        selectArticlesDropdown.forEach((articlesdropdown) => {
          articlesdropdown.insertAdjacentHTML(
            "beforeend",
            `<option value="${article?.id}">${article?.nom}</option>`
          );
        });
      });

    })
    .catch(() => {
      console.error("Failed to fetch articles and partners");
    });
}
fetchArticlesAndPartenersQuery();




// Handle adding a new article row
document.getElementById("addRowBtn").addEventListener("click", () => handleAddArticleRow());

function handleAddArticleRow(
  currentArticleId = "",
  currentArticlePrixUnitaire = "",
  currentArticleQuantite = "",
  index
) {
    const articlesContainer = document.getElementById("articlesContainer");
    const articleRow = document.createElement("div");
    articleRow.classList.add("article-row", "mb-2", "new-select-article-row");
    articleRow.innerHTML = `
        <select name="selectArticles[]" class="form-control select-article">
            <option value="" default>Toutes les articles</option>
        </select>
        <input value="${currentArticlePrixUnitaire}" type="number" name="price[]" class="form-control price-input" placeholder="Prix" required min="0.01" step="0.01">
        <input value="${currentArticleQuantite}" type="number" name="quantite[]" class="form-control quntite-input" placeholder="Quantité" required min="1" id="selectArticlesQuantite">
        <button type="button" class="btn btn-danger btn-sm delete-row-btn">Supprimer</button>
    `;

    articlesContainer.appendChild(articleRow);

    const firstSelect = document.querySelector(".article-row .select-article");
    const newSelect = articleRow.querySelector(".select-article");
    newSelect.innerHTML = firstSelect.innerHTML; // Copy options

    newSelect.value = currentArticleId;
    
    articleRow.querySelector(".delete-row-btn").addEventListener("click", () => {
        articleRow.remove();
        updateDeleteButtonState();
    });

    updateDeleteButtonState();
}

function updateDeleteButtonState() {
    const articleRows = document.querySelectorAll(".article-row");
    if (articleRows.length <= 1) {
        const deleteButton = articleRows[0].querySelector(".delete-row-btn");
        deleteButton.disabled = true;
        deleteButton.style.cursor = "not-allowed";
        deleteButton.style.backgroundColor = "#9097c4";
        deleteButton.style.borderColor = "#9097c4";
    } else {
        articleRows.forEach((row) => {
            const deleteButton = row.querySelector('.delete-row-btn');
            deleteButton.disabled = false;
            deleteButton.style.cursor = "pointer";
            deleteButton.style.backgroundColor = "";
            deleteButton.style.borderColor = "";
        })
    }
}

// Initial call to populate the first article row and set initial state
updateDeleteButtonState();







document
  .querySelector(".show-add-entree-modal-btn")
  .addEventListener("click", () => {
    const form = document.getElementById("entryForm");
    form.dataset.type = "add";

    document.getElementById("files-upload-inactive-container").style.display =
      "none";
    document.getElementById("files-upload-container").style.display = "block";

    document
      .querySelectorAll(".new-select-article-row")
      .forEach((elem) => elem.remove());

    form.querySelector("button[type=submit]").textContent = "Ajouter l'entree";
    document.getElementById("nouvelleEntreeModalLabel").textContent =
      "Nouvelle Entrée";
    form.reset();
  });

const form = document.getElementById("entryForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formObject = Object.fromEntries(
    new FormData(document.querySelector("#entryForm"))
  );
  let filesIds = [];

  document.getElementById("file-list").childNodes?.forEach((fileElem) => {
    fileElem?.querySelector(".remove-btn").dataset.fileId &&
      filesIds.push(fileElem?.querySelector(".remove-btn").dataset.fileId);
  });

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
        quantite: quantite,
      });
    }
  }

  // Add articles data to the form data
  formObject.articles = articlesData;

  // Now you can send this formObject to your server using fetch, AJAX, or any other method.
  console.log("Form data:", formObject);

  // Build the GraphQL mutation query string manually
  let articlesQueryString = articlesData
    .map((article) => {
      return `{articleId:${article.articleId}, prixUnitaire:${article.prixUnitaire}, quantite:${article.quantite}}`; ////////////////////
    })
    .join(", ");

  if (form.dataset.type === "add") {
    form.querySelector("button[type=submit]").disabled = true;

    const query = `
        mutation MyMutation {
            createEntree(
                input: {
                    partenaireId: "${formObject.selectedPartenaire}", 
                    dateTimeEntree: "${formObject.dateAjoute}"
                    designation: "${formObject.designation?.replace(
                      /\n/g,
                      "\\n"
                    )}", 
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
  } else if (form.dataset.type === "edit") {
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
                    designation: "${formObject.designation?.replace(
                      /\n/g,
                      "\\n"
                    )}"
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
        window.location.reload();
      })
      .catch(() => {
        window.location.reload();
        console.error("Failed to create article");
      });
  }
});

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
      window.location.reload();
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
    .then((response) => response.json())
    .then((id) => {
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
    body: { id },
  })
    .then((response) => {
      response.ok && container.remove();
    })
    .catch((error) => {
      alert("Error deleting file");
    });
}

addFileInput();
