'use strict';

(function () {
  var cardTemplate = document.querySelector('#card').content;
  var fragment = document.createDocumentFragment();

  // Словарь соответствия названия помещений и их топом
  var typeMap = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  // Словарь соответствия удобств и их классов для разметки
  var featureMap = {
    'wifi': 'popup__feature--wifi',
    'dishwasher': 'popup__feature--dishwasher',
    'parking': 'popup__feature--parking',
    'washer': 'popup__feature--washer',
    'elevator': 'popup__feature--elevator',
    'conditioner': 'popup__feature--conditioner'
  };

  // Удаляем контейнер если внутри него нет элементов
  var removeElementHandler = function (card, element) {
    if (element.childElementCount === 0) {
      card.removeChild(element);
    }
  };

  // Очищаем элемент от чилдов и создаем новые
  var createFeaturesElement = function (clone, array) {
    var parent = clone.querySelector('.popup__features');
    parent.textContent = '';

    array.forEach(function (element) {
      var li = document.createElement('li');
      li.classList.add('popup__feature', featureMap[element]);
      return parent.appendChild(li);
    });

    removeElementHandler(clone.querySelector('.map__card'), parent);
  };

  // Добавляем изображения в карточку из шаблона картинки и удаляем сам шаблон
  var createPhotosElement = function (clone, array) {
    var parent = clone.querySelector('.popup__photos');
    array.forEach(function (element) {
      var img = parent.querySelector('img').cloneNode(true);
      img.src = element;
      return parent.appendChild(img);
    });
    parent.removeChild(parent.querySelectorAll('img')[0]);

    removeElementHandler(clone.querySelector('.map__card'), parent);
  };

  // Создаем карточку из шаблона
  var createCard = function (card) {
    var cloneNode = cardTemplate.cloneNode(true);

    cloneNode.querySelector('img').src = card.author.avatar;
    cloneNode.querySelector('.popup__title').textContent = card.offer.title;
    cloneNode.querySelector('.popup__text--address').textContent = card.offer.address;
    cloneNode.querySelector('.popup__text--price').textContent = card.offer.price + '₽/ночь';
    cloneNode.querySelector('.popup__type').textContent = typeMap[card.offer.type];
    cloneNode.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
    cloneNode.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;
    cloneNode.querySelector('.popup__description').textContent = card.offer.description;

    createFeaturesElement(cloneNode, card.offer.features);
    createPhotosElement(cloneNode, card.offer.photos);

    return cloneNode;
  };

  // Рендерим карточку в Document-fragment
  var renderCard = function (card) {
    fragment.appendChild(createCard(card));
    return fragment;
  };

  // Удаляем карточку если она есть в DOM дереве и обработчик клавишы ESC
  var removeCard = function () {
    var cardPopup = document.querySelector('.map__card');

    if (cardPopup !== null) {
      window.map.mapSection.removeChild(cardPopup);
      document.removeEventListener('keydown', keydownHandler);
    }
  };

  // Закрываем карточку по клавише ESC
  var keydownHandler = function (evt) {
    window.util.escKeyEvent(evt, closeCardHandler);
  };

  var closeCardHandler = function () {
    window.pin.removeClassActive();
    window.map.mapSection.removeChild(document.querySelector('.map__card'));
    document.removeEventListener('keydown', keydownHandler);
  };

  // Закрываем карточку объявления при клике
  var closeCard = function () {
    var closeElement = document.querySelector('.popup__close');
    closeElement.addEventListener('click', function () {
      closeCardHandler();
    });
  };

  // Рендерим карточку объявления
  var openCard = function (pin) {
    var cardPopup = document.querySelector('.map__card');

    // Если карточка отрисована, удаляем ее
    if (cardPopup !== null) {
      window.map.mapSection.removeChild(cardPopup);
    }

    window.map.mapContainer.after(renderCard(pin));
    document.addEventListener('keydown', keydownHandler);
    closeCard();
  };

  window.card = {
    removeCard: removeCard,
    openCard: openCard
  };
})();
