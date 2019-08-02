'use strict';

(function () {
  var FILE_TYPES = ['jpg', 'jpeg', 'png', 'gif'];
  var FIRST_FILE = 0;

  var fileChooserAvatar = window.form.adForm.querySelector('.ad-form-header__input'); // Поле формы для загрузки фотографии аватара
  var previewAvatar = window.form.adForm.querySelector('.ad-form-header__preview img'); // Фото аватара
  var fileChooserPhotos = window.form.adForm.querySelector('.ad-form__input'); // Поле формы для загрузки фоторгафий объявления
  var containerPhoto = window.form.adForm.querySelector('.ad-form__photo-container'); // Контейнер для блоков с фотографиями
  var previewPhoto = window.form.adForm.querySelector('.ad-form__photo'); // Блок с фотографией
  fileChooserPhotos.multiple = true;

  // Проверяем расширение файла и записываем data URL в адрес изображения если расширение совпадает
  var fileChooser = function (file, preview) {
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (element) {
      return fileName.endsWith(element);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        preview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };

  // Отрисовываем блоки и элементы img для фотографий объявления
  var photosHandler = function (files) {
    Array.from(files).forEach(function (element) {
      var imageElement = document.createElement('img');
      imageElement.style = 'margin-right:10px; border-radius:5px; width:70px; height:70px;';

      var clonePreview = previewPhoto.cloneNode(true);
      clonePreview.appendChild(imageElement);
      containerPhoto.appendChild(clonePreview);

      fileChooser(element, imageElement);
    });

    // Удаляем блок фото если внутри нет фотографии
    containerPhoto.querySelectorAll('.ad-form__photo').forEach(function (element) {
      if (element.firstElementChild === null) {
        element.remove();
      }
    });
  };

  // Удаляем все загруженные фоторгафии и отрисовываем пустой блок
  var removePhotos = function () {
    var photos = containerPhoto.querySelectorAll('.ad-form__photo');
    photos.forEach(function (element) {
      element.remove();
    });
    var defualtPhoto = document.createElement('div');
    defualtPhoto.classList.add('ad-form__photo');
    containerPhoto.appendChild(defualtPhoto);
  };

  fileChooserAvatar.addEventListener('change', function () {
    var file = fileChooserAvatar.files[FIRST_FILE];

    fileChooser(file, previewAvatar);
  });

  fileChooserPhotos.addEventListener('change', function () {
    var files = fileChooserPhotos.files;

    photosHandler(files);
  });

  window.photo = {
    removePhotos: removePhotos
  };
})();
