'use strict';

var numbers = [1, 2, 3, 4, 5, 6, 7, 8];
var offers = ['palace', 'flat', 'house', 'bungalo'];

var getGenerationPin = function () {
  var arrObj = [];

  numbers.sort(function () {
    return Math.random() - 0.5;
  });

  var randomCoordinate = function (min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
  };

  for (var i = 0; i < numbers.length; i++) {
    var number = String('0') + numbers[i];
    var randOffer = offers[Math.floor(Math.random() * offers.length)];

    var obj = {
      author: {
        avatar: 'img/avatars/user' + number + '.png'
      },
      offer: {
        type: randOffer
      },
      location: {
        x: randomCoordinate(0, document.querySelector('.map').clientWidth),
        y: randomCoordinate(130, 630)
      }
    };
    arrObj.push(obj);
  }

  return arrObj;
};

console.log(getGenerationPin());

var map = document.querySelector('.map');
map.classList.remove('map--faded');
