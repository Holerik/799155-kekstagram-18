// remote.js
'use strict';

(function () {
  var TIMEOUT_MS = 10000;
  var SERVER_SATUS_OK = 200;

  var urlData = {
    to: 'https://js.dump.academy/kekstagram',
    from: 'https://js.dump.academy/kekstagram/data'
  };

  window.remote = {
    load: function (receivePhotosData, showErrorMessage) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.timeout = TIMEOUT_MS;
      xhr.addEventListener('load', function () {
        if (xhr.status === SERVER_SATUS_OK) {
          receivePhotosData(xhr.response);
        } else {
          showErrorMessage('Статус ответа:' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        showErrorMessage('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        showErrorMessage('Запрос не успел выполниться за ' + xhr.timeout + ' мс');
      });

      xhr.open('GET', urlData.from);
      xhr.send();
    },

    save: function (data, showSuccessMessage, showErrorMessage) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        if (xhr.status === SERVER_SATUS_OK) {
          showSuccessMessage(xhr.response);
        } else {
          showErrorMessage('Статус ответа:' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        showErrorMessage('Произошла ошибка соединения');
      });
      xhr.open('POST', urlData.to);
      xhr.send(data);
      return xhr.readyState;
    }
  };
})();
