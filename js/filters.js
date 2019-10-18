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

  popButton.addEventListener('click', function () {
    if (randButton.classList.contains('img-filters__button--active')) {
      randButton.classList.remove('img-filters__button--active');
    }
    if (discButton.classList.contains('img-filters__button--active')) {
      discButton.classList.remove('img-filters__button--active');
    }
    popButton.classList.add('img-filters__button--active');
    window.filter.onPopularFilter();
  });

  randButton.addEventListener('click', function () {
    if (popButton.classList.contains('img-filters__button--active')) {
      popButton.classList.remove('img-filters__button--active');
    }
    if (discButton.classList.contains('img-filters__button--active')) {
      discButton.classList.remove('img-filters__button--active');
    }
    randButton.classList.add('img-filters__button--active');
    window.filter.onRandomFilter();
  });

  discButton.addEventListener('click', function () {
    if (popButton.classList.contains('img-filters__button--active')) {
      popButton.classList.remove('img-filters__button--active');
    }
    if (randButton.classList.contains('img-filters__button--active')) {
      randButton.classList.remove('img-filters__button--active');
    }
    discButton.classList.add('img-filters__button--active');
    window.filter.onDiscussFilter();
  });

  window.filter = filter;
})();
