// filters.js
import { loadData } from './dataLoader.js';

export function applyFilters() {
  const categoryID = document.getElementById("categorySelect").value;
  const institutionID = document.getElementById("institutionSelect").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  
  loadData({ categoryID, institutionID, startDate, endDate });
}

export function resetFilters() {
  document.getElementById("categorySelect").value = "";
  document.getElementById("institutionSelect").value = "";
  document.getElementById("startDate").value = "";
  document.getElementById("endDate").value = "";
}
