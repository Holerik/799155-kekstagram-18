// filters.js
'use strict';
(function () {
  window.filter = null;

  var filter = {
    selectPopularPhotos: function () {},
    selectRandomPhotos: function () {},
    selectDiscussedPhotos: function () {}
  };

  var popularFilterButton = document.querySelector('#filter-popular');
  var randomFilterButton = document.querySelector('#filter-random');
  var discussedFilterButton = document.querySelector('#filter-discussed');

  var popularFilterButtonClickHandler = function () {
    if (randomFilterButton.classList.contains('img-filters__button--active')) {
      randomFilterButton.classList.remove('img-filters__button--active');
    }
    if (discussedFilterButton.classList.contains('img-filters__button--active')) {
      discussedFilterButton.classList.remove('img-filters__button--active');
    }
    popularFilterButton.classList.add('img-filters__button--active');
    window.filter.selectPopularPhotos();
  };

  popularFilterButton.addEventListener('click', popularFilterButtonClickHandler);
  popularFilterButton.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.DOM_VK.ENTER) {
      popularFilterButtonClickHandler();
    }
  });

  var randomFilterButtonClickHandler = function () {
    if (popularFilterButton.classList.contains('img-filters__button--active')) {
      popularFilterButton.classList.remove('img-filters__button--active');
    }
    if (discussedFilterButton.classList.contains('img-filters__button--active')) {
      discussedFilterButton.classList.remove('img-filters__button--active');
    }
    randomFilterButton.classList.add('img-filters__button--active');
    window.filter.selectRandomPhotos();
  };

  randomFilterButton.addEventListener('click', randomFilterButtonClickHandler);
  randomFilterButton.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.DOM_VK.ENTER) {
      randomFilterButtonClickHandler();
    }
  });

  var discussedFilterButtonClickHandler = function () {
    if (popularFilterButton.classList.contains('img-filters__button--active')) {
      popularFilterButton.classList.remove('img-filters__button--active');
    }
    if (randomFilterButton.classList.contains('img-filters__button--active')) {
      randomFilterButton.classList.remove('img-filters__button--active');
    }
    discussedFilterButton.classList.add('img-filters__button--active');
    window.filter.selectDiscussedPhotos();
  };

  discussedFilterButton.addEventListener('click', discussedFilterButtonClickHandler);
  discussedFilterButton.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.DOM_VK.ENTER) {
      discussedFilterButtonClickHandler();
    }
  });

  window.filter = filter;
})();
