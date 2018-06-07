'use strict';

var AVATAR = [
  'img/avatars/user01.png',
  'img/avatars/user02.png',
  'img/avatars/user03.png',
  'img/avatars/user04.png',
  'img/avatars/user05.png',
  'img/avatars/user06.png',
  'img/avatars/user07.png',
  'img/avatars/user08.png'
];

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
var ADDRESS_X = [300, 900];
var ADDRESS_Y = [130, 630];
var ROOMS = [1, 5];
var GUESTS = [1, 100];
var PRICE = [1000, 1000000];

var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var OBJECT_NUMBER = 8;
var DELETE_FEATURES = 2;

var map = document.querySelector('.map');

var mapContainer = map.querySelector('.map__filters-container');
var mapPins = document.querySelector('.map__pins');

var template = document.querySelector('template');
var mapPin = template.content.querySelector('.map__pin');
var mapCard = template.content.querySelector('.map__card');


var getRandomElement = function (arrayElements) {
  var index = Math.floor(Math.random() * arrayElements.length);
  return arrayElements[index];
};


var getRandomInRange = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};


var getRandomIndex = function (arrayElements) {
  return getRandomInRange(0, arrayElements.length - 1);
};


var getAdvertCard = function () {
  var advertCard = {
    author: {
      avatar: getRandomElement(AVATAR)
    },
    offer: {
      title: getRandomElement(TITLE_TEXT),
      address: getRandomInRange(ADDRESS_X[0], ADDRESS_X[1]) + ', ' + getRandomInRange(ADDRESS_Y[0], ADDRESS_Y[1]),
      price: getRandomInRange(PRICE[0], PRICE[1]),
      type: getRandomElement(TYPE),
      rooms: getRandomInRange(ROOMS[0], ROOMS[1]),
      guests: getRandomInRange(GUESTS[0], GUESTS[1]),
      checkin: getRandomElement(TIMES),
      checkout: getRandomElement(TIMES),
      features: FEATURES,
      description: '',
      photos: PHOTOS
    },
    location: {
      x: getRandomInRange(ADDRESS_X[0], ADDRESS_X[1]),
      y: getRandomInRange(ADDRESS_Y[0], ADDRESS_Y[1])
    },
  };
  return advertCard;
};

var createMapPin = function (element) {
  var pin = mapPin.cloneNode(true);
  var image = pin.querySelector('img');
  var width = image.getAttribute('width');
  var height = image.getAttribute('height');

  pin.style.left = (element.location.x - width / 2) + 'px';
  pin.style.top = (element.location.y - height) + 'px';
  image.src = element.author.avatar;
  image.alt = element.offer.title;

  return pin;
};


var renderAdvertCard = function (element) {
  var cardElement = mapCard.cloneNode(true);

  cardElement.querySelector('.popup__title').textContent = element.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = element.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = element.offer.price + ' ₽/ночь.';
  cardElement.querySelector('.popup__text--capacity').textContent = element.offer.rooms + ' комнаты для ' + element.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + element.offer.checkin + ', выезд до ' + element.offer.checkout;
  cardElement.querySelector('.popup__description').textContent = element.offer.description;
  cardElement.querySelector('.popup__avatar').src = element.author.avatar;

  var cardType = cardElement.querySelector('.popup__type');

  switch (element.offer.type) {
    case ('palace'):
      cardType.textContent = 'Дворец';
      break;
    case ('flat'):
      cardType.textContent = 'Квартира';
      break;
    case ('house'):
      cardType.textContent = 'Дом';
      break;
    case ('bungalo'):
      cardType.textContent = 'Бунгало';
      break;
  }

  var cardPhotos = cardElement.querySelector('.popup__photos');
  var cardPhoto = cardPhotos.querySelector('.popup__photo');

  for (i = 0; i < element.offer.photos.length; i++) {
    cardPhoto = cardPhoto.cloneNode();
    cardPhoto.src = element.offer.photos[i];
    cardPhotos.appendChild(cardPhoto);
  }
  cardPhotos.removeChild(cardPhotos.children[0]);


  var cardFeature = cardElement.querySelector('.popup__features');
  for (i = 0; i < DELETE_FEATURES; i++) {
    cardFeature.removeChild(cardFeature.children[getRandomIndex(element.offer.features)]);
  }

  return cardElement;
};


var renderElements = [];

for (var i = 0; i < OBJECT_NUMBER; i++) {
  renderElements.push(getAdvertCard());
}

var fragment = document.createDocumentFragment();
for (i = 0; i < OBJECT_NUMBER; i++) {
  fragment.appendChild(createMapPin(renderElements[i]));
}

mapPins.appendChild(fragment);
map.classList.remove('map--faded');

fragment.appendChild(renderAdvertCard(renderElements[0]));

map.insertBefore(fragment, mapContainer);
