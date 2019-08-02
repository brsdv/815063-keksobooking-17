'use strict';

(function () {
  var MAIN_HEIGHT_PIN = 81; // Высота главной метки, определяется метрикой scrollHeight в активном режиме страницы
  var MIN_COORDINATE_Y = 130; // Минимальная координата Y
  var MAX_COORDINATE_Y = 630; // Максимальная координата Y
  var SET_TIMEOUT = 500; // Таймер в мс для функции SetTimeout()

  var mapSection = document.querySelector('.map'); // Секция карты
  var mapContainer = document.querySelector('.map__pins'); // Контейнер для всех меток
  var pinMain = document.querySelector('.map__pin--main'); // Начальная метка
  var adForm = document.querySelector('.ad-form'); // Форма заполнения объявления
  var addressInput = adForm.querySelector('#address'); // Поле "адрес"
  var pinMainHalfWidth = pinMain.offsetWidth / 2; // Середина самой метки по X
  var pinMainHalfHeight = pinMain.offsetHeight / 2; // Середина самой метки по Y
  var startCoordinateX = Math.round(pinMain.offsetLeft + pinMainHalfWidth); // Середина начальной метки по X
  var startCoordinateY = Math.round(pinMain.offsetTop + pinMainHalfHeight); // Середина начальной метки по Y
  var lastTimeout; // Переменная под функцию таймера, чтобы потом эту функцию можно было удалить

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

  // Перерисовываем пины по выбранным фильтрам с тайм-аутом в пол секунды
  var changeFilterHandler = function () {
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }

    lastTimeout = setTimeout(function () {
      window.card.removeCard();
      window.pin.rebuildPin(window.filter.filterPin(window.data));
    }, SET_TIMEOUT);
  };

  var successHandler = function (data) {
    window.data = data;
    mapContainer.appendChild(window.pin.renderPin(data)); // Отрисовываем пины

    window.filter.form.addEventListener('change', changeFilterHandler);

    mapContainer.addEventListener('click', function (evt) {
      var dataX = parseInt(evt.target.dataset.x, 10);
      var dataY = parseInt(evt.target.dataset.y, 10);

      for (var i = 0; i < data.length; i++) {
        // Ловим клик по координатам X, Y и отрисовываем карточку
        if (dataX === data[i].location.x && dataY === data[i].location.y) {
          window.pin.setClassActive(evt.target);
          window.card.openCard(data[i]);
        }
      }
    });
  };

  // Активируем состояние страницы
  var setStatusPage = function (status) {
    window.util.disabledForm(adForm.querySelectorAll('fieldset'), status); // Дизейблим все поля формы объявления
    window.util.disabledForm(window.filter.form.querySelectorAll('select'), status); // Дизейблим все поля формы фильтрации
    window.util.removeStyleInput(adForm.querySelectorAll('input:required')); // Убираем стили у обязательных полей

    adForm.reset(); // Сбрасываем форму подачи объявления
    window.filter.form.reset(); // Сбрасываем форму фильтрации

    pinMain.style.left = Math.floor(startCoordinateX - pinMainHalfWidth) + 'px'; // Возвращаем метку в стартовое положение координаты X
    pinMain.style.top = Math.floor(startCoordinateY - pinMainHalfHeight) + 'px'; // Возвращаем метку в стартовое положение координаты Y
    addressInput.value = startCoordinateX + ', ' + startCoordinateY; // Задаем стартовые координаты в поле адрес
    adForm.querySelector('#price').placeholder = window.form.Price.FLAT; // Возвращаем плейсхолдер цены в начальное состояние
    adForm.querySelector('.ad-form-header img').src = 'img/muffin-grey.svg'; // Задаем стартовую картинку для аватара

    // Переводим страницу в неактивное состояние если пришло true, иначе активируем ее
    if (status) {
      mapSection.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');
      window.card.removeCard();
      window.pin.removePin();
      window.filter.form.removeEventListener('change', changeFilterHandler);
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

      var currentX = pinMain.offsetLeft - shift.x; // Текущая координата по X
      var currentY = pinMain.offsetTop - shift.y; // Текущая координата по Y
      var minX = currentX >= mapSection.clientLeft - pinMainHalfWidth; // Вернет true если текущая координата не выходит за начало блока карты по которой возможно перетаскивание
      var maxX = currentX <= mapSection.clientWidth - pinMainHalfWidth; // Вернет true если текущая координата не выходит за конец блока карты по которой возможно перетаскивание
      var minY = currentY >= MIN_COORDINATE_Y - MAIN_HEIGHT_PIN; // Вернет true если текущая координата не выходит за начало верхнего блока карты по которой возможно перетаскивание
      var maxY = currentY <= MAX_COORDINATE_Y - MAIN_HEIGHT_PIN; // Вернет true если текущая координата не выходит за конец нижнего блока карты по которой возможно перетаскивание

      if (minX && maxX) {
        pinMain.style.left = currentX + 'px';
      }
      if (minY && maxY) {
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
