'use strict';

(function () {
  var MIN_PRICE = 10000; // Минимальное значение фильтра Цены
  var MAX_PRICE = 50000; // Максимальное значение фильтра Цены
  var ANY_OPTION = 'any'; // Опция любого кол-ва или значения в селектах

  var form = document.querySelector('.map__filters'); // Форма всех фильтров на карте
  var housingType = form.querySelector('#housing-type');
  var housingPrice = form.querySelector('#housing-price');
  var housingRooms = form.querySelector('#housing-rooms');
  var housingGuests = form.querySelector('#housing-guests');
  var housingFeatures = form.querySelectorAll('.map__features input');

  // Перечисление значений селекта Цены
  var PriceName = {
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
      case PriceName.LOW: return element.offer.price <= MIN_PRICE;
      case PriceName.MIDDLE: return element.offer.price >= MIN_PRICE && element.offer.price <= MAX_PRICE;
      case PriceName.HIGH: return element.offer.price >= MAX_PRICE;
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
    var checkedElement = [].slice.call(housingFeatures).filter(function (input) {
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
    form: form,
    filterPin: filterPin
  };
})();
