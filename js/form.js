'use strict';

(function () {
  var main = document.querySelector('main'); // Секция main
  var adForm = document.querySelector('.ad-form'); // Форма заполнения объявления
  var submit = adForm.querySelector('.ad-form__submit');
  var reset = adForm.querySelector('.ad-form__reset');
  var titleInput = adForm.querySelector('#title');
  var typeSelect = adForm.querySelector('#type');
  var priceInput = adForm.querySelector('#price');
  var timeInSelect = adForm.querySelector('#timein');
  var timeOutSelect = adForm.querySelector('#timeout');
  var roomNumberSelect = adForm.querySelector('#room_number');
  var capacitySelect = adForm.querySelector('#capacity');

  // Перечисление вида жилья с ценой
  var Price = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };

  // Словарь соответствия опций кол-во комнат к количеству мест
  var CapacityPropertyMap = {
    '1': '1',
    '2': '2',
    '3': '3',
    '100': '0'
  };

  // Словарь ограничения опций кол-ва мест по выбранным опциям кол-во комнат
  var CapacityDisableMap = {
    '1': ['0', '2', '3'],
    '2': ['0', '3'],
    '3': ['0'],
    '100': ['1', '2', '3']
  };

  // Проверка соответствия типа жилья и цены
  var changePriceHandler = function (value) {
    if (value === 'bungalo') {
      priceInput.placeholder = Price.BUNGALO;
      priceInput.min = Price.BUNGALO;
    } else if (value === 'flat') {
      priceInput.placeholder = Price.FLAT;
      priceInput.min = Price.FLAT;
    } else if (value === 'house') {
      priceInput.placeholder = Price.HOUSE;
      priceInput.min = Price.HOUSE;
    } else if (value === 'palace') {
      priceInput.placeholder = Price.PALACE;
      priceInput.min = Price.PALACE;
    }
  };

  // Проверка на ввод максимального значения аттрибута max
  var inputPriceHandler = function (value) {
    if (value > parseInt(priceInput.max, 10)) {
      priceInput.value = priceInput.max;
    }
  };

  // Синхронность полей время заезда и выезда
  var changeTimeHandler = function (timeSelect, index) {
    timeSelect.options[index].selected = true;
  };

  // Синхронность полей кол-во комнат и кол-во мест
  var changeRoomHandler = function (value) {
    capacitySelect.value = CapacityPropertyMap[value];

    Array.from(capacitySelect).forEach(function (option) {
      option.disabled = false;
    });

    CapacityDisableMap[value].forEach(function (element) {
      capacitySelect.querySelector('option[value="' + element + '"]').disabled = true;
    });
  };

  typeSelect.addEventListener('change', function (evt) {
    changePriceHandler(evt.target.value);
  });

  priceInput.addEventListener('input', function (evt) {
    inputPriceHandler(evt.target.value);
  });

  timeInSelect.addEventListener('change', function (evt) {
    changeTimeHandler(timeOutSelect, evt.target.selectedIndex);
  });

  timeOutSelect.addEventListener('change', function (evt) {
    changeTimeHandler(timeInSelect, evt.target.selectedIndex);
  });

  roomNumberSelect.addEventListener('change', function (evt) {
    changeRoomHandler(evt.target.value);
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

  // Рисуем красную рамку у полей которые не прошли валидацию
  submit.addEventListener('click', function () {
    adForm.querySelectorAll('input').forEach(function (element) {
      element.style = '';
      if (element.validity.valid === false) {
        element.style.boxShadow = '0 0 2px 2px #ff0000';
      }
    });
  });

  // Сбрасываем состояние страницы
  reset.addEventListener('click', function () {
    window.map.setStatusPage(true);
  });

  var keydownPopupHandler = function (evt) {
    window.util.escKeyEvent(evt, closePopup);
  };

  // Закрытие поп-апа
  var closePopup = function () {
    main.removeChild(main.lastElementChild);
    submit.disabled = false;
    submit.removeAttribute('style');
    document.removeEventListener('keydown', keydownPopupHandler);
  };

  // Попап успешной отправки данных
  var successHandler = function () {
    var successTemplate = document.querySelector('#success').content;
    var successClone = successTemplate.cloneNode(true);
    window.map.setStatusPage(true);
    main.appendChild(successClone);

    main.lastElementChild.addEventListener('click', function () {
      closePopup();
    });

    document.addEventListener('keydown', keydownPopupHandler);
  };

  // Попап с ошибкой
  var errorHandler = function (message) {
    var errorTemplate = document.querySelector('#error').content;
    var errorClone = errorTemplate.cloneNode(true);
    errorClone.querySelector('.error__message').textContent = 'Произошла ошибка. ' + message;
    main.appendChild(errorClone);

    main.lastElementChild.addEventListener('click', function () {
      closePopup();
    });

    document.addEventListener('keydown', keydownPopupHandler);
    throw new Error(message);
  };

  // Отправка формы на сервер
  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(adForm), successHandler, errorHandler);

    submit.disabled = true;
    submit.style.backgroundColor = 'lightgray';
    submit.style.color = 'gray';
    submit.style.border = '4px solid #c5c5c5';
  });

  window.form = {
    Price: Price,
    errorHandler: errorHandler
  };
})();
