'use strict';

var avatar = {
  PATH: 'img/avatars/user',
  EXTENSION: '.png'
};

var TITLE_TEXT = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var TYPE = ['palace', 'flat', 'house', 'bungalo'];

var offerTypesTranslation = {
  flat: 'Квартира',
  palace: 'Дворец',
  house: 'Дом',
  bungalo: 'Бунгало'
};


var ADDRESS_X = {
  start: 300,
  finish: 900
};
var ADDRESS_Y = {
  start: 130,
  finish: 630
};
var ROOMS = {
  min: 1,
  max: 5
};
var GUESTS = {
  min: 1,
  max: 50
};
var PRICE = {
  min: 1000,
  max: 1000000
};

var pinSizes = {
  width: 40,
  height: 44
};

var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var OBJECT_NUMBER = 8;

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
  return avatar.PATH + index + avatar.EXTENSION;
};

/**
 * Функция генерации данных для объявления
 * @param {number} index
 * @return {Object}
 */
var getAdvertCard = function (index) {
  var locationX = getRandomInRange(ADDRESS_X.start, ADDRESS_X.finish);
  var locationY = getRandomInRange(ADDRESS_Y.start, ADDRESS_Y.finish);

  var advertCard = {
    author: {
      avatar: getAvatarLink(++index)
    },
    offer: {
      title: TITLE_TEXT[index],
      address: locationX + ', ' + locationY,
      price: getRandomInRange(PRICE.min, PRICE.max),
      type: getRandomElement(TYPE),
      rooms: getRandomInRange(ROOMS.min, ROOMS.max),
      guests: getRandomInRange(GUESTS.min, GUESTS.max),
      checkin: getRandomElement(TIMES),
      checkout: getRandomElement(TIMES),
      features: shuffleElements(FEATURES).slice(getRandomInRange(0, FEATURES.length)),
      description: '',
      photos: shuffleElements(PHOTOS)
    },
    location: {
      x: locationX,
      y: locationY
    }
  };
  return advertCard;
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
  var photoTemplate = document.querySelector('template').content.querySelector('.popup__photo');
  var photo = photoTemplate.cloneNode();
  photo.src = photoLink;
  return photo;
};

/**
 * Отрисовка метки объявления
 * @param {Object} element
 * @return {Node}
 */
var renderMapPin = function (element) {
  var mapPin = document.querySelector('template').content.querySelector('.map__pin');
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
 * @param {Object} element
 * @return {Node}
 */
var renderAdvertCard = function (element) {
  var mapCard = document.querySelector('template').content.querySelector('.map__card');
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

  var featureFragment = document.createDocumentFragment();
  element.offer.features.forEach(function (item) {
    featureFragment.appendChild(createFeature(item));
  });
  cardElement.querySelector('.popup__features').appendChild(featureFragment);

  var photoFragment = document.createDocumentFragment();
  element.offer.photos.forEach(function (item) {
    photoFragment.appendChild(createPhoto(item));
  });
  cardPhotos.removeChild(cardPhotos.children[0]);
  cardElement.querySelector('.popup__photos').appendChild(photoFragment);

  return cardElement;
};

/**
 * Функция отрисовки объектов карты объявлений в необходимом количестве
 * @return {Node}
 */
var renderMapFragment = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < OBJECT_NUMBER; i++) {
    fragment.appendChild(renderMapPin(getAdvertCard(i)));
  }
  fragment.appendChild(renderAdvertCard(getAdvertCard(0)));
  return fragment;
};

/**
 * Функция инициилизации карты
 */
var initPage = function () {
  var map = document.querySelector('.map');
  map.classList.remove('map--faded');
  var mapFiltersContainer = map.querySelector('.map__filters-container');
  map.insertBefore(renderMapFragment(), mapFiltersContainer);
};


initPage();
