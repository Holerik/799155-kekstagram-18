// slider.js
'use strict';

(function () {

  var MAX_SLIDER_VALUE = 100;

  // даные для инициализации слайдера
  var sliderData = {
    sliderObj: null,
    pinObj: null,
    depthObj: null,
    valueObj: null
  };

  var sliderPos = 0;
  var callBackFunction = null;

  window.initSlider = function (callBackFunc) {
    callBackFunction = callBackFunc;
    callBackFunction(sliderData);
    sliderData.pinObj.addEventListener('mouseup', onMouseUp);
    sliderData.pinObj.addEventListener('mousedown', function (evt) {
      evt.preventDefault();
    });
  };

  window.resetSlider = function () {
    sliderData.pinObj.style.left = 0;
    sliderData.depthObj.style.width = 0;
  };

  // получить положение ползунка
  var getPinPosition = function (evt) {
    var rect = sliderData.sliderObj.getBoundingClientRect();
    var pos = MAX_SLIDER_VALUE * (evt.clientX - rect.left) / rect.width;
    if (pos > MAX_SLIDER_VALUE) {
      pos = MAX_SLIDER_VALUE;
    } else if (pos < 0) {
      pos = 0;
    }
    return Math.floor(pos);
  };

  var testMousePos = function (evt) {
    var rect = sliderData.sliderObj.getBoundingClientRect();
    if (!(evt.which === 1) || (evt.clientY < rect.top) ||
        (evt.clientY > rect.bottom) ||
        (evt.clientX < rect.left) || (evt.clientX > rect.right)) {
      return false;
    }
    return true;
  };

  // установить положение ползунка
  var setPinPosition = function (evt) {
    if (testMousePos(evt)) {
      sliderPos = getPinPosition(evt);
      sliderData.valueObj.value = sliderPos;
      var pos = sliderPos.toString() + '%';
      sliderData.pinObj.style.left = pos;
      sliderData.depthObj.style.width = pos;
      callBackFunction(null);
    }
  };

  var onMouseUp = function (evt) {
    evt.preventDefault();
    document.removeEventListener('mousemove', onMouseMove);
    sliderData.pinObj.removeEventListener('mouseup', onMouseUp);
  };

  var onMouseMove = function (evt) {
    evt.preventDefault();
    setPinPosition(evt);
  };

  document.addEventListener('mousemove', onMouseMove);

})();
