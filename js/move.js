'use strict';

var dragLimit = {
  x: {
    MIN: 0
  },
  y: {
    MIN: 130,
    MAX: 630
  }
};


// Функция инициализации страницы
var initPage = function () {
  window.deactivatePage();

  window.mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var mainPinCoords = window.getMainPinPosition();

      if (
        mainPinCoords.y - shift.y >= dragLimit.y.MIN &&
        mainPinCoords.y - shift.y <= dragLimit.y.MAX
      ) {
        window.mapPinMain.style.top = window.mapPinMain.offsetTop - shift.y + 'px';
      }
      if (
        mainPinCoords.x - shift.x >= dragLimit.x.MIN &&
        mainPinCoords.x - shift.x <= window.mapPins.offsetWidth
      ) {
        window.mapPinMain.style.left = window.mapPinMain.offsetLeft - shift.x + 'px';
      }
      window.getAddressValue(mainPinCoords);
    };


    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
};

initPage();
