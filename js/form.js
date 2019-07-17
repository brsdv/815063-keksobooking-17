'use strict';

(function () {
  window.main = document.querySelector('main');
  window.successTemplate = document.querySelector('#success').content; // Шаблон успешной отправки данных
  window.errorTemplate = document.querySelector('#error').content; // Шаблон ошибки
  var adForm = document.querySelector('.ad-form'); // Форма заполнения объявления
  var submit = adForm.querySelector('.ad-form__submit');
  var titleInput = adForm.querySelector('#title');
  var typeSelect = adForm.querySelector('#type');
  var priceInput = adForm.querySelector('#price');
  var timeInSelect = adForm.querySelector('#timein');
  var timeOutSelect = adForm.querySelector('#timeout');
  var roomNumberSelect = adForm.querySelector('#room_number');
  var capacitySelect = adForm.querySelector('#capacity');
  var filterForm = document.querySelector('.map__filters'); // Форма фильтров под картой
  var filterType = filterForm.querySelector('#housing-type');

  // Словарь соответствия опций кол-во комнат к количеству мест
  var CapacityProperty = {
    '1': '1',
    '2': '2',
    '3': '3',
    '100': '0'
  };

  // Словарь ограничения опций кол-ва мест по выбранным опциям кол-во комнат
  var CapacityDisable = {
    '1': ['0', '2', '3'],
    '2': ['0', '3'],
    '3': ['0'],
    '100': ['1', '2', '3']
  };

  // Проверка соответствия типа жилья и цены
  var changePriceHandler = function (val) {
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

  // Синхронность полей время заезда и выезда
  var changeTimeHandler = function (opt, index) {
    opt.selectedOptions[0].selected = false;
    opt.options[index].selected = true;
  };

  // Синхронность полей кол-во комнат и кол-во мест с ограничениями из словарей
  var changeRoomHandler = function (val) {
    capacitySelect.value = CapacityProperty[val];

    Array.from(capacitySelect).forEach(function (option) {
      option.disabled = false;
    });

    CapacityDisable[val].forEach(function (value) {
      capacitySelect.querySelector('option[value="' + value + '"]').disabled = true;
    });
  };

  typeSelect.addEventListener('change', function (evt) {
    changePriceHandler(evt.target.value);
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

  // Фильтрация по типу жилья
  var changeFilterTypeHandler = function (value) {
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
    changeFilterTypeHandler(evt.target.value);
  });

  var keydownPopupHandler = function (evt) {
    window.util.escKeyEvent(evt, closePopup);
  };

  // Закрытие поп-апа
  var closePopup = function () {
    window.main.removeChild(window.currentPopup);
    submit.disabled = false;
    submit.removeAttribute('style');
    document.removeEventListener('keydown', keydownPopupHandler);
  };

  // Успешная отправка формы на сервер
  var successHandler = function () {
    window.setStatusPage(true);
    var successClone = window.successTemplate.cloneNode(true);
    window.main.appendChild(successClone);

    window.currentPopup = window.main.querySelector('.success');
    window.currentPopup.addEventListener('click', function () {
      closePopup();
    });

    document.addEventListener('keydown', keydownPopupHandler);
  };

  // Ошибка при отправки формы на сервер
  var errorHandler = function (message) {
    var errorClone = window.errorTemplate.cloneNode(true);
    errorClone.querySelector('.error__message').textContent = 'Произошла ошибка. ' + message;
    window.main.appendChild(errorClone);

    window.currentPopup = window.main.querySelector('.error');
    window.currentPopup.addEventListener('click', function () {
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
})();
