'use strict';

(function () {
  var MIN_Y_COORD = 130; // Минимальная координата Y
  var MAX_Y_COORD = 630; // Максимальная координата Y
  var MAIN_HEIGHT_PIN = 81; // Высота главной метки, определяется метрикой scrollHeight в активном режиме страницы

  window.map = document.querySelector('.map'); // Секция карты
  window.mapPins = document.querySelector('.map__pins'); // Контейнер для всех меток
  var pinMain = window.mapPins.querySelector('.map__pin--main'); // Начальная метка
  var pinMainHalfWidth = pinMain.offsetWidth / 2; // Середина самой метки по X
  var pinMainHalfHeight = pinMain.offsetHeight / 2; // Середина самой метки по Y
  var startCoordinateX = Math.round(pinMain.offsetLeft + pinMainHalfWidth); // Середина начальной метки по X
  var startCoordinateY = Math.round(pinMain.offsetTop + pinMainHalfHeight); // Середина начальной метки по Y
  var adForm = document.querySelector('.ad-form'); // Форма заполнения объявления
  var addressInput = adForm.querySelector('#address'); // Поле "адрес"

  var successHandler = function (response) {
    window.data = response;
    window.mapPins.appendChild(window.renderPin(response));

    window.mapPins.addEventListener('click', function (evt) {
      var target = evt.target;
      var dataX = parseInt(target.dataset.x, 10);
      var dataY = parseInt(target.dataset.y, 10);

      for (var i = 0; i < response.length; i++) {
        // Ловим клик по координатам X, Y и отрисовываем карточку
        if (dataX === response[i].location.x && dataY === response[i].location.y) {
          window.openCard(response[i]);
        }
      }
    });
  };

  var errorHandler = function (message) {
    var error = window.errorTemplate.cloneNode(true);
    error.querySelector('.error__message').textContent = message;
    window.main.appendChild(error);

    var errorButton = window.main.querySelector('.error');
    errorButton.addEventListener('click', function () {
      window.main.removeChild(errorButton);
    });

    throw new Error(message);
  };

  // Активируем состояние страницы
  window.setStatusPage = function (status) {
    document.querySelector('.ad-form').reset();
    pinMain.style.left = Math.floor(startCoordinateX - pinMainHalfWidth) + 'px'; // Возвращаем метку в стартовое положение координаты X
    pinMain.style.top = Math.floor(startCoordinateY - pinMainHalfHeight) + 'px'; // Возвращаем метку в стартовое положение координаты Y
    addressInput.value = startCoordinateX + ', ' + startCoordinateY; // Задаем стартовые координаты в поле адрес

    var fieldsets = adForm.querySelectorAll('fieldset');
    fieldsets.forEach(function (element) {
      element.disabled = status;
      if (!status) {
        element.removeAttribute('disabled');
      }
    });

    if (status) {
      window.map.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');
      window.removeCard();
      window.removePin();
    } else {
      window.backend.load(successHandler, errorHandler); // Загрузка данных с сервера с обработкой ошибок
      window.map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
    }
  };
  window.setStatusPage(true);

  // Устанавливаем координаты в поле адрес
  var setPinCoord = function () {
    var currentCoordinateX = Math.round(pinMain.offsetLeft + pinMainHalfWidth);
    var currentCoordinateY = Math.round(pinMain.offsetTop + MAIN_HEIGHT_PIN);
    addressInput.value = currentCoordinateX + ', ' + currentCoordinateY;
  };

  // Функция-конструктор для вычисления координат
  var Coordinate = function (x, y) {
    this.x = x;
    this.y = y;
  };

  pinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    pinMain.style.zIndex = 2;

    var startCoordinate = new Coordinate(evt.clientX, evt.clientY);

    var mouseMoveHandler = function (evtMove) {
      evtMove.preventDefault();

      // если страница дезактивирована, активируем ее
      if (window.map.classList.contains('map--faded')) {
        window.setStatusPage(false);
      }

      var shift = new Coordinate(startCoordinate.x - evtMove.clientX, startCoordinate.y - evtMove.clientY);

      startCoordinate = new Coordinate(evtMove.clientX, evtMove.clientY);

      var currentX = pinMain.offsetLeft - shift.x;
      var currentY = pinMain.offsetTop - shift.y;

      if (currentX >= window.map.clientLeft - pinMainHalfWidth && currentX <= window.map.clientWidth - pinMainHalfWidth) {
        pinMain.style.left = currentX + 'px';
      }
      if (currentY >= MIN_Y_COORD - MAIN_HEIGHT_PIN && currentY <= MAX_Y_COORD - MAIN_HEIGHT_PIN) {
        pinMain.style.top = currentY + 'px';
      }
    };

    var mouseUpHandler = function (evtUp) {
      evtUp.preventDefault();

      setPinCoord();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });
})();
