// upload.js
'use strict';

(function () {
  var HASHTAGS_MAX_COUNT = 5;
  var HASHTAG_MAX_LENGTH = 20;

  // показ формы редактирования изображения
  var imageUploadForm = document.querySelector('#upload-select-image');
  var imageUploadPopup = document.querySelector('.img-upload__overlay');
  var submitButton = imageUploadPopup.querySelector('.img-upload__submit');
  var hashtagsInput = document.querySelector('.text__hashtags');
  var textDescriptionInput = document.querySelector('.text__description');

  window.upload = {
    // обработчик нажатия клавиши Esc
    popupEscHandler: function (evt) {
      if (evt.keyCode === window.utils.DOM_VK.ESC) {
        if (hashtagsInput === document.activeElement) {
          return;
        }
        if (textDescriptionInput === document.activeElement) {
          return;
        }
        if (window.picture.userCommentInput === document.activeElement) {
          return;
        }
        if (!window.picture.bigPicturePopup.classList.contains('hidden')) {
          window.picture.closeBigPicturePopup();
        } else if (!imageUploadPopup.classList.contains('hidden')) {
          closeImagePopup();
        }
      }
    }
  };
  //
  // загрузка изображений и работа с фильтрами
  //
  var uploadFile = document.querySelector('#upload-file');
  var uploadControl = document.querySelector('.img-upload__start');
  var cancelButton = document.querySelector('#upload-cancel');

  var resetImageUploadPopup = function () {
    var preview = imageUploadPopup.querySelector('.img-upload__preview');
    preview.style.filter = '';
    window.effects.resetEffects();
    if (!(window.effects.currentEffect === 'none')) {
    // удалим текущий фильтр из списка классов
      var effectClass = 'effects__preview--' + window.effects.currentEffect;
      if (preview.classList.contains(effectClass)) {
        preview.classList.remove(effectClass);
      }
      window.effects.currentEffect = 'none';
      imageUploadPopup.querySelector('.effect-level__value').value = 0;
      imageUploadPopup.querySelector('.img-upload__preview').style.transform = 'scale(100)';
      imageUploadPopup.querySelector('.scale__control--value').value = '100%';
    }
    window.effects.currentEffect = 'none';
    imageUploadPopup.querySelector('#effect-none').checked = true;
    // убираем слайдер
    imageUploadPopup.querySelector('.effect-level').classList.add('hidden');
    imageUploadPopup.querySelector('.img-upload__preview').style.transform = 'scale(1)';
    // удаляем хэш-теги и комментарии
    hashtagsInput.value = '';
    textDescriptionInput.value = '';
  };

  var openImagePopup = function () {
    imageUploadPopup.classList.remove('hidden');
    document.addEventListener('keydown', window.upload.popupEscHandler);
  };

  var closeImagePopup = function () {
    resetImageUploadPopup();
    imageUploadPopup.classList.add('hidden');
    document.removeEventListener('keydown', window.upload.popupEscHandler);
    uploadFile.value = '';
  };

  uploadFile.addEventListener('change', function () {
    openImagePopup();
  });

  uploadControl.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.utils.DOM_VK.ENTER) {
      uploadFile.click();
    }
  });
  cancelButton.addEventListener('click', function () {
    closeImagePopup();
  });

  //
  // валидация хэш-тэгов и комментария
  //
  var checkHashtagLength = function (hashtags) {
    return hashtags.every(function (hashtag) {
      return hashtag.length <= HASHTAG_MAX_LENGTH;
    });
  };

  var checkHashtagIsDouble = function (hashtags) {
    for (var i = hashtags.length - 1; i > 0; i--) {
      for (var j = i - 1; j >= 0; j--) {
        if (hashtags[i].toLowerCase() === hashtags[j].toLowerCase()) {
          return true;
        }
      }
    }
    return false;
  };

  hashtagsInput.addEventListener('input', function (evt) {
    var target = evt.target;
    var hashTags = target.value.split(' ');
    target.setCustomValidity('');
    for (var j = 0; j < hashTags.length; j++) {
      if (!(hashTags[j][0] === '#') && (hashTags[j].length > 0)) {
        target.setCustomValidity('# - обязательный символ');
      } else if (hashTags[j].length === 1) {
        target.setCustomValidity('хэш-тэг не может состоять тодько из решетки');
      } else if (hashTags[j].indexOf('#', 1) > 0) {
        target.setCustomValidity('хэш-тэги разделяются пробелами');
      } else if (hashTags.length > HASHTAGS_MAX_COUNT) {
        target.setCustomValidity('хэш-тэгов не может быть больше 5');
      } else if (!checkHashtagLength(hashTags)) {
        target.setCustomValidity('максимальная длина хэш-тэга 20 символов с решеткой');
      } else if (checkHashtagIsDouble(hashTags)) {
        target.setCustomValidity('один и тот же хэш-тэг не может быть использован дважды');
      }
    }
    if (target.validity.customError) {
      target.style.borderColor = 'red';
      target.style.backgroundColor = 'yellow';
    } else {
      target.style.borderColor = '';
      target.style.backgroundColor = '';
    }
  });

  textDescriptionInput.addEventListener('input', window.picture.inputCommentHandler);

  //
  // отправка данных формы после валидации
  //
  var sendFormData = function () {
    window.remote.save(new FormData(imageUploadForm), window.photos.showSuccess,
        window.photos.showErrorMessage);
  };

  var submitButtonClickHandler = function (evt) {
    evt.preventDefault();
    if (imageUploadForm.reportValidity()) {
      sendFormData();
      resetImageUploadPopup();
      closeImagePopup();
    }
  };

  submitButton.addEventListener('click', submitButtonClickHandler);
})();
