// effects.js
'use strict';

(function () {
  var SCALE_STEP = 25;
  var MAX_SCALE_VALUE = 100;

  var effectStyles = [
    {
      name: 'none',
      filter: '',
      min: 0,
      max: 0,
      value: 0,
      suffix: ''
    },
    {
      name: 'chrome',
      filter: 'grayscale',
      min: 0,
      max: 1.0,
      value: window.slider.MAX_SLIDER_VALUE,
      suffix: ''
    },
    {
      name: 'sepia',
      filter: 'sepia',
      min: 0,
      max: 1.0,
      value: window.slider.MAX_SLIDER_VALUE,
      suffix: ''
    },
    {
      name: 'marvin',
      filter: 'invert',
      min: 0,
      max: 100,
      value: window.slider.MAX_SLIDER_VALUE,
      suffix: '%'
    },
    {
      name: 'phobos',
      filter: 'blur',
      min: 0,
      max: 3,
      value: window.slider.MAX_SLIDER_VALUE,
      suffix: 'px'
    },
    {
      name: 'heat',
      filter: 'brightness',
      min: 1.0,
      max: 3.0,
      value: window.slider.MAX_SLIDER_VALUE,
      suffix: ''
    }
  ];

  window.effects = {
  // текущий эффект
    currentEffect: 'none',
    resetEffects: function () {
      effectStyles.forEach(function (style) {
        style.value = window.slider.MAX_SLIDER_VALUE;
      });
    }
  };

  // показ окна редактирования изображения
  var imageUploadPopup = document.querySelector('.img-upload__overlay');
  var slider = imageUploadPopup.querySelector('.effect-level');
  // кнопки масштабирования
  var smallerScaleButton = imageUploadPopup.querySelector('.scale__control--smaller');
  var biggerScaleButton = imageUploadPopup.querySelector('.scale__control--bigger');

  // убираем слайдер
  slider.classList.add('hidden');

  var sliderInfo = {
    // объект слайдер
    sliderObject: slider,
    // пин слайдера уровня насыщенности эффекта
    pinObject: slider.querySelector('.effect-level__pin'),
    // полоска слайдера уровня насыщенности эффекта
    depthObject: slider.querySelector('.effect-level__depth'),
    // числовое значение слайдера
    valueObject: slider.querySelector('.effect-level__value')
  };

  sliderInfo.valueObject.style.position = 'absolute';

  var setFilterValue = function (preview, effectStyle) {
    var filterStep = (effectStyle.max - effectStyle.min) *
        effectStyle.value / window.slider.MAX_SLIDER_VALUE;
    var filterValue = effectStyle.min + filterStep;
    if (effectStyle.max > 1) {
      filterValue = Math.ceil(filterValue);
    }
    // откорректируем фильтр в CSS
    preview.style.filter = effectStyle.filter +
    '(' + filterValue.toString() + effectStyle.suffix + ')';
  };

  var callbackSliderFunction = function (sliderData) {
    if (!(sliderData === null)) {
      sliderData.sliderObject = sliderInfo.sliderObject;
      sliderData.pinObject = sliderInfo.pinObject;
      sliderData.depthObject = sliderInfo.depthObject;
      sliderData.valueObject = sliderInfo.valueObject;
    } else {
      if (!(window.effects.currentEffect === 'none')) {
        // применим эффект
        var preview = imageUploadPopup.querySelector('.img-upload__preview');
        var effectStyle = getEffectStyle(window.effects.currentEffect);
        effectStyle.value = sliderInfo.valueObject.value;
        setFilterValue(preview, effectStyle);
        sliderInfo.valueObject.min = effectStyle.min;
        sliderInfo.valueObject.max = effectStyle.max;
      }
    }
  };

  // инициализация слайдера
  window.slider.initSlider(callbackSliderFunction);
  //
  // определение выбранного эффекта
  //
  var getEffectName = function (evt) {
    if (evt.target.classList.contains('effects__radio')) {
      return evt.target.value;
    }
    return null;
  };

  var getEffectStyle = function (effect) {
    var effectStyle = effectStyles[0];
    effectStyles.some(function (style) {
      if (style.name === effect) {
        effectStyle = style;
        return true;
      }
      return false;
    });
    return effectStyle;
  };

  var setEffect = function (evt) {
    var effect = getEffectName(evt);
    if (effect === null) {
      // обходим span
      return null;
    }
    var effectStyle = getEffectStyle(effect);
    var preview = imageUploadPopup.querySelector('.img-upload__preview');

    if (!(window.effects.currentEffect === 'none')) {
      // удалим предыдущий фильтр из списка классов
      var effectClass = 'effects__preview--' + window.effects.currentEffect;
      if (preview.classList.contains(effectClass)) {
        preview.classList.remove(effectClass);
      }
    }
    if (effectStyle.name === 'none') {
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
      setFilterValue(preview, effectStyle);
    }
    return effect;
  };

  imageUploadPopup.querySelector('.effects__list').addEventListener('click', function (evt) {
    var effect = setEffect(evt);
    if (!(effect === null)) {
      window.effects.currentEffect = effect;
      // устанавливаем начальное значение ползунка
      window.slider.setSlider(getEffectStyle(effect));
    }
  });
  //
  // обработка изменения масштаба
  //
  var scaleHandler = function (evt) {
    var valueElement = imageUploadPopup.querySelector('.scale__control--value');
    var scale = parseInt(valueElement.value.slice(0, valueElement.value.length - 1), 10);
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
    valueElement.value = scale.toString() + '%';
    var formattedScale = scale / MAX_SCALE_VALUE;
    imageUploadPopup.querySelector('.img-upload__preview').style.transform = 'scale(' + formattedScale.toString() + ')';
  };

  smallerScaleButton.addEventListener('click', function (evt) {
    scaleHandler(evt);
  });

  biggerScaleButton.addEventListener('click', function (evt) {
    scaleHandler(evt);
  });

})();
