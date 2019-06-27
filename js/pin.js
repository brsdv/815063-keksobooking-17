'use strict';

window.pin = (function () {
  var WIDTH_PIN = 50; // Ширина пользовательской метки, определяется в CSS
  var HEIGHT_PIN = 70; // Высота пользовательской метки, определяется в CSS

  var fragment = document.createDocumentFragment();
  var pinTemplate = document.querySelector('#pin')
    .content;
  var errorTemplate = document.querySelector('#error')
    .content;

  var getCreatePin = function (pin) {
    var pinElement = pinTemplate.cloneNode(true);

    pinElement.querySelector('img').src = pin.author.avatar;
    pinElement.querySelector('img').alt = pin.offer.title;
    pinElement.querySelector('.map__pin').style.left = pin.location.x - WIDTH_PIN / 2 + 'px';
    pinElement.querySelector('.map__pin').style.top = pin.location.y - HEIGHT_PIN + 'px';

    return pinElement;
  };

  var successHandler = function (response) {
    for (var i = 0; i < response.length; i++) {
      var currentPin = getCreatePin(response[i]);
      fragment.appendChild(currentPin);
    }
  };

  var errorHandler = function (message) {
    var main = document.querySelector('main');
    var error = errorTemplate.cloneNode(true);

    error.querySelector('.error__message').textContent = message;
    main.appendChild(error);

    throw new Error(message);
  };

  window.load(successHandler, errorHandler);

  return fragment;
})();
