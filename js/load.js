'use strict';

(function () {
  window.backend = {
    load: function (success, error) {
      var xhr = new XMLHttpRequest();

      xhr.responseType = 'json';
      xhr.timeout = 10000;

      xhr.addEventListener('load', function () {
        switch (xhr.status) {
          case 200:
            return success(xhr.response);
          case 403:
            return error('Доступ запрещен');
          case 404:
            return error('Страница не найдена');
          case 500:
            return error('Ошибка сервера');
          default:
            return error('Ошибка. Статус ответа - ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('timeout', function () {
        error('Время ответа от сервера превысило ' + xhr.timeout + ' мс');
      });

      xhr.addEventListener('error', function () {
        error('Произошла ошибка соединения');
      });

      xhr.open('GET', 'https://js.dump.academy/keksobooking/data');
      xhr.send();
    },
    save: function (data, success, error) {
      var xhr = new XMLHttpRequest();

      xhr.responseType = 'json';
      xhr.timeout = 10000;

      xhr.addEventListener('load', function () {
        switch (xhr.status) {
          case 200:
            return success(xhr.response);
          default:
            return error('Статус ответа - ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('timeout', function () {
        error('Время ответа от сервера превысило ' + xhr.timeout + ' мс');
      });

      xhr.addEventListener('error', function () {
        error('Произошла ошибка соединения');
      });

      xhr.open('POST', 'https://js.dump.academy/keksobooking');
      xhr.send(data);
    }
  };
})();
