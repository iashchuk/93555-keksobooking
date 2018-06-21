'use strict';

(function () {

  var form = document.querySelector('.ad-form');
  var titleInput = form.querySelector('#title');
  var inputType = form.querySelector('#type');
  var inputPrice = form.querySelector('#price');
  var inputTimeIn = form.querySelector('#timein');
  var inputTimeOut = form.querySelector('#timeout');
  var inputRooms = form.querySelector('#room_number');
  var inputGuests = form.querySelector('#capacity');
  var optionGuests = inputGuests.querySelectorAll('option');
  var formReset = form.querySelector('.ad-form__reset');
  var fieldsets = form.querySelectorAll('fieldset');
  var addressInput = document.querySelector('#address');

  var TypePrice = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  var RoomGuests = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  var invalidInputs = [];

  /**
   * Записываем полученные координаты в инпут
   * @param {Location} position
   */
  var setAddress = function (position) {
    addressInput.value = position.x + ', ' + position.y;
  };

  // Функция установки минимальных цен в зависимости от типа дома
  var onTypeInputChange = function () {
    inputPrice.min = TypePrice[inputType.value];
    inputPrice.placeholder = TypePrice[inputType.value];
  };

  // Функция синхронного изменение времени заезда и выезда
  var onTimeInputChange = function (input, value) {
    input.value = value;
  };

  // Функция установки количества комнат, взависимости от числа гостей
  var onRoomInputChange = function () {
    var room = inputRooms[inputRooms.selectedIndex].value;
    var selectedValue = RoomGuests[room];

    optionGuests.forEach(function (option) {
      option.disabled = !selectedValue.includes(option.value);
    });
    inputGuests.value = selectedValue.includes(inputGuests.value) ? inputGuests.value : selectedValue[0];
  };

  /**
   * Функция выделение неправильно заполненных полей
   * @param {Node} input
   */
  var markInvalidInput = function (input) {
    invalidInputs.push(input);
    input.classList.add('invalid-field');
  };

  /**
   * Функция снятия выделения с неправильно заполенных полей
   * @param {Node} input
   */
  var removeMarkInvalidInput = function (input) {
    invalidInputs.splice(invalidInputs.indexOf(input), 1);
    input.classList.remove('invalid-field');
  };

  // Функция проверки валидности полей
  var onInputCheckValidity = function (evt) {
    var target = evt.target;
    if (!target.checkValidity()) {
      markInvalidInput(target);
    } else if (invalidInputs.indexOf(target) !== -1) {
      removeMarkInvalidInput(target);
    }
  };

  // Функция очистки формы
  var clearForm = function () {
    invalidInputs.forEach(function (input) {
      input.classList.remove('invalid-field');
    });
    form.reset();
    deactivateForm();
    window.map.deactivate();
  };

  var deactivateForm = function () {
    form.classList.add('ad-form--disabled');
    fieldsets.forEach(function (item) {
      item.disabled = true;
    });
  };

  titleInput.addEventListener('change', onInputCheckValidity);
  inputType.addEventListener('change', onTypeInputChange);
  inputPrice.addEventListener('change', onInputCheckValidity);
  inputTimeIn.addEventListener('change', function () {
    onTimeInputChange(inputTimeOut, inputTimeIn.value);
  });
  inputTimeOut.addEventListener('change', function () {
    onTimeInputChange(inputTimeIn, inputTimeOut.value);
  });
  inputRooms.addEventListener('change', onRoomInputChange);
  formReset.addEventListener('click', function () {
    clearForm();
  });

  var initForm = function () {
    form.classList.remove('ad-form--disabled');
    fieldsets.forEach(function (item) {
      item.disabled = false;
    });
    onRoomInputChange();

    form.addEventListener('invalid', function (evt) {
      markInvalidInput(evt.target);
    }, true);

  };


  window.form = {
    init: initForm,
    setAddress: setAddress
  };

})();
