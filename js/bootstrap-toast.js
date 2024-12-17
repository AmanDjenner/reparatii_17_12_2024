function showToast(message, type = 'primary') {
    const toastContainer = document.getElementById('toastContainer');

    // Creare element toast
    const toastElement = document.createElement('div');
    toastElement.className = `toast align-items-center text-bg-${type} border-0 mb-2`;
    toastElement.role = "alert";
    toastElement.ariaLive = "assertive";
    toastElement.ariaAtomic = "true";

    // Structura HTML a toast-ului
    toastElement.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    // Adaugă toast-ul în container
    toastContainer.appendChild(toastElement);

    // Inițializează și afișează toast-ul
    const toast = new bootstrap.Toast(toastElement);
    toast.show();

    // Elimină toast-ul din DOM după ce este ascuns
    toastElement.addEventListener('hidden.bs.toast', () => {
      toastElement.remove();
    });
  }

//   // Exemplu de utilizare
//   document.getElementById('showToastButton').addEventListener('click', function () {
//     const messages = [
//       'Primul mesaj!',
//       'Al doilea mesaj!',
//       'Al treilea mesaj!'
//     ];
//     messages.forEach((msg, index) => {
//       setTimeout(() => showToast(msg, 'success'), index * 1000); // Afișează fiecare mesaj cu un delay
//     });
//   });