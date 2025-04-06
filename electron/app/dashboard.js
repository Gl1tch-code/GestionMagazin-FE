document.addEventListener("DOMContentLoaded", function () {
  // Initialize Morris Bar Chart
  Morris.Bar({
    element: "morris-bar-chart",
    data: [
      { y: "FOURNITURE BUR", a: 100 },
      { y: "MATÉRIEL INFO", a: 75 },
      { y: "CONSOMMABLES", a: 50 },
      { y: "MOBILIER BUR", a: 30 },
      { y: "ÉLECTRICITÉ", a: 60 },
      { y: "MATÉRIAUX CONST", a: 40 },
      { y: "QUINCAILLERIE", a: 25 },
      { y: "PLOMBERIE", a: 45 },
      { y: "OUTILLAGE", a: 35 },
    ],
    xkey: "y",
    ykeys: ["a"],
    labels: ["Quantité"],
    barColors: ["#4d7cff"],
    hideHover: "auto",
    gridLineColor: "transparent",
    resize: true,
  });

  // Toggle between Division and Service views
  document
    .getElementById("viewToggle")
    ?.addEventListener("change", function () {
      const divisionView = document.getElementById("division-view");
      const serviceView = document.getElementById("service-view");

      if (this.checked) {
        divisionView.classList.add("d-none");
        serviceView.classList.remove("d-none");
      } else {
        serviceView.classList.add("d-none");
        divisionView.classList.remove("d-none");
      }
    });

  const getCurrentStockQuery = `
    query MyQuery {
        getCurrentStock
    }`;

  fetch(window.constants.backend_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: getCurrentStockQuery }),
  })
    .then((response) => response.json())
    .then(({ data }) => {
      console.log(data?.getCurrentStock);
      document.getElementById(
        "current-stock"
      ).textContent = `${data?.getCurrentStock} Articles`;
    });

  const getEntreesAndSortiesCountQuery = `
    query MyQuery {
        getEntreesAndSortiesCount {
            totalEntrees
            totalSorties
        }
    }`;

  fetch(window.constants.backend_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: getEntreesAndSortiesCountQuery }),
  })
    .then((response) => response.json())
    .then(({ data }) => {
      console.log(data?.getEntreesAndSortiesCount);
      document.getElementById(
        "weekly-count"
      ).textContent = `${data?.getEntreesAndSortiesCount?.totalEntrees}/${data?.getEntreesAndSortiesCount?.totalSorties}`;
    });
});
