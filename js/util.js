'use strict';

(function () {
  var ESC_KEY = 27; // Код клавишы ESC

  window.util = {
    escKeyEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEY) {
        action();
      }
    }
  };
})();
