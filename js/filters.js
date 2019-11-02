// filters.js
'use strict';
(function () {
  window.filter = null;

  var filter = {
    onPopularFilter: function () {},
    onRandomFilter: function () {},
    onDiscussFilter: function () {}
  };

  var popButton = document.querySelector('#filter-popular');
  var randButton = document.querySelector('#filter-random');
  var discButton = document.querySelector('#filter-discussed');

  var pressPopButton = function () {
    if (randButton.classList.contains('img-filters__button--active')) {
      randButton.classList.remove('img-filters__button--active');
    }
    if (discButton.classList.contains('img-filters__button--active')) {
      discButton.classList.remove('img-filters__button--active');
    }
    popButton.classList.add('img-filters__button--active');
    window.filter.onPopularFilter();
  };

  popButton.addEventListener('click', pressPopButton);
  popButton.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.DOM_VK.enter) {
      pressPopButton();
    }
  });

  var pressRandButton = function () {
    if (popButton.classList.contains('img-filters__button--active')) {
      popButton.classList.remove('img-filters__button--active');
    }
    if (discButton.classList.contains('img-filters__button--active')) {
      discButton.classList.remove('img-filters__button--active');
    }
    randButton.classList.add('img-filters__button--active');
    window.filter.onRandomFilter();
  };

  randButton.addEventListener('click', pressRandButton);
  randButton.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.DOM_VK.enter) {
      pressRandButton();
    }
  });

  var pressDiscButton = function () {
    if (popButton.classList.contains('img-filters__button--active')) {
      popButton.classList.remove('img-filters__button--active');
    }
    if (randButton.classList.contains('img-filters__button--active')) {
      randButton.classList.remove('img-filters__button--active');
    }
    discButton.classList.add('img-filters__button--active');
    window.filter.onDiscussFilter();
  };

  discButton.addEventListener('click', pressDiscButton);
  discButton.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.DOM_VK.enter) {
      pressDiscButton();
    }
  });

  window.filter = filter;
})();
