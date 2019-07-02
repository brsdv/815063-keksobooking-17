'use strict';

(function () {
  var WIDTH_PIN = 50; // Ширина пользовательской метки, определяется в CSS
  var HEIGHT_PIN = 70; // Высота пользовательской метки, определяется в CSS

  window.main = document.querySelector('main');
  window.errorTemplate = document.querySelector('#error').content;
  var fragment = document.createDocumentFragment();
  var pinTemplate = document.querySelector('#pin').content;

  var getCreatePin = function (pin) {
    var pinElement = pinTemplate.cloneNode(true);

    pinElement.querySelector('img').src = pin.author.avatar;
    pinElement.querySelector('img').alt = pin.offer.title;
    pinElement.querySelector('.map__pin').style.left = pin.location.x - WIDTH_PIN / 2 + 'px';
    pinElement.querySelector('.map__pin').style.top = pin.location.y - HEIGHT_PIN + 'px';

    return pinElement;
  };

  window.getRenderPin = function (pins) {
    for (var i = 0; i < pins.length; i++) {
      fragment.appendChild(getCreatePin(pins[i]));
    }
    window.render = fragment;
  };

  var successHandler = function (response) {
    window.filter(response);
  };

  var errorHandler = function (message) {
    var error = window.errorTemplate.cloneNode(true);
    error.querySelector('.error__message').textContent = message;
    window.main.appendChild(error);

    throw new Error(message);
  };

  window.backend.load(successHandler, errorHandler);
})();
