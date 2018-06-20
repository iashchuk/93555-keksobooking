'use strict';

(function () {

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

  var avatarOptions = {
    PATH: 'img/avatars/user',
    EXTENSION: '.png'
  };

  /**
 * @constant {number}
 */
  var QUANTITY_PINS = 8;


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
    var locationX = window.util.getRandomInRange(locationOptions.x.START, locationOptions.y.FINISH);
    var locationY = window.util.getRandomInRange(locationOptions.x.START, locationOptions.y.FINISH);

    var advertObject = {
      author: {
        avatar: getAvatarLink(index + 1)
      },
      offer: {
        title: offerOptions.TITLES[index],
        address: locationX + ', ' + locationY,
        price: window.util.getRandomInRange(offerOptions.prices.MIN, offerOptions.prices.MAX),
        type: window.util.getRandomElement(offerOptions.TYPES),
        rooms: window.util.getRandomInRange(offerOptions.rooms.MIN, offerOptions.rooms.MAX),
        guests: window.util.getRandomInRange(offerOptions.guests.MIN, offerOptions.guests.MAX),
        checkin: window.util.getRandomElement(offerOptions.TIMES),
        checkout: window.util.getRandomElement(offerOptions.TIMES),
        features: window.util.shuffleElements(offerOptions.FEATURES).slice(window.util.getRandomInRange(0, offerOptions.FEATURES.length)),
        description: '',
        photos: window.util.shuffleElements(offerOptions.PHOTOS)
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

  window.data = {
    getAdvertData: getAdvertData
  };

})();
