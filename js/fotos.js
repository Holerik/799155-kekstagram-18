// fotos. js
'use strict';

(function () {
  var FOTOS_COUNT = 25;
  var RANDOM_FOTOS_COUNT = 10;

  window.userFotos = [];
  var userPictures = null;

  // нефильтрованные данные с сервера
  window.data = null;
  // блок с картинками
  var picturesBlock = null;

  var removeFotos = function () {
    if (!(userPictures === null)) {
      userPictures.forEach(function (picture) {
        picture.removeEventListener('click', selectPicture);
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

  window.filter.onPopularFilter = window.debounce(function () {
    removeFotos();
    // просто показываем нефильтрованные картинки
    loadFotosData(window.data);
  });

  window.filter.onRandomFilter = window.debounce(function () {
    removeFotos();
    // получим массив RANDOM_FOTOS_COUNT случайных значений индексов
    var indexes = [];
    while (indexes.length < RANDOM_FOTOS_COUNT) {
      var ind = window.getRandomIndex(window.data.length);
      if (indexes.indexOf(ind) < 0) {
        indexes.push(ind);
      }
    }
    // покажем картинки с этими индексами
    var data = window.data.filter(function (pict, index) {
      if (indexes.indexOf(index) < 0) {
        return false;
      }
      return true;
    });
    loadFotosData(data);
  });

  var pictureComparator = function (left, right) {
    if (right.comments.length - left.comments.length === 0) {
      return right.likes - left.likes;
    }
    return right.comments.length - left.comments.length;
  };

  window.filter.onDiscussFilter = window.debounce(function () {
    removeFotos();
    var data = window.data.slice();
    data.sort(pictureComparator);
    loadFotosData(data);
  });

  var successTempl = document.querySelector('#success')
  .content
  .querySelector('.success');

  // показываем окно после успешной загрузки фотографий с сервера
  window.showSuccess = function () {
    var successSection = successTempl.cloneNode(true);
    document.body.insertAdjacentElement('afterbegin', successSection);
    document.addEventListener('click', closeSuccessSection);
    document.addEventListener('keydown', closeSuccessSectionOnEsc);
  };

  var onLoad = function (data) {
    window.data = data;
    loadFotosData(data);
    window.showSuccess();
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
  };

  var errorTempl = document.querySelector('#error')
  .content
  .querySelector('.error');

  var closeErrorSection = function (evt) {
    var error = document.querySelector('.error');
    var errorButton = document.querySelector('.error__buttons:last-child');
    if (evt.target === error ||
      (evt.target === errorButton) || (evt.keyCode === window.DOM_VK.esc)) {
      error.remove();
      document.removeEventListener('click', closeErrorSection);
      evt.stopPropagation();
    }
  };

  var closeErrorSectionOnEsc = function (evt) {
    if (evt.keyCode === window.DOM_VK.esc) {
      closeErrorSection(evt);
      document.removeEventListener('keydown', closeErrorSectionOnEsc);
    }
  };

  // показываем окно с ошибкой загрузки с сервера
  var showError = function (message) {
    var errorSection = errorTempl.cloneNode(true);
    errorSection.querySelector('.error__title').textContent = 'Ошибка загрузки файла: ' + message;
    document.body.insertAdjacentElement('afterbegin', errorSection);
    document.addEventListener('click', closeErrorSection);
    document.addEventListener('keydown', closeErrorSectionOnEsc);
  };

  window.onError = function (message) {
    showError(message);
  };

  var closeSuccessSection = function (evt) {
    var success = document.querySelector('.success');
    var successButton = document.querySelector('.success__button');
    if (evt.target === success ||
      (evt.target === successButton) || (evt.keyCode === window.DOM_VK.esc)) {
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

  var closeSuccessSectionOnEsc = function (evt) {
    if (evt.keyCode === window.DOM_VK.esc) {
      closeSuccessSection(evt);
      document.removeEventListener('keydown', closeSuccessSectionOnEsc);
    }
  };

  var commentTempl = document.querySelector('#social__comment').content.querySelector('.social__comment');

  var createComment = function (comment) {
    var commentElement = commentTempl.cloneNode(true);
    commentElement.querySelector('.social__picture').src = comment.avatar;
    commentElement.querySelector('.social__picture').alt = comment.name;
    commentElement.querySelector('.social__text').textContent = comment.message;
    return commentElement;
  };

  var pictureTempl = document.querySelector('#picture')
    .content
    .querySelector('.picture');

  var createPicture = function (foto) {
    var pictureElem = pictureTempl.cloneNode(true);
    pictureElem.querySelector('.picture__img').src = foto.url;
    pictureElem.querySelector('.picture__likes').textContent = foto.likes;
    pictureElem.querySelector('.picture__comments').textContent = foto.maxComments;
    return pictureElem;
  };

  // src - фотография, которую выбрали для просмотра
  // возвращаем индекс этой фотографии в массиве userFotos
  var selectFoto = function (src) {
    for (var i = 0; i < window.userFotos.length; i++) {
      if (src.indexOf(window.userFotos[i].url, 0) > -1) {
        return i;
      }
    }
    return -1;
  };

  // обработчик клика мышки на фотографии
  var selectPicture = function (evt) {
    var index = selectFoto(evt.target.src);
    if (index > -1) {
      window.openBigPicturePopup(index);
    }
  };

  // обработчик нажатия клавиши Enter
  var onPopupPressEnter = function (evt) {
    if (evt.keyCode === window.DOM_VK.enter) {
      evt.preventDefault();
      var index = -1;
      for (var i = 0; i < userPictures.length; i++) {
        if (userPictures[i] === document.activeElement) {
          index = selectFoto(userPictures[i].firstElementChild.src);
          break;
        }
      }
      if (index >= 0) {
        window.openBigPicturePopup(index);
      }
    }
  };

  document.addEventListener('keydown', onPopupPressEnter);

  // эагружаем фотографии, полученные с сервера, на сайт
  var loadFotosData = function (data) {
    window.userFotos = [];
    for (var i = 0; i < data.length; i++) {
      if (i === FOTOS_COUNT) {
        break;
      }
      var fotoInfo = {};
      fotoInfo.url = data[i].url;
      fotoInfo.description = data[i].description;
      fotoInfo.likes = data[i].likes;
      fotoInfo.comments = [];
      fotoInfo.maxComments = data[i].comments.length;
      // создадим комментарии
      for (var j = 0; j < data[i].comments.length; j++) {
        fotoInfo.comments[j] = createComment(data[i].comments[j]);
      }
      window.userFotos[i] = fotoInfo;
    }

    var fragment = document.createDocumentFragment();
    window.userFotos.forEach(function (foto) {
      fragment.appendChild(createPicture(foto));
    });

    picturesBlock = document.querySelector('.pictures');
    picturesBlock.appendChild(fragment);
    userPictures = document.querySelectorAll('.picture');

    userPictures.forEach(function (picture) {
      picture.addEventListener('click', selectPicture);
    });
  };

  // загрузка фотографий с сервера
  window.load(onLoad, window.onError);
})();

