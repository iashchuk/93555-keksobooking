'use strict';

(function () {

  var pinSizes = {
    WIDTH: 40,
    HEIGHT: 44
  };
  var mapPin = document.querySelector('template').content.querySelector('.map__pin');
  var activePin;

  /**
   * Функция выделения активного пина
   * @param {Node} pinElement
   */
  var activatePin = function (pinElement) {
    deactivatePin();
    activePin = pinElement;
    activePin.classList.add('map__pin--active');
  };

  // Снятие выделения активного пина
  var deactivatePin = function () {
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
  };

    /**
   * Отрисовка метки объявления
   * @param {Advert} element
   * @return {Node}
   */
  var renderPin = function (element) {
    var pin = mapPin.cloneNode(true);
    var image = pin.querySelector('img');
    var width = pinSizes.WIDTH;
    var height = pinSizes.HEIGHT;

    pin.style.left = (element.location.x - width / 2) + 'px';
    pin.style.top = (element.location.y - height) + 'px';
    image.src = element.author.avatar;
    image.alt = element.offer.title;

    pin.addEventListener('click', function () {
      window.card.open(element);
      activatePin(pin);
    });

    return pin;
  };


  window.pin = {
    render: renderPin,
    deactivate: deactivatePin
  };

})();
