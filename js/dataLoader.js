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
