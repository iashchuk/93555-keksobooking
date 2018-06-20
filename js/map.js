'use strict';

(function () {

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mapPinMain = map.querySelector('.map__pin--main');
  var mapPinList = [];


  /**
   * Функция отрисовки меток объявлений
   * @param {Array.<Advert>} advertData
   * @return {Node}
  */
  var renderPinFragment = function (advertData) {
    var fragment = document.createDocumentFragment();
    advertData.forEach(function (item) {
      var pin = window.pin.renderMapPin(item);
      fragment.appendChild(pin);
      mapPinList.push(pin);
    });
    return fragment;
  };


  // Перевод страницы в активное состояние
  var activatePage = function () {
    mapPins.appendChild(renderPinFragment(window.data.getAdvertData()));
    map.classList.remove('map--faded');
    window.form.init();
    var pinPosition = window.drag.getMainPinPosition();
    window.drag.getAddressValue(pinPosition);
    mapPinMain.removeEventListener('mousedown', activatePage);
  };


  // Перевод страницы в неактивное состояние
  var deactivatePage = function () {
    map.classList.add('map--faded');
    window.drag.mainPinDefaultPosition();
    window.card.closeActive();
    mapPinList.forEach(function (item) {
      mapPins.removeChild(item);
    });
    mapPinList = [];
    mapPinMain.addEventListener('mousedown', activatePage);
  };


  // Функция инициализации страницы
  var initPage = function () {
    deactivatePage();
    mapPinMain.addEventListener('mouseup', activatePage);
  };

  initPage();

  window.map = {
    deactivatePage: deactivatePage
  };

})();
