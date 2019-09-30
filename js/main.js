'use strict';

var FOTOS_COUNT = 25;
var AVATAR_COUNT = 6;
var MIN_LIKES = 15;
var MAX_LIKES = 200;
var MAX_COMMENTS = 3;
var DOM_VK_ESC = 0x1B;
var SCALE_STEP = 25;
var MAX_SCALE_VALUE = 100;
var HASHTAGS_MAX_COUNT = 5;
var HASHTAG_MAX_LENGTH = 20;
var MAX_DESCR_LENGTH = 140;

var MESSAGES = [
  'Всё отлично',
  'В целом все неплохо',
  'Когда Вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрфессионально',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент'
];

var AUTOR_NAMES = [
  'Иван',
  'Марья',
  'Людмила',
  'Александр',
  'Ирина',
  'Николай',
  'Олег',
  'Алексей',
  'Марина',
  'Андрей',
  'Степан',
  'Надежда'
];

var effectStyles = [
  {
    name: 'none',
    filter: ''
  },
  {
    name: 'chrome',
    filter: 'grayscale',
    min: 0,
    max: 1.0,
    suff: ''
  },
  {
    name: 'sepia',
    filter: 'sepia',
    min: 0,
    max: 1.0,
    suff: ''
  },
  {
    name: 'marvin',
    filter: 'invert',
    min: 0,
    max: 100,
    suff: '%'
  },
  {
    name: 'phobos',
    filter: 'blur',
    min: 0,
    max: 3,
    suff: 'px'
  },
  {
    name: 'heat',
    filter: 'brightness',
    min: 1.0,
    max: 3.0,
    suff: ''
  }
];

var getRandomIndex = function (upperLimit) {
  return Math.floor(Math.random() * upperLimit);
};

var getRandomAutorName = function () {
  return AUTOR_NAMES[getRandomIndex(AUTOR_NAMES.length)];
};

var getRandomMessage = function () {
  return MESSAGES[getRandomIndex(MESSAGES.length)];
};

var getRandomValue = function (upperLimit) {
  return Math.ceil(Math.random() * upperLimit);
};

var getRandomComments = function (comments) {
  var comentsCount = getRandomValue(MAX_COMMENTS);
  for (var i = 0; i < comentsCount; i++) {
    var comment = {};
    comment.name = getRandomAutorName();
    comment.message = getRandomMessage();
    comment.avatar = getRandomAvatar();
    comments[i] = comment;
  }
};

var getRandomAvatar = function () {
  return 'img/avatar-' + getRandomValue(AVATAR_COUNT) + '.svg';
};

var getRandomLikes = function () {
  return getRandomValue(MAX_LIKES - MIN_LIKES) + MIN_LIKES;
};

var userFotos = [];

var createFotosData = function () {
  var fotos = [];
  for (var i = 0; i < FOTOS_COUNT; i++) {
    var fotoInfo = {};
    fotoInfo.url = 'photos/' + (i + 1) + '.jpg';
    fotoInfo.description = 'Описание фотографии';
    fotoInfo.likes = getRandomLikes();
    fotoInfo.comments = [];
    getRandomComments(fotoInfo.comments);
    fotos[i] = fotoInfo;
  }
  return fotos;
};

var renderPicture = function (foto) {
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
  fragment.appendChild(renderPicture(userFotos[i]));
}
var picturesBlock = document.querySelector('.pictures');
picturesBlock.appendChild(fragment);

var createComment = function (comment) {
  var commentElement = commentTempl.cloneNode(true);
  commentElement.querySelector('.social__picture').src = comment.avatar;
  commentElement.querySelector('.social__picture').alt = comment.name;
  commentElement.querySelector('.social__text').textContent = comment.message;
  return commentElement;
};

var hashtagsInput = document.querySelector('.text__hashtags');
var textDescrInput = document.querySelector('.text__description');
var bigPicture = document.querySelector('.big-picture');

// показ формы редактирования изображения
var imgUploadForm = document.querySelector('#upload-select-image');
var imgUploadPopup = document.querySelector('.img-upload__overlay');
var submitButton = imgUploadPopup.querySelector('.img-upload__submit');
// пин слайдера уровня насыщенности эффекта
var effectLevelPin = imgUploadPopup.querySelector('.effect-level__pin');
var effectLevelDepth = imgUploadPopup.querySelector('.effect-level__depth');
// кнопки масштабирования
var smallerScaleButton = imgUploadPopup.querySelector('.scale__control--smaller');
var biggerScaleButton = imgUploadPopup.querySelector('.scale__control--bigger');
// текущий эффект
var currentEffect = 'none';
// убираем слайдер
imgUploadPopup.querySelector('.effect-level').classList.add('hidden');

// обработчик нажатия клавиши Esc
var onPopupPressEsc = function (evt) {
  if (evt.keyCode === DOM_VK_ESC) {
    if (hashtagsInput === document.activeElement) {
      return;
    }
    if (textDescrInput === document.activeElement) {
      return;
    }
    if (!bigPicture.classList.contains('hidden')) {
      closePopup();
    } else if (!imgUploadPopup.classList.contains('hidden')) {
      closeImgPopup();
    }
  }
};

var closePopup = function () {
  bigPicture.classList.add('hidden');
  document.removeEventListener('keydown', onPopupPressEsc);
};

var bigPictureCancel = document.querySelector('.big-picture__cancel');
bigPictureCancel.addEventListener('click', function () {
  closePopup();
});

// показ элемента .big-picture
// bigPicture.classList.remove('hidden');
document.addEventListener('keydown', onPopupPressEsc);

document.querySelector('.big-picture__img').firstElementChild.src = userFotos[0].url;
document.querySelector('.likes-count').textContent = userFotos[0].likes;
document.querySelector('.comments-count').textContent = userFotos[0].comments.length;
document.querySelector('.social__caption').textContent = userFotos[0].description;

// блок комментариев
var commentsBlock = document.querySelector('.social__comments');
// удаление временных комментариев из блока
commentsBlock.innerHTML = '';
// добавление комментариев в блок
var commentTempl = document.querySelector('#social__comment').content.querySelector('.social__comment');
fragment = document.createDocumentFragment();
for (i = 0; i < userFotos[0].comments.length; i++) {
  fragment.appendChild(createComment(userFotos[0].comments[i]));
}
commentsBlock.appendChild(fragment);

document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.comments-loader').classList.add('visually-hidden');

var uploadFile = document.querySelector('#upload-file');
var cancelButton = document.querySelector('#upload-cancel');

var openImgPopup = function () {
  imgUploadPopup.classList.remove('hidden');
  document.addEventListener('keydown', onPopupPressEsc);
};

var closeImgPopup = function () {
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
// обработка событий ползунка для управления эффектами
//
// получить положение ползунка
var getLevelPinPosition = function (evt) {
  var slider = imgUploadPopup.querySelector('.effect-level');
  var rect = slider.getBoundingClientRect();
  var pos = MAX_SCALE_VALUE * (evt.clientX - rect.left) / rect.width;
  if (pos > MAX_SCALE_VALUE) {
    pos = MAX_SCALE_VALUE;
  } else if (pos < 0) {
    pos = 0;
  }
  return Math.floor(pos);
};

// установить положение ползунка и применить эффект
var setLevelPinPosition = function (evt) {
  if (evt.which === 1) {
    var levelValue = imgUploadPopup.querySelector('.effect-level__value');
    levelValue.value = getLevelPinPosition(evt);
    var pos = levelValue.value.toString() + '%';
    effectLevelPin.style.left = pos;
    effectLevelDepth.style.width = pos;
    if (!(currentEffect === 'none')) {
      // применим эффект
      var preview = imgUploadPopup.querySelector('.img-upload__preview');
      var effectStyle = effectStyles[0];
      for (var j = 0; j < effectStyles.length; j++) {
        if (effectStyles[j].name === currentEffect) {
          effectStyle = effectStyles[j];
          break;
        }
      }
      var slider = imgUploadPopup.querySelector('.effect-level');
      var filterStep = (effectStyle.max - effectStyle.min) * levelValue.value / 100;
      var filterValue = effectStyle.min + filterStep;
      if (effectStyle.max > 1) {
        filterValue = Math.ceil(filterValue);
      }
      slider.querySelector('.effect-level__value').value = filterValue.toString() + effectStyle.suff;
      // откорректируем фильтр в CSS
      var filter = effectStyle.filter + '(' + filterValue.toString() + effectStyle.suff + ')';
      preview.style.filter = filter;
    }
  }
};

var onMouseUp = function (evt) {
  evt.preventDefault();
  document.removeEventListener('mousemove', onMouseMove);
  effectLevelPin.removeEventListener('mouseup', onMouseUp);
};

effectLevelPin.addEventListener('mouseup', onMouseUp);

effectLevelPin.addEventListener('mousedown', function (evt) {
  evt.preventDefault();
});

var onMouseMove = function (evt) {
  evt.preventDefault();
  setLevelPinPosition(evt);
};

document.addEventListener('mousemove', onMouseMove);

//
// определение выбранного эффекта
//
var getEffect = function (evt) {
  if (evt.target.classList.contains('effects__radio')) {
    return evt.target.value;
  }
  return null;
};

var setEffect = function (evt) {
  var effect = getEffect(evt);
  if (effect === null) {
    // обходим span
    return;
  }
  var effectStyle = effectStyles[0];
  for (var j = 0; j < effectStyles.length; j++) {
    if (effectStyles[j].name === effect) {
      effectStyle = effectStyles[j];
      break;
    }
  }

  var preview = imgUploadPopup.querySelector('.img-upload__preview');
  var slider = imgUploadPopup.querySelector('.effect-level');
  if (!(currentEffect === 'none')) {
    // удалим предыдущий фильтр из списка классов
    var effectClass = 'effects__preview--' + currentEffect;
    if (preview.classList.contains(effectClass)) {
      preview.classList.remove(effectClass);
    }
  }
  if (effectStyle.name === 'none') {
    // устанавливаем начальное значение ползунка
    effectLevelPin.style.left = 0;
    effectLevelDepth.style.width = 0;
    // скрываем слайдер
    if (!slider.classList.contains('hidden')) {
      slider.classList.add('hidden');
    }
    preview.style.filter = '';
  } else {
    // показываем слайдер
    if (slider.classList.contains('hidden')) {
      slider.classList.remove('hidden');
    }
    // добавляем фильтр с список классов
    effectClass = 'effects__preview--' + effect;
    preview.classList.add(effectClass);
    // добавляем фильтр в CSS
    var filter = effectStyle.filter + '(' + effectStyle.min.toString() + effectStyle.suff + ')';
    // preview.style.filter = effectStyle.filter + '(' + effectStyle.min.toString() + effectStyle.suff + ')';
    preview.style.filter = filter;
    // устанавливаем начальное значение ползунка
    effectLevelPin.style.left = 0;
    effectLevelDepth.style.width = 0;
    // устанавливаем начальное значение фильтра
    slider.querySelector('.effect-level__value').value = effectStyle.min.toString() + effectStyle.suff;
  }
  currentEffect = effect;
};

imgUploadPopup.querySelector('.effects__list').addEventListener('click', function (evt) {
  setEffect(evt);
});

//
// обработка изменения масштаба
//
var scaleHandler = function (evt) {
  var valueElem = imgUploadPopup.querySelector('.scale__control--value');
  var scale = parseInt(valueElem.value.slice(0, valueElem.value.length - 1), 10);
  if (evt.target === smallerScaleButton) {
    scale -= SCALE_STEP;
    if (scale < SCALE_STEP) {
      scale = SCALE_STEP;
    }
  } else if (evt.target === biggerScaleButton) {
    scale += SCALE_STEP;
    if (scale > MAX_SCALE_VALUE) {
      scale = MAX_SCALE_VALUE;
    }
  }
  valueElem.value = scale.toString() + '%';
  var fScale = scale / 100.0;
  imgUploadPopup.querySelector('.img-upload__preview').style.transform = 'scale(' + fScale.toString() + ')';
};

smallerScaleButton.addEventListener('click', function (evt) {
  scaleHandler(evt);
});

biggerScaleButton.addEventListener('click', function (evt) {
  scaleHandler(evt);
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

textDescrInput.addEventListener('input', function (evt) {
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
});

//
// отправка данных формы после валидации
//
var sendFormData = function () {
  if (imgUploadForm.checkValidity()) {
    imgUploadForm.submit();
    return true;
  }
  return false;
};

var resetImgUploadPopup = function () {
  var preview = imgUploadPopup.querySelector('.img-upload__preview');
  preview.style.filter = '';
  if (!(currentEffect === 'none')) {
    // удалим текущий фильтр из списка классов
    var effectClass = 'effects__preview--' + currentEffect;
    if (preview.classList.contains(effectClass)) {
      preview.classList.remove(effectClass);
    }
    currentEffect = 'none';
    imgUploadPopup.querySelector('.effect-level__value').value = 0;
    imgUploadPopup.querySelector('.img-upload__preview').style.transform = 'scale(100)';
    imgUploadPopup.querySelector('.scale__control--value').value = '100%';
    hashtagsInput.value = '';
    textDescrInput.value = '';
  }
};

var submitClickHandler = function (evt) {
  if (sendFormData()) {
    resetImgUploadPopup();
    closeImgPopup();
  } else {
    evt.preventDefault();
  }
};

submitButton.addEventListener('click', submitClickHandler);
