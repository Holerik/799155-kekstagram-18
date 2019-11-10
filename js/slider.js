// slider.js
'use strict';

(function () {

  var MAX_SLIDER_VALUE = 100;

  // даные для инициализации слайдера
  var sliderData = {
    sliderObject: null,
    pinObject: null,
    depthObject: null,
    valueObject: null
  };

  window.slider = {
    initSlider: function (callback) {
      callbackFunction = callback;
      callbackFunction(sliderData);
      sliderData.pinObject.addEventListener('mouseup', mouseUpHandler);
      sliderData.pinObject.addEventListener('mousedown', function (evt) {
        evt.preventDefault();
      });
    },
    resetSlider: function () {
      sliderData.pinObject.style.left = 0;
      sliderData.depthObject.style.width = 0;
      sliderData.valueObject.value = 0;
    },
    setSlider: function (style) {
      setSliderPosition(style.value);
    }
  };

  var callbackFunction = null;

  // получить положение ползунка
  var getPinPosition = function (evt) {
    var rect = sliderData.sliderObject.getBoundingClientRect();
    var pos = MAX_SLIDER_VALUE * (evt.clientX - rect.left) / rect.width;
    if (pos > MAX_SLIDER_VALUE) {
      pos = MAX_SLIDER_VALUE;
    } else if (pos < 0) {
      pos = 0;
    }
    return Math.floor(pos);
  };

  var testMousePos = function (evt) {
    var rect = sliderData.sliderObject.getBoundingClientRect();
    if (!(evt.which === 1) || (evt.clientY < rect.top) ||
        (evt.clientY > rect.bottom) ||
        (evt.clientX < rect.left) || (evt.clientX > rect.right)) {
      return false;
    }
    return true;
  };

  var setSliderPosition = function (position) {
    sliderData.valueObject.value = position;
    var pos = position.toString() + '%';
    sliderData.pinObject.style.left = pos;
    sliderData.depthObject.style.width = pos;
    callbackFunction(null);
  };

  // установить положение ползунка
  var setPinPosition = function (evt) {
    if (callbackFunction === null) {
      return;
    }
    if (testMousePos(evt)) {
      var sliderPos = getPinPosition(evt);
      setSliderPosition(sliderPos);
    }
  };

  var mouseUpHandler = function (evt) {
    evt.preventDefault();
    document.removeEventListener('mousemove', mouseMoveHandler);
    sliderData.pinObject.removeEventListener('mouseup', mouseUpHandler);
  };

  var mouseDownHandler = function (evt) {
    if (testMousePos(evt)) {
      evt.preventDefault();
      document.addEventListener('mousemove', mouseMoveHandler);
      sliderData.pinObject.addEventListener('mouseup', mouseUpHandler);
    }
  };

  document.addEventListener('mousedown', mouseDownHandler);

  var mouseMoveHandler = function (evt) {
    evt.preventDefault();
    setPinPosition(evt);
  };

  document.addEventListener('mousemove', mouseMoveHandler);

})();
