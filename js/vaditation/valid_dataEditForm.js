
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("dataEditForm");
    const submitButton = document.getElementById("submitButton");

    // Обработчик события для кнопки отправки
    submitButton.addEventListener("click", function (event) {
      createToast('error','Completati toate cimpurile!!!');
      if (!form.checkValidity()) {
        event.preventDefault(); // Предотвращаем отправку формы
        form.classList.add("was-validated");

      } else {
        // Если форма валидна, здесь можно отправить данные
      createToast('succes','A fost adaugat cu succes!!!');
        form.classList.remove("was-validated");
      }
    });
  });

