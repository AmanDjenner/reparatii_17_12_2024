
let currentData = []; // Holds table data
let currentPage = 1;
const itemsPerPage = 8; // Set items per page to 5
let categoryMap = {};
let institutionMap = {};
let userMap = {};
async function fetchData(url, token, map, idField, nameField) {
  if (!token) {
    console.error("No token found, please log in");
    return;
  }
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status == 401) {
      sessionStorage.setItem("token", null);
      window.location.href = "/";
    } else if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const data = await response.json();
    map = data.reduce((map, item) => {
      map[item[idField]] = item[nameField];
      return map;
    }, {});
    if (nameField === "categoryName") {
      categoryMap = map;
    } else if (nameField === "institutionName") {
      institutionMap = map;
    } else if (nameField === "name") {
      userMap = map;
    }
  } catch (error) {
    console.error(`Error fetching ${nameField.toLowerCase()}:`, error);
  }
}

async function fetchCategories() {
  const url = "https://10.111.111.27:32769/api/Categories";
  const token = sessionStorage.getItem("token");
  await fetchData(
    url,
    token,
    categoryMap,
    "categoryID",
    "categoryName"
  );
  const categorySelect = document.getElementById("categorySelect");
  Object.entries(categoryMap).forEach(([id, name]) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = name;
    categorySelect.appendChild(option);
  });
}
async function fetchUsers() {
  const url = "https://10.111.111.27:32769/api/User";
  const token = sessionStorage.getItem("token");
  await fetchData(url, token, userMap, "employeeID", "name");
}
const AnPReceiptPersonSelect = document.getElementById(
  "AnPReceiptPersonSelect"
);
Object.entries(institutionMap).forEach(([id, name]) => {
  const option = document.createElement("option");
  option.value = id;
  option.textContent = name;
  AnPReceiptPersonSelect.appendChild(option);
});
async function fetchInstitutions() {
  const url = "https://10.111.111.27:32769/api/Institutions";
  const token = sessionStorage.getItem("token");
  await fetchData(
    url,
    token,
    institutionMap,
    "institutionID",
    "institutionName"
  );
  const institutionSelect =
    document.getElementById("institutionSelect");
  Object.entries(institutionMap).forEach(([id, name]) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = name;
    institutionSelect.appendChild(option);
  });
}





fetchCategories();
fetchInstitutions();
fetchUsers();

    // Add event listener to detect changes
stateSelect.addEventListener('change', () => {
// Get the selected option's id
const selectedOptionId = stateSelect.selectedOptions[0].id;
console.log(`Selected ID: ${selectedOptionId}`);
});

async function loadData(searchFlag) {

  

  const token = sessionStorage.getItem("token");
  const categoryID = document.getElementById("categorySelect").value;
  const institutionID =
    document.getElementById("institutionSelect").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const stateSelect = document.getElementById('stateSelect');



// Example of getting the ID programmatically
  const initialSelectedId = stateSelect.selectedOptions[0].id;
  let url ="";
  if(searchFlag!='1'){
    url = `https://10.111.111.27:32769/api/Date/api/Date/search?page=${currentPage}&pageSize=${itemsPerPage}&serialNumber=${searchFlag}`;
  } else {
    url = `https://10.111.111.27:32769/api/Date?institution=${institutionID}&categoryID=${categoryID}&startDate=${startDate}&endDate=${endDate}&page=${currentPage}&pageSize=${itemsPerPage}&state=${initialSelectedId}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const data = await response.json();
    currentData = data;
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";
    const editFlag = false;
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    data.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td scope="row" class="column-1">${startIndex + index}</td>
                <td class="column-2">${item.insertedData.split("T")[0]}</td>
                <td class="column-3">${categoryMap[item.categoryID] || "Unknown"}</td>
                <td class="column-4">${item.serialNumber}</td>
                <td class="column-5">${item.courierName}</td>
                <td class="column-6">${userMap[item.anpReceiptPerson] || "Unknown"}</td>
               <td class="column-7">
${
item.repairDate 
? `<button type="button" class="btn btn-outline-success btn-sm">${item.repairDate.split("T")[0]}</button>` 
: (
    
       `<button type="button" class="btn btn-outline-warning btn-sm">ÎN PROCES</button>` //  `<button type="button" class="btn btn-outline-primary btn-sm">ÎN REPARAȚIE</button>`
        // : `<button type="button" class="btn btn-outline-warning btn-sm">ÎN PROCES</button>`
)
}
</td>
<td class="column-8">
${
item.repairDate 
? (
    item.repairSuccessful
        ? `<button type="button" class="btn btn-success btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
            </svg>
            REPARAT
        </button>`
        : `<button type="button" class="btn btn-danger btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
            </svg>
            NE REPARABIL
        </button>`
)
: `<button type="button" class="btn btn-outline-warning btn-sm">ÎN PROCES</button>`
}
</td>

                <td class="hidden">${item.repairID}</td>
                <td class="column-9">${
                  institutionMap[item.institution] || "Unknown"
                }</td>
                <td class="column-10">${item.receivingPerson}</td>
                <td class="column-11">${item.receivingDate 
? `<button type="button" class="btn btn-outline-success btn-sm">${item.receivingDate.split("T")[0]}</button>` 
: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hourglass-split" viewBox="0 0 16 16">
<path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z"/>
</svg>`}
</td>
                <td class="column-12"><button type="button" class="btn btn-outline-success btn-sm" id="addBtn" data-bs-toggle="modal" data-bs-target="#addElementModal" onclick="editRow(${index}, ${editFlag})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
<path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
</svg> EDIT </button></td>

            `;
      tableBody.appendChild(row);
    });
    // Pagination
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    const totalPages = Math.ceil(data.totalItems / itemsPerPage); // Ensure totalItems is correct in the API response
    // Generate pagination buttons
    for (let i = 1; i <= totalPages; i++) {
      const pageItem = document.createElement("li");
      pageItem.classList.add("page-item");
      pageItem.innerHTML = `<a class="page-link" href="#" onclick="goToPage(${i})">${i}</a>`;
      pagination.appendChild(pageItem);
    }
    // Disable the previous button if on the first page
    const prevButton = document.createElement("li");
    prevButton.classList.add("page-item");
    prevButton.innerHTML = `<a class="page-link" href="#" onclick="goToPage(${
      currentPage - 1
    })" ${currentPage === 1 ? "disabled" : ""}>Înapoi</a>`;
    pagination.prepend(prevButton);
    // Disable the next button if on the last page
    const nextButton = document.createElement("li");
    nextButton.classList.add("page-item");
    nextButton.innerHTML = `<a class="page-link" href="#" onclick="goToPage(${
      currentPage + 1
    })" ${currentPage === totalPages ? "disabled" : ""}>Înainte</a>`;
    pagination.appendChild(nextButton);
  } else if (response.status == 401) {
    sessionStorage.setItem("token", null);
    window.location.href = "/";
  } else {
    console.error("Failed to fetch data:", response.statusText);
  }
}

function goToPage(page) {
  if (page < 1) {
    page = 1;
  }
  currentPage = page;
  loadData('1');

}

function resetFilters() {
  document.getElementById("categorySelect").value = "";
  document.getElementById("institutionSelect").value = "";
  document.getElementById("startDate").value = "";
  document.getElementById("endDate").value = "";
  currentPage = 1;
  loadData('1');
}

function search() {
  currentPage = 1;
  loadData('1');
}



// Function to make GET request
async function fetchResults(serialNumber) {
loadData(serialNumber);
}


document.getElementById('serialInput').addEventListener('input', (event) => {
const serialNumber = event.target.value.trim();
if (serialNumber === "") {
resetFilters();
} else {
fetchResults(serialNumber);
}
});
document.getElementById("filterBtn").addEventListener("click", search);
document
  .getElementById("resetBtn")
  .addEventListener("click", resetFilters);
document
  .getElementById("addBtn")
  .addEventListener("click", function () {
    editRow(-1, true); // Pass your parameter here
  });

function convertStringToDate(date) {
  const insertedDate = new Date(date); // Parse the date string
  if (!isNaN(insertedDate.getTime())) {
    // Check if the date is valid
    // Extract the date parts manually to avoid time zone adjustments
    const year = insertedDate.getFullYear();
    const month = String(insertedDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(insertedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Return in 'YYYY-MM-DD' format
  } else {
    return ""; // Return an empty string for invalid dates
  }
}
// Populate the edit form with row data
function editRow(index, editFlag) {
  const item = currentData[index];
  const categorySelect = document.getElementById("categorySelectEdit");
  categorySelectEdit.innerHTML = "";
  Object.entries(categoryMap).forEach(([id, name]) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = name;
    categorySelectEdit.appendChild(option);
  });
  const institutionSelect = document.getElementById(
    "institutionSelectEdit"
  );
  institutionSelectEdit.innerHTML = "";
  Object.entries(institutionMap).forEach(([id, name]) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = name;
    institutionSelectEdit.appendChild(option);
  });
  const AnPReceiptPersonSelectEdit = document.getElementById(
    "AnPReceiptPersonSelectEdit"
  );
  AnPReceiptPersonSelectEdit.innerHTML = "";
  Object.entries(userMap).forEach(([id, name]) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = name;
    AnPReceiptPersonSelectEdit.appendChild(option);
  });
  if (!editFlag) {
    document.getElementById("editRepairID").value = item.repairID;
    document.getElementById("editInsertedData").value =
      convertStringToDate(item.insertedData); // Parse the date string
    document.getElementById("categorySelectEdit").value =
      item.categoryID;
    document.getElementById("editSerialNumber").value =
      item.serialNumber;
    document.getElementById("editCourierName").value = item.courierName;
    document.getElementById("AnPReceiptPersonSelectEdit").value =
      item.anpReceiptPerson;
    if (item.repairDate != null) {
      document.getElementById("editRepairDate").value =
        convertStringToDate(item.repairDate); // Parse the date string
    }
    document.getElementById("editRepairSuccessful").checked =
      item.repairSuccessful;
    document.getElementById("institutionSelectEdit").value =
      item.institution;
    document.getElementById("editReceivingPerson").value =
      item.receivingPerson;
    // console.log(convertStringToDate(item.receivingDate.split("T")[0]));
    //
    if (item.receivingDate != null) {
      document.getElementById("editReceivingDate").value =
        convertStringToDate(item.receivingDate); // Parse the date string
    }
    document.getElementById("editForm").style.display = "block";
  } else {
    //
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    //
    document.getElementById("editInsertedData").value = formattedDate;
    document.getElementById("editSerialNumber").value = null;
    document.getElementById("editCourierName").value = null;
    document.getElementById("institutionSelectEdit").value = null;
    document.getElementById("AnPReceiptPersonSelectEdit").value = null;
    document.getElementById("categorySelectEdit").value = null;
    document.getElementById("editRepairDate").value = null;
    document.getElementById("editRepairSuccessful").checked = null;
    document.getElementById("editReceivingDate").value = null;
    document.getElementById("editForm").style.display = "block";
  }
}
// Cancel edit
function cancelEdit() {
  document.getElementById("editForm").style.display = "none";///da forma nu e
}

function redirectLogin() {
  sessionStorage.setItem("token", null);
  window.location.href = "/";
}
// Submit the edit form
async function submitEditForm() {
  const repairID = document.getElementById("editRepairID").value;
  const updatedData = {
    repairID: parseInt(repairID),
    insertedData: document.getElementById("editInsertedData").value,
    categoryID: document.getElementById("categorySelectEdit").value,
    serialNumber: document.getElementById("editSerialNumber").value,
    courierName: document.getElementById("editCourierName").value,
    anp_Receipt_Person: document.getElementById(
      "AnPReceiptPersonSelectEdit"
    ).value,
    repairDate: document.getElementById("editRepairDate").value
      ? editRepairDate.value
      : null,
    repairSuccessful: document.getElementById("editRepairSuccessful")
      .checked,
    institution: document.getElementById("institutionSelectEdit").value,
    receivingPerson: document.getElementById("editReceivingPerson")
      .value,
    receivingDate: document.getElementById("editReceivingDate").value
      ? editReceivingDate.value
      : null,
  };
  const response = await fetch("https://10.111.111.27:32769/api/Date", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });
  if (response.ok) {
    // alert("A fost adaugat cu succes!!!");
     showAlert()
    loadData('1');
    cancelEdit();
  } else if (response.status == 401) {
    sessionStorage.setItem("token", null);
    window.location.href = "/";showErrorAlert()
  } else {
    console.error("Failed to update data:", response.statusText);showErrorAlert()
  }
}
loadData('1');

            async function fetchRepairStats() {
              const url = "https://10.111.111.27:32769/api/Date/repair-stats";
              const token = sessionStorage.getItem("token");
  
              // Получаем данные
              const institutionMap = await fetchData(url, token, "institutionName", "repairDateSetCount", "repairDateNullCount");
  
              const tableBody = document.querySelector("#tableStatistica tbody");
              const totalInRepair = document.getElementById("totalInRepair");
              const totalRepaired = document.getElementById("totalRepaired");
  
              // Проверяем, что tbody найден
              if (!tableBody) {
                  console.error("Элемент <tbody> не найден в таблице.");
                  return;
              }
  
              // Очищаем предыдущие данные
              tableBody.innerHTML = "";
              let inRepairTotal = 0;
              let repairedTotal = 0;
  
              // Добавляем строки в таблицу
              let rowNumber = 1; // Начинаем с 1
              Object.entries(institutionMap).forEach(([institutionName, data]) => {
                const { repairDateSetCount, repairDateNullCount } = data;
  
                // Создаем строку таблицы
                const row = document.createElement("tr");
  
                // Создаем ячейку для номера строки
                const numberCell = document.createElement("td");
                numberCell.textContent = rowNumber++;
  
                // Создаем ячейки для остальных данных
                const nameCell = document.createElement("td");
                nameCell.textContent = institutionName;
  
                const setCountCell = document.createElement("td");
                setCountCell.textContent = repairDateSetCount;
  
                const nullCountCell = document.createElement("td");
                nullCountCell.textContent = repairDateNullCount;
  
                // Добавляем все ячейки в строку
                row.appendChild(numberCell);
                row.appendChild(nameCell);
                row.appendChild(setCountCell);
                row.appendChild(nullCountCell);
  
                // Добавляем строку в тело таблицы
                tableBody.appendChild(row);
  
                // Суммируем значения
                inRepairTotal += repairDateSetCount; //  "In reparație"
                repairedTotal += repairDateNullCount; // С "Reparate"
              });
  
              // Обновляем итоговые значения
              totalInRepair.textContent = inRepairTotal;
              totalRepaired.textContent = repairedTotal;
            }
  
            // Пример функции fetchData
            async function fetchData(url, token, ...keys) {
              try {
                const response = await fetch(url, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                });
  
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
  
                const data = await response.json();
  
                // Преобразуем массив данных в карту
                const institutionMap = {};
                data.forEach((item) => {
                  const institutionName = item[keys[0]];
                  institutionMap[institutionName] = {
                    [keys[1]]: item[keys[1]],
                    [keys[2]]: item[keys[2]],
                  };
                });
  
                return institutionMap;
              } catch (error) {
                console.error("Failed to fetch data:", error);
                return {};
              }
            }
  
            // Вызываем функцию для заполнения таблицы
            fetchRepairStats();
       