'use strict';

window.card = (function () {
  var cardTemplate = document.querySelector('#card').content;
  var fragment = document.createDocumentFragment();

  var typeMap = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  var featureMap = {
    'wifi': 'popup__feature--wifi',
    'dishwasher': 'popup__feature--dishwasher',
    'parking': 'popup__feature--parking',
    'washer': 'popup__feature--washer',
    'elevator': 'popup__feature--elevator',
    'conditioner': 'popup__feature--conditioner'
  };

  var createFeaturesElement = function (parent, array) {
    parent.textContent = '';

    array.forEach(function (element) {
      var li = document.createElement('li');
      li.classList.add('popup__feature', featureMap[element]);
      return parent.appendChild(li);
    });
  };

  var createPhotosElement = function (parent, array) {
    array.forEach(function (element) {
      var img = parent.querySelector('img').cloneNode(true);
      img.src = element;
      return parent.appendChild(img);
    });

    parent.removeChild(parent.querySelectorAll('img')[0]);
  };

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

    createFeaturesElement(cloneNode.querySelector('.popup__features'), card.offer.features);
    createPhotosElement(cloneNode.querySelector('.popup__photos'), card.offer.photos);

    return cloneNode;
  };

  window.renderCard = function (card) {
    console.log(card);
    fragment.appendChild(createCard(card));
    return fragment;
  };
})();
