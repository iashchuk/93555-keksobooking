'use strict';

(function () {

  /**
   * @constant {number}
   */
  var ESC_KEYCODE = 27;

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
  var addressInput = form.querySelector('#address');
  var success = document.querySelector('.success');

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
  var setTime = function (input, value) {
    input.value = value;
  };

  var onTimeOutInputChange = function () {
    setTime(inputTimeIn, inputTimeOut.value);
  };

  var onTimeInInputChange = function () {
    setTime(inputTimeOut, inputTimeIn.value);
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

  var onFormInvalid = function (evt) {
    markInvalidInput(evt.target);
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

  // Обработчик успешной отправки формы
  var onSubmitFormSuccess = function () {
    clearForm();
    success.classList.remove('hidden');
    document.addEventListener('click', onSuccessMessageClick);
    document.addEventListener('keydown', onSuccessMessageEscPress);
  };

  // Обработчик при возникновении ошибки
  var onSubmitFormError = function (textMessage) {
    window.errorMessage.create(textMessage);
  };

  // Действия при закрытии сообщения об успешной отправки формы
  var closeSuccessMessage = function () {
    success.classList.add('hidden');
    document.removeEventListener('click', onSuccessMessageClick);
    document.removeEventListener('keydown', onSuccessMessageEscPress);
  };

  // Клик по сообщению об успешной отправки формы
  var onSuccessMessageClick = function () {
    closeSuccessMessage();
  };

  // Нажатие клавиши ESC при открытом сообщении об успешной отправки формы
  var onSuccessMessageEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeSuccessMessage();
    }
  };

  // Действия при нажатии кнопки отправить
  var onFormSubmit = function (evt) {
    window.backend.upload(new FormData(form), onSubmitFormSuccess, onSubmitFormError);
    evt.preventDefault();
  };


  var addFormHandlers = function () {
    titleInput.addEventListener('change', onInputCheckValidity);
    inputType.addEventListener('change', onTypeInputChange);
    inputPrice.addEventListener('change', onInputCheckValidity);
    inputTimeIn.addEventListener('change', onTimeInInputChange);
    inputTimeOut.addEventListener('change', onTimeOutInputChange);
    inputRooms.addEventListener('change', onRoomInputChange);
    formReset.addEventListener('click', clearForm);
    form.addEventListener('invalid', onFormInvalid, true);
    form.addEventListener('submit', onFormSubmit);
  };

  var removeFormHandlers = function () {
    titleInput.removeEventListener('change', onInputCheckValidity);
    inputType.removeEventListener('change', onTypeInputChange);
    inputPrice.removeEventListener('change', onInputCheckValidity);
    inputTimeIn.removeEventListener('change', onTimeInInputChange);
    inputTimeOut.removeEventListener('change', onTimeOutInputChange);
    inputRooms.removeEventListener('change', onRoomInputChange);
    formReset.removeEventListener('click', clearForm);
    form.removeEventListener('invalid', onFormInvalid, true);
    form.removeEventListener('submit', onFormSubmit);
  };

  // Функция активации формы
  var initForm = function () {
    form.classList.remove('ad-form--disabled');
    fieldsets.forEach(function (item) {
      item.disabled = false;
    });
    onRoomInputChange();
    addFormHandlers();
  };

  // Функция деактивации формы
  var deactivateForm = function () {
    form.classList.add('ad-form--disabled');
    fieldsets.forEach(function (item) {
      item.disabled = true;
    });
    removeFormHandlers();
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

  window.form = {
    init: initForm,
    deactivate: deactivateForm,
    setAddress: setAddress
  };

})();
