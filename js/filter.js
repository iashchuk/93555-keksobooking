'use strict';

(function () {

  /**
   * @constant {number}
   */
  var SHOW_ADS = 5;

  /**
   * @enum {number}
   */
  var Price = {
    START_RANGE: 10000,
    FINISH_RANGE: 50000
  };

  var filter = document.querySelector('.map__filters');
  var type = filter.querySelector('#housing-type');
  var price = filter.querySelector('#housing-price');
  var rooms = filter.querySelector('#housing-rooms');
  var guests = filter.querySelector('#housing-guests');
  var features = filter.querySelectorAll('.map__checkbox');
  var loadAds = [];
  var filteredAds = [];

  var PriceRange = {
    'any': function () {
      return true;
    },
    'low': function (value) {
      return value < Price.START_RANGE;
    },
    'middle': function (value) {
      return value >= Price.START_RANGE && value <= Price.FINISH_RANGE;
    },
    'high': function (value) {
      return value > Price.FINISH_RANGE;
    }
  };

  /** Фильтрация по типу жилья / числу комнат / числу гостей
    * @param {Node} select
    * @param {string} property
    * @return {boolean}
    */
  var onFilterSelectChange = function (select, property) {
    return function (element) {
      if (select[select.selectedIndex].value === 'any') {
        return true;
      }
      return element.offer[property].toString() === select[select.selectedIndex].value;
    };
  };

    /** Фильтрация по цене
    * @param {Node} element
    * @return {boolean}
    */
  var onFilterPriceChange = function (element) {
    if (price[price.selectedIndex].value === 'any') {
      return true;
    }
    return PriceRange[price[price.selectedIndex].value](element.offer.price);
  };

  /**
   * Фильтрация по наличию удобств
   * @param {Advert} element
   * @return {boolean}
   */
  var onFilterFeaturesChange = function (element) {
    var isFeature = true;

    features.forEach(function (item) {
      if (item.checked && element.offer.features.indexOf(item.value) < 0) {
        isFeature = false;
      }
    });
    return isFeature;
  };

  // Фильтрация объявлений
  var filterAdverts = function () {
    filteredAds = loadAds.slice(0);
    filteredAds = filteredAds.filter(onFilterSelectChange(type, 'type'));
    filteredAds = filteredAds.filter(onFilterSelectChange(rooms, 'rooms'));
    filteredAds = filteredAds.filter(onFilterSelectChange(guests, 'guests'));
    filteredAds = filteredAds.filter(onFilterPriceChange);
    filteredAds = filteredAds.filter(onFilterFeaturesChange);
  };

  var setFilters = window.debounce(function () {
    filterAdverts();
    window.card.deactivate();
    window.map.remove();
    window.map.create(filteredAds.slice(0, SHOW_ADS));
  });


  var setFilterHandlers = function () {
    filter.addEventListener('change', setFilters);
  };

  var removeFilterHandlers = function () {
    filter.removeEventListener('change', setFilters);
  };

  var activateFilter = function (data) {
    loadAds = data.slice(0);
    setFilterHandlers();
    return loadAds.slice(0, SHOW_ADS);
  };

  var deactivateFilter = function () {
    filter.reset();
    removeFilterHandlers();
  };


  window.filter = {
    activate: activateFilter,
    deactivate: deactivateFilter
  };

})();
