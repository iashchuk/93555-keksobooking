'use strict';

var offerOptions = {

  TITLES: [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ],
  TYPES: [
    'palace',
    'flat',
    'house',
    'bungalo'
  ],
  TIMES: [
    '12:00',
    '13:00',
    '14:00'
  ],
  FEATURES: [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ],

  PHOTOS: [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ],

  rooms: {
    MIN: 1,
    MAX: 5
  },

  guests: {
    MIN: 1,
    MAX: 50
  },

  prices: {
    MIN: 1000,
    MAX: 1000000
  }
};

var locationOptions = {
  x: {
    START: 300,
    FINISH: 900
  },
  y: {
    START: 130,
    FINISH: 630
  }
};

var pinSizes = {
  width: 40,
  height: 44
};


var avatarOptions = {
  PATH: 'img/avatars/user',
  EXTENSION: '.png'
};

var offerTypesTranslation = {
  flat: 'Квартира',
  palace: 'Дворец',
  house: 'Дом',
  bungalo: 'Бунгало'
};

var QUANTITY_PINS = 8;

var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
var mapCard = document.querySelector('template').content.querySelector('.map__card');
var photoTemplate = document.querySelector('template').content.querySelector('.popup__photo');
var mapPin = document.querySelector('template').content.querySelector('.map__pin');


var getRandomElement = function (arrayElements) {
  var index = Math.floor(Math.random() * arrayElements.length);
  return arrayElements[index];
};

var getRandomInRange = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var shuffleElements = function (arrayElements) {
  for (var i = arrayElements.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arrayElements[j];
    arrayElements[j] = arrayElements[i];
    arrayElements[i] = temp;
  }
  return arrayElements;
};

/**
 * Функция получения ссылки на аватар
 * @param {number} numberPhoto
 * @return {string}
 */
var getAvatarLink = function (numberPhoto) {
  var index = numberPhoto > 9 ? numberPhoto : '0' + numberPhoto;
  return avatarOptions.PATH + index + avatarOptions.EXTENSION;
};

/**
 * Функция генерации данных для объявления
 * @param {number} index
 * @return {Advert}
 */
var getAdvertObject = function (index) {
  var locationX = getRandomInRange(locationOptions.x.START, locationOptions.y.FINISH);
  var locationY = getRandomInRange(locationOptions.x.START, locationOptions.y.FINISH);

  var advertObject = {
    author: {
      avatar: getAvatarLink(index + 1)
    },
    offer: {
      title: offerOptions.TITLES[index],
      address: locationX + ', ' + locationY,
      price: getRandomInRange(offerOptions.prices.MIN, offerOptions.prices.MAX),
      type: getRandomElement(offerOptions.TYPES),
      rooms: getRandomInRange(offerOptions.rooms.MIN, offerOptions.rooms.MAX),
      guests: getRandomInRange(offerOptions.guests.MIN, offerOptions.guests.MAX),
      checkin: getRandomElement(offerOptions.TIMES),
      checkout: getRandomElement(offerOptions.TIMES),
      features: shuffleElements(offerOptions.FEATURES).slice(getRandomInRange(0, offerOptions.FEATURES.length)),
      description: '',
      photos: shuffleElements(offerOptions.PHOTOS)
    },
    location: {
      x: locationX,
      y: locationY
    }
  };
  return advertObject;
};

/**
 * @typedef {Object} Advert
 * @property {AvatarOptions}
 * @property {OfferOptions}
 * @property {LocationOptions}
 */

/**
 * @typedef {Object} AvatarOptions
 * @property {string} avatar
 */

/**
 * @typedef {Object} OfferOptions
 * @property {string} title
 * @property {string} adress
 * @property {number} price
 * @property {number} rooms
 * @property {number} guests
 * @property {string} checkin
 * @property {string} checkout
 * @property {Array.<string>} features
 * @property {string} description
 * @property {Array.<string>} photos
 */

/**
 * @typedef {Object} LocationOptions
 * @property {string} x
 * @property {string} y
 */

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
  var photo = photoTemplate.cloneNode();
  photo.src = photoLink;
  return photo;
};

/**
 * Отрисовка метки объявления
 * @param {Advert} element
 * @return {Node}
 */
var renderMapPin = function (element) {
  var pin = mapPin.cloneNode(true);
  var image = pin.querySelector('img');
  var width = pinSizes.width;
  var height = pinSizes.height;

  pin.style.left = (element.location.x - width / 2) + 'px';
  pin.style.top = (element.location.y - height) + 'px';
  image.src = element.author.avatar;
  image.alt = element.offer.title;

  return pin;
};

/**
 * Отрисовка карточки объявления
 * @param {Advert} element
 * @return {Node}
 */
var renderAdvertCard = function (element) {
  var cardElement = mapCard.cloneNode(true);
  var cardPhotos = cardElement.querySelector('.popup__photos');

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
  cardPhotos.removeChild(cardPhotos.children[0]);

  return cardElement;
};

/**
 * Функция получения массива данных по объявлениям
 * @return {Array}
*/
var getAdvertData = function () {
  var advertData = [];

  for (var i = 0; i < QUANTITY_PINS; i++) {
    advertData.push(getAdvertObject(i));
  }
  return advertData;
};

/**
 * Функция отрисовки меток объявлений
 * @param {Advert} element
 * @return {Node}
*/
var renderPinFragment = function (element) {
  var fragment = document.createDocumentFragment();
  element.forEach(function (item) {
    fragment.appendChild(renderMapPin(item));
  });
  return fragment;
};

/**
 * Функция инициилизации карты объявлений
*/
var initPage = function () {
  map.classList.remove('map--faded');
  var advertList = getAdvertData();
  mapPins.appendChild(renderPinFragment(advertList));
  var advertCardRender = renderAdvertCard(advertList[0]);
  map.insertBefore(advertCardRender, map.querySelector('.map__filters-container'));
};


initPage();
