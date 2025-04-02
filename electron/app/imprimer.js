function formatDate(input) {
  let date = new Date(input);

  if (isNaN(date.getTime())) {
    return "Invalid date format";
  }

  let isoFormat = date.toISOString().slice(0, 16);

  let slashFormat = `${date.getFullYear()}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

  return slashFormat;
}

document.addEventListener("DOMContentLoaded", () => {
  const categoriesAndPartenersQuery = `
    query MyQuery {
        getAllCategorieArticles {
            id
            nom
        }
    }`;

  async function fetchCategories() {
    fetch(window.constants.backend_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: categoriesAndPartenersQuery }),
    })
      .then((response) => response.json())
      .then((data) => data?.data)
      .then((data) => {
        const articleTypeDropdown =
          document.getElementById("entreeArticleType");
        const articleType = document.getElementById("articleType");

        console.log(data);

        data?.getAllCategorieArticles?.forEach((category) => {
          articleTypeDropdown.insertAdjacentHTML(
            "beforeend",
            `<option value="${category?.id}">${category?.nom}</option>`
          );
          articleType.insertAdjacentHTML(
            "beforeend",
            `<option value="${category?.id}">${category?.nom}</option>`
          );
        });
      })
      .catch(() => {
        console.error("Failed to fetch articles");
      });
  }
  fetchCategories();

  document.getElementById("printStock").addEventListener("click", () => {
    const categoryId = document.getElementById("articleType")?.value;
    const artStartDateFilter =
      document.getElementById("artStartDateFilter")?.value;
    const artEndDateFilter = document.getElementById("artEndDateFilter")?.value;

    // const query = `
    //     query MyQuery {
    //       printArticles (
    //         startDate: "${artStartDateFilter}",
    //         endDate: "${artEndDateFilter}",
    //         categorieId: "${categoryId}"
    //       ) {
    //           id
    //           unite
    //           nom
    //           designation
    //           quantite
    //           categorieNom
    //           categorieId
    //       }
    //     }`;

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
    fetch(window.constants.backend_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    })
      .then((result) => {
        return result.json();
      })
      .then((data) => {
        console.log({ data });

        if (data?.data?.getArticlesDTO?.length > 0) {
          document.getElementById("art-fromDate").textContent =
            formatDate(artStartDateFilter);
          document.getElementById("art-toDate").textContent =
            formatDate(artEndDateFilter);
          document.getElementById("art-responsable").textContent = JSON.parse(
            localStorage.getItem("user-infos")
          )?.username;
          document.getElementById("art-category").textContent =
            data?.data?.getArticlesDTO?.[0]?.categorieNom;

          const printStyles = `
            @media print {
              .main-wrapper,
              .main-wrapper *,
              #loader-row,
              #loader-row * {
                display: none !important;
              }
              #entree-exportDataTemplate {
                display: none;
              }
              #art-exportDataTemplate {
                display: flex !important;
              }
            }
          `;

          const styleTag = document.createElement("style");
          styleTag.innerHTML = printStyles;
          document.head.appendChild(styleTag);

          document.getElementById("art-table").innerHTML = `          
            <tr>
              <th>Nom d’article</th>
              <th>Désignation</th>
              <th>Catégorie</th>
              <th>Unité</th>
              <th>Quantité Stock</th>
            </tr>

            <!--     Montants    -->
            <tr id="art-montants" style="display: none;">
            </tr>
          `;

          let finalHtmlContent = "";
          data?.data?.getArticlesDTO?.forEach((art) => {
            const htmlContent = `
              <tr class="sortie-data-row">
                  <td>${art?.nom}</td>
                  <td>${art?.designation}</td>
                  <td>${art?.categorieNom}</td>
                  <td>${art?.unite}</td>
                  <td>${art?.quantite} pcs</td>
              </tr>`;
            finalHtmlContent += htmlContent;
          });
          document
            .getElementById("art-montants")
            .insertAdjacentHTML("beforebegin", finalHtmlContent);

          window.print();

          styleTag.remove();
        }
      });

    console.log({ categoryId, artStartDateFilter, artEndDateFilter });
  });

  document.getElementById("entrySubmit").addEventListener("click", () => {
    const categoryId = document.getElementById("entreeArticleType")?.value;
    const entryStartDateFilter = document.getElementById(
      "entryStartDateFilter"
    )?.value;
    const entryEndDateFilter =
      document.getElementById("entryEndDateFilter")?.value;

    const query = `
        query MyQuery {
            printingEntree(startDate: "${entryStartDateFilter}", endDate: "${entryEndDateFilter}", categorieId: "${categoryId}") {
                id
                numeroBand
                totalHt
                totalTtc
                dateTimeEntree
                designation
                partenaireNom
            }
        }`;

    fetch(window.constants.backend_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    })
      .then((result) => {
        return result.json();
      })
      .then((data) => {
        console.log(data?.data?.printingEntree?.length);
        let totalHT = 0;
        let totalTTC = 0;

        if (data?.data?.printingEntree?.length > 0 || true) {
          document.getElementById("fromDate").textContent =
            formatDate(entryStartDateFilter);
          document.getElementById("toDate").textContent =
            formatDate(entryEndDateFilter);
          document.getElementById("responsable").textContent = JSON.parse(
            localStorage.getItem("user-infos")
          )?.username;

          const printStyles = `
            @media print {
              .main-wrapper,
              .main-wrapper *,
              #loader-row,
              #loader-row * {
                display: none !important;
              }
              #entree-exportDataTemplate {
                display: flex !important;
              }
            }
          `;

          const styleTag = document.createElement("style");
          styleTag.innerHTML = printStyles;
          document.head.appendChild(styleTag);
          document.getElementById("entr-table").innerHTML = `          
            <tr>
              <th>N° BL / Marché</th>
              <th>Fournisseur</th>
              <th>Désignation</th>
              <th>Date de Réception</th>
              <th>Total (TTC)</th>
              <th>Total (HT)</th>
            </tr>

            <!--     Montants    -->
            <tr id="montants">
              <td style="border: none;"></td>
              <td style="border: none;"></td>
              <td style="border: none;"></td>
              <td style="border: none;"></td>
              <td>Montant total HT</td>
              <td id="montant-total-ht"></td>
            </tr>
            <tr>
              <td style="border: none;"></td>
              <td style="border: none;"></td>
              <td style="border: none;"></td>
              <td style="border: none;"></td>
              <td>Montant total TTC</td>
              <td id="montant-total-ttc"></td>
            </tr>
          `;

          let finalHtmlContent = "";
          data?.data?.printingEntree?.forEach((printing) => {
            const htmlContent = `
                <tr class="sortie-data-row">
                    <td>${printing?.numeroBand}</td>
                    <td>${printing?.partenaireNom}</td>
                    <td>${printing?.designation}</td>
                    <td>${new Date(
                      printing?.dateTimeEntree
                    ).toLocaleDateString()}</td>
                    <td>${printing?.totalTtc} MAD</td>
                    <td>${printing?.totalHt} MAD</td>
                </tr>`;
            finalHtmlContent += htmlContent;

            totalHT += printing?.totalHt;
            totalTTC += printing?.totalTtc;
          });
          document
            .getElementById("montants")
            .insertAdjacentHTML("beforebegin", finalHtmlContent);

          document.getElementById("montant-total-ht").textContent =
            totalHT + " MAD";
          document.getElementById("montant-total-ttc").textContent =
            totalTTC + " MAD";
          window.print();
          styleTag.remove();
        }
      });
  });

  let sortieFilterType = "1";
  let ServicesAndDivisionsData = {};

  const filterTypeQuery = `
    query MyQuery {
      getAllDivisions {
        id
        nom
      }
      getAllServiceClasses {
        id
        nom
      }
    }
  `;

  function getFilterType() {
    fetch(window.constants.backend_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: filterTypeQuery }),
    })
      .then((result) => {
        return result.json();
      })
      .then(({ data }) => {
        console.log(data);
        ServicesAndDivisionsData = data;

        const sortieFilter = document.getElementById("sortieFilter");
        sortieFilter.innerHTML = `
          <option value="" disabled selected id="default-sort-filter-value"> Choisir votre division </option>`;

        if (sortieFilterType === "1") {
          data?.getAllDivisions?.forEach((division) => {
            sortieFilter.insertAdjacentHTML(
              "beforeend",
              `<option value="${division?.id}">${division?.nom}</option>`
            );
          });

          document.getElementById("sort-filtre-label").textContent =
            "Par division";
          document.getElementById("default-sort-filter-value").textContent =
            "Choisir votre division";
        } else if (sortieFilterType === "2") {
          data?.getAllServiceClasses?.forEach((serviceClasses) => {
            sortieFilter.insertAdjacentHTML(
              "beforeend",
              `<option value="${serviceClasses?.id}">${serviceClasses?.nom}</option>`
            );
          });
          document.getElementById("sort-filtre-label").textContent =
            "Par service";
          document.getElementById("default-sort-filter-value").textContent =
            "Choisir votre service";
        }
      });
  }
  getFilterType();

  document.getElementById("sortieSubmit").addEventListener("click", () => {
    const serviceOrDivisionId = document.getElementById("sortieFilter")?.value;
    const sortieStartDateFilter = document.getElementById(
      "sortieStartDateFilter"
    )?.value;
    const sortieEndDateFilter = document.getElementById(
      "sortieEndDateFilter"
    )?.value;

    console.log({
      sortieEndDateFilter,
      sortieStartDateFilter,
      serviceOrDivisionId,
    });

    document.getElementById("sort-fromDate").textContent = formatDate(
      sortieStartDateFilter
    );
    document.getElementById("sort-toDate").textContent =
      formatDate(sortieEndDateFilter);
    document.getElementById("sort-filteredBy").textContent =
      sortieFilterType === "1"
        ? `Division (${
            ServicesAndDivisionsData?.getAllDivisions?.find(
              (elem) => elem?.id === serviceOrDivisionId
            )?.nom
          })`
        : `Service (${
            ServicesAndDivisionsData?.getAllServiceClasses?.find(
              (elem) => elem?.id === serviceOrDivisionId
            )?.nom
          })`;
    document.getElementById("sort-responsable").textContent = JSON.parse(
      localStorage.getItem("user-infos")
    )?.username;

    const query = `
        query MyQuery {
          printSortiesService (
            startDate: "${sortieStartDateFilter}", 
            endDate: "${sortieEndDateFilter}", 
            someId: "${serviceOrDivisionId}"
            isService: ${sortieFilterType !== '1'}
          ) {
            fonctionnaireNom
            montant
            dateDeSortie
          }
        }`;

    fetch(window.constants.backend_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    })
      .then((result) => {
        return result.json();
      })
      .then(({ data }) => {
        let totalMontant = 0;

        const printStyles = `
          @media print {
            .main-wrapper,
            .main-wrapper *,
            #loader-row,
            #loader-row * {
              display: none !important;
            }
            #sort-exportDataTemplate {
              display: flex !important;
            }
          }
        `;

        const styleTag = document.createElement("style");
        styleTag.innerHTML = printStyles;
        document.head.appendChild(styleTag);
        document.getElementById("sort-table").innerHTML = `          
          <tr>
            <th>N° Sortie</th>
            <th>Fonctionnaire</th>
            <th>${sortieFilterType === "1" ? "Division" : "Service"}</th>
            <th>Montant</th>
            <th>Date de Sortie</th>
          </tr>

          <!--     Montants    -->
          <tr id="sort-montants">
            <th style="border: none;"></th>
            <th style="border: none;"></th>
            <th style="border: none;"></th>
            <th>Montant Totale</th>
            <th id="sort-montant-total"></th>
          </tr>
        `;

        let finalHtmlContent = "";
        data?.printSortiesService?.forEach((printing, index) => {
          const htmlContent = `
              <tr class="sortie-data-row">
                  <td>${index + 1}</td>
                  <td>${printing?.fonctionnaireNom}</td>
                  <td>${
                    sortieFilterType === "1"
                      ? ServicesAndDivisionsData?.getAllDivisions?.find(
                          (elem) => elem?.id === serviceOrDivisionId
                        )?.nom
                      : ServicesAndDivisionsData?.getAllServiceClasses?.find(
                          (elem) => elem?.id === serviceOrDivisionId
                        )?.nom
                  }</td>
                  <td>${printing?.montant} MAD</td>
                  <td>${formatDate(printing?.dateDeSortie)}</td>
              </tr>`;
          finalHtmlContent += htmlContent;

          totalMontant += Number(printing?.montant) || 0;
        });
        console.log(totalMontant);
        
        document
          .getElementById("sort-montants")
          .insertAdjacentHTML("beforebegin", finalHtmlContent);
        document.getElementById("sort-montant-total").textContent = totalMontant + " MAD";

        window.print();
        styleTag.remove();
      });
  });

  document.getElementById("sort-filterType").addEventListener("change", (e) => {
    sortieFilterType = e.target.value;
    getFilterType();
  });
});
