'use strict';

(function () {
  var cardTemplate = document.querySelector('#card').content;
  var fragment = document.createDocumentFragment();

  // Словарь соответствия названия помещений
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
  var removeElementHandler = function (cloneCard, element) {
    if (element.firstElementChild === null) {
      cloneCard.removeChild(element);
    }
  };

  // Очищаем элемент от чилдов и создаем новые
  var createFeaturesElement = function (clone, features) {
    var parent = clone.querySelector('.popup__features');
    parent.textContent = '';

    features.forEach(function (element) {
      var li = document.createElement('li');
      li.classList.add('popup__feature', featureMap[element]);
      return parent.appendChild(li);
    });

    removeElementHandler(clone.querySelector('.map__card'), parent);
  };

  // Добавляем изображения в карточку из шаблона картинки и удаляем сам шаблон
  var createPhotosElement = function (clone, photos) {
    var parent = clone.querySelector('.popup__photos');
    photos.forEach(function (element) {
      var img = parent.querySelector('img').cloneNode(true);
      img.src = element;
      return parent.appendChild(img);
    });
    parent.removeChild(parent.querySelector('img'));

    removeElementHandler(clone.querySelector('.map__card'), parent);
  };

  // Создаем карточку из шаблона
  var createCard = function (element) {
    var cloneNode = cardTemplate.cloneNode(true);

    cloneNode.querySelector('img').src = element.author.avatar;
    cloneNode.querySelector('.popup__title').textContent = element.offer.title;
    cloneNode.querySelector('.popup__text--address').textContent = element.offer.address;
    cloneNode.querySelector('.popup__text--price').textContent = element.offer.price + '₽/ночь';
    cloneNode.querySelector('.popup__type').textContent = typeMap[element.offer.type];
    cloneNode.querySelector('.popup__text--capacity').textContent = element.offer.rooms + ' комнаты для ' + element.offer.guests + ' гостей';
    cloneNode.querySelector('.popup__text--time').textContent = 'Заезд после ' + element.offer.checkin + ', выезд до ' + element.offer.checkout;
    cloneNode.querySelector('.popup__description').textContent = element.offer.description;

    createFeaturesElement(cloneNode, element.offer.features);
    createPhotosElement(cloneNode, element.offer.photos);

    return cloneNode;
  };

  // Рендерим карточку в Document-fragment
  var renderCard = function (element) {
    fragment.appendChild(createCard(element));
    return fragment;
  };

  // Получаем DOM-элемент карточки объявления
  var getCardElement = function () {
    var cardElement = document.querySelector('.map__card');
    return cardElement;
  };

  // Удаляем карточку если она есть в DOM дереве и обработчик клавишы ESC
  var removeCard = function () {
    if (getCardElement() !== null) {
      window.map.mapSection.removeChild(getCardElement());
      document.removeEventListener('keydown', keydownHandler);
    }
  };

  // Закрываем карточку по клавише ESC
  var keydownHandler = function (evt) {
    window.util.escKeyEvent(evt, closeCardHandler);
  };

  var closeCardHandler = function () {
    window.pin.removeClassActive();
    window.map.mapSection.removeChild(getCardElement());
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
  var openCard = function (element) {
    // Если карточка отрисована, удаляем ее
    if (getCardElement() !== null) {
      window.map.mapSection.removeChild(getCardElement());
    }

    window.map.mapContainer.after(renderCard(element));
    document.addEventListener('keydown', keydownHandler);
    closeCard();
  };

  window.card = {
    removeCard: removeCard,
    openCard: openCard
  };
})();
