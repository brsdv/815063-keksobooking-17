'use strict';

(function () {
  var MIN_Y_COORD = 130; // Минимальная координата Y
  var MAX_Y_COORD = 630; // Максимальная координата Y
  var MAIN_HEIGHT_PIN = 81; // Высота главной метки, определяется метрикой scrollHeight в активном режиме страницы

  window.map = document.querySelector('.map'); // Секция карты
  window.pinContainer = document.querySelector('.map__pins'); // Контейнер для всех меток
  var pinMain = window.pinContainer.querySelector('.map__pin--main'); // Начальная метка
  var pinMainHalfWidth = pinMain.offsetWidth / 2; // Середина самой метки по X
  var pinMainHalfHeight = pinMain.offsetHeight / 2; // Середина самой метки по Y
  var startCoordinateX = Math.round(pinMain.offsetLeft + pinMainHalfWidth); // Середина начальной метки по X
  var startCoordinateY = Math.round(pinMain.offsetTop + pinMainHalfHeight); // Середина начальной метки по Y
  var adForm = document.querySelector('.ad-form'); // Форма заполнения объявления
  var addressInput = adForm.querySelector('#address'); // Поле "адрес"

  addressInput.value = startCoordinateX + ', ' + startCoordinateY; // Задаем стартовые координаты в поле адрес

  var keydownHandler = function (evt) {
    window.util.escKeyEvent(evt, closeCardHandler);
  };

  var closeCardHandler = function () {
    window.map.removeChild(window.map.querySelector('article'));
    document.removeEventListener('keydown', keydownHandler);
  };

  // Закрываем карточку объявления при клике
  var closeCard = function () {
    var closeElement = window.map.querySelector('.popup__close');
    closeElement.addEventListener('click', function () {
      closeCardHandler();
    });
  };

  // Рендерим карточку объявления
  var сardRender = function (pin) {
    var cardElement = window.map.querySelector('article');

    // Если карточка отрисована, удаляем ее
    if (cardElement !== null) {
      window.map.removeChild(cardElement);
    }

    window.pinContainer.after(window.renderCard(pin));
    document.addEventListener('keydown', keydownHandler);
    closeCard();
  };

  // Показываем карточку объявления при клике на пин
  var openCard = function (data) {
    window.pinContainer.addEventListener('click', function (evt) {
      var target = evt.target;
      var dataX = parseInt(target.dataset.x, 10);
      var dataY = parseInt(target.dataset.y, 10);

      for (var i = 0; i < data.length; i++) {
        if (dataX === data[i].location.x && dataY === data[i].location.y) {
          сardRender(data[i]);
        }
      }
    });
  };

  // Активируем состояние страницы
  var setStatusPage = function (status) {
    var fieldsets = adForm.querySelectorAll('fieldset');

    if (!status) {
      window.map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
      window.pinContainer.appendChild(window.pin);
      openCard(window.data);
    }

    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].disabled = status;

      if (!status) {
        fieldsets[i].removeAttribute('disabled');
      }
    }
  };
  setStatusPage(true);

  // Устанавливаем координаты в поле адрес
  var setPinCoord = function () {
    var currentCoordinateX = Math.round(pinMain.offsetLeft + pinMainHalfWidth);
    var currentCoordinateY = Math.round(pinMain.offsetTop + MAIN_HEIGHT_PIN);
    addressInput.value = currentCoordinateX + ', ' + currentCoordinateY;
  };

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
        setStatusPage(false);
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
