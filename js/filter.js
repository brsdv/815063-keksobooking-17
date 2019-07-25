'use strict';

(function () {
  var MIN_PRICE = 10000; // Минимальное значение фильтра Цены
  var MAX_PRICE = 50000; // Максимальное значение фильтра Цены
  var ANY_OPTION = 'any'; // Опция любого кол-ва или значения в селектах

  var housingType = document.querySelector('#housing-type');
  var housingPrice = document.querySelector('#housing-price');
  var housingRooms = document.querySelector('#housing-rooms');
  var housingGuests = document.querySelector('#housing-guests');
  var housingFeatures = document.querySelectorAll('.map__features input');

  var Price = {
    LOW: 'low',
    MIDDLE: 'middle',
    HIGH: 'high'
  };

  var getFilterType = function (element) {
    return housingType.value === ANY_OPTION ? true : element.offer.type === housingType.value;
  };

  var getFilterPrice = function (element) {
    switch (housingPrice.value) {
      case Price.LOW: return element.offer.price <= MIN_PRICE;
      case Price.MIDDLE: return element.offer.price >= MIN_PRICE && element.offer.price <= MAX_PRICE;
      case Price.HIGH: return element.offer.price >= MAX_PRICE;
      default: return true;
    }
  };

  var getFilterRooms = function (element) {
    return housingRooms.value === ANY_OPTION ? true : element.offer.rooms === parseInt(housingRooms.value, 10);
  };

  var getFilterGuests = function (element) {
    return housingGuests.value === ANY_OPTION ? true : element.offer.guests === parseInt(housingGuests.value, 10);
  };

  var getFilterFeatures = function (element) {
    var checkedElement = Array.from(housingFeatures).filter(function (input) {
      return input.checked;
    }).map(function (input) {
      return input.value;
    });

    return checkedElement.every(function (value) {
      return element.offer.features.indexOf(value) !== -1;
    });
  };

  window.filterPin = function (data) {
    return data.filter(function (element) {
      return getFilterType(element) && getFilterPrice(element) && getFilterRooms(element) && getFilterGuests(element) && getFilterFeatures(element);
    });
  };
})();
