'use strict';

(function () {

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mapPinMain = map.querySelector('.map__pin--main');
  var mapPinList = [];

  /**
 * @constant {number}
 */
  var QUANTITY_PINS = 8;

  /**
   * Функция получения массива данных по объявлениям
   * @return {Array.<Advert>}
  */
  var getAdvertData = function () {
    var advertData = [];

    for (var i = 0; i < QUANTITY_PINS; i++) {
      advertData.push(window.data.getAdvert(i));
    }
    return advertData;
  };

  /**
   * Функция отрисовки меток объявлений
   * @param {Array.<Advert>} advertData
   * @return {Node}
  */
  var renderPinFragment = function (advertData) {
    var fragment = document.createDocumentFragment();
    advertData.forEach(function (item) {
      var pin = window.pin.render(item);
      fragment.appendChild(pin);
      mapPinList.push(pin);
    });
    return fragment;
  };


  // Перевод карты в активное состояние
  var activateMap = function () {
    mapPins.appendChild(renderPinFragment(getAdvertData()));
    map.classList.remove('map--faded');
    window.form.init();
    var pinPosition = window.mainPin.getPosition();
    window.form.getAddressValue(pinPosition);
    mapPinMain.removeEventListener('mousedown', activateMap);
  };


  // Перевод карты в неактивное состояние
  var deactivateMap = function () {
    map.classList.add('map--faded');
    window.mainPin.getDefaultPosition();
    window.card.closeActive();
    mapPinList.forEach(function (item) {
      mapPins.removeChild(item);
    });
    mapPinList = [];
    mapPinMain.addEventListener('mousedown', activateMap);
  };

  var initMap = function () {
    mapPinMain.addEventListener('mousedown', activateMap);
  };

  initMap();

  window.map = {
    deactivate: deactivateMap
  };

})();
