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

  // Перечисление значений селекта Цены
  var Price = {
    LOW: 'low',
    MIDDLE: 'middle',
    HIGH: 'high'
  };

  // Проверяем является ли значение "Тип жилья" любым или соответствуем текущему значению
  var getFilterType = function (element) {
    return housingType.value === ANY_OPTION ? true : element.offer.type === housingType.value;
  };

  // Проверяем является ли значение "Цена за ночь" любым или соответствуем текущему значению которое ограничевается диапозоном цен
  var getFilterPrice = function (element) {
    switch (housingPrice.value) {
      case Price.LOW: return element.offer.price <= MIN_PRICE;
      case Price.MIDDLE: return element.offer.price >= MIN_PRICE && element.offer.price <= MAX_PRICE;
      case Price.HIGH: return element.offer.price >= MAX_PRICE;
      default: return true;
    }
  };

  // Проверяем является ли значение "Число комнат" любым или соответствуем текущему значению
  var getFilterRooms = function (element) {
    return housingRooms.value === ANY_OPTION ? true : element.offer.rooms === parseInt(housingRooms.value, 10);
  };

  // Проверяем является ли значение "Число гостей" любым или соответствуем текущему значению
  var getFilterGuests = function (element) {
    return housingGuests.value === ANY_OPTION ? true : element.offer.guests === parseInt(housingGuests.value, 10);
  };

  // Проверяем является ли значение "Дополнительные удобства" выделенным и строим новый массив который соответствует текущему значению
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

  // Фильтруем данные если все фильтры вернули true
  var filterPin = function (data) {
    return data.filter(function (element) {
      return getFilterType(element) && getFilterPrice(element) && getFilterRooms(element) && getFilterGuests(element) && getFilterFeatures(element);
    });
  };

  window.filter = {
    filterPin: filterPin
  };
})();
