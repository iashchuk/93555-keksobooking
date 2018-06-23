'use strict';

(function () {

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mapPinMain = map.querySelector('.map__pin--main');
  var mapPinList = [];


  /**
   * Функция отрисовки меток объявлений
   * @param {Array.<Advert>} advertData
   */
  var onLoadSuccess = function (advertData) {
    var fragment = document.createDocumentFragment();
    advertData.forEach(function (item) {
      var pin = window.pin.render(item);
      fragment.appendChild(pin);
      mapPinList.push(pin);
    });
    mapPins.appendChild(fragment);
  };

  var onLoadError = function (textMessage) {
    window.errorMessage.create(textMessage);
  };


  // Перевод карты в активное состояние
  var activateMap = function () {
    window.backend.load(onLoadSuccess, onLoadError);
    map.classList.remove('map--faded');
    window.form.init();
    var pinPosition = window.mainPin.getPosition();
    window.form.setAddress(pinPosition);
    mapPinMain.removeEventListener('mousedown', activateMap);
  };


  // Перевод карты в неактивное состояние
  var deactivateMap = function () {
    map.classList.add('map--faded');
    window.mainPin.getDefaultPosition();
    window.card.deactivate();
    mapPinList.forEach(function (item) {
      mapPins.removeChild(item);
    });
    mapPinList = [];
    mapPinMain.addEventListener('mousedown', activateMap);
  };

  var initMap = function () {
    window.form.deactivate();
    mapPinMain.addEventListener('mousedown', activateMap);
  };

  initMap();

  window.map = {
    deactivate: deactivateMap
  };

})();
