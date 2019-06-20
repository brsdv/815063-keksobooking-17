'use strict';

var MIN_Y_COORDINATE = 130; // Минимальная координата Y метки на карте
var MAX_Y_COORDINATE = 630; // Максимальная координата Y метки на карте
var WIDTH_PIN = 50; // Ширина пользовательской метки, определяется в CSS
var HEIGHT_PIN = 70; // Высота пользовательской метки, определяется в CSS
var MAIN_HEIGHT_PIN = 81; // Высота главной метки, определяется метрикой scrollHeight в активном режиме страницы
var ALT_TEXT_IMG = 'заголовок объявления';

var numbers = [1, 2, 3, 4, 5, 6, 7, 8];
var offers = ['palace', 'flat', 'house', 'bungalo'];

var pinTemplate = document.querySelector('#pin')
  .content; // Шаблон DocumentFragment пользовательской метки на карте

var map = document.querySelector('.map'); // Секция карты
var pinContainer = document.querySelector('.map__pins'); // Контейнер для всех меток объявлений
var pinMain = pinContainer.querySelector('.map__pin--main'); // Начальная метка на карте
var adForm = document.querySelector('.ad-form'); // Форма заполнения объявления
var titleInput = adForm.querySelector('#title');
var addressInput = adForm.querySelector('#address');
var typeSelect = adForm.querySelector('#type');
var priceInput = adForm.querySelector('#price');
var timeInSelect = adForm.querySelector('#timein');
var timeOutSelect = adForm.querySelector('#timeout');
var pinMainHalfWidth = pinMain.offsetWidth / 2; // Середина самой метки по оси X
var pinMainHalfHeight = pinMain.offsetHeight / 2; // Середина самой метки по оси Y
var startCoordinateX = Math.round(pinMain.offsetLeft + pinMainHalfWidth); // Середина начальной метки на карте по оси X
var startCoordinateY = Math.round(pinMain.offsetTop + pinMainHalfHeight); // Середина начальной метки на карте по оси Y
addressInput.value = startCoordinateX + ', ' + startCoordinateY; // Добавляю в поле "адрес" координаты метки в неактивном режиме

var getGenerationPin = function () {
  var arrObj = [];

  var shuffle = function (arr) {
    var j;
    var temp;

    for (var i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
    }

    return arr;
  };

  var randomNumbers = shuffle(numbers);

  var randomCoordinate = function (min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
  };

  for (var i = 0; i < randomNumbers.length; i++) {
    var leadZero = String('0') + randomNumbers[i];
    var randomOffer = offers[Math.floor(Math.random() * offers.length)];

    var obj = {
      author: {
        avatar: 'img/avatars/user' + leadZero + '.png'
      },
      offer: {
        type: randomOffer
      },
      location: {
        x: randomCoordinate(map.clientLeft, map.clientWidth),
        y: randomCoordinate(MIN_Y_COORDINATE, MAX_Y_COORDINATE)
      }
    };

    arrObj.push(obj);
  }

  return arrObj;
};

var pins = getGenerationPin();

var createPin = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.querySelector('img').src = pin.author.avatar;
  pinElement.querySelector('img').alt = ALT_TEXT_IMG;
  pinElement.querySelector('.map__pin').style.left = pin.location.x - WIDTH_PIN / 2 + 'px';
  pinElement.querySelector('.map__pin').style.top = pin.location.y - HEIGHT_PIN + 'px';

  return pinElement;
};

var renderPin = function () {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < pins.length; i++) {
    fragment.appendChild(createPin(pins[i]));
  }

  return fragment;
};

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

var getStatusPage = function (status) {
  var fieldsets = adForm.querySelectorAll('fieldset');

  if (!status) {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    pinContainer.appendChild(renderPin());
  }

  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].disabled = status;

    if (!status) {
      fieldsets[i].removeAttribute('disabled');
    }
  }
};
getStatusPage(true);

var pinCoordinate = function () {
  var currentCoordinateX = Math.round(pinMain.offsetLeft + pinMainHalfWidth);
  var currentCoordinateY = Math.round(pinMain.offsetTop + MAIN_HEIGHT_PIN);
  addressInput.value = currentCoordinateX + ', ' + currentCoordinateY;
};

// Добавляю обработчик на mouseDown
pinMain.addEventListener('mousedown', function (evt) {
  evt.preventDefault();
  pinMain.style.zIndex = 10;

  if (map.classList.length === 2) {
    getStatusPage(false);
  }

  var startCoordinate = {
    x: evt.clientX,
    y: evt.clientY
  };

  // callback mouseMove
  var mouseMoveHandler = function (evtMove) {
    evtMove.preventDefault();

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
    if (currentY >= MIN_Y_COORDINATE - MAIN_HEIGHT_PIN && currentY <= MAX_Y_COORDINATE - MAIN_HEIGHT_PIN) {
      pinMain.style.top = currentY + 'px';
    }
  };

  // callback mouseUp
  var mouseUpHandler = function (evtUp) {
    evtUp.preventDefault();

    pinCoordinate();

    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  // Добавляю обработчики на mouseMove и mouseUp
  document.addEventListener('mousemove', mouseMoveHandler);
  document.addEventListener('mouseup', mouseUpHandler);
});
