let g_tableData;

let columns = [
  {
    name: "CountryHeader",
  },
  {
    name: "ConfirmedHeader",
  },
  {
    name: "DeathsHeader",
  },
  {
    name: "RecoveredHeader",
  },
];

function find() {
  let term = document.getElementById("searchBar").value;

  for (let i = 0; i < g_tableData.Countries.length; i++) {
    let nextCountry = g_tableData.Countries[i];
    if (term == "") {
      onTableHeaderClick("Confirmed");
      break;
    } else if (
      nextCountry.Country.toLowerCase() == term.toLowerCase() ||
      nextCountry.Slug.toLowerCase() == term.toLowerCase() ||
      nextCountry.CountryCode.toLowerCase() == term.toLowerCase()
    ) {
      clearTable();
      removeClasses();
      insertRow(
        nextCountry.Country,
        nextCountry.TotalConfirmed,
        nextCountry.TotalDeaths,
        nextCountry.TotalRecovered,
        "Searched: "
      );

      break;
    } else {
      clearTable();
      removeClasses();
      insertRow(
        "Not Found",
        "Not Found",
        "Not Found",
        "Not Found",
        "Searched: "
      );
    }
  }
  document.getElementById("searchBar").value = "";
}

function removeClasses() {
  for (let i = 0; i < columns.length; i++) {
    let columnElement = document.getElementById(columns[i].name);
    let columnIcon = columnElement.querySelector("i");
    columnElement.classList.remove("ascending");
    columnIcon.classList.remove("fa-arrow-up", "fa-arrow-down");
  }
}

function onTableHeaderClick(columnName) {
  let header = document.getElementById(columnName + "Header");
  let icon = header.querySelector("i");

  if (header.classList.contains("ascending")) {
    removeClasses();
    generateTable(g_tableData, columnName, true);
    icon.classList.add("fa-arrow-down");
  } else {
    removeClasses();
    icon.classList.add("fa-arrow-up");
    generateTable(g_tableData, columnName, false);
    header.classList.add("ascending");
  }
}


function insertRow(
  countryValue,
  infectedValue,
  deadValue,
  recoveredValue,
  indexValue
) {
  let row = table.insertRow();
  let index = row.insertCell(0);
  let country = row.insertCell(1);
  let infected = row.insertCell(2);
  let dead = row.insertCell(3);
  let recovered = row.insertCell(4);

  country.innerHTML = countryValue;
  infected.innerHTML = infectedValue;
  dead.innerHTML = deadValue;
  recovered.innerHTML = recoveredValue;
  index.innerHTML = indexValue;
}

function clearTable() {
  let table = document.getElementById("table");

  for (let i = table.rows.length - 1; i > 0; i--) {
    let next = table.rows[i];

    if (next.className != "headerRow") {
      table.deleteRow(i);
    }
  }
}

function sortTableData(tableData, columnName, isAcending) {
  let data = tableData.Countries;
  search = "Total" + columnName;
  if (columnName == "Country") {
    data.sort((a, b) => {
      let result;
      if (a.Country < b.Country) {
        result = 1;
      } else if (a.Country > b.Country) {
        result = -1;
      } else {
        result = 0;
      }
      return isAcending ? result : -result;
    });
  } else {
    data.sort((a, b) => {
      let result = a[search] - b[search];

      return isAcending ? result : -result;
    });
  }
}


function generateTable(tableData, columnName, isAcending) {
  clearTable();
  sortTableData(tableData, columnName, isAcending);

  tableData.Global.Country = "Global";
  insertRow(
    tableData.Global.Country,
    tableData.Global.TotalConfirmed,
    tableData.Global.TotalDeaths,
    tableData.Global.TotalRecovered,
    0
  );

  let table = document.getElementById("table");
  let highestTotalDeath = 0;
  let highestTotalDeathIndex = 0;
  let updated = document.getElementById("dateModified");
  let updatedDate = tableData.Date.replace("Z", "").replace("T", " ");
  updated.innerHTML = updatedDate;

  for (let i = 0; i < tableData.Countries.length; i++) {
    let nextCountry = tableData.Countries[i];

    if (nextCountry.Country != null) {
      insertRow(
        nextCountry.Country,
        nextCountry.TotalConfirmed,
        nextCountry.TotalDeaths,
        nextCountry.TotalRecovered,
        i + 1
      );

      if (nextCountry.TotalDeaths > highestTotalDeath) {
        highestTotalDeath = nextCountry.TotalDeaths;
        highestTotalDeathCountry = nextCountry;
        highestTotalDeathIndex = i;
      }
    }
  }

  let highestTotalDeathRow = document
    .getElementById("table")
    .rows.item(highestTotalDeathIndex + 2);

  highestTotalDeathRow.classList.add("mostDeaths");
}

function getStats(columnName) {
  fetch("https://api.covid19api.com/summary")
    .then((response) => response.json())
    .then((data) => {
      data.Countries.splice(0, 1);

      g_tableData = data;

      onTableHeaderClick(columnName);
    });
}


