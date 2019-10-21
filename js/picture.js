// picture.js
'use strict';
(function () {

  var MAX_DESCR_LENGTH = 140;
  var MAX_COMMENTS = 5;

  window.DOM_VK = {
    esc: 0x1B,
    enter: 0x0D
  };

  var messagesTempl = document.querySelector('#messages').content
  .querySelector('.img-upload__message--loading');

  window.showMessage = function () {
    var messageBlock = messagesTempl.cloneNode(true);
    document.body.insertAdjacentElement('afterbegin', messageBlock);
  };

  window.closeMessage = function () {
    var message = document.querySelector('.img-upload__message--loading');
    if (!(message === null)) {
      message.remove();
    }
  };

  // окно полноэкранного просмотра выбранного изображения
  window.bigPicturePopup = document.querySelector('.big-picture');
  // поле комментария
  window.userCommentInput = window.bigPicturePopup.querySelector('.social__footer-text');
  // блок комментариев
  var commentsBlock = document.querySelector('.social__comments');
  // кнопка показа следующих MAX_COMMENTS комментариев
  var commentsLoaderButton = window.bigPicturePopup.querySelector('.comments-loader');

  var firstCommentNumber = 0;
  var lastCommentNumber = MAX_COMMENTS - 1;
  var userFotoIndex = -1;

  commentsLoaderButton.addEventListener('click', function () {
    var commentsCount = window.userFotos[userFotoIndex].comments.length;
    // уберем текущие комментарии
    commentsBlock.innerHTML = '';
    if (lastCommentNumber + 1 < commentsCount) {
      firstCommentNumber = lastCommentNumber + 1;
      lastCommentNumber += MAX_COMMENTS;
      if (lastCommentNumber >= commentsCount) {
        lastCommentNumber = commentsCount - 1;
      }
    } else {
      // спрячем кнопку доп.комментариев
      commentsLoaderButton.classList.add('hidden');
      // код позволяющий вернуться в начало комментариев
      // firstCommentNumber = 0;
      // lastCommentNumber = MAX_COMMENTS > commentsCount ? commentsCount - 1 : MAX_COMMENTS - 1;
    }
    addCommetsToBlock();
  });

  window.closePopup = function () {
    window.bigPicturePopup.classList.add('hidden');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', window.onPopupPressEsc);
  };

  var bigPictureCancel = window.bigPicturePopup.querySelector('#picture-cancel');
  bigPictureCancel.addEventListener('click', function () {
    window.closePopup();
  });

  var addCommetsToBlock = function () {
    var fragment = document.createDocumentFragment();
    for (var i = firstCommentNumber; i <= lastCommentNumber; i++) {
      var comment = window.userFotos[userFotoIndex].comments[i];
      fragment.appendChild(comment);
    }
    commentsBlock.appendChild(fragment);
    var pp = document.querySelector('p.social__comment-count');
    var commentsCount = lastCommentNumber + 1;
    pp.childNodes[0].textContent = commentsCount.toString() + ' из ';
  };

  window.openBigPicturePopup = function (index) {
    userFotoIndex = index;
    document.querySelector('.big-picture__img').firstElementChild.src = window.userFotos[index].url;
    document.querySelector('.likes-count').textContent = window.userFotos[index].likes;
    lastCommentNumber = window.userFotos[index].maxComments > MAX_COMMENTS ?
      MAX_COMMENTS : window.userFotos[index].maxComments;
    firstCommentNumber = 0;
    lastCommentNumber -= 1;
    document.querySelector('.comments-count').textContent = window.userFotos[index].maxComments;
    document.querySelector('.social__caption').textContent = window.userFotos[index].description;
    // удаление временных комментариев из блока
    commentsBlock.innerHTML = '';
    // добавление  комментариев в блок
    addCommetsToBlock();
    // показ элемента .big-picture
    window.bigPicturePopup.classList.remove('hidden');
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', window.onPopupPressEsc);
    if (commentsLoaderButton.classList.contains('hidden')) {
      commentsLoaderButton.classList.remove('hidden');
    }
  };

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
