'use strict';

(function () {
  var WIDTH_PIN = 50; // Ширина пользовательской метки, определяется в CSS
  var HEIGHT_PIN = 70; // Высота пользовательской метки, определяется в CSS
  var NUMBER_BEGIN = 0; // Элемент с которого нужно начать обрезать массив
  var NUMBER_END = 5; // Элемент на котором нужно закончить обрезать массив

  var fragment = document.createDocumentFragment();
  var pinTemplate = document.querySelector('#pin').content;

  // Создаем элементы из шаблона пина
  var createPin = function (element) {
    var pinElement = pinTemplate.cloneNode(true);

    pinElement.querySelector('img').src = element.author.avatar;
    pinElement.querySelector('img').alt = element.offer.title;
    pinElement.querySelector('img').dataset.x = element.location.x;
    pinElement.querySelector('img').dataset.y = element.location.y;
    pinElement.querySelector('button').dataset.x = element.location.x;
    pinElement.querySelector('button').dataset.y = element.location.y;
    pinElement.querySelector('.map__pin').style.left = element.location.x - WIDTH_PIN / 2 + 'px';
    pinElement.querySelector('.map__pin').style.top = element.location.y - HEIGHT_PIN + 'px';

    return pinElement;
  };

  // Рендерим 5 элементов в Document-fragment
  var renderPin = function (data) {
    data.slice(NUMBER_BEGIN, NUMBER_END).forEach(function (element) {
      fragment.appendChild(createPin(element));
    });

    return fragment;
  };

  // Перерисовываем элементы в DOM'е, кроме главного пина
  var rebuildPin = function (data) {
    window.map.mapContainer.querySelectorAll('button').forEach(function (element) {
      if (!element.classList.contains('map__pin--main')) {
        window.map.mapContainer.removeChild(element);
      }
    });
    window.map.mapContainer.appendChild(renderPin(data));
  };

  // Удаляем активный класс у пина
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
    } else if (target.tagName.toLowerCase() === 'img') {
      target.parentElement.classList.add('map__pin--active');
    }
  };

  // Удаляем все пользовательские пины которые есть в DOM дереве кроме основного пина
  var removePin = function () {
    var container = document.querySelector('.map__pin--main').parentNode;
    container.querySelectorAll('button').forEach(function (element) {
      if (!element.classList.contains('map__pin--main')) {
        container.removeChild(element);
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
