// photos. js
'use strict';

(function () {
  var PHOTOS_COUNT = 25;
  var RANDOM_PHOTOS_COUNT = 10;

  var userPictures = null;

  window.photos = {
    // нефильтрованные данные с сервера
    data: null,
    userPhotos: [],
    showSuccess: function () {
      var successSection = successTemplate.cloneNode(true);
      document.body.insertAdjacentElement('afterbegin', successSection);
      document.addEventListener('click', closeSuccessSection);
      document.addEventListener('keydown', closeSuccessSectionEscHandler);
    },
    showErrorMessage: function (message) {
      showError(message);
    },
    createCommentElement: function (comment) {
      var commentElement = commentTemplate.cloneNode(true);
      commentElement.querySelector('.social__picture').src = comment.avatar;
      commentElement.querySelector('.social__picture').alt = comment.name;
      commentElement.querySelector('.social__text').textContent = comment.message;
      return commentElement;
    }
  };

  // блок с картинками
  var picturesBlock = null;

  var removePhotos = function () {
    if (!(userPictures === null)) {
      userPictures.forEach(function (picture) {
        picture.removeEventListener('click', selectPictureClickHandler);
      });
      while (picturesBlock) {
        var picture = picturesBlock.querySelector('.picture');
        if (picture) {
          picturesBlock.removeChild(picture);
        } else {
          break;
        }
      }
    }
  };

  window.filter.selectPopularPhotos = window.debounce(function () {
    removePhotos();
    // просто показываем нефильтрованные картинки
    loadPhotosData(window.photos.data);
  });

  window.filter.selectRandomPhotos = window.debounce(function () {
    removePhotos();
    // получим массив RANDOM_PHOTOS_COUNT случайных значений индексов
    var indexes = [];
    while (indexes.length < RANDOM_PHOTOS_COUNT) {
      var ind = window.utils.getRandomIndex(window.photos.data.length);
      if (indexes.indexOf(ind) < 0) {
        indexes.push(ind);
      }
    }
    // покажем картинки с этими индексами
    var data = window.photos.data.filter(function (pict, index) {
      return indexes.indexOf(index) >= 0;
    });
    loadPhotosData(data);
  });

  var comparePictureComments = function (left, right) {
    if (right.comments.length - left.comments.length === 0) {
      return right.likes - left.likes;
    }
    return right.comments.length - left.comments.length;
  };

  window.filter.selectDiscussedPhotos = window.debounce(function () {
    removePhotos();
    var data = window.photos.data.slice();
    data.sort(comparePictureComments);
    loadPhotosData(data);
  });

  var successTemplate = document.querySelector('#success')
  .content
  .querySelector('.success');

  var receivePhotosData = function (data) {
    window.photos.data = data;
    loadPhotosData(data);
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
  };

  var errorTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');

  var closeErrorSectionHandler = function (evt) {
    var error = document.querySelector('.error');
    var errorButton = document.querySelector('.error__buttons:last-child');
    if (evt.target === error ||
      (evt.target === errorButton) || (evt.keyCode === window.DOM_VK.ESC)) {
      error.remove();
      document.removeEventListener('click', closeErrorSectionHandler);
      evt.stopPropagation();
    }
  };

  var closeErrorSectionEscHandler = function (evt) {
    if (evt.keyCode === window.DOM_VK.ESC) {
      closeErrorSectionHandler(evt);
      document.removeEventListener('keydown', closeErrorSectionEscHandler);
    }
  };

  // показываем окно с ошибкой загрузки с сервера
  var showError = function (message) {
    var errorSection = errorTemplate.cloneNode(true);
    errorSection.querySelector('.error__title').textContent = 'Ошибка загрузки файла: ' + message;
    document.body.insertAdjacentElement('afterbegin', errorSection);
    document.addEventListener('click', closeErrorSectionHandler);
    document.addEventListener('keydown', closeErrorSectionEscHandler);
  };

  var closeSuccessSection = function (evt) {
    var success = document.querySelector('.success');
    var successButton = document.querySelector('.success__button');
    if (evt.target === success ||
      (evt.target === successButton) || (evt.keyCode === window.DOM_VK.ESC)) {
      if (!(success === null)) {
        success.remove();
      }
      document.removeEventListener('click', closeSuccessSection);
      evt.stopPropagation();
    }
    var filters = document.querySelector('.img-filters');
    if (filters.classList.contains('img-filters--inactive')) {
      filters.classList.remove('img-filters--inactive');
    }
  };

  var closeSuccessSectionEscHandler = function (evt) {
    if (evt.keyCode === window.DOM_VK.ESC) {
      closeSuccessSection(evt);
      document.removeEventListener('keydown', closeSuccessSectionEscHandler);
    }
  };

  var commentTemplate = document.querySelector('#social__comment').content.querySelector('.social__comment');

  var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

  var createPicture = function (photo) {
    var pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector('.picture__img').src = photo.url;
    pictureElement.querySelector('.picture__likes').textContent = photo.likes;
    pictureElement.querySelector('.picture__comments').textContent = photo.maxComments;
    return pictureElement;
  };

  // src - фотография, которую выбрали для просмотра
  // возвращаем индекс этой фотографии в массиве userPhotos
  var selectPhoto = function (src) {
    var index = -1;
    window.photos.userPhotos.some(function (photo, i) {
      if (src.indexOf(photo.url, 0) > -1) {
        index = i;
        return true;
      }
      return false;
    });
    return index;
  };

  // обработчик клика мышки на фотографии
  var selectPictureClickHandler = function (evt) {
    var index = selectPhoto(evt.target.src);
    if (index > -1) {
      window.picture.openBigPicturePopup(index);
    }
  };

  // обработчик нажатия клавиши Enter
  var popupEnterHandler = function (evt) {
    if (evt.keyCode === window.DOM_VK.ENTER) {
      evt.preventDefault();
      var picturesArray = Array.from(userPictures);
      var index = selectPhoto(userPictures[picturesArray.indexOf(document.activeElement)].firstElementChild.src);
      if (index >= 0) {
        window.picture.openBigPicturePopup(index);
      }
    }
  };

  document.addEventListener('keydown', popupEnterHandler);

  // эагружаем фотографии, полученные с сервера, на сайт
  var loadPhotosData = function (data) {
    window.photos.userPhotos = [];
    var photoData = data.slice(0, PHOTOS_COUNT - 1);
    photoData.forEach(function (photo) {
      var photoInfo = {};
      photoInfo.url = photo.url;
      photoInfo.dESCription = photo.dESCription;
      photoInfo.likes = photo.likes;
      photoInfo.comments = [];
      photoInfo.maxComments = photo.comments.length;
      // создадим комментарии
      photo.comments.forEach(function (comment) {
        photoInfo.comments.push(window.photos.createCommentElement(comment));
      });
      window.photos.userPhotos.push(photoInfo);
    });
    var fragment = document.createDocumentFragment();
    window.photos.userPhotos.forEach(function (photo) {
      fragment.appendChild(createPicture(photo));
    });

    picturesBlock = document.querySelector('.pictures');
    picturesBlock.appendChild(fragment);
    userPictures = document.querySelectorAll('.picture');

    userPictures.forEach(function (picture) {
      picture.addEventListener('click', selectPictureClickHandler);
    });
  };

  // загрузка фотографий с сервера
  window.remote.load(receivePhotosData, window.photos.showErrorMessage);
})();
