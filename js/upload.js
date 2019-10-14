// upload.js
'use strict';

(function () {
  var DOM_VK_ESC = 0x1B;
  var HASHTAGS_MAX_COUNT = 5;
  var HASHTAG_MAX_LENGTH = 20;

  // показ формы редактирования изображения
  var imgUploadForm = document.querySelector('#upload-select-image');
  var imgUploadPopup = document.querySelector('.img-upload__overlay');
  var submitButton = imgUploadPopup.querySelector('.img-upload__submit');
  var hashtagsInput = document.querySelector('.text__hashtags');
  var textDescrInput = document.querySelector('.text__description');


  // обработчик нажатия клавиши Esc
  window.onPopupPressEsc = function (evt) {
    if (evt.keyCode === DOM_VK_ESC) {
      if (hashtagsInput === document.activeElement) {
        return;
      }
      if (textDescrInput === document.activeElement) {
        return;
      }
      if (window.userCommentInput === document.activeElement) {
        return;
      }
      if (!window.bigPicturePopup.classList.contains('hidden')) {
        window.closePopup();
      } else if (!imgUploadPopup.classList.contains('hidden')) {
        closeImgPopup();
      }
    }
  };
  //
  // загрузка изображений и работа с фильтрами
  //
  var uploadFile = document.querySelector('#upload-file');
  var cancelButton = document.querySelector('#upload-cancel');

  var resetImgUploadPopup = function () {
    var preview = imgUploadPopup.querySelector('.img-upload__preview');
    preview.style.filter = '';
    if (!(window.currentEffect === 'none')) {
    // удалим текущий фильтр из списка классов
      var effectClass = 'effects__preview--' + window.currentEffect;
      if (preview.classList.contains(effectClass)) {
        preview.classList.remove(effectClass);
      }
      window.currentEffect = 'none';
      imgUploadPopup.querySelector('.effect-level__value').value = 0;
      imgUploadPopup.querySelector('.img-upload__preview').style.transform = 'scale(100)';
      imgUploadPopup.querySelector('.scale__control--value').value = '100%';
      hashtagsInput.value = '';
      textDescrInput.value = '';
    }
    window.currentEffect = 'none';
    // убираем слайдер
    imgUploadPopup.querySelector('.effect-level').classList.add('hidden');
    imgUploadPopup.querySelector('.img-upload__preview').style.transform = 'scale(1)';
  };

  var openImgPopup = function () {
    imgUploadPopup.classList.remove('hidden');
    document.addEventListener('keydown', window.onPopupPressEsc);
  };

  var closeImgPopup = function () {
    resetImgUploadPopup();
    imgUploadPopup.classList.add('hidden');
    document.removeEventListener('keydown', window.onPopupPressEsc);
    uploadFile.value = '';
  };

  uploadFile.addEventListener('change', function () {
    openImgPopup();
  });

  cancelButton.addEventListener('click', function () {
    closeImgPopup();
  });

  //
  // валидация хэш-тэгов и комментария
  //
  var checkHashtagLength = function (hashtags) {
    for (var j = 0; j < hashtags.length; j++) {
      if (hashtags[j].length > HASHTAG_MAX_LENGTH) {
        return false;
      }
    }
    return true;
  };

  var checkHashtagIsDouble = function (hashtags) {
    var htag = hashtags[hashtags.length - 1];
    for (var j = 0; j < hashtags.length - 2; j++) {
      if (hashtags[j] === htag) {
        return true;
      }
    }
    return false;
  };

  hashtagsInput.addEventListener('input', function (evt) {
    var target = evt.target;
    var hashArray = target.value.split(' ');
    for (var j = 0; j < hashArray.length; j++) {
      if (!(hashArray[j][0] === '#')) {
        target.setCustomValidity('# - обязательный символ');
      } else if (hashArray[j].length === 1) {
        target.setCustomValidity('хэш-тэг не может состоять тодько из решетки');
      } else if (hashArray[j].indexOf('#', 1) > 0) {
        target.setCustomValidity('хэш-тэги разделяются пробелами');
      } else if (hashArray.length > HASHTAGS_MAX_COUNT) {
        target.setCustomValidity('хэш-тэгов не может быть больше 5');
      } else if (!checkHashtagLength(hashArray)) {
        target.setCustomValidity('максимальная длина хэш-тэга 20 символов с решеткой');
      } else if (checkHashtagIsDouble(hashArray)) {
        target.setCustomValidity('один и тот же хэш-тэг не может быть использован дважды');
      } else {
        target.setCustomValidity('');
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

  textDescrInput.addEventListener('input', window.validateCommentInput);

  //
  // отправка данных формы после валидации
  //
  var sendFormData = function () {
    imgUploadForm.submit();
  };

  var submitClickHandler = function (evt) {
    evt.preventDefault();
    if (imgUploadForm.reportValidity()) {
      sendFormData();
      resetImgUploadPopup();
      closeImgPopup();
    }
  };

  submitButton.addEventListener('click', submitClickHandler);

})();
