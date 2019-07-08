'use strict';

window.pin = (function () {
  var WIDTH_PIN = 50; // Ширина пользовательской метки, определяется в CSS
  var HEIGHT_PIN = 70; // Высота пользовательской метки, определяется в CSS

  window.main = document.querySelector('main');
  window.successTemplate = document.querySelector('#success').content; // Шаблон успешной отправки данных
  window.errorTemplate = document.querySelector('#error').content; // Шаблон ошибки
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
  var renderPin = function (pins) {
    window.lastFive = pins.slice(0, 5);

    window.lastFive.forEach(function (pin) {
      fragment.appendChild(createPin(pin));
    });

    return fragment;
  };

  // Перерисовывает элементы в DOM'е, кроме главного пина
  window.rebuildPin = function (pins) {
    window.pinContainer.querySelectorAll('button').forEach(function (element) {
      if (!element.classList.contains('map__pin--main')) {
        window.pinContainer.removeChild(element);
      }
    });

    window.pinContainer.appendChild(renderPin(pins));
  };

  var successHandler = function (response) {
    window.data = response;
    renderPin(response);
  };

  var errorHandler = function (message) {
    var error = window.errorTemplate.cloneNode(true);
    error.querySelector('.error__message').textContent = message;
    window.main.appendChild(error);

    var errorButton = window.main.querySelector('.error');
    errorButton.addEventListener('click', function () {
      window.main.removeChild(errorButton);

    });

    throw new Error(message);
  };

  window.backend.load(successHandler, errorHandler);

  return fragment;
})();
