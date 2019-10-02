// effects.js
'use strict';

(function () {
  var SCALE_STEP = 25;
  var MAX_SCALE_VALUE = 100;

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

  // показ окна редактирования изображения
  var imgUploadPopup = document.querySelector('.img-upload__overlay');
  // пин слайдера уровня насыщенности эффекта
  var effectLevelPin = imgUploadPopup.querySelector('.effect-level__pin');
  var effectLevelDepth = imgUploadPopup.querySelector('.effect-level__depth');
  // кнопки масштабирования
  var smallerScaleButton = imgUploadPopup.querySelector('.scale__control--smaller');
  var biggerScaleButton = imgUploadPopup.querySelector('.scale__control--bigger');
  // текущий эффект
  window.currentEffect = 'none';
  // убираем слайдер
  imgUploadPopup.querySelector('.effect-level').classList.add('hidden');

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
      if (!(window.currentEffect === 'none')) {
        // применим эффект
        var preview = imgUploadPopup.querySelector('.img-upload__preview');
        var effectStyle = effectStyles[0];
        for (var j = 0; j < effectStyles.length; j++) {
          if (effectStyles[j].name === window.currentEffect) {
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
      return null;
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
    if (!(window.currentEffect === 'none')) {
      // удалим предыдущий фильтр из списка классов
      var effectClass = 'effects__preview--' + window.currentEffect;
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
      preview.style.filter = effectStyle.filter + '(' + effectStyle.min.toString() + effectStyle.suff + ')';
      // устанавливаем начальное значение ползунка
      effectLevelPin.style.left = 0;
      effectLevelDepth.style.width = 0;
      // устанавливаем начальное значение фильтра
      slider.querySelector('.effect-level__value').value = effectStyle.min.toString() + effectStyle.suff;
    }
    return effect;
  };

  imgUploadPopup.querySelector('.effects__list').addEventListener('click', function (evt) {
    window.currentEffect = setEffect(evt);
  });

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

})();
