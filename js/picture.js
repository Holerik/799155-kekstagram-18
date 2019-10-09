// picture.js
'use strict';
(function () {

  var FOTOS_COUNT = 25;
  var DOM_VK_ENTER = 0x0D;
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
    window.bigPicturePopup.classList.remove('hidden');
    document.addEventListener('keydown', window.onPopupPressEsc);
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
