'use strict';

(function () {

  var requestData = {
    METHODS: [
      'GET',
      'POST'
    ],
    url: {
      LOAD: 'https://js.dump.academy/keksobooking/data',
      UPLOAD: 'https://js.dump.academy/keksobooking'
    },
    timeout: {
      LOAD: 10000,
      UPLOAD: 5000
    },
    status: {
      OK: 200
    },
    message: {
      ERROR_LOAD: 'Произошла ошибка во время загрузки. Статус ответа: ',
      ERROR_SERVER: 'Произошла ошибка соединения',
      ERROR_TIMEOUT: 'Запрос не успел выполниться за '
    }
  };

  var setupXMLHttpRequest = function (onLoad, onError, url, method, timeout, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === requestData.status.OK) {
        onLoad(xhr.response);
      } else {
        onError(requestData.message.ERROR_LOAD + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError(requestData.message.ERROR_SERVER);
    });

    xhr.addEventListener('timeout', function () {
      onError(requestData.message.ERROR_TIMEOUT + xhr.timeout + 'мс');
    });

    xhr.timeout = timeout;

    xhr.open(method, url);

    if (typeof data !== 'undefined') {
      xhr.send(data);
    } else {
      xhr.send();
    }
  };

  var load = function (onLoad, onError) {
    setupXMLHttpRequest(onLoad, onError, requestData.url.LOAD, requestData.METHODS[0], requestData.timeout.LOAD);
  };

  var upload = function (onLoad, onError, data) {
    setupXMLHttpRequest(onLoad, onError, requestData.url.UPLOAD, requestData.METHODS[1], requestData.timeout.UPLOAD, data);
  };

  window.backend = {
    load: load,
    upload: upload
  };

})();
