'use strict';

window.pin = (function () {
  var WIDTH_PIN = 50; // Ширина пользовательской метки, определяется в CSS
  var HEIGHT_PIN = 70; // Высота пользовательской метки, определяется в CSS

  window.main = document.querySelector('main');
  window.successTemplate = document.querySelector('#success').content; // Шаблон успешной отправки данных
  window.errorTemplate = document.querySelector('#error').content; // Шаблон ошибки
  var fragment = document.createDocumentFragment();
  var pinTemplate = document.querySelector('#pin').content; // Шаблон пина

  // Создает элементы из шоблона пина
  var createPin = function (pin) {
    var pinElement = pinTemplate.cloneNode(true);

    pinElement.querySelector('img').src = pin.author.avatar;
    pinElement.querySelector('img').alt = pin.offer.title;
    pinElement.querySelector('.map__pin').style.left = pin.location.x - WIDTH_PIN / 2 + 'px';
    pinElement.querySelector('.map__pin').style.top = pin.location.y - HEIGHT_PIN + 'px';

    return pinElement;
  };

  // Рендерит 5 элементов в Document-fragment
  var renderPin = function (pins) {
    pins.slice(0, 5).forEach(function (pin) {
      fragment.appendChild(createPin(pin));
    });

    return fragment;
  };

  // Перерисовывает элементы в DOM'е, кроме главного пина
  window.rebuildPin = function (pins) {
    var pinContainer = document.querySelector('.map__pins');
    pinContainer.querySelectorAll('button').forEach(function (element) {
      if (!element.classList.contains('map__pin--main')) {
        pinContainer.removeChild(element);
      }
    });

    pinContainer.appendChild(renderPin(pins));
  };

  var successHandler = function (response) {
    window.data = response;
    renderPin(response);
    window.renderCard(response);
  };

  var errorHandler = function (message) {
    var error = window.errorTemplate.cloneNode(true);
    error.querySelector('.error__message').textContent = message;
    window.main.appendChild(error);

    throw new Error(message);
  };

  window.backend.load(successHandler, errorHandler);

  return fragment;
})();
