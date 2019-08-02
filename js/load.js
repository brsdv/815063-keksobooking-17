'use strict';

(function () {
  var TIMEOUT = 10000; // Таймер в мс

  // Перечисление http ошибок
  var Code = {
    SUCCESS: 200,
    MOVED_PERMANENTLY: 301,
    CACHED: 302,
    BAD_REQUEST: 400,
    FORBIDDEN: 403,
    NOT_FOUND_ERROR: 404,
    SERVER_ERROR: 500
  };

  window.backend = {
    load: function (success, error) {
      var xhr = new XMLHttpRequest();

      xhr.responseType = 'json';
      xhr.timeout = TIMEOUT;

      xhr.addEventListener('load', function () {
        switch (xhr.status) {
          case Code.SUCCESS:
            return success(xhr.response);
          case Code.MOVED_PERMANENTLY:
            return error('Запрашиваемый документ был окончательно перенесен на новый URL');
          case Code.CACHED:
            return error('Запрашиваемый документ временно доступен по другому URL');
          case Code.BAD_REQUEST:
            return error('Плохой запрос');
          case Code.FORBIDDEN:
            return error('Доступ запрещен');
          case Code.NOT_FOUND_ERROR:
            return error('Страница не найдена');
          case Code.SERVER_ERROR:
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
      xhr.timeout = TIMEOUT;

      xhr.addEventListener('load', function () {
        switch (xhr.status) {
          case Code.SUCCESS:
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
