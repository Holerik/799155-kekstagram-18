'use strict';

var FOTOS_COUNT = 25;
var AVATAR_COUNT = 6;
var MIN_LIKES = 15;
var MAX_LIKES = 200;
var MAX_COMMENTS = 3;

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

var getRandomComments = function (comments) {
  var comentsCount = getRandomValue(MAX_COMMENTS);
  for (var i = 0; i < comentsCount; i++) {
    var comment = {};
    comment.name = getRandomAutorName();
    comment.message = getRandomMessage();
    comment.avatar = getRandomAvatar();
    comments[i] = comment;
  }
};

var getRandomAvatar = function () {
  return 'img/avatar-' + getRandomValue(AVATAR_COUNT) + '.svg';
};

var getRandomLikes = function () {
  return getRandomValue(MAX_LIKES - MIN_LIKES) + MIN_LIKES;
};

var userFotos = [];

var createFotosData = function () {
  var fotos = [];
  for (var i = 0; i < FOTOS_COUNT; i++) {
    var fotoInfo = {};
    fotoInfo.url = 'photos/' + (i + 1) + '.jpg';
    fotoInfo.description = 'Описание фотографии';
    fotoInfo.likes = getRandomLikes();
    fotoInfo.comments = [];
    getRandomComments(fotoInfo.comments);
    fotos[i] = fotoInfo;
  }
  return fotos;
};

var renderPicture = function (foto) {
  var pictureElem = pictureTempl.cloneNode(true);
  pictureElem.querySelector('.picture__img').src = foto.url;
  pictureElem.querySelector('.picture__likes').textContent = foto.likes;
  pictureElem.querySelector('.picture__comments').textContent = foto.comments.length;
  return pictureElem;
};

var pictureTempl = document.querySelector('#picture')
.content
.querySelector('.picture');

userFotos = createFotosData();
var fragment = document.createDocumentFragment();
for (var i = 0; i < userFotos.length; i++) {
  fragment.appendChild(renderPicture(userFotos[i]));
}
var picturesBlock = document.querySelector('.pictures');
picturesBlock.appendChild(fragment);
