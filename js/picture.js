// picture.js
'use strict';
(function () {

  var FOTOS_COUNT = 25;
  var DOM_VK_ENTER = 0x0D;
  var MAX_DESCR_LENGTH = 140;
  var MAX_COMMENTS = 5;

  var userFotos = [];
  var userPictures = null;

  var errorTempl = document.querySelector('#error')
  .content
  .querySelector('.error');

  var successTempl = document.querySelector('#success')
  .content
  .querySelector('.success');

  // показываем окно с ошибкой загоузки с сервера
  var showError = function (message) {
    var errorSection = errorTempl.cloneNode(true);
    errorSection.querySelector('.error__title').textContent = 'Ошибка загрузки файла: ' + message;
    document.body.insertAdjacentElement('afterbegin', errorSection);
    document.querySelector('.error__buttons:last-child').addEventListener('click', function () {
      document.querySelector('.error').remove();
    });
  };

  // показываем окно после успешной загрузки фотографий с сервера
  var showSuccess = function () {
    var successSection = successTempl.cloneNode(true);
    document.body.insertAdjacentElement('afterbegin', successSection);
    document.querySelector('.success__button').addEventListener('click', function () {
      document.querySelector('.success').remove();
    });
  };

  var onLoad = function (data) {
    loadFotosData(data);
    showSuccess();
  };

  window.onError = function (message) {
    showError(message);
  };

  var commentTempl = document.querySelector('#social__comment').content.querySelector('.social__comment');

  var createComment = function (comment) {
    var commentElement = commentTempl.cloneNode(true);
    commentElement.querySelector('.social__picture').src = comment.avatar;
    commentElement.querySelector('.social__picture').alt = comment.name;
    commentElement.querySelector('.social__text').textContent = comment.message;
    return commentElement;
  };

  // src - фотография, которую выбрали для просмотра
  // возвращаем индекс этой фотографии в массиве userFotos
  var selectFoto = function (src) {
    for (var i = 0; i < userFotos.length; i++) {
      if (src.indexOf(userFotos[i].url, 0) > -1) {
        return i;
      }
    }
    return -1;
  };

  // обработчик клика мышки на фотографии
  var selectPicture = function (evt) {
    var index = selectFoto(evt.target.src);
    if (index > -1) {
      openBigPicturePopup(index);
    }
  };

  // эагружаем фотографии, полученные с сервера, на сайт
  var loadFotosData = function (data) {
    userFotos = [];
    for (var i = 0; i < data.length; i++) {
      if (i === FOTOS_COUNT) {
        break;
      }
      var fotoInfo = {};
      fotoInfo.url = data[i].url;
      fotoInfo.description = data[i].description;
      fotoInfo.likes = data[i].likes;
      fotoInfo.comments = [];
      for (var j = 0; j < data[i].comments.length; j++) {
        fotoInfo.comments[j] = createComment(data[i].comments[j]);
        if (j === MAX_COMMENTS - 1) {
          break;
        }
      }
      userFotos[i] = fotoInfo;
    }

    var fragment = document.createDocumentFragment();
    userFotos.forEach(function (foto) {
      fragment.appendChild(createPicture(foto));
    });

    var picturesBlock = document.querySelector('.pictures');
    picturesBlock.appendChild(fragment);
    userPictures = document.querySelectorAll('.picture');

    userPictures.forEach(function (picture) {
      picture.addEventListener('click', selectPicture);
    });
  };

  var pictureTempl = document.querySelector('#picture')
    .content
    .querySelector('.picture');

  var createPicture = function (foto) {
    var pictureElem = pictureTempl.cloneNode(true);
    pictureElem.querySelector('.picture__img').src = foto.url;
    pictureElem.querySelector('.picture__likes').textContent = foto.likes;
    pictureElem.querySelector('.picture__comments').textContent = foto.comments.length;
    return pictureElem;
  };

  // загрузка фотографий с сервера
  window.load(onLoad, window.onError);

  // окно полноэкранного просмотра выбранного изображения
  window.bigPicturePopup = document.querySelector('.big-picture');
  // поле комментария
  window.userCommentInput = window.bigPicturePopup.querySelector('.social__footer-text');

  window.closePopup = function () {
    window.bigPicturePopup.classList.add('hidden');
    document.removeEventListener('keydown', window.onPopupPressEsc);
  };

  var bigPictureCancel = window.bigPicturePopup.querySelector('#picture-cancel');
  bigPictureCancel.addEventListener('click', function () {
    window.closePopup();
  });

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
    var fragment = document.createDocumentFragment();
    userFotos[index].comments.forEach(function (comment) {
      fragment.appendChild(comment);
    });
    commentsBlock.appendChild(fragment);

    // показ элемента .big-picture
    window.bigPicturePopup.classList.remove('hidden');
    document.addEventListener('keydown', window.onPopupPressEsc);
  };

  // обработчик нажатия клавиши Enter
  var onPopupPressEnter = function (evt) {
    if (evt.keyCode === DOM_VK_ENTER) {
      evt.preventDefault();
      var index = -1;
      for (var i = 0; i < userPictures.length; i++) {
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

  document.addEventListener('keydown', onPopupPressEnter);

  window.bigPicturePopup.querySelector('.social__comment-count').classList.add('visually-hidden');
  window.bigPicturePopup.querySelector('.comments-loader').classList.add('visually-hidden');

  // валидация комментария полноэкранного просмотра
  window.validateCommentInput = function (evt) {
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

  window.userCommentInput.addEventListener('input', window.validateCommentInput);
})();
