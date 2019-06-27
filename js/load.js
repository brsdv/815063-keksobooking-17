'use strict';

(function () {
  window.load = function (successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';
    xhr.timeout = 10000;

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
          return successHandler(xhr.response);
        case 403:
          return errorHandler('Доступ запрещен');
        case 404:
          return errorHandler('Страница не найдена');
        case 500:
          return errorHandler('Ошибка сервера');
        default:
          return errorHandler('Ошибка. Статус ответа - ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('timeout', function () {
      errorHandler('Время ответа от сервера превысило ' + xhr.timeout + ' мс');
    });

    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения');
    });

    xhr.open('GET', 'https://js.dump.academy/keksobooking/data');
    xhr.send();
  };
})();
