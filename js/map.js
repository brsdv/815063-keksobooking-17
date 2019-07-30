'use strict';

(function () {
  var MIN_Y_COORD = 130; // Минимальная координата Y
  var MAX_Y_COORD = 630; // Максимальная координата Y
  var MAIN_HEIGHT_PIN = 81; // Высота главной метки, определяется метрикой scrollHeight в активном режиме страницы

  var mapSection = document.querySelector('.map'); // Секция карты
  var mapContainer = document.querySelector('.map__pins'); // Контейнер для всех меток
  var pinMain = document.querySelector('.map__pin--main'); // Начальная метка
  var filterForm = document.querySelector('.map__filters'); // Форма всех фильтров на карте
  var adForm = document.querySelector('.ad-form'); // Форма заполнения объявления
  var addressInput = adForm.querySelector('#address'); // Поле "адрес"
  var pinMainHalfWidth = pinMain.offsetWidth / 2; // Середина самой метки по X
  var pinMainHalfHeight = pinMain.offsetHeight / 2; // Середина самой метки по Y
  var startCoordinateX = Math.round(pinMain.offsetLeft + pinMainHalfWidth); // Середина начальной метки по X
  var startCoordinateY = Math.round(pinMain.offsetTop + pinMainHalfHeight); // Середина начальной метки по Y

  // Функция-конструктор для вычисления координат
  var Coordinate = function (x, y) {
    this.x = x;
    this.y = y;
  };

  // Устанавливаем координаты в поле адрес
  var setInputCoordinate = function () {
    var currentCoordinateX = Math.round(pinMain.offsetLeft + pinMainHalfWidth);
    var currentCoordinateY = Math.round(pinMain.offsetTop + MAIN_HEIGHT_PIN);
    addressInput.value = currentCoordinateX + ', ' + currentCoordinateY;
  };

  var successHandler = function (response) {
    window.data = response; // Записываем данные полученные с сервера в глобальную переменную
    mapContainer.appendChild(window.pin.renderPin(response)); // Отрисовываем пины

    filterForm.addEventListener('change', window.filter.changeHandler);

    mapContainer.addEventListener('click', function (evt) {
      var dataX = parseInt(evt.target.dataset.x, 10);
      var dataY = parseInt(evt.target.dataset.y, 10);

      for (var i = 0; i < response.length; i++) {
        // Ловим клик по координатам X, Y и отрисовываем карточку
        if (dataX === response[i].location.x && dataY === response[i].location.y) {
          window.pin.setClassActive(evt.target);
          window.card.openCard(response[i]);
        }
      }
    });
  };

  // Активируем состояние страницы
  var setStatusPage = function (status) {
    window.util.disabledForm(adForm.querySelectorAll('fieldset'), status); // Дизейблим все поля формы объявления
    window.util.disabledForm(filterForm.querySelectorAll('select'), status); // Дизейблим все поля формы фильтрации
    window.util.removeStyleInput(adForm.querySelectorAll('input:required')); // Убираем стили у обязательных полей

    adForm.reset(); // Сбрасываем форму подачи объявления
    filterForm.reset(); // Сбрасываем форму фильтрации

    pinMain.style.left = Math.floor(startCoordinateX - pinMainHalfWidth) + 'px'; // Возвращаем метку в стартовое положение координаты X
    pinMain.style.top = Math.floor(startCoordinateY - pinMainHalfHeight) + 'px'; // Возвращаем метку в стартовое положение координаты Y
    addressInput.value = startCoordinateX + ', ' + startCoordinateY; // Задаем стартовые координаты в поле адрес
    adForm.querySelector('#price').placeholder = 1000; // Возвращаем плейсхолдер цены в начальное состояние

    // Переводим страницу в неактивное состояние если пришло true, иначе активируем ее
    if (status) {
      mapSection.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');
      window.card.removeCard();
      window.pin.removePin();
      filterForm.removeEventListener('change', window.filter.changeHandler);
    } else {
      window.backend.load(successHandler, window.form.errorHandler); // Загрузка данных с сервера с обработкой ошибок
      mapSection.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
    }
  };
  setStatusPage(true);

  pinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    pinMain.style.zIndex = 2;

    var startCoordinate = new Coordinate(evt.clientX, evt.clientY);

    var mouseMoveHandler = function (evtMove) {
      evtMove.preventDefault();

      // если страница дезактивирована, активируем ее
      if (mapSection.classList.contains('map--faded')) {
        setStatusPage(false);
      }

      var shift = new Coordinate(startCoordinate.x - evtMove.clientX, startCoordinate.y - evtMove.clientY);

      startCoordinate = new Coordinate(evtMove.clientX, evtMove.clientY);

      var currentX = pinMain.offsetLeft - shift.x;
      var currentY = pinMain.offsetTop - shift.y;

      if (currentX >= mapSection.clientLeft - pinMainHalfWidth && currentX <= mapSection.clientWidth - pinMainHalfWidth) {
        pinMain.style.left = currentX + 'px';
      }
      if (currentY >= MIN_Y_COORD - MAIN_HEIGHT_PIN && currentY <= MAX_Y_COORD - MAIN_HEIGHT_PIN) {
        pinMain.style.top = currentY + 'px';
      }
    };

    var mouseUpHandler = function (evtUp) {
      evtUp.preventDefault();

      setInputCoordinate();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  window.map = {
    mapSection: mapSection,
    mapContainer: mapContainer,
    setStatusPage: setStatusPage
  };
})();
