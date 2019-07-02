'use strict';

(function () {
  window.filter = function (data) {
    var pinContainer = document.querySelector('.map__pins');
    var form = document.querySelector('.map__filters');
    var type = form.querySelector('#housing-type');

    var filteredData = data;

    var changeTypeHandler = function (value) {
      if (value === 'bungalo') {
        filteredData = data.filter(function (pin) {
          return pin.offer.type === 'bungalo';
        });

        console.log(filteredData);
        return window.getRenderPin(filteredData);
      }
    };

    type.addEventListener('change', function (evt) {
      changeTypeHandler(evt.target.value);
    });

    console.log(filteredData);
    return window.getRenderPin(filteredData);
  };
})();
