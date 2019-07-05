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

  var createCard = function (card) {
    var cloneNode = cardTemplate.cloneNode(true);

    cloneNode.querySelector('img').src = card.author.avatar;
    cloneNode.querySelector('.popup__title').textContent = card.offer.title;
    cloneNode.querySelector('.popup__text--address').textContent = card.offer.address;
    cloneNode.querySelector('.popup__text--price').textContent = card.offer.price + '₽/ночь';
    cloneNode.querySelector('.popup__type').textContent = typeMap[card.offer.type];
    cloneNode.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
    cloneNode.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;

    return cloneNode;
  };

  window.renderCard = function (cards) {
    cards.slice(0, 1).forEach(function (card) {
      return fragment.appendChild(createCard(card));
    });
  };

  return fragment;
})();
