// utils.js
'use strict';

(function () {

  var doAction = function (evt, action, process) {
    if (process) {
      action(evt);
    } else {
      action();
    }
  };

  window.utils = {
    DOM_VK: {
      ESC: 0x1B,
      ENTER: 0x0D
    },
    isEscPressed: function (evt, action, process) {
      if (evt.keyCode === this.DOM_VK.esc) {
        doAction(evt, action, process);
      }
    },
    isEnterPressed: function (evt, action, process) {
      if (evt.keyCode === this.DOM_VK.enter) {
        doAction(evt, action, process);
      }
    },
    getRandomIndex: function (upperLimit) {
      return Math.floor(Math.random() * upperLimit);
    }
  };
})();
