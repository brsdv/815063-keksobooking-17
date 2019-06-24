'use strict';

window.pin = (function () {
  var WIDTH_PIN = 50; // Ширина пользовательской метки, определяется в CSS
  var HEIGHT_PIN = 70; // Высота пользовательской метки, определяется в CSS
  var ALT_TEXT_IMG = 'заголовок объявления';

  // Шаблон DocumentFragment пользовательской метки на карте
  var pinTemplate = document.querySelector('#pin')
    .content;
  var fragment = document.createDocumentFragment();

  var createPin = function (pin) {
    var pinElement = pinTemplate.cloneNode(true);

    pinElement.querySelector('img').src = pin.author.avatar;
    pinElement.querySelector('img').alt = ALT_TEXT_IMG;
    pinElement.querySelector('.map__pin').style.left = pin.location.x - WIDTH_PIN / 2 + 'px';
    pinElement.querySelector('.map__pin').style.top = pin.location.y - HEIGHT_PIN + 'px';

    return pinElement;
  };

  for (var i = 0; i < window.data.length; i++) {
    fragment.appendChild(createPin(window.data[i]));
  }

  return fragment;
})();
