'use strict';

(function () {
  var WIDTH_PIN = 50; // Ширина пользовательской метки, определяется в CSS
  var HEIGHT_PIN = 70; // Высота пользовательской метки, определяется в CSS

  var fragment = document.createDocumentFragment();
  var pinTemplate = document.querySelector('#pin').content; // Шаблон пина

  // Создает элементы из шаблона пина
  var createPin = function (pin) {
    var pinElement = pinTemplate.cloneNode(true);

    pinElement.querySelector('img').src = pin.author.avatar;
    pinElement.querySelector('img').alt = pin.offer.title;
    pinElement.querySelector('img').dataset.x = pin.location.x;
    pinElement.querySelector('img').dataset.y = pin.location.y;
    pinElement.querySelector('.map__pin').style.left = pin.location.x - WIDTH_PIN / 2 + 'px';
    pinElement.querySelector('.map__pin').style.top = pin.location.y - HEIGHT_PIN + 'px';

    return pinElement;
  };

  // Рендерит 5 элементов в Document-fragment
  window.renderPin = function (pins) {
    pins.slice(0, 5).forEach(function (pin) {
      fragment.appendChild(createPin(pin));
    });

    return fragment;
  };

  // Перерисовывает элементы в DOM'е, кроме главного пина
  window.rebuildPin = function (pins) {
    window.mapPins.querySelectorAll('button').forEach(function (element) {
      if (!element.classList.contains('map__pin--main')) {
        window.mapPins.removeChild(element);
      }
    });

    window.mapPins.appendChild(window.renderPin(pins));
  };

  window.removePin = function () {
    window.mapPins.querySelectorAll('button').forEach(function (element) {
      if (!element.classList.contains('map__pin--main')) {
        window.mapPins.removeChild(element);
      }
    });
  };
})();
