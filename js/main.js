// main.js
'use strict';

(function () {
  var FOTOS_COUNT = 25;
  var DOM_VK_ESC = 0x1B;
  var DOM_VK_ENTER = 0x0D;
  var HASHTAGS_MAX_COUNT = 5;
  var HASHTAG_MAX_LENGTH = 20;
  var MAX_DESCR_LENGTH = 140;

  var userFotos = [];

  var createFotosData = function () {
    var fotos = [];
    for (var i = 0; i < FOTOS_COUNT; i++) {
      var fotoInfo = {};
      fotoInfo.url = 'photos/' + (i + 1) + '.jpg';
      fotoInfo.description = 'Описание фотографии';
      fotoInfo.likes = window.getRandomLikes();
      fotoInfo.comments = [];
      fotoInfo.comments = window.getRandomComments();
      fotos[i] = fotoInfo;
    }
    return fotos;
  };

  var createPicture = function (foto) {
    var pictureElem = pictureTempl.cloneNode(true);
    pictureElem.querySelector('.picture__img').src = foto.url;
    pictureElem.querySelector('.picture__likes').textContent = foto.likes;
    pictureElem.querySelector('.picture__comments').textContent = foto.comments.length;
    return pictureElem;
  };

  var pictureTempl = document.querySelector('#picture')
.content
.querySelector('.picture');

  userFotos = createFotosData();
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < userFotos.length; i++) {
    fragment.appendChild(createPicture(userFotos[i]));
  }

  var picturesBlock = document.querySelector('.pictures');
  picturesBlock.appendChild(fragment);

  var commentTempl = document.querySelector('#social__comment').content.querySelector('.social__comment');

  var createComment = function (comment) {
    var commentElement = commentTempl.cloneNode(true);
    commentElement.querySelector('.social__picture').src = comment.avatar;
    commentElement.querySelector('.social__picture').alt = comment.name;
    commentElement.querySelector('.social__text').textContent = comment.message;
    return commentElement;
  };

  // окно полноэкранного просмотра выбранного изображения
  var bigPicturePopup = document.querySelector('.big-picture');
  // поле комментария
  var userCommentInput = bigPicturePopup.querySelector('.social__footer-text');

  // показ формы редактирования изображения
  var imgUploadForm = document.querySelector('#upload-select-image');
  var imgUploadPopup = document.querySelector('.img-upload__overlay');
  var submitButton = imgUploadPopup.querySelector('.img-upload__submit');
  var hashtagsInput = document.querySelector('.text__hashtags');
  var textDescrInput = document.querySelector('.text__description');

  // обработчик нажатия клавиши Esc
  var onPopupPressEsc = function (evt) {
    if (evt.keyCode === DOM_VK_ESC) {
      if (hashtagsInput === document.activeElement) {
        return;
      }
      if (textDescrInput === document.activeElement) {
        return;
      }
      if (userCommentInput === document.activeElement) {
        return;
      }
      if (!bigPicturePopup.classList.contains('hidden')) {
        closePopup();
      } else if (!imgUploadPopup.classList.contains('hidden')) {
        closeImgPopup();
      }
    }
  };

  var closePopup = function () {
    bigPicturePopup.classList.add('hidden');
    document.removeEventListener('keydown', onPopupPressEsc);
  };

  var bigPictureCancel = bigPicturePopup.querySelector('#picture-cancel');
  bigPictureCancel.addEventListener('click', function () {
    closePopup();
  });

  var selectFoto = function (src) {
    for (i = 0; i < userFotos.length; i++) {
      if (src.indexOf(userFotos[i].url, 0) > -1) {
        return i;
      }
    }
    return -1;
  };

  var userPictures = document.querySelectorAll('.picture');

  var openBigPicturePopup = function (index) {
    document.querySelector('.big-picture__img').firstElementChild.src = userFotos[index].url;
    document.querySelector('.likes-count').textContent = userFotos[index].likes;
    document.querySelector('.comments-count').textContent = userFotos[index].comments.length;
    document.querySelector('.social__caption').textContent = userFotos[index].description;
    // блок комментариев
    var commentsBlock = document.querySelector('.social__comments');
    // удаление временных комментариев из блока
    commentsBlock.innerHTML = '';
    // добавление комментариев в блок
    fragment = document.createDocumentFragment();
    for (i = 0; i < userFotos[index].comments.length; i++) {
      fragment.appendChild(createComment(userFotos[index].comments[i]));
    }
    commentsBlock.appendChild(fragment);
    document.querySelector('.social__comment-count').classList.add('visually-hidden');
    document.querySelector('.comments-loader').classList.add('visually-hidden');
    // показ элемента .big-picture
    bigPicturePopup.classList.remove('hidden');
    document.addEventListener('keydown', onPopupPressEsc);
  };

  var selectPicture = function (evt) {
    var index = selectFoto(evt.target.src);
    if (index > -1) {
      openBigPicturePopup(index);
    }
  };

  // обработчик нажатия клавиши Enter
  var onPopupPressEnter = function (evt) {
    if (evt.keyCode === DOM_VK_ENTER) {
      evt.preventDefault();
      var index = -1;
      for (i = 0; i < userPictures.length; i++) {
        if (userPictures[i] === document.activeElement) {
          index = selectFoto(userPictures[i].firstElementChild.src);
          break;
        }
      }
      if (index >= 0) {
        openBigPicturePopup(index);
      }
    }
  };

  for (i = 0; i < userPictures.length; i++) {
    userPictures[i].addEventListener('click', selectPicture);
  }

  document.addEventListener('keydown', onPopupPressEsc);
  document.addEventListener('keydown', onPopupPressEnter);

  // блок комментариев
  var commentsBlock = document.querySelector('.social__comments');
  // удаление временных комментариев из блока
  commentsBlock.innerHTML = '';
  // добавление комментариев в блок
  fragment = document.createDocumentFragment();
  for (i = 0; i < userFotos[0].comments.length; i++) {
    fragment.appendChild(createComment(userFotos[0].comments[i]));
  }
  commentsBlock.appendChild(fragment);

  bigPicturePopup.querySelector('.social__comment-count').classList.add('visually-hidden');
  bigPicturePopup.querySelector('.comments-loader').classList.add('visually-hidden');

  // валидация комментария полноэкранного просмотра
  var validateCommentInput = function (evt) {
    var target = evt.target;
    if (target.value.length > MAX_DESCR_LENGTH) {
      target.setCustomValidity('длина комментария не должна превышать 140 символов');
    } else {
      target.setCustomValidity('');
    }
    if (target.validity.customError) {
      target.style.borderColor = 'red';
      target.style.backgroundColor = 'yellow';
    } else {
      target.style.borderColor = '';
      target.style.backgroundColor = '';
    }
  };

  userCommentInput.addEventListener('input', validateCommentInput);

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
    document.addEventListener('keydown', onPopupPressEsc);
  };

  var closeImgPopup = function () {
    resetImgUploadPopup();
    imgUploadPopup.classList.add('hidden');
    document.removeEventListener('keydown', onPopupPressEsc);
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

  textDescrInput.addEventListener('input', validateCommentInput);

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
