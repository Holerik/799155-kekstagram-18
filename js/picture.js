// picture.js
'use strict';
(function () {

  var DESCRIPTION_MAX_LENGTH = 140;
  var MAX_COMMENTS = 5;

  var messagesTemplate = document.querySelector('#messages').content
  .querySelector('.img-upload__message--loading');

  window.picture = {
    // окно полноэкранного просмотра выбранного изображения
    bigPicturePopup: document.querySelector('.big-picture'),
    // поле комментария
    userCommentInput: document.querySelector('.big-picture').querySelector('.social__footer-text'),

    showMessageBlock: function () {
      var messageBlock = messagesTemplate.cloneNode(true);
      document.body.insertAdjacentElement('afterbegin', messageBlock);
    },

    closeMessageBlock: function () {
      var message = document.querySelector('.img-upload__message--loading');
      if (!(message === null)) {
        message.remove();
      }
    },

    closeBigPicturePopup: function () {
      this.bigPicturePopup.classList.add('hidden');
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', window.upload.popupEscHandler);
    },

    openBigPicturePopup: function (index) {
      userPhotoIndex = index;
      document.querySelector('.big-picture__img').firstElementChild.src = window.photos.userPhotos[index].url;
      document.querySelector('.likes-count').textContent = window.photos.userPhotos[index].likes;
      lastCommentNumber = window.photos.userPhotos[index].maxComments > MAX_COMMENTS ?
        MAX_COMMENTS : window.photos.userPhotos[index].maxComments;
      firstCommentNumber = 0;
      lastCommentNumber -= 1;
      document.querySelector('.comments-count').textContent = window.photos.userPhotos[index].maxComments;
      document.querySelector('.social__caption').textContent = window.photos.userPhotos[index].dESCription;
      // удаление временных комментариев из блока
      commentsBlock.innerHTML = '';
      // добавление  комментариев в блок
      addCommetsToBlock();
      // показ элемента .big-picture
      this.bigPicturePopup.classList.remove('hidden');
      document.body.classList.add('modal-open');
      document.addEventListener('keydown', window.upload.popupEscHandler);
      if (window.photos.userPhotos[index].maxComments >= MAX_COMMENTS) {
        if (commentsLoaderButton.classList.contains('hidden')) {
          commentsLoaderButton.classList.remove('hidden');
        }
      } else {
        commentsLoaderButton.classList.add('hidden');
      }
    },

    // валидация комментария полноэкранного просмотра
    inputCommentHandler: function (evt) {
      var target = evt.target;
      if (target.value.length > DESCRIPTION_MAX_LENGTH) {
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
    }
  };


  // блок комментариев
  var commentsBlock = document.querySelector('.social__comments');
  // кнопка показа следующих MAX_COMMENTS комментариев
  var commentsLoaderButton = window.picture.bigPicturePopup.querySelector('.comments-loader');

  var firstCommentNumber = 0;
  var lastCommentNumber = MAX_COMMENTS - 1;
  var userPhotoIndex = -1;

  commentsLoaderButton.addEventListener('click', function () {
    var commentsCount = window.photos.userPhotos[userPhotoIndex].comments.length;
    if (lastCommentNumber + 1 < commentsCount) {
      firstCommentNumber = lastCommentNumber + 1;
      lastCommentNumber += MAX_COMMENTS;
      if (lastCommentNumber >= commentsCount) {
        lastCommentNumber = commentsCount - 1;
        // все комментарии на экране - спрячем кнопку доп.комментариев
        commentsLoaderButton.classList.add('hidden');
      }
    } else {
      // прячем кнопку доп.комментариев
      commentsLoaderButton.classList.add('hidden');
    }
    addCommetsToBlock();
  });

  var bigPictureCancelButton = window.picture.bigPicturePopup.querySelector('#picture-cancel');

  bigPictureCancelButton.addEventListener('click', function () {
    window.picture.closeBigPicturePopup();
  });

  var addCommetsToBlock = function () {
    var fragment = document.createDocumentFragment();
    for (var i = firstCommentNumber; i <= lastCommentNumber; i++) {
      var comment = window.photos.userPhotos[userPhotoIndex].comments[i];
      fragment.appendChild(comment);
    }
    commentsBlock.appendChild(fragment);
    var commentCount = document.querySelector('p.social__comment-count');
    var commentsCount = lastCommentNumber + 1;
    commentCount.childNodes[0].textContent = commentsCount.toString() + ' из ';
  };

  window.picture.userCommentInput.addEventListener('input', window.picture.inputCommentHandler);
})();
