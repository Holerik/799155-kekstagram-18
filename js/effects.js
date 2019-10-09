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
  var slider = imgUploadPopup.querySelector('.effect-level');
  // кнопки масштабирования
  var smallerScaleButton = imgUploadPopup.querySelector('.scale__control--smaller');
  var biggerScaleButton = imgUploadPopup.querySelector('.scale__control--bigger');
  // текущий эффект
  window.currentEffect = 'none';
  // убираем слайдер
  slider.classList.add('hidden');

  var sliderInfo = {
    // объект слайдер
    sliderObj: slider,
    // пин слайдера уровня насыщенности эффекта
    pinObj: slider.querySelector('.effect-level__pin'),
    // полоска слайдера уровня насыщенности эффекта
    depthObj: slider.querySelector('.effect-level__depth'),
    // числовое значение слайдера
    valueObj: slider.querySelector('.effect-level__value')
  };

  var callBackSliderFunc = function (sliderData) {
    if (!(sliderData === null)) {
      sliderData.sliderObj = sliderInfo.sliderObj;
      sliderData.pinObj = sliderInfo.pinObj;
      sliderData.depthObj = sliderInfo.depthObj;
      sliderData.valueObj = sliderInfo.valueObj;
    } else {
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
        var sliderPos = sliderInfo.valueObj.value;
        var filterStep = (effectStyle.max - effectStyle.min) * sliderPos / 100;
        var filterValue = effectStyle.min + filterStep;
        if (effectStyle.max > 1) {
          filterValue = Math.ceil(filterValue);
        }
        sliderInfo.valueObj.value = filterValue.toString();
        // откорректируем фильтр в CSS
        var filter = effectStyle.filter + '(' + filterValue.toString() + effectStyle.suff + ')';
        preview.style.filter = filter;
      }
    }
  };

  // инициализация слайдера
  window.initSlider(callBackSliderFunc);

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
    if (!(window.currentEffect === 'none')) {
      // удалим предыдущий фильтр из списка классов
      var effectClass = 'effects__preview--' + window.currentEffect;
      if (preview.classList.contains(effectClass)) {
        preview.classList.remove(effectClass);
      }
    }
    if (effectStyle.name === 'none') {
      // устанавливаем начальное значение ползунка
      window.resetSlider();
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
      window.resetSlider();
    }
    return effect;
  };

  imgUploadPopup.querySelector('.effects__list').addEventListener('click', function (evt) {
    var effect = setEffect(evt);
    if (!(effect === null)) {
      window.currentEffect = effect;
    }
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

})();
