'use strict';

window.data = (function () {
  window.MIN_Y_COORD = 130; // Минимальная координата Y
  window.MAX_Y_COORD = 630; // Максимальная координата Y

  var map = document.querySelector('.map');

  var numbers = [1, 2, 3, 4, 5, 6, 7, 8];
  var offers = ['palace', 'flat', 'house', 'bungalo'];
  var numbersObj = [];

  // Тасование массива по методу Фишера-Йетса
  var shuffle = function (arr) {
    var j;
    var temp;

    for (var i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
    }

    return arr;
  };

  // Рандомное значение в диапозоне от мин до макс
  var getRandCoord = function (min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
  };

  var randNumbers = shuffle(numbers);

  for (var i = 0; i < randNumbers.length; i++) {
    var leadZero = String('0') + randNumbers[i];
    var randOffer = offers[Math.floor(Math.random() * offers.length)];

    var obj = {
      author: {
        avatar: 'img/avatars/user' + leadZero + '.png'
      },
      offer: {
        type: randOffer
      },
      location: {
        x: getRandCoord(map.clientLeft, map.clientWidth),
        y: getRandCoord(window.MIN_Y_COORD, window.MAX_Y_COORD)
      }
    };

    numbersObj.push(obj);
  }

  return numbersObj;
})();
