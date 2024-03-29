// effects.js
'use strict';

(function () {
  var SCALE_STEP = 25;
  var MAX_SCALE_VALUE = 100;
  var FILTERS_MIN_VALUE = 0;
  var CHROM_FILTER_MAX_VALUE = 1.0;
  var SEPIA_FILTER_MAX_VALUE = 1.0;
  var MARVIN_FILTER_MAX_VALUE = 100;
  var PHOBOS_FILTER_MAX_VALUE = 3;
  var HEAT_FILTER_MIN_VALUE = 1.0;
  var HEAT_FILTER_MAX_VALUE = 3.0;

  var effectStyles = [
    {
      name: 'none',
      filter: '',
      min: FILTERS_MIN_VALUE,
      max: FILTERS_MIN_VALUE,
      value: FILTERS_MIN_VALUE,
      suffix: ''
    },
    {
      name: 'chrome',
      filter: 'grayscale',
      min: FILTERS_MIN_VALUE,
      max: CHROM_FILTER_MAX_VALUE,
      value: window.slider.MAX_SLIDER_VALUE,
      suffix: ''
    },
    {
      name: 'sepia',
      filter: 'sepia',
      min: FILTERS_MIN_VALUE,
      max: SEPIA_FILTER_MAX_VALUE,
      value: window.slider.MAX_SLIDER_VALUE,
      suffix: ''
    },
    {
      name: 'marvin',
      filter: 'invert',
      min: FILTERS_MIN_VALUE,
      max: MARVIN_FILTER_MAX_VALUE,
      value: window.slider.MAX_SLIDER_VALUE,
      suffix: '%'
    },
    {
      name: 'phobos',
      filter: 'blur',
      min: FILTERS_MIN_VALUE,
      max: PHOBOS_FILTER_MAX_VALUE,
      value: window.slider.MAX_SLIDER_VALUE,
      suffix: 'px'
    },
    {
      name: 'heat',
      filter: 'brightness',
      min: HEAT_FILTER_MIN_VALUE,
      max: HEAT_FILTER_MAX_VALUE,
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
    },
    resetScale: function () {
      scaleControlValue.value = MAX_SCALE_VALUE.toString() + '%';
    }
  };

  // показ окна редактирования изображения
  var imageUploadPopup = document.querySelector('.img-upload__overlay');
  var slider = imageUploadPopup.querySelector('.effect-level');
  // кнопки масштабирования
  var smallerScaleButton = imageUploadPopup.querySelector('.scale__control--smaller');
  var biggerScaleButton = imageUploadPopup.querySelector('.scale__control--bigger');
  var scaleControlValue = imageUploadPopup.querySelector('.scale__control--value');

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
      // при изменении фильтра сбросим уровень расыщенности
      sliderInfo.valueObject.setAttribute('value', window.slider.MAX_SLIDER_VALUE.toString());
      effectStyle.value = window.slider.MAX_SLIDER_VALUE;
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
    var scale = parseInt(scaleControlValue.value.slice(0, scaleControlValue.value.length - 1), 10);
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
    scaleControlValue.value = scale.toString() + '%';
    scaleControlValue.setAttribute('value', scale.toString() + '%');
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
