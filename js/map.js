'use strict';

(function () {
  var MIN_Y_COORD = 130; // Минимальная координата Y
  var MAX_Y_COORD = 630; // Максимальная координата Y
  var MAIN_HEIGHT_PIN = 81; // Высота главной метки, определяется метрикой scrollHeight в активном режиме страницы

  var map = document.querySelector('.map'); // Секция карты
  var pinContainer = document.querySelector('.map__pins'); // Контейнер для всех меток
  var pinMain = pinContainer.querySelector('.map__pin--main'); // Начальная метка
  var pinMainHalfWidth = pinMain.offsetWidth / 2; // Середина самой метки по X
  var pinMainHalfHeight = pinMain.offsetHeight / 2; // Середина самой метки по Y
  var startCoordinateX = Math.round(pinMain.offsetLeft + pinMainHalfWidth); // Середина начальной метки по X
  var startCoordinateY = Math.round(pinMain.offsetTop + pinMainHalfHeight); // Середина начальной метки по Y
  var adForm = document.querySelector('.ad-form'); // Форма заполнения объявления
  var addressInput = adForm.querySelector('#address'); // Поле "адрес"

  // Задаем стартовые координаты в поле адрес
  addressInput.value = startCoordinateX + ', ' + startCoordinateY;

  // Активирует состояние страницы
  var setStatusPage = function (status) {
    var fieldsets = adForm.querySelectorAll('fieldset');

    if (!status) {
      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
      pinContainer.appendChild(window.pin);
    }

    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].disabled = status;

      if (!status) {
        fieldsets[i].removeAttribute('disabled');
      }
    }
  };
  setStatusPage(true);

  // Устанавливает координаты в поле адрес
  var setPinCoord = function () {
    var currentCoordinateX = Math.round(pinMain.offsetLeft + pinMainHalfWidth);
    var currentCoordinateY = Math.round(pinMain.offsetTop + MAIN_HEIGHT_PIN);
    addressInput.value = currentCoordinateX + ', ' + currentCoordinateY;
  };

  pinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    pinMain.style.zIndex = 2;

    var startCoordinate = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mouseMoveHandler = function (evtMove) {
      evtMove.preventDefault();

      // если страница дезактивирована, активируем ее
      if (map.classList.contains('map--faded')) {
        setStatusPage(false);
      }

      var shift = {
        x: startCoordinate.x - evtMove.clientX,
        y: startCoordinate.y - evtMove.clientY
      };

      startCoordinate = {
        x: evtMove.clientX,
        y: evtMove.clientY
      };

      var currentX = pinMain.offsetLeft - shift.x;
      var currentY = pinMain.offsetTop - shift.y;

      if (currentX >= map.clientLeft - pinMainHalfWidth && currentX <= map.clientWidth - pinMainHalfWidth) {
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
