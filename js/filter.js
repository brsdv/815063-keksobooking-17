'use strict';

(function () {
  window.filter = function (data) {
    var pinContainer = document.querySelector('.map__pins'); // Контейнер для всех меток
    var form = document.querySelector('.map__filters');
    var type = form.querySelector('#housing-type');

    var filteredData = data;

    var changeTypeHandler = function (value) {
      if (value === 'bungalo') {
        filteredData = data.filter(function (pin) {
          return pin.offer.type === 'bungalo';
        });

        window.getRenderPin(filteredData);
        pinContainer.appendChild(window.render);
      }
    };

    type.addEventListener('change', function (evt) {
      changeTypeHandler(evt.target.value);
    });

    return window.getRenderPin(filteredData);
  };
})();
