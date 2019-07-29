'use strict';

(function () {
  var WIDTH_PIN = 50; // Ширина пользовательской метки, определяется в CSS
  var HEIGHT_PIN = 70; // Высота пользовательской метки, определяется в CSS

  var fragment = document.createDocumentFragment();
  var pinTemplate = document.querySelector('#pin').content;

  // Создаем элементы из шаблона пина
  var createPin = function (pin) {
    var pinElement = pinTemplate.cloneNode(true);

    pinElement.querySelector('img').src = pin.author.avatar;
    pinElement.querySelector('img').alt = pin.offer.title;
    pinElement.querySelector('img').dataset.x = pin.location.x;
    pinElement.querySelector('img').dataset.y = pin.location.y;
    pinElement.querySelector('button').dataset.x = pin.location.x;
    pinElement.querySelector('button').dataset.y = pin.location.y;
    pinElement.querySelector('.map__pin').style.left = pin.location.x - WIDTH_PIN / 2 + 'px';
    pinElement.querySelector('.map__pin').style.top = pin.location.y - HEIGHT_PIN + 'px';

    return pinElement;
  };

  // Рендерим 5 элементов в Document-fragment
  var renderPin = function (data) {
    data.slice(0, 5).forEach(function (pin) {
      fragment.appendChild(createPin(pin));
    });

    return fragment;
  };

  // Перерисовываем элементы в DOM'е, кроме главного пина
  var rebuildPin = function (pins) {
    window.map.mapContainer.querySelectorAll('button').forEach(function (element) {
      if (!element.classList.contains('map__pin--main')) {
        window.map.mapContainer.removeChild(element);
      }
    });

    window.map.mapContainer.appendChild(renderPin(pins));
  };

  // Удаляем активный класс у кнопки пина
  var removeClassActive = function () {
    var pinActive = document.querySelector('.map__pin--active');

    if (pinActive !== null) {
      pinActive.classList.remove('map__pin--active');
    }
  };

  // Устанавливаем активный класс кнопке и изображению текущего пина
  var setClassActive = function (target) {
    removeClassActive();

    if (target.className === 'map__pin') {
      target.classList.add('map__pin--active');
    } else if (target.tagName === 'IMG') {
      target.parentElement.classList.add('map__pin--active');
    }
  };

  // Удаляем все пользовательские пины которые есть в DOM дереве кроме основного пина
  var removePin = function () {
    document.querySelector('.map__pins').querySelectorAll('button').forEach(function (element) {
      if (!element.classList.contains('map__pin--main')) {
        document.querySelector('.map__pins').removeChild(element);
      }
    });
  };

  window.pin = {
    renderPin: renderPin,
    rebuildPin: rebuildPin,
    removeClassActive: removeClassActive,
    setClassActive: setClassActive,
    removePin: removePin
  };
})();
