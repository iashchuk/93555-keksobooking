'use strict';

(function () {
  var SHOW_ADS = 5;

  var priceRange = {
    low: {
      MAX: 10000
    },
    middle: {
      MIN: 10000,
      MAX: 50000
    },
    high: {
      MIN: 50000
    }
  };

  var filter = document.querySelector('.map__filters');
  var type = filter.querySelector('#housing-type');
  var price = filter.querySelector('#housing-price');
  var rooms = filter.querySelector('#housing-rooms');
  var guests = filter.querySelector('#housing-guests');
  var features = filter.querySelectorAll('.map__checkbox');
  var loadAds = [];
  var filteredAds = [];


  var onFilterTypeChange = function (element) {
    if (type[type.selectedIndex].value === 'any') {
      return element;
    }
    return element.offer.type === type[type.selectedIndex].value;
  };

  var onFilterPriceChange = function (element) {
    switch (price[price.selectedIndex].value) {
      case 'low':
        return element.offer.price < priceRange.low.MAX;
      case 'middle':
        return element.offer.price >= priceRange.middle.MIN && element.offer.price <= priceRange.middle.MAX;
      case 'high':
        return element.offer.price > priceRange.high.MIN;
      default:
        return element;
    }
  };

  var onFilterRoomsChange = function (element) {
    if (rooms[rooms.selectedIndex].value === 'any') {
      return element;
    }
    return element.offer.rooms === parseInt(rooms[rooms.selectedIndex].value, 10);
  };

  var onFilterGuestChange = function (element) {
    if (guests[guests.selectedIndex].value === 'any') {
      return element;
    }
    return element.offer.guests === parseInt(guests[guests.selectedIndex].value, 10);
  };

  var onFilterFeaturesChange = function (element) {
    var isFeature = true;

    var checkedFeatures = Array.from(features).filter(function (item) {
      return item.checked;
    });

    checkedFeatures.forEach(function (item) {
      if (element.offer.features.indexOf(item.value) < 0) {
        isFeature = false;
      }
    });
    return isFeature;
  };


  var filterAdverts = function () {
    filteredAds = loadAds.slice(0);
    filteredAds = filteredAds.filter(onFilterTypeChange)
                             .filter(onFilterPriceChange)
                             .filter(onFilterRoomsChange)
                             .filter(onFilterGuestChange)
                             .filter(onFilterFeaturesChange);
  };

  var setFilters = function () {
    filterAdverts();
    window.card.deactivate();
    window.map.remove();
    window.map.create(filteredAds.slice(0, SHOW_ADS));
  };


  var setFilterHandlers = function () {
    filter.addEventListener('change', window.debounce(setFilters));
  };

  var removeFilterHandlers = function () {
    filter.removeEventListener('change', window.debounce(setFilters));
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
