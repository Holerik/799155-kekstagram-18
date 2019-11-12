// slider.js
'use strict';

(function () {


  // даные для инициализации слайдера
  var sliderData = {
    sliderObject: null,
    pinObject: null,
    depthObject: null,
    valueObject: null
  };

  window.slider = {
    MAX_SLIDER_VALUE: 100,
    initSlider: function (callback) {
      callbackFunction = callback;
      callbackFunction(sliderData);
    },
    setSlider: function (style) {
      setSliderPosition(style.value);
    }
  };

  var callbackFunction = null;
  var mouseDown = false;
  var dragMouse = false;

  // получить положение ползунка
  var getPinPosition = function (evt) {
    var rect = sliderData.sliderObject.getBoundingClientRect();
    var pos = window.slider.MAX_SLIDER_VALUE * (evt.clientX - rect.left) / rect.width;
    if (pos > window.slider.MAX_SLIDER_VALUE) {
      pos = window.slider.MAX_SLIDER_VALUE;
    } else if (pos < 0) {
      pos = 0;
    }
    return Math.floor(pos);
  };

  var testMousePos = function (evt) {
    if (mouseDown) {
      return true;
    }
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

  var mouseUpHandler = function (upEvent) {
    upEvent.preventDefault();
    if (mouseDown) {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    }
    if (dragMouse) {
      var preventDefaultClickHandler = function (evt) {
        evt.preventDefault();
        document.removeEventListener('click', preventDefaultClickHandler);
      };
      document.addEventListener('click', preventDefaultClickHandler);
    }
    mouseDown = false;
    dragMouse = false;
  };

  var mouseDownHandler = function (evt) {
    if (testMousePos(evt)) {
      evt.preventDefault();
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
      mouseDown = true;
    }
  };

  document.addEventListener('mousedown', mouseDownHandler);

  var mouseMoveHandler = function (evt) {
    if (mouseDown) {
      evt.preventDefault();
      setPinPosition(evt);
      dragMouse = true;
    }
  };

  document.addEventListener('mousemove', mouseMoveHandler);

})();
