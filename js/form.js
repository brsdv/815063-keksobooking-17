'use strict';

(function () {
  var adForm = document.querySelector('.ad-form'); // Форма заполнения объявления
  var submit = adForm.querySelector('.ad-form__submit');
  var titleInput = adForm.querySelector('#title');
  var typeSelect = adForm.querySelector('#type');
  var priceInput = adForm.querySelector('#price');
  var timeInSelect = adForm.querySelector('#timein');
  var timeOutSelect = adForm.querySelector('#timeout');
  var filterForm = document.querySelector('.map__filters'); // Форма фильтров под картой
  var filterType = filterForm.querySelector('#housing-type');

  var changeInputPriceHandler = function (val) {
    if (val === 'bungalo') {
      priceInput.placeholder = 0;
      priceInput.min = 0;
    } else if (val === 'flat') {
      priceInput.placeholder = 1000;
      priceInput.min = 1000;
    } else if (val === 'house') {
      priceInput.placeholder = 5000;
      priceInput.min = 5000;
    } else if (val === 'palace') {
      priceInput.placeholder = 10000;
      priceInput.min = 10000;
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

  // Колбек события по фильтру тип жилья
  var changeTypeHandler = function (value) {
    if (value !== 'any') {
      var data = window.data.filter(function (pin) {
        return pin.offer.type === value;
      });
      window.rebuildPin(data);
    } else {
      window.rebuildPin(window.data);
    }
  };

  filterType.addEventListener('change', function (evt) {
    changeTypeHandler(evt.target.value);
  });

  var successHandler = function () {
    var successClone = window.successTemplate.cloneNode(true);
    window.main.appendChild(successClone);
  };

  var errorHandler = function (message) {
    var errorClone = window.errorTemplate.cloneNode(true);
    errorClone.querySelector('.error__message').textContent = 'Произошла ошибка. ' + message;
    window.main.appendChild(errorClone);

    var errorButton = window.main.querySelector('.error');
    errorButton.addEventListener('click', function () {
      window.main.removeChild(errorButton);

      submit.disabled = false;
      submit.removeAttribute('style');
    });

    throw new Error(message);
  };

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    window.backend.save(new FormData(adForm), successHandler, errorHandler);

    submit.disabled = true;
    submit.style.backgroundColor = 'lightgray';
    submit.style.color = 'gray';
    submit.style.border = '4px solid #c5c5c5';
  });
})();
