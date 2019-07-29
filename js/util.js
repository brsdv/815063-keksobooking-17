'use strict';

(function () {
  var ESC_KEY = 27; // Код клавишы ESC

  window.util = {
    // Выполняем экшион если была нажата клавиша
    escKeyEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEY) {
        action();
      }
    },
    // Дизейблим поля формы если страница неактивна и раздизейбливаем если активна
    disabledForm: function (formSets, status) {
      formSets.forEach(function (element) {
        element.disabled = status;
        if (!status) {
          element.removeAttribute('disabled');
        }
      });
    },
    // Убираем стили у всех обязательных полей
    removeStyleInput: function (inputs) {
      inputs.forEach(function (element) {
        element.style = '';
      });
    }
  };
})();
