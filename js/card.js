'use strict';

(function () {

  var mapCard = document.querySelector('template').content.querySelector('.map__card');
  var map = document.querySelector('.map');
  var mapContainer = map.querySelector('.map__filters-container');
  var activeCard;

  /**
   * @constant {number}
   */
  var ESC_KEYCODE = 27;

  var offerTypesTranslation = {
    flat: 'Квартира',
    palace: 'Дворец',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var photoAtributes = {
    WIDTH: 45,
    HEIGHT: 40,
    ALT: 'Фотография жилья'
  };

  /**
   * Функция получения элемента иконки удобств
   * @param {string} modifierName
   * @return {Node}
   */
  var createFeature = function (modifierName) {
    var feature = document.createElement('li');
    feature.classList.add('popup__feature');
    feature.classList.add('popup__feature--' + modifierName);
    return feature;
  };

  /**
   * Функция получения элемента изображения квартиры
   * @param {string} photoLink
   * @return {Node}
   */
  var createPhoto = function (photoLink) {
    var photo = document.createElement('img');
    photo.classList.add('popup__photo');
    photo.width = photoAtributes.WIDTH;
    photo.height = photoAtributes.HEIGHT;
    photo.alt = photoAtributes.ALT;
    photo.src = photoLink;
    return photo;
  };

  /**
   * Отрисовка карточки объявления
   * @param {Advert} element
   * @return {Node}
   */
  var renderAdvertCard = function (element) {
    var cardElement = mapCard.cloneNode(true);
    var closeCard = cardElement.querySelector('.popup__close');

    cardElement.querySelector('.popup__title').textContent = element.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = element.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = element.offer.price + ' ₽/ночь.';
    cardElement.querySelector('.popup__type').textContent = offerTypesTranslation[element.offer.type];
    cardElement.querySelector('.popup__text--capacity').textContent = element.offer.rooms + ' комнаты для ' + element.offer.guests + ' гостей';
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + element.offer.checkin + ', выезд до ' + element.offer.checkout;
    cardElement.querySelector('.popup__description').textContent = element.offer.description;
    cardElement.querySelector('.popup__avatar').src = element.author.avatar;

    element.offer.features.forEach(function (item) {
      cardElement.querySelector('.popup__features').appendChild(createFeature(item));
    });

    element.offer.photos.forEach(function (item) {
      cardElement.querySelector('.popup__photos').appendChild(createPhoto(item));
    });

    closeCard.addEventListener('click', function () {
      closeActive();
      window.pin.removeActivePin();
    });

    document.addEventListener('keydown', onCardEscPress);

    return cardElement;
  };

    /**
   * Функция открытия карточки
   * @param {Advert} element
   */
  var open = function (element) {
    closeActive();
    activeCard = map.insertBefore(renderAdvertCard(element), mapContainer);
  };


  // Функция закрытия активной карточки
  var closeActive = function () {
    if (activeCard) {
      activeCard.remove();
    }
  };

  // При нажатии кнопки ESC: закрытие карточки и снятие выделения активного пина
  var onCardEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeActive();
      window.pin.removeActivePin();
    }
    document.remove.addEventListener('keydown', onCardEscPress);
  };

  window.card = {
    open: open,
    closeActive: closeActive
  };

})();
