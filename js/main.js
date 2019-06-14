'use strict';

var MIN_Y_COORDINATE = 130; // Минимальная координата Y метки на карте
var MAX_Y_COORDINATE = 630; // Максимальная координата Y метки на карте
var WIDTH_PIN = 50; // Ширина метки, определяется в CSS
var HEIGHT_PIN = 70; // Высота метки, определяется в CSS
var ALT_TEXT_IMG = 'заголовок объявления';

var numbers = [1, 2, 3, 4, 5, 6, 7, 8];
var offers = ['palace', 'flat', 'house', 'bungalo'];

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var mapPinContainer = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin')
  .content;

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
    var queryMap = document.querySelector('.map');

    var obj = {
      author: {
        avatar: 'img/avatars/user' + leadZero + '.png'
      },
      offer: {
        type: randomOffer
      },
      location: {
        x: randomCoordinate(queryMap.clientLeft, queryMap.clientWidth),
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

mapPinContainer.appendChild(renderPin());
