'use strict';

(function () {

  /**
   * @constant {string}
   */
  var DEFAULT_AVATAR_SRC = 'img/muffin-grey.svg';

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var avatar = document.querySelector('.ad-form-header__preview img');
  var photo = document.querySelector('.ad-form__photo');
  var photoContainer = document.querySelector('.ad-form__photo-container');
  var avatarInput = document.querySelector('#avatar');
  var photoInput = document.querySelector('#images');
  var photoDropZone = document.querySelector('.ad-form__drop-zone');
  var avatarDropZone = document.querySelector('.ad-form-header__drop-zone');

  var photoParams = {
    WIDTH: '70',
    HEIGHT: '70',
    BORDER_RADIUS: '5px'
  };

  var dragHighlight = {
    HOVER: 'border: 1px dashed red; border-radius: 5px;',
    DEFAULT: ''
  };

  /**
   * Функция создания аватара для загрузки
   * @param {string} value
   */
  var createAvatar = function (value) {
    avatar.src = value;
  };

  /**
   * Функция создания изображения для загрузки
   * @param {string} value
   */
  var createImage = function (value) {
    var image = document.createElement('img');
    var newPhoto = document.createElement('div');
    newPhoto.className = 'ad-form__photo';
    newPhoto.classList.add('ad-form__photo--upload');
    image.src = value;
    image.width = photoParams.WIDTH;
    image.height = photoParams.HEIGHT;
    image.style.borderRadius = photoParams.BORDER_RADIUS;
    newPhoto.appendChild(image);
    photoContainer.insertBefore(newPhoto, photo);
  };

  /**
   * Функция проверки типа загружаемого файла
   * @param {Object} file
   * @return {boolean}
   */
  var isCorrectType = function (file) {
    return FILE_TYPES.some(function (it) {
      return file.name.toLowerCase().endsWith(it);
    });
  };

  /**
   * Функция загрузки файлов
   * @param {Node} formField
   * @param {function} callback
   */
  var loadFile = function (formField, callback) {
    var files = Array.from(formField.files);
    var correctFiles = files.filter(isCorrectType);

    correctFiles.forEach(function (item) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        callback(reader.result);
      });

      reader.readAsDataURL(item);
    });
  };

  // Функция удаления фотографий из формы
  var removePhotos = function () {
    avatar.src = DEFAULT_AVATAR_SRC;
    var photoUpload = document.querySelectorAll('.ad-form__photo--upload');
    if (photoUpload) {
      photoUpload.forEach(function (item) {
        item.parentNode.removeChild(item);
      });
    }
  };

  var onAvatarChange = function () {
    loadFile(avatarInput, createAvatar);
  };

  var onPhotoChange = function () {
    loadFile(photoInput, createImage);
  };

  var DropInput = {
    'ad-form-header__drop-zone': createAvatar,
    'ad-form__drop-zone': createImage
  };

  var dragEnterHandler = function (evt) {
    evt.target.style = dragHighlight.HOVER;
    evt.preventDefault();
  };

  var dragLeaveHandler = function (evt) {
    evt.preventDefault();
    evt.target.style = dragHighlight.DEFAULT;
  };

  var dragOverHandler = function (evt) {
    evt.preventDefault();
    return false;
  };

  var dragDropHandler = function (evt) {
    evt.preventDefault();
    evt.target.style = dragHighlight.DEFAULT;
    loadFile(evt.dataTransfer, DropInput[evt.target.className]);
  };


  var addDragDropHandlers = function (dragDropElement) {
    dragDropElement.addEventListener('dragenter', dragEnterHandler);
    dragDropElement.addEventListener('dragover', dragOverHandler);
    dragDropElement.addEventListener('dragleave', dragLeaveHandler);
    dragDropElement.addEventListener('drop', dragDropHandler);
  };

  var removeDragDropHandlers = function (dragDropElement) {
    dragDropElement.removeEventListener('dragenter', dragEnterHandler);
    dragDropElement.removeEventListener('dragover', dragOverHandler);
    dragDropElement.removeEventListener('dragleave', dragLeaveHandler);
    dragDropElement.removeEventListener('drop', dragDropHandler);
  };

  var addImageHandlers = function () {
    avatarInput.addEventListener('change', onAvatarChange);
    photoInput.addEventListener('change', onPhotoChange);
    addDragDropHandlers(avatarDropZone);
    addDragDropHandlers(photoDropZone);
  };

  var removeImageHandlers = function () {
    avatarInput.removeEventListener('change', onAvatarChange);
    photoInput.removeEventListener('change', onPhotoChange);
    removeDragDropHandlers(avatarDropZone);
    removeDragDropHandlers(photoDropZone);
  };

  window.formImage = {
    addHandlers: addImageHandlers,
    removeHandlers: removeImageHandlers,
    remove: removePhotos
  };

})();
