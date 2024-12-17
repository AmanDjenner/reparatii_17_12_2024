



function showAlert() {
    Swal.fire({
      title: 'Totul e Ok!',
      text: 'A fost adaugat cu succes!!!',
      icon: 'success',
      timer: 3000, 
      showConfirmButton: false 
      // confirmButtonText: 'ОК'
    });
  }
  function showErrorAlert() {
    Swal.fire({
      title: 'A avut loc o eroare!',
      text: 'Încercați din nou',
      icon: 'error', 
      timer: 3000,   
      showConfirmButton: false 
    });
  }
  function showErrorTokenAlert() {
    Swal.fire({
      title: 'A avut loc o eroare!',
      text: 'Încercați să vă logați din nou!',
      icon: 'error', 
      timer: 3000,   
      showConfirmButton: false 
    });
  }