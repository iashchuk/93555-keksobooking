'use strict';

(function () {

  var map = document.querySelector('.map');
  var mapPinMain = map.querySelector('.map__pin--main');
  var mapPins = map.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  var mapPinList = [];


  var createMapPins = function (advertData) {
    advertData.forEach(function (item) {
      var pin = window.pin.render(item);
      fragment.appendChild(pin);
      mapPinList.push(pin);
    });
    mapPins.appendChild(fragment);
  };

  var removeMapPins = function () {
    mapPinList.forEach(function (item) {
      mapPins.removeChild(item);
    });
    mapPinList = [];
  };

  /**
   * Функция отрисовки меток объявлений
   * @param {Array.<Advert>} advertData
   */
  var onLoadSuccess = function (advertData) {
    createMapPins(window.filter.activate(advertData));
  };


  var onLoadError = function (textMessage) {
    window.errorMessage.create(textMessage);
  };


  // Перевод карты в активное состояние
  var activateMap = function () {
    window.backend.load(onLoadSuccess, onLoadError);
    map.classList.remove('map--faded');
    window.form.init();
    mapPinMain.removeEventListener('mousedown', activateMap);
  };


  // Перевод карты в неактивное состояние
  var deactivateMap = function () {
    map.classList.add('map--faded');
    window.mainPin.getDefaultPosition();
    window.card.deactivate();
    window.filter.deactivate();
    removeMapPins();
    mapPinMain.addEventListener('mousedown', activateMap);
  };

  var initMap = function () {
    window.form.deactivate();
    window.form.setAddress(window.mainPin.getPosition());
    mapPinMain.addEventListener('mousedown', activateMap);
  };

  initMap();

  window.map = {
    deactivate: deactivateMap,
    create: createMapPins,
    remove: removeMapPins
  };

})();
