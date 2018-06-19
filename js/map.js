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
  WIDTH: 40,
  HEIGHT: 44
};

var mainPinSizes = {
  WIDTH: 65,
  HEIGHT: 84
};

var mainPinStartCoords = {
  x: '570px',
  y: '375px'
};

var photoAtributes = {
  WIDTH: 45,
  HEIGHT: 40,
  ALT: 'Фотография жилья'
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

/**
 * @constant {number}
 */
var QUANTITY_PINS = 8;

/**
 * @constant {number}
 */
var ESC_KEYCODE = 27;

var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
var mapCard = document.querySelector('template').content.querySelector('.map__card');
var mapPin = document.querySelector('template').content.querySelector('.map__pin');
var mapContainer = map.querySelector('.map__filters-container');
var form = document.querySelector('.ad-form');
var fieldsets = form.querySelectorAll('fieldset');
var mapPinMain = map.querySelector('.map__pin--main');
var addressInput = form.querySelector('#address');
var activePin;
var activeCard;
var mapPinList = [];

/**
 * Функция получения случайного элемента массива
 * @param {Array} arrayElements
 * @return {*}
 */
var getRandomElement = function (arrayElements) {
  var index = Math.floor(Math.random() * arrayElements.length);
  return arrayElements[index];
};

/**
 * Функция получения случайного числа в интервале заданных чисел
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
var getRandomInRange = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

/**
 * Функция тасования массива по алгоритму Фишера-Йетса
 * @param {Array} arrayElements
 * @return {Array}
 */
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
 * @property {Avatar}
 * @property {Offer}
 * @property {Location}
 */

/**
 * @typedef {Object} Avatar
 * @property {string} avatar
 */

/**
 * @typedef {Object} Offer
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
 * @typedef {Object} Location
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
  var photo = document.createElement('img');
  photo.classList.add('popup__photo');
  photo.width = photoAtributes.WIDTH;
  photo.height = photoAtributes.HEIGHT;
  photo.alt = photoAtributes.ALT;
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
  var width = pinSizes.WIDTH;
  var height = pinSizes.HEIGHT;

  pin.style.left = (element.location.x - width / 2) + 'px';
  pin.style.top = (element.location.y - height) + 'px';
  image.src = element.author.avatar;
  image.alt = element.offer.title;

  pin.addEventListener('click', function () {
    openCard(element);
    activatePin(pin);
  });

  mapPinList.push(pin);

  return pin;
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
    closeActiveCard();
    removeActivePin();
  });

  document.addEventListener('keydown', onCardEscPress);

  return cardElement;
};

/**
 * Функция получения массива данных по объявлениям
 * @return {Array.<Advert>}
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
 * @param {Array.<Advert>} advertData
 * @return {Node}
*/
var renderPinFragment = function (advertData) {
  var fragment = document.createDocumentFragment();
  advertData.forEach(function (item) {
    fragment.appendChild(renderMapPin(item));
  });
  return fragment;
};

/**
 * Получаем координаты главного пина
 * @return {Location}
 */
var getMainPinPosition = function () {
  var mainPinPosition = {
    x: mapPinMain.offsetLeft + mainPinSizes.WIDTH / 2,
    y: mapPinMain.offsetTop + mainPinSizes.HEIGHT
  };
  return mainPinPosition;
};

/**
 * Записываем полученные координаты в инпут
 * @param {Location} position
 */
var getAddressValue = function (position) {
  addressInput.value = position.x + ', ' + position.y;
};


/**
 * Функция открытия карточки
 * @param {Advert} element
 */
var openCard = function (element) {
  closeActiveCard();
  activeCard = map.insertBefore(renderAdvertCard(element), mapContainer);
};

// Функция закрытия активной карточки
var closeActiveCard = function () {
  if (activeCard) {
    activeCard.remove();
  }
};

// При нажатии кнопки ESC: закрытие карточки и снятие выделения активного пина
var onCardEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeActiveCard();
    removeActivePin();
  }
  document.remove.addEventListener('keydown', onCardEscPress);
};

/**
 * Функция выделения активного пина
 * @param {Node} pinElement
 */
var activatePin = function (pinElement) {
  removeActivePin();
  activePin = pinElement;
  activePin.classList.add('map__pin--active');
};

// Снятие выделения активного пина
var removeActivePin = function () {
  if (activePin) {
    activePin.classList.remove('map__pin--active');
  }
};


// Перевод страницы в активное состояние
var activatePage = function () {
  var advertList = getAdvertData();
  mapPins.appendChild(renderPinFragment(advertList));
  map.classList.remove('map--faded');
  form.classList.remove('ad-form--disabled');
  fieldsets.forEach(function (item) {
    item.disabled = false;
  });
  getAddressValue(getMainPinPosition());
  mapPinMain.removeEventListener('mousedown', activatePage);
  window.onRoomInputChange();

  form.addEventListener('invalid', function (evt) {
    window.markInvalidInput(evt.target);
  }, true);
};

// Перевод страницы в неактивное состояние
window.deactivatePage = function () {
  map.classList.add('map--faded');
  form.classList.add('ad-form--disabled');
  fieldsets.forEach(function (item) {
    item.disabled = true;
  });

  mapPinMain.style.left = mainPinStartCoords.x;
  mapPinMain.style.top = mainPinStartCoords.y;

  getAddressValue(getMainPinPosition());

  if (openCard) {
    closeActiveCard();
  }

  mapPinList.forEach(function (item) {
    mapPins.removeChild(item);
  });
  mapPinList = [];
  mapPinMain.addEventListener('mousedown', activatePage);
};
