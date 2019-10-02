// utils.js
'use strict';

(function () {

  var MESSAGES = [
    'Всё отлично',
    'В целом все неплохо',
    'Когда Вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрфессионально',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент'
  ];

  var AUTOR_NAMES = [
    'Иван',
    'Марья',
    'Людмила',
    'Александр',
    'Ирина',
    'Николай',
    'Олег',
    'Алексей',
    'Марина',
    'Андрей',
    'Степан',
    'Надежда'
  ];

  var MAX_COMMENTS = 3;
  var AVATAR_COUNT = 6;
  var MIN_LIKES = 15;
  var MAX_LIKES = 200;

  var getRandomIndex = function (upperLimit) {
    return Math.floor(Math.random() * upperLimit);
  };

  var getRandomAutorName = function () {
    return AUTOR_NAMES[getRandomIndex(AUTOR_NAMES.length)];
  };

  var getRandomMessage = function () {
    return MESSAGES[getRandomIndex(MESSAGES.length)];
  };

  var getRandomValue = function (upperLimit) {
    return Math.ceil(Math.random() * upperLimit);
  };

  window.getRandomComments = function () {
    var comments = [];
    var comentsCount = getRandomValue(MAX_COMMENTS);
    for (var i = 0; i < comentsCount; i++) {
      var comment = {};
      comment.name = getRandomAutorName();
      comment.message = getRandomMessage();
      comment.avatar = getRandomAvatar();
      comments[i] = comment;
    }
    return comments;
  };

  var getRandomAvatar = function () {
    return 'img/avatar-' + getRandomValue(AVATAR_COUNT) + '.svg';
  };

  window.getRandomLikes = function () {
    return getRandomValue(MAX_LIKES - MIN_LIKES) + MIN_LIKES;
  };
})();
