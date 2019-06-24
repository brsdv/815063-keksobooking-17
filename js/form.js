'use strict';

(function () {
  var adForm = document.querySelector('.ad-form'); // Форма заполнения объявления
  var titleInput = adForm.querySelector('#title');
  var typeSelect = adForm.querySelector('#type');
  var priceInput = adForm.querySelector('#price');
  var timeInSelect = adForm.querySelector('#timein');
  var timeOutSelect = adForm.querySelector('#timeout');

  var changeInputPriceHandler = function (val) {
    if (val === 'bungalo') {
      priceInput.placeholder = 0;
      priceInput.setAttribute('min', 0);
    } else if (val === 'flat') {
      priceInput.placeholder = 1000;
      priceInput.setAttribute('min', 1000);
    } else if (val === 'house') {
      priceInput.placeholder = 5000;
      priceInput.setAttribute('min', 5000);
    } else if (val === 'palace') {
      priceInput.placeholder = 10000;
      priceInput.setAttribute('min', 10000);
    }
  };

  var changeSelectTimeHandler = function (opt, index) {
    opt.selectedOptions[0].selected = false;
    opt.options[index].selected = true;
  };

  typeSelect.addEventListener('change', function (evt) {
    changeInputPriceHandler(evt.target.value);
  });

  timeInSelect.addEventListener('change', function (evt) {
    changeSelectTimeHandler(timeOutSelect, evt.target.selectedIndex);
  });

  timeOutSelect.addEventListener('change', function (evt) {
    changeSelectTimeHandler(timeInSelect, evt.target.selectedIndex);
  });

  titleInput.addEventListener('invalid', function (evt) {
    if (titleInput.validity.tooShort) {
      titleInput.setCustomValidity('Минимальная длина заголовка: ' + evt.target.minLength);
    } else if (titleInput.validity.tooLong) {
      titleInput.setCustomValidity('Максимальная длина заголовка: ' + evt.target.maxLength);
    } else if (titleInput.validity.valueMissing) {
      titleInput.setCustomValidity('Обязательное поле для заполнения');
    } else {
      titleInput.setCustomValidity('');
    }
  });

  priceInput.addEventListener('invalid', function (evt) {
    if (priceInput.validity.rangeOverflow) {
      priceInput.setCustomValidity('Число не должно превышать: ' + evt.target.max);
    } else if (priceInput.validity.rangeUnderflow) {
      priceInput.setCustomValidity('Число не должно быть меньше: ' + evt.target.min);
    } else if (priceInput.validity.valueMissing) {
      priceInput.setCustomValidity('Обязательное поле для заполнения');
    } else {
      priceInput.setCustomValidity('');
    }
  });
})();
